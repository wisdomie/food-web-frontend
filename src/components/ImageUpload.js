/**
 * ImageUpload Component
 *
 * Handles image upload with drag-and-drop and click functionality
 */

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { predictFood } from '../services/api';

function ImageUpload({
  selectedImage,
  previewUrl,
  loading,
  onImageSelect,
  onAnalysisStart,
  onAnalysisComplete,
  onAnalysisError,
}) {
  /**
   * Handle file drop
   */
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validate file size (max 16MB)
        if (file.size > 16 * 1024 * 1024) {
          onAnalysisError('File too large. Maximum size: 16MB');
          return;
        }

        onImageSelect(file);
      }
    },
    [onImageSelect, onAnalysisError]
  );

  /**
   * Configure dropzone
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    multiple: false,
  });

  /**
   * Handle analyze button click
   */
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    onAnalysisStart();

    try {
      const results = await predictFood(selectedImage);

      if (results.success) {
        onAnalysisComplete(results);
      } else {
        onAnalysisError(results.error || 'Analysis failed');
      }
    } catch (error) {
      onAnalysisError(error.message || 'Failed to analyze image');
    }
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    onImageSelect(null);
  };

  return (
    <div className="upload-container">
      {!selectedImage ? (
        /* Upload Area */
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">📷</div>
            <h2>Upload Food Image</h2>
            <p>
              {isDragActive
                ? 'Drop image here...'
                : 'Drag and drop an image, or click to select'}
            </p>
            <p className="upload-hint">
              Supported formats: JPG, PNG (max 16MB)
            </p>
          </div>
        </div>
      ) : (
        /* Preview and Analyze */
        <div className="preview-container">
          {/* Image Preview */}
          <div className="image-preview">
            <img src={previewUrl} alt="Food preview" />
          </div>

          {/* Actions */}
          <div className="upload-actions">
            {!loading ? (
              <>
                <button
                  onClick={handleAnalyze}
                  className="btn-primary btn-analyze"
                >
                  Analyze Food
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  Upload Different Image
                </button>
              </>
            ) : (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Analyzing your food...</p>
                <p className="loading-subtext">
                  This may take a few seconds
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
