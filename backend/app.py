from datetime import datetime
import pytz
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from flask import Flask, request, jsonify, session, url_for, send_from_directory
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from google.cloud.sql.connector import Connector 
from google.cloud import storage 
from datetime import datetime, timezone
from werkzeug.utils import secure_filename
from transformers import pipeline

# model import
from model.git_base_model import generate_captions_git_base  # Import from git_large_model.py
import streamlit as st
from PIL import Image
import requests
from io import BytesIO
import base64
import random  # For selecting game content

app = Flask(__name__)
GOOGLE_CLOUD_STORAGE_BUCKET = "image-upload-seesayai"
CLOUD_SQL_CONNECTION_NAME = 'seesayai1:asia-southeast1:seesay-instance'
DB_USER = 'root'
DB_PASSWORD = 'seesay123!'
DB_NAME = 'seesaydb'

# Connection pooling
connector = Connector()

def getconn():
    return connector.connect(
        CLOUD_SQL_CONNECTION_NAME,
        'pymysql',
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME
    )
# app.config['SECRET_KEY'] = 'your_secret_key'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///seesay.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://:password@localhost/db_name'
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'creator': getconn
}
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

#google bucket 
def upload_to_gcs(file, bucket_name, filename):
    """Uploads a file to the Google Cloud Storage bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    blob.make_public()  # Make the file public
    return blob.public_url

def delete_from_gcs(file, bucket_name,filename):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)
    
    blob = bucket.blob(filename)
    blob.delete()

# Image caption function start & upload user image to google bucket
@app.route('/imageCaptioning', methods=['POST'])
def predict_caption():
    generated_caption = None
    image = None
    image2generate = None  # Initialize image2generate
        
    user_id = request.form.get('userId') 
    user = User.query.get(user_id)
    
    print(f"User ID: {user_id}")
    
    if not user_id:
        return jsonify({"error": "User not found"}), 400
    
    
    image_file = request.files.get('imageFile')
    image_url = request.form.get('imageURL')
    image_filename = request.form.get('imageFilename')
    
    if image_file:
        filename = secure_filename(image_file.filename)

        # Upload the file to Google Cloud Storage
        gcs_url = upload_to_gcs(image_file, GOOGLE_CLOUD_STORAGE_BUCKET, filename)

        # Use the file from GCS to generate the caption
        image2generate = Image.open(image_file)  # Keep image_file open for local use

        if image2generate:
            generated_caption = generate_captions_git_base(image2generate)
        else:
            return jsonify({'error': 'Failed to process image'}), 500

        # Save image metadata to the database with the GCS URL
        new_image = ChildImage(filename=filename, filepath=gcs_url, user_id=user_id, imageCaption=generated_caption)
        db.session.add(new_image)
        db.session.commit()

        # Prepare image data for the response (you can remove this if not necessary)
        image_file.seek(0)
        image = f"data:image/jpeg;base64,{base64.b64encode(image_file.read()).decode('utf-8')}"

    elif image_url:
        response = requests.get(image_url)
        response.raise_for_status()
        image2generate = Image.open(BytesIO(response.content))

        if image2generate:
            generated_caption = generate_captions_git_base(image2generate)
        else:
            return jsonify({'error': 'Failed to process image'}), 500

        # Upload the image from the URL to GCS
        filename = os.path.basename(image_url)
        file_bytes = BytesIO(response.content)
        gcs_url = upload_to_gcs(file_bytes, GOOGLE_CLOUD_STORAGE_BUCKET, image_filename)

        # Save image metadata to the database
        new_image = ChildImage(filename=image_filename, filepath=gcs_url, user_id=user_id, imageCaption=generated_caption)
        db.session.add(new_image)
        db.session.commit()

        image = f"data:image/jpeg;base64,{base64.b64encode(response.content).decode('utf-8')}"

    else:
        return jsonify({'error': 'No image file or URL provided'}), 400

    return jsonify({'caption': generated_caption, 'image': image})

# Image caption function end


# Child User gallery
@app.route('/gallery', methods=['GET'])
def user_gallery():
    # Fetch the user based on the provided user_id
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    # print(user_id) #check if get the current user id
    
     # Verify if the user exists in the users table
    user = User.query.filter_by(id=user_id).first()  # Assuming you have a User model
    
    # Check if the user exists
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Query images associated with this user
    images = ChildImage.query.filter_by(user_id=user_id).all()  # Filter images by user_id
    
    if not images:
            print("No images")
    
    # Create a list of image details
    image_list = [
        {
            "image_id": img.id,
            "filename": img.filename,
            "filepath":  img.filepath,  # Full image URL,
            "caption": img.imageCaption,
            "is_favorite": img.is_favorite,
            "dateUploaded": img.date_uploaded
        } for img in images
    ]
    # print(image_list) 
    
    # Return the list of images as JSON
    return jsonify({"images": image_list}), 200

# Fetch specific image by ID
@app.route('/image/<int:image_id>', methods=['GET'])
def get_image_by_id(image_id):
    # Query the image by ID
    image = ChildImage.query.get(image_id)
    
    # Check if the image exists
    if not image:
        return jsonify({"error": "Image not found"}), 404

    # Create a dictionary with image details
    image_data = {
        "image_id": image.id,
        "filename": image.filename,
        "filepath": image.filepath,
        "caption": image.imageCaption,
        "is_favorite": image.is_favorite,
        "dateUploaded": image.date_uploaded
    }
    
    # Return the image data as JSON
    return jsonify({"image": image_data}), 200



# Route for Admin to upload images
@app.route('/admin/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    
    # Save the file
    filename = secure_filename(file.filename)
    gcs_url = upload_to_gcs(file, GOOGLE_CLOUD_STORAGE_BUCKET, filename)
    
    # to check file
    # print(file.filename)
    # print(file)
    
    new_image = AdminImage(
            filename=filename,  # Use the secure filename
            filepath=gcs_url,
            date_uploaded=datetime.now()
        )

    db.session.add(new_image)
    db.session.commit()
    
    # to check
    # print(new_image)
    
    return jsonify({"message": "Image uploaded successfully"}), 201

@app.route('/favorite', methods=['POST'])
def favorite_image():
    data = request.get_json()
    user_id = data.get('user_id')
    image_id = data.get('image_id')
    is_favorite = data.get('is_favorite')
    
    # print(data)

    # Query the image by id and user_id
    image = ChildImage.query.filter_by(id=image_id, user_id=user_id).first()

    if not image:
        return jsonify({"error": "Image not found or does not belong to the user."}), 404

    # Update the is_favorite status
    image.is_favorite = is_favorite

    # Commit the changes to the database
    db.session.commit()

    return jsonify({"message": "Favorite status updated successfully."}), 200

    

#Route for child to delete images 
@app.route('/delete/<int:image_id>', methods=['DELETE'])
def child_delete_image(image_id):
    image = ChildImage.query.get(image_id)
    
    if not image:
        return jsonify({"error": "Image not found"}), 404
    
    delete_from_gcs(image, GOOGLE_CLOUD_STORAGE_BUCKET, image.filename)

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Image deleted successfully"}), 200

# Route for Admin to delete images
@app.route('/admin/delete/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = AdminImage.query.get(image_id)
    
    if not image:
        return jsonify({"error": "Image not found"}), 404
    
    delete_from_gcs(image, GOOGLE_CLOUD_STORAGE_BUCKET, image.filename)
    
    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Image deleted successfully"}), 200

# Route to fetch the gallery for child users
@app.route('/explorePage', methods=['GET'])
def view_gallery():
    images = AdminImage.query.all()
    
     # Create a list of image details
    image_list = [
        {
            "id": img.id,
            "filename": img.filename,
            "filepath":  img.filepath,  # Full image URL,
        } for img in images
    ]
    # print(image_list) #check image list
    
    return jsonify({"images": image_list}), 200

# Route to get child id from parents id 
# In your Flask app, add a route to fetch children by parent ID
@app.route('/children', methods=['GET'])
def get_children():
    parent_id = request.args.get('parent_id')
    
    if not parent_id:
        return jsonify({"error": "Parent ID is required"}), 400
    
    # Fetch all children where parent_id matches
    children = User.query.filter_by(parent_id=parent_id).all()
    
    if not children:
        return jsonify({"error": "No children found for this parent"}), 404

    # Return the child data
    children_data = [{"id": child.id, "name": child.name} for child in children]
    
    return jsonify({"children": children_data}), 200


#Images db start
# User model for image upload
class ChildImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), nullable=False)
    imageCaption = db.Column(db.String(255), nullable=True)
    filepath = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('images', lazy=True))
    date_uploaded = db.Column(db.DateTime, default=datetime.utcnow)
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)
    
    
# User model for image upload
class AdminImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), nullable=False)
    imageCaption = db.Column(db.String(255), nullable=True)
    filepath = db.Column(db.String(255), nullable=False)
    date_uploaded = db.Column(db.DateTime, default=datetime.utcnow)
# end

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    username = db.Column(db.String(150), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=True, unique=True)
    password = db.Column(db.String(255), nullable=False)
    parent_id = db.Column(db.Integer, nullable=True)
    suspend = db.Column(db.Boolean, default=False)

    profile = db.relationship('Profile', backref=db.backref('users', lazy=True))

# Child model
class Child(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    time_limit = db.Column(db.Integer, default=0)
    game_access = db.Column(db.Boolean, default=True)
    gallery_access = db.Column(db.Boolean, default=True)

# Avatar model
class Avatar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    base_color = db.Column(db.String(255), nullable=True, default='6bd9e9')
    earring_color = db.Column(db.String(255), nullable=True, default='ff5733')
    earrings = db.Column(db.String(255), nullable=True, default='hoop')
    eyebrows = db.Column(db.String(255), nullable=True, default='down')
    eyes = db.Column(db.String(255), nullable=True, default='eyes')
    eyes_color = db.Column(db.String(255), nullable=True, default='000000')
    facial_hair = db.Column(db.String(255), nullable=True, default='beard')
    facial_hair_color = db.Column(db.String(255), nullable=True, default='d2b48c')
    glasses = db.Column(db.String(255), nullable=True, default='round')
    glasses_color = db.Column(db.String(255), nullable=True, default='6bd9e9')
    hair = db.Column(db.String(255), nullable=True, default='dannyPhantom')
    hair_color = db.Column(db.String(255), nullable=True, default='ff5733')
    mouth = db.Column(db.String(255), nullable=True, default='smile')
    mouth_color = db.Column(db.String(255), nullable=True, default='000000')
    nose = db.Column(db.String(255), nullable=True, default='curve')
    shirt = db.Column(db.String(255), nullable=True, default='collared')
    shirt_color = db.Column(db.String(255), nullable=True, default='9287ff')
    background_type = db.Column(db.String(255), nullable=True, default='gradientLinear')
    background_color = db.Column(db.String(255), nullable=True, default='ffb036')
    gradient_start_color = db.Column(db.String(255), nullable=True, default='ffb036')
    gradient_end_color = db.Column(db.String(255), nullable=True, default='fe7479')

# Profile model
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(255), nullable=False)

# Game Content model
class GameContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)

# User Scores model
class UserScores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    time_taken = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

# Review model
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Singapore')), nullable=False)
    display = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
# Create DB
with app.app_context():
    db.create_all()

# Child: save avatar
@app.route('/save_avatar', methods=['POST'])
def save_avatar():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"message": "Login required!"}), 401

    avatar_attributes = {
        'base_color': data.get('baseColor'),
        'earring_color': data.get('earringColor'),
        'earrings': data.get('earrings'),
        'eyebrows': data.get('eyebrows'),
        'eyes': data.get('eyes'),
        'eyes_color': data.get('eyesColor'),
        'facial_hair': data.get('facialHair'),
        'facial_hair_color': data.get('facialHairColor'),
        'glasses': data.get('glasses'),
        'glasses_color': data.get('glassesColor'),
        'hair': data.get('hair'),
        'hair_color': data.get('hairColor'),
        'mouth': data.get('mouth'),
        'mouth_color': data.get('mouthColor'),
        'nose': data.get('nose'),
        'shirt': data.get('shirt'),
        'shirt_color': data.get('shirtColor'),
        'background_type': data.get('backgroundType'),
        'background_color': data.get('backgroundColor'),
        'gradient_start_color': data.get('gradientStartColor'),
        'gradient_end_color': data.get('gradientEndColor') 
    }

    # Check if the avatar already exists for the user
    existing_avatar = Avatar.query.filter_by(user_id=user_id).first()

    if existing_avatar:
        for key, value in avatar_attributes.items():
            if value is not None:
                setattr(existing_avatar, key, value)
    else:
        new_avatar_data = {k: v for k, v in avatar_attributes.items() if v is not None}
        new_avatar = Avatar(user_id=user_id, **new_avatar_data)
        db.session.add(new_avatar)

    db.session.commit()
    return jsonify({'message': 'Avatar saved successfully!'}), 200

# Child: get avatar
@app.route('/get_avatar', methods=['GET'])
def get_avatar():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"message": "Login required!"}), 401

    existing_avatar = Avatar.query.filter_by(user_id=user_id).first()
    
    # Default avatar attributes
    default_avatar = {
        'base_color': '#77311d',
        'earring_color': '#77311d',
        'earrings': 'hoop',
        'eyebrows': 'down',
        'eyes': 'eyes',
        'eyes_color': '#000000',
        'facial_hair': 'beard',
        'facial_hair_color': '#000000',
        'glasses': 'round',
        'glasses_color': '#000000',
        'hair': 'dannyPhantom',
        'hair_color': '#000000',
        'mouth': 'smile',
        'mouth_color': '#000000',
        'nose': 'curve',
        'shirt': 'collared',
        'shirt_color': '#000000',
        'background_type': 'gradientLinear',
        'background_color': '#ffb036',
        'gradient_start_color': '#ffb036',
        'gradient_end_color': '#fe7479'
    }

    if existing_avatar:
        avatar_data = {
            'baseColor': existing_avatar.base_color,
            'earringColor': existing_avatar.earring_color,
            'earrings': existing_avatar.earrings,
            'eyebrows': existing_avatar.eyebrows,
            'eyes': existing_avatar.eyes,
            'eyesColor': existing_avatar.eyes_color,
            'facialHair': existing_avatar.facial_hair,
            'facialHairColor': existing_avatar.facial_hair_color,
            'glasses': existing_avatar.glasses,
            'glassesColor': existing_avatar.glasses_color,
            'hair': existing_avatar.hair,
            'hairColor': existing_avatar.hair_color,
            'mouth': existing_avatar.mouth,
            'mouthColor': existing_avatar.mouth_color,
            'nose': existing_avatar.nose,
            'shirt': existing_avatar.shirt,
            'shirtColor': existing_avatar.shirt_color,
            'backgroundType': existing_avatar.background_type,
            'backgroundColor': existing_avatar.background_color,
            'gradientStartColor': existing_avatar.gradient_start_color,
            'gradientEndColor': existing_avatar.gradient_end_color
        }
    else:
        avatar_data = default_avatar

    return jsonify(avatar_data), 200

# Parent: view all users (by user_id & profile_id)
@app.route('/get_users', methods=['GET'])
def get_users():
    # global session_user # temp
    # session_user = session['user']
    user_id = request.args.get('user_id')
    print(user_id)
    # user_id2 = session.get("user_id")
    # print(user_id2)
    if not user_id:
        return jsonify({"message": "Login required!"}), 401
    # current_user = User.query.filter_by(id=user_id).first()
    child_users = User.query.filter_by(parent_id=user_id).order_by(User.id.asc()).all()
    user_list = []
    for user in child_users:
        user_info = {
            "user_id": user.id,
            "username": user.username, 
            "name": user.name,
            "password": user.password 
        }
        user_list.append(user_info)
    # user_list.append(current_user.name)
    return jsonify(user_list), 200

# Parent: add new child user
@app.route('/add_child', methods=['POST'])
def add_child():
    # global session_user # temp
    data = request.get_json()
    user_id = data.get('user_id') 
    if not user_id:
        return jsonify({"message": "Login required!"}), 401
    
    # Check if the user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400

    # Create new user
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(profile_id=3, username=data['username'], name=data['name'], password=hashed_password, parent_id=user_id)
    db.session.add(new_user)
    db.session.flush() 

    new_child = Child(user_id=new_user.id)
    db.session.add(new_child)
    db.session.commit()
    return jsonify({"message": "Child profile added successfully!"}), 201

# Parent: sign up
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Check if the user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists!"}), 400
    
    # Check if the email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists!"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(profile_id=2, username=data['username'], name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully!"}), 201

# All: login 
@app.route('/login', methods=['POST'])
def login():
    # global session_user # temp
    data = request.get_json()
    print(data)
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        # session_user = user.id # temp

        # Check if the user role
        if user.profile_id == 1: # admin
            return jsonify({"message": "Admin login successful!", "user_id": user.id, "profile": "admin"}), 200
        elif user.profile_id == 2: # parent
            return jsonify({"message": "Parent login successful!", "user_id": user.id, "profile": "parent"}), 200
        elif user.profile_id == 3: # child
            return jsonify({"message": "Child login successful!", "user_id": user.id, "profile": "child"}), 200
   
    return jsonify({"message": "Invalid username or password!"}), 401

# All: logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    session.clear()
    return jsonify({"message": "Logout successful!"}), 200

# Get game content route
@app.route('/api/game-content', methods=['GET'])
def get_game_content():
    try:
        content = GameContent.query.all()
        if len(content) < 5:
            return jsonify({"error": "Not enough content available to create a game."}), 400

        # Select 5 random pictures from the content
        pictures = random.sample(content, min(len(content), 5))
        matching_words = [picture.name for picture in pictures]
        
        # Select additional words, ensuring we don't select duplicates
        additional_words = random.sample(
            [c.name for c in content if c.name not in matching_words],
            min(len(content) - len(matching_words), 5)
        )
        
        words = matching_words + additional_words
        random.shuffle(words)

        # Prepare the response
        game_data = {
            "pictures": [{"id": p.id, "imageUrl": p.image_url, "name": p.name} for p in pictures],
            "words": words
        }
        return jsonify(game_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Save user score route
@app.route('/api/save-score', methods=['POST'])
def save_score():
    data = request.json
    user_id = data.get('userId')
    score = data.get('score')
    time_taken = data.get('timeTaken')

    if not user_id or not score or not time_taken:
        return jsonify({"error": "Invalid request data"}), 400

    try:
        new_score = UserScores(user_id=user_id, score=score, time_taken=time_taken)
        db.session.add(new_score)
        db.session.commit()
        return jsonify({"message": "Score saved successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get user scores route
@app.route('/api/user-scores', methods=['GET'])
def get_user_scores():
    user_id = request.args.get('userId')
    
    try:
        if user_id:
            scores = UserScores.query.filter_by(user_id=user_id).all()
        else:
            scores = UserScores.query.all()
        score_list = [
            {
                "userId": score.user_id,
                "score": score.score,
                "timeTaken": score.time_taken,
                "date": score.date.strftime('%Y-%m-%d')
            } for score in scores
        ]
        return jsonify({"scores": score_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Spam review detector
spam_detector = pipeline("text-classification", model="roberta-base-openai-detector")
def is_spam(review):
    result = spam_detector(review)
    print(f"Model output for review '{review}': {result}")
    label = result[0]['label']
    score = result[0]['score']
    spam_threshold = 0.75

    return label == 'Fake' and score > spam_threshold

# Parent: add review route
@app.route('/add_review', methods=['POST'])
def add_review():
    data = request.get_json()
    print(data)
    
    user_id = data.get('user_id')  
    if not user_id:
        return jsonify({"message": "Login required!"}), 401

    description = data['description']
    
    # Check for spam
    if is_spam(description):
        return jsonify({"message": "Review rejected as spam!"}), 400
    
    try:
        new_review = Review(user_id=user_id, type=data['type'], description=description, rating=data['rating'] )
        db.session.add(new_review)
        db.session.commit()
        
        return jsonify({"message": "Review added successfully!"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Parent: view my reviews (by user_id)
@app.route('/my_reviews', methods=['GET'])
def my_reviews():
    user_id = request.args.get('user_id')
    try:
        if not user_id:
            return jsonify({"message": "Login required!"}), 401

        # Fetch reviews by user_id
        reviews = Review.query.filter_by(user_id=user_id).all()

        review_list = [
            {
                "type": review.type,
                "description": review.description,
                "rating": review.rating,
                "timestamp": review.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            } for review in reviews
        ]
        return jsonify({"reviews": review_list}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin: view all reviews
@app.route('/view_all_reviews', methods=['GET'])
def view_all_reviews():
    try:
        reviews = Review.query.all()

        review_list = [
            {
                "id": review.id,
                "user_id": review.user_id,
                "username": review.user.username, 
                "type": review.type,
                "description": review.description,
                "rating": review.rating,
                "timestamp": review.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                "display": review.display
            } for review in reviews
        ]

        return jsonify({"reviews": review_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin: toggle display for review
@app.route('/toggle_display/<int:review_id>', methods=['PUT'])
def toggle_display(review_id):
    try:
        review = Review.query.get(review_id)
        if not review:
            return jsonify({"error": "Review not found"}), 404
        
        # Toggle the display status
        review.display = not review.display
        db.session.commit()

        return jsonify({"message": "Display status updated", "display": review.display}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Guest: view displayed reviews (by display)
@app.route('/view_reviews', methods=['GET'])
def view_reviews():
    try:
        reviews = Review.query.filter_by(display=True).all()

        review_list = [
            {
                "user_id": review.user_id,
                "name": review.user.name,
                "type": review.type,
                "description": review.description,
                "rating": review.rating,
                "timestamp": review.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            } for review in reviews
        ]
        return jsonify({"reviews": review_list}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# All: edit my account 
@app.route('/update_user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if 'username' in data:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"message": "Username already taken"}), 400
        user.username = data['username']

    if 'name' in data:
        user.name = data['name']
        
    if 'email' in data:
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({"message": "Email already exists!"}), 400
        user.email = data['email']

    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # if child user
    if user.profile_id == 3:
        child = Child.query.filter_by(user_id=user.id).first()
        if not child:
            return jsonify({"message": "Child profile not found"}), 404
        
        if 'time_limit' in data:
            child.time_limit = data['time_limit']
        
        if 'game_access' in data:
            child.game_access = data['game_access']
        
        if 'gallery_access' in data:
            child.gallery_access = data['gallery_access']

    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# All: get my account details
@app.route('/get_user_details/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user_info = {
        "user_id": user.id,
        "username": user.username,
        "name": user.name,
        "email": user.email if user.email else None,
        "profile_id": user.profile_id,
        "parent_id": user.parent_id
    }

    # if child user
    if user.profile_id == 3:
        child = Child.query.filter_by(user_id=user.id).first()
        
        if child:
            user_info["time_limit"] = child.time_limit
            user_info["game_access"] = child.game_access
            user_info["gallery_access"] = child.gallery_access
        else:
            return jsonify({"message": "Child profile not found for user"}), 404

    return jsonify(user_info), 200

# Parent & admin: delete my account
@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"message": "User not found"}), 404
        
        children = User.query.filter_by(parent_id=user_id).all()

         # Delete in the Child table
        if children:
            child_ids = [child.id for child in children]
            Child.query.filter(Child.user_id.in_(child_ids)).delete(synchronize_session=False)

        # Delete all child acc under parent acc
        for child in children:
                db.session.delete(child)

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Admin: create admin user
@app.route('/create_admin', methods=['POST'])
def create_admin():
    data = request.get_json()

    # Check if the user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists!"}), 400
    
    # Check if the email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists!"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(profile_id=1, username=data['username'], name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully!"}), 201

# Admin: view all users
@app.route('/view_all_users', methods=['GET'])
def view_all_users():
    try:
        users = User.query.all()

        user_list = [
            {
                "id": user.id,
                "profile_id": user.profile_id,
                "username": user.username, 
                "name": user.name,
                "email": user.email,
                "parent_id": user.parent_id,
                "suspend": user.suspend
            } for user in users
        ]

        return jsonify({"users": user_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Admin: suspend user 
@app.route('/suspend_account/<int:user_id>', methods=['PUT'])
def toggle_suspend(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Toggle the suspension status
        user.suspend = not user.suspend
        db.session.commit()

        return jsonify({"message": "Suspension status updated", "suspend": user.suspend}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Admin: create user profile
@app.route('/create_profile', methods=['POST'])
def create_profile():
    data = request.get_json()

    # Check if the role already exists
    if Profile.query.filter_by(role=data['role']).first():
        return jsonify({"message": "Role already exists!"}), 400
    
    new_profile = Profile(role=data['role'])
    db.session.add(new_profile)
    db.session.commit()
    return jsonify({"message": "Profile created successfully!"}), 201

# Admin: view all profiles
@app.route('/view_all_profiles', methods=['GET'])
def view_all_profiles():
    try:
        profiles = Profile.query.all()

        profile_list = []
        for profile in profiles:
            user_count = User.query.filter_by(profile_id=profile.id).count()
            suspended_count = User.query.filter_by(profile_id=profile.id, suspend=True).count()

            profile_list.append({
                "id": profile.id,
                "role": profile.role,
                "user_count": user_count, 
                "suspended_count": suspended_count
            })

        return jsonify({"profiles": profile_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin: suspend/unsuspend users (by profile_id)
@app.route('/suspend_profile/<int:profile_id>', methods=['PUT'])
def suspend_profile(profile_id):
    try:
        suspend = request.json.get('suspend')

        users = User.query.filter_by(profile_id=profile_id).all()

        if not users:
            return jsonify({"message": "No users found with this profile"}), 400

        for user in users:
            user.suspend = suspend
            db.session.commit()

        action = "suspended" if suspend else "unsuspended"
        return jsonify({"message": f"All users with profile {profile_id} have been {action}."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin: update profile role
@app.route('/update_role/<int:profile_id>', methods=['PUT'])
def update_role(profile_id):
    try:
        data = request.get_json()
        new_role = data.get('role')

        # Check if the profile exists
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({"message": "Profile not found!"}), 404

        # Check if the new role already exists
        if Profile.query.filter_by(role=new_role).first():
            return jsonify({"message": "Role already exists!"}), 400

        profile.role = new_role
        db.session.commit()

        return jsonify({"message": "Profile role updated successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
