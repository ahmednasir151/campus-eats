import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = ({ onUploadSuccess, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const imageUrl = `http://localhost:5000${response.data.imageUrl}`;
      onUploadSuccess(imageUrl);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <div className="upload-area">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="change-image-btn"
              onClick={() => document.getElementById('imageInput').click()}
            >
              Change Image
            </button>
          </div>
        ) : (
          <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
            <div className="upload-icon">📸</div>
            <p>Click to upload image</p>
            <span className="upload-hint">JPG, PNG or GIF (Max 5MB)</span>
          </div>
        )}
      </div>

      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {uploading && (
        <div className="upload-status">
          <div className="spinner"></div>
          <span>Uploading...</span>
        </div>
      )}

      {error && (
        <div className="upload-error">{error}</div>
      )}
    </div>
  );
};

export default ImageUpload;