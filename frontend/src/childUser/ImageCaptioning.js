import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Slider from "react-slick"; // image slider
import Webcam from "react-webcam"; // web cam
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import "./ImageCaptioning.css";

const ImageCaptioning = () => {
  const navigate = useNavigate();
  const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal(); // modal
 
  // for time limit
  const logoutUser = useCallback(() => {
    openModal("Time limit is up!", "You have been logged out.", () => {
      localStorage.clear();
      setTimeout(() => {
        navigate('/login');
      }, 100); 
    });
  }, [openModal, navigate]);

  useEffect(() => {
    let timer;
    const storedLogoutTime = localStorage.getItem('logoutTime');
    
    if (storedLogoutTime) {
      const remainingTime = storedLogoutTime - Date.now();

      if (remainingTime > 0) {
        timer = setTimeout(() => {
          logoutUser();
        }, remainingTime);
      } else {
        logoutUser();
      }
    }

    return () => {
      clearTimeout(timer); 
    };
  }, [logoutUser]); 

  //state functions (self explanatory)
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exampleImages, setImages] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  //explore page
  const explorePageLocation = useLocation();
  const { selectedImage } = explorePageLocation.state || {};

  // references functions
  const imageFileRef = useRef(null);
  const imageUrlRef = useRef(null);
  const webcamRef = useRef(null);

  const generateUniqueFilename = (userId) => {
    const now = new Date();

    // Format the date as ddmmyyyy
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-indexed
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string

    return `ChildImage_${userId}_${formattedDate}_${randomString}.jpg`; // Combine user ID, formatted date, and random string
  };

  // Pop up alert
  const showAlert = (message) => {
    alert(message);
    setLoading(false);
  };

  // Fetch the explore page images
  const fetchGallery = async () => {
    const response = await axios.get("http://localhost:5000/explorePage");
    setImages(response.data.images);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // main handle -> submit image(file or url or webcam image) -> flask(app.py) for generating image
  const handleSubmit = async (event) => {
    event.preventDefault(); //prevent default submit action
    setLoading(true);

    const formData = new FormData();
    const imageFile = imageFileRef.current.files[0];
    const imageURL = imageUrlRef.current.value || selectedImageUrl;
    const imageBlob = capturedImage;

    const userId = localStorage.getItem("user_id");

    // error handling process
    if (!imageFile && !imageURL && !imageBlob) {
      showAlert("No image selected, please upload an image.");
      return; //stop the process
    }

    const uniqueFilename = generateUniqueFilename(userId);

    // append the uploaded image
    if (imageFile) {
      formData.append("imageFile", imageFile, uniqueFilename);
    } else if (imageURL) {
      formData.append("imageURL", imageURL);
      formData.append("imageFilename", uniqueFilename);
    } else if (imageBlob) {
      formData.append("imageFile", imageBlob, uniqueFilename);
    }

    formData.append("userId", userId);

    //pass the image
    const response = await fetch("http://127.0.0.1:5000/imageCaptioning", {
      method: "POST",
      body: formData,
    });

    //get the caption
    const data = await response.json();
    setCaption(data.caption);
    setLoading(false);
  };

  // Set the selected image from the explore page as the preview
  useEffect(() => {
    if (selectedImage) {
      setPreview(selectedImage);
      setSelectedImageUrl(selectedImage);
    }
  }, [selectedImage]);

  //preview image uploaded
  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const previewUrlImage = () => {
    const imageURL = imageUrlRef.current.value;
    if (imageURL) {
      setPreview(imageURL);
    }
  };
  //image slider handler
  const handleImageClick = (imageExampleURL) => {
    setSelectedImageUrl(imageExampleURL);
    setPreview(imageExampleURL); // Preview the selected image
    imageUrlRef.current.value = "";
  };

  // webcam func
  const captureWebcamImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    setSelectedImageUrl(null);
    setCapturedImage(dataURLtoBlob(imageSrc)); // Convert to Blob for sending
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // resets all states and clear input
  const handleClearInputs = () => {
    imageFileRef.current.value = null;
    imageUrlRef.current.value = "";
    setPreview(null);
    setCaption("");
  };

  // text-to-speech functionality
  const speakCaption = () => {
    if (caption) {
      const utterance = new SpeechSynthesisUtterance(caption);
      window.speechSynthesis.speak(utterance);
    }
  };

  // slick settings (image slider)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const capitalizeFirstLetter = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : '';


  return (
    <div className="container-imageCaptioning">
      <div>
        <h1 className="image-captioning-title">Upload or Capture an Image</h1>
        <p>
          Choose an image from your computer or take a new picture with your
          camera to begin!
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="actions">
          <div class="upload-btn-wrapper">
            <button class="btn btn-upload">Upload Image</button>
            <input
              type="file"
              ref={imageFileRef}
              onChange={previewImage}
              name=""
            />
          </div>

          <button
            type="button"
            className="btn btn-capture"
            onClick={() => setUseWebcam(!useWebcam)}
          >
            {useWebcam ? "Close Webcam" : "Capture Image"}
          </button>
          <input
            className="btn-url"
            type="text"
            ref={imageUrlRef}
            placeholder="Enter Image URL"
            onBlur={previewUrlImage}
          />
        </div>

        {useWebcam && (
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <button
              type="button"
              onClick={captureWebcamImage}
              className="btn btn-capture"
            >
              Capture
            </button>
          </div>
        )}

        <div className="image-preview-container">
          <div className="outer">
            {preview ? (
              preview && (
                <img src={preview} alt="Preview" className="image-preview" />
              )
            ) : (
              <div className="image-placeholder">No Image Selected</div>
            )}
            <div className="generated-caption">
              <p className="generated-caption-p">
                Generated Caption: {capitalizeFirstLetter(caption) || "Your caption will appear here"}
                {caption && (
                  <button
                    className="btn-speak"
                    onClick={(event) => {
                      event.preventDefault(); // Prevents form submission
                      speakCaption();
                    }}
                  >
                    🔊
                  </button> // Speaker icon for text-to-speech
                )}
              </p>
            </div>
          </div>
        </div>

        {/* image slider */}
        <div className="example-images">
          <h2>Choose an image below to start exploring!</h2>
          <Slider {...settings}>
            {exampleImages.map((image, index) => (
              <div key={index} onClick={() => handleImageClick(image.filepath)}>
                <img src={image.filepath} className="slider-image" />
              </div>
            ))}
          </Slider>
        </div>

        <div className="actions-bottom">
          <button type="submit" className="btn btn-generate" disabled={loading}>
            {loading ? "Generating..." : "Generate Caption"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClearInputs}
          >
            Clear Input
          </button>
        </div>
      </form>
      <Modal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        onConfirm={modalAction}
        header={modalHeader} 
        message={modalMessage} 
      />
    </div>
  );
};

export default ImageCaptioning;
