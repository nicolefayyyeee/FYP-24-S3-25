import React, { useState, useRef } from "react";
import Slider from "react-slick"; // image slider
import Webcam from "react-webcam"; // web cam
import "./ImageCaptioning.css";

const ImageCaptioning = () => {
  //state functions (self explanatory)
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exampleImages] = useState([
    // example image URLs
    "https://files.worldwildlife.org/wwfcmsprod/images/Tiger_resting_Bandhavgarh_National_Park_India/hero_small/6aofsvaglm_Medium_WW226365.jpg",
    "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2018/07/17235840/golden-retriever-diving-to-bottom-of-pool-lg.jpg",
    "https://ichef.bbci.co.uk/news/976/cpsprodpb/16CD7/production/_132299339_bb76bca9-78b6-432b-b118-7f181762e443.jpg",
    "https://miro.medium.com/v2/resize:fit:1024/1*YMJ1POyhsHklGVmFBLfW_A.jpeg",
    "https://i.guim.co.uk/img/media/b95bf2911302acf8f7cee71b51e7fef401026824/228_1262_2374_1423/master/2374.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=9fdd7512072b8a51074a30e1f5880776",
  ]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  

  // references functions
  const imageFileRef = useRef(null);
  const imageUrlRef = useRef(null);
  const webcamRef = useRef(null);


  // Pop up alert
  const showAlert = (message) => {
    alert(message);
    setLoading(false);
  };

  // main handle -> submit image(file or url or webcam image) -> flask(app.py) for generating image
  const handleSubmit = async (event) => {
    event.preventDefault(); //prevent default submit action
    setLoading(true);

    const formData = new FormData();
    const imageFile = imageFileRef.current.files[0];
    const imageURL = imageUrlRef.current.value || selectedImageUrl;
    const imageBlob = capturedImage;
  
    const userId = localStorage.getItem('user_id');
    
    // error handling process
    if (!imageFile && !imageURL && !imageBlob) {
      showAlert("No image selected, please upload an image.");
      return; //stop the process
    }

    // append the uploaded image
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (imageURL) {
      formData.append("imageURL", imageURL);
    } else if (imageBlob) {
      formData.append("imageFile", imageBlob, "capturedImage.jpg");
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

  return (
    <div className="container-imageCaptioning">
      <div className="title>">
        <h1>Upload or Capture an Image</h1>
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
                Generated Caption: {caption || "Your caption will appear here"}
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
          <h2>Example Images</h2>
          <Slider {...settings}>
            {exampleImages.map((image, index) => (
              <div key={index} onClick={() => handleImageClick(image)}>
                <img
                  src={image}
                  alt={`Example ${index}`}
                  className="slider-image"
                />
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
    </div>
  );
};

export default ImageCaptioning;
