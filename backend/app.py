from datetime import datetime
import pytz
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from flask import Flask, request, jsonify, session, url_for, send_from_directory
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from google.cloud.sql.connector import Connector 
from datetime import datetime, timezone
from werkzeug.utils import secure_filename

# model import
from model.git_base_model import generate_captions_git_base  # Import from git_large_model.py
import streamlit as st
from PIL import Image
import requests
from io import BytesIO
import base64
import random  # For selecting game content

app = Flask(__name__)

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

# Set the upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')  # Adjust as necessary

# Create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Image caption function start & upload user image to their own gallery
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
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the uploaded image file
        image_file.save(file_path)
        image2generate = Image.open(file_path)  # Open the saved image file
        
        if image2generate:
            generated_caption = generate_captions_git_base(image2generate)
        else:
            return jsonify({'error': 'Failed to process image'}), 500  # Return an error if image processing fails
            
        # Convert image file to base64 for return
        image_file.seek(0)  # Reset the file pointer to read from the start
        image = f"data:image/jpeg;base64,{base64.b64encode(image_file.read()).decode('utf-8')}"
        
        # Save image metadata to database
        new_image = ChildImage(filename=filename, filepath=file_path, user_id=user_id, imageCaption=generated_caption)
        db.session.add(new_image)
        db.session.commit()
        
    elif image_url:
            response = requests.get(image_url)
            response.raise_for_status()  # Raise an error for bad responses
            image2generate = Image.open(BytesIO(response.content))
            
            if image2generate:
                generated_caption = generate_captions_git_base(image2generate)
            else:
                return jsonify({'error': 'Failed to process image'}), 500  # Return an error if image processing fails
                
            # Prepare for saving the image
            filename = os.path.basename(image_url)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)

            with open(file_path, 'wb') as f:
                f.write(response.content)  # Save the image

            # Save image metadata to database
            new_image = ChildImage(filename=image_filename, filepath=file_path, user_id=user_id, imageCaption=generated_caption)
            db.session.add(new_image)
            db.session.commit()

            # Convert image content to base64 for return
            image = f"data:image/jpeg;base64,{base64.b64encode(response.content).decode('utf-8')}"

    else:
        return jsonify({'error': 'No image file or URL provided'}), 400  # Return an error if no image is provided

    return jsonify({'caption': generated_caption, 'image': image})

# Image caption function end

# Route to serve uploaded images 
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Child User gallery
@app.route('/gallery', methods=['GET'])
def user_gallery():
    # Fetch the user based on the provided user_id
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    print(user_id) #check if get the current user id
    
     # Verify if the user exists in the users table
    user = User.query.filter_by(id=user_id).first()  # Assuming you have a User model
    
    # Check if the user exists
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Query images associated with this user
    images = ChildImage.query.filter_by(user_id=user_id).all()  # Filter images by user_id
    
    if not images:
            return jsonify({'message': 'No images found for this user'}), 404
    
    # Create a list of image details
    image_list = [
        {
            "image_id": img.id,
            "filename": img.filename,
            "filepath":  f"http://192.168.18.13:5000/uploads/{img.filename}",  # Full image URL,
            "caption": img.imageCaption,
            "is_favorite": img.is_favorite,
        } for img in images
    ]
    print(image_list) #check image list
    
    # Return the list of images as JSON
    return jsonify({"images": image_list}), 200


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
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    print(file.filename)
    print(file)
    
    new_image = AdminImage(
            filename=filename,  # Use the secure filename
            imageCaption=request.form.get('caption'),  # Assuming a caption is provided
            filepath=filepath,
            date_uploaded=datetime.now()
        )

    db.session.add(new_image)
    db.session.commit()
    print(new_image)
    
    return jsonify({"message": "Image uploaded successfully"}), 201

@app.route('/favorite', methods=['POST'])
def favorite_image():
    data = request.get_json()
    user_id = data.get('user_id')
    image_id = data.get('image_id')
    is_favorite = data.get('is_favorite')
    
    print(data)

    
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

    os.remove(image.filepath)  
    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Image deleted successfully"}), 200

# Route for Admin to delete images
@app.route('/admin/delete/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = AdminImage.query.get(image_id)
    
    if not image:
        return jsonify({"error": "Image not found"}), 404

    os.remove(image.filepath) 
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
            "filepath":  f"http://192.168.18.13:5000/uploads/{img.filename}",  # Full image URL,
        } for img in images
    ]
    print(image_list) #check image list
    
    return jsonify({"images": image_list}), 200

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
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Singapore')), nullable=False)
    display = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
# Create DB
with app.app_context():
    db.create_all()

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
    db.session.commit()
    return jsonify({"message": "User added successfully!"}), 201

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

# Add new child profile for the logged-in parent
# @app.route('/add_child_profile', methods=['POST'])
# def add_child_profile():
#     if 'user' not in session:
#         return jsonify({"message": "Login required!"}), 401

#     data = request.get_json()
#     user_name = data['name']
#     parent_email = session['user']  # Get the logged-in parent's email

#     parent = Users.query.filter_by(email=parent_email).first()

#     # Check if the child name already exists under this parent
#     if Users.query.filter_by(name=user_name, parentID=parent.id).first():
#         return jsonify({"message": "Child profile already exists"}), 400

#     # Create the child profile
#     new_child = Users(name=user_name, email=f"{user_name}@example.com", password='default', parentID=parent.id)
#     db.session.add(new_child)
#     db.session.commit()

#     return jsonify({"message": "Child profile added successfully!"}), 201

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

# Parent: add review route
@app.route('/add_review', methods=['POST'])
def add_review():
    data = request.get_json()
    print(data)
    
    user_id = data.get('user_id')  
    if not user_id:
        return jsonify({"message": "Login required!"}), 401

    try:
        new_review = Review(user_id=user_id, content=data['content'], rating=data['rating'] )
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
                "content": review.content,
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
                "content": review.content,
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
                "username": review.user.username,
                "content": review.content,
                "rating": review.rating,
                "timestamp": review.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            } for review in reviews
        ]
        return jsonify({"reviews": review_list}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Parent & Admin: edit my account 
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

    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Parent & Admin: get my account details
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

    return jsonify(user_info), 200

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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
