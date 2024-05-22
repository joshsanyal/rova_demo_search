import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import "../Styles/FileUpload.css"
import { REACT_APP_API_URL } from "../consts";
import CircularProgress from '@mui/material/CircularProgress';// Assuming you have Material-UI installed

const FileUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(REACT_APP_API_URL + 'files/');
        const result = await response.json();
        setFiles(result);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(REACT_APP_API_URL + `delete/${fileId}/`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } else {
        console.error('Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.reload();
  };

  const handleUpload = async (event, isGrantApp) => {
    const newFiles = Array.from(event.target.files);
    setIsLoading(true);
    for (const file of newFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(REACT_APP_API_URL + `upload/${isGrantApp}/`, {
          method: 'POST',
          body: formData,
        });
        if (isGrantApp) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setShowPopup(true);
          } else {
            const result = await response.json();
            console.log(result);
            setFiles((prevFiles) => [...prevFiles, result]);
          }
        
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  return (
      <div style={{ 
        width: '300px', 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRight: '1px solid black', 
        overflowY: 'auto' 
      }}>
        <label style={{margin: '20px'}} className="custom-file-input">
        Upload Research
        <input
          type="file"
          multiple
          onChange={(event) => handleUpload(event, 0)}
          style={{ display: 'none' }}
        />
      </label>

        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontWeight: 'bold' }}>Uploaded Files</h1>
          {files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              {files.map((file) => (
                <li key={file.filename} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.filename}</span>
                  <FaTrash 
                    style={{ cursor: 'pointer', color: 'red', flexShrink: 0 }} 
                    onClick={() => handleDelete(file.id)} 
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ position: 'fixed', bottom: '0', width: '100%', margin: '20px' }}>
        <label style={{ background: "#fd7013", color: "white" }} className="custom-file-input">
            {isLoading ? (
                <div style={{color: 'white'}}>
                <CircularProgress color="inherit"/>
                </div>
            ) : (
                <strong>Draft Grant (upload a template to begin)</strong>
            )}
            <input
                type="file"
                multiple
                onChange={(event) => handleUpload(event, 1)}
                style={{ display: 'none' }}
            />
        </label>
    </div>

    {showPopup && (
        <div style={{
          position: 'fixed',
          top: '47.5%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '90%',
          backgroundColor: 'white',
          overflow: 'scroll',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          padding: '37px',
          boxSizing: 'border-box'
        }}>
          <iframe
            src={pdfUrl}
            style={{ width: '100%', height: '100%'}}
            frameBorder="0"
          />
          <button
            onClick={() => handleClosePopup()}
            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1001}}
          >
            Close
          </button>
          <a href={pdfUrl} download="grant_application.pdf" style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 1001}}>
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
