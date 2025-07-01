import React from 'react';
import JSONPretty from 'react-json-pretty';
import './JsonModal.css'; // We'll create this CSS file
import 'react-json-pretty/themes/monikai.css';


const JsonModal = ({ isOpen, onClose, jsonData, title = 'JSON Data View' }) => {
  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <div className="json-modal-overlay" onClick={onClose}>
      <div className="json-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Prevent clicks inside content from closing modal */}
        <div className="json-modal-header">
          <h2>{title}</h2>
          <button className="json-modal-close-button" onClick={onClose}>
            &times; {/* Times symbol for close button */}
          </button>
        </div>
        <div className="json-modal-body">
          {jsonData ? (
            <JSONPretty id="json-pretty" data={jsonData}></JSONPretty>
          ) : (
            <p>No JSON data to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonModal;