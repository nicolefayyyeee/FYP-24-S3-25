import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminUpload.css"; // Import the CSS file

const AdminUploadImg = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For image enlargement
  const imagesPerPage = 5; // Set images per page

  // Fetch the gallery images
  const fetchGallery = async () => {
    const response = await axios.get("http://localhost:5000/explorePage");
    setImages(response.data.images);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const generateUniqueFilename = (userId) => {
    const now = new Date();

    // Format the date as ddmmyyyy
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-indexed
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string

    return `AdminImage_${userId}_${formattedDate}_${randomString}.jpg`; // Combine user ID, formatted date, and random string
  };

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userId = localStorage.getItem("user_id");
    const uniqueFilename = generateUniqueFilename(userId);
    setUploading(true);

    formData.append("file", file, uniqueFilename);

    await axios.post("http://localhost:5000/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImagePreview(null); // Clear image preview after upload
    setFile(null); // Reset file input
    setUploading(false);
    fetchGallery(); // Refresh gallery after upload
  };

  // Handle image deletion with confirmation
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (confirmed) {
      await axios.delete(`http://localhost:5000/admin/delete/${id}`);
      fetchGallery(); // Refresh gallery after delete
    }
  };

  // Handle file change and show image preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Show the preview
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  // Handle clicking an image to enlarge it
  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath); // Set the selected image for modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedImage(null); // Close the modal by resetting selectedImage
  };

  // Pagination logic
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // resets all states and clear input
  const handleClearInputs = () => {
    setImagePreview(null);
    setFile(null);
  };

  return (
    <div className="admin-dashboard">
      <h2>Upload photo to explore page </h2>

      {/* Upload Section */}
      <div className="action-button">
        <form onSubmit={handleUpload}>
          <div className="choose-btn-wrapper">
            <button className="btn-choose">Choose Image</button>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-upload"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          <button
            type="button"
            onClick={handleClearInputs}
            className="btn-clear"
          >
            {" "}
            Clear Input{" "}
          </button>
          <div>
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img src={imagePreview} alt="Preview" width="300" />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Gallery Section */}
      <h3>Pre-Existing Gallery</h3>
      <div className="gallery-table">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
          className="tab-table"
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                ID
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                Image
              </th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentImages.map((image) => (
              <tr key={image.id}>
                <td style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                  {image.id}
                </td>
                <td style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                  <img
                    src={image.filepath}
                    alt=""
                    width="150"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleImageClick(image.filepath)} // Handle image click
                  />
                </td>
                <td style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                  <button
                    style={{
                      backgroundColor: "#d9534f",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(image.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Section */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                padding: "8px 16px",
                margin: "0 4px",
                backgroundColor: currentPage === index + 1 ? "#007bff" : "#fff",
                color: currentPage === index + 1 ? "#fff" : "#000",
                border: "1px solid #007bff",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{ width: "400px", height: "auto" }}
            />
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                opacity: "0.5",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploadImg;
