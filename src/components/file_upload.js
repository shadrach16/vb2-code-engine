import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import './DocumentUploadTabs.css'; // Ensure your CSS file exists and is linked
import SRA from '../assets/images/Spinner@1x-1.0s-200px-200px.svg'
import Select from "react-select"; // Keeping external libs
import CustomSelect from "./CustomSelect"; // Keeping external libs
import { LucideMoonStar  } from 'lucide-react'

import pdfToText from 'react-pdftotext';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const originalOptions = [
  "Web Application",
  "Mobile Application",
  "Desktop GUI Application",
  "Command-Line Interface (CLI) Tool",
  "Browser Extension",
  "Backend API/Service",
  "Data Processing Script/Pipeline",
  "Embedded System Logic",
  "Library/SDK (Software Development Kit)",
  "Games",
  "IoT Application",
  "AI/ML Application",
  "Blockchain Application/Smart Contract",
  "Cloud Function/Serverless Application",
  'Software Development (Others)'
];


 const placeholders  = [
  ' I need a social media app for pet owners.',
  ' Develop a platform for local artisans to sell handmade goods.',
  ' Build an AI-powered personal finance tracker.',
  ' Create a subscription box service for organic snacks.',
  ' Design a mobile game where users manage a virtual garden."',
  ' Launch a web portal for community event listings.',
  ' An online learning platform for coding beginners.',
  ' A smart home automation system controlled by voice.',
];

const DocumentUploadTabs = ({ state = {}, updateState = f => f,isOpen,setClose }) => {
  const [activeTab, setActiveTab] = useState(state.activeTab || 'manual');
  const [documentFileName, setDocumentFileName] = useState(state.documentFileName || '');
  const [manualContent, setManualContent] = useState(''); // This state seems unused as updateState is called directly
  const [documentContent, setDocumentContent] = useState(''); // This state seems unused as updateState is called directly
  const [loading, setLoading] = useState(false);

 


  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const fileType = file.type;
      setDocumentFileName(file.name);
      updateState('documentFileName', file.name);
      setLoading(true);

      if (fileType === 'application/pdf') {
        handlePdfUpload(file);
      } else if (fileType.includes('text') || fileType === 'text/csv') {
        handleTextOrCsvUpload(file);
      } else if (fileType.includes('word') || fileType.includes('application/vnd')) {
        handleDocUpload(file);
      } else {
        // Fallback for unknown types, assuming text-like content
        handleTextOrCsvUpload(file);
      }
    });
  };

  const handlePdfUpload = async (file) => {
    pdfToText(file)
      .then(text => {
        // setLoading(true) // This was here, but should be false after success
        updateState('content', text);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to extract text from pdf", error); // Log error object
        setLoading(false);
      });
  };

  const handleTextOrCsvUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      if (file.type === 'text/csv') {
        const parsedCsv = Papa.parse(text, { header: true });
        // You might want to handle potential parsing errors or empty data
        updateState('content', JSON.stringify(parsedCsv.data, null, 2));
      } else {
        updateState('content', text);
      }
      setLoading(false);
    };

    reader.onerror = (error) => { // Add error handling for FileReader
      console.error('Error reading file:', error);
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const handleDocUpload = (file) => {
    const reader = new FileReader();
    setLoading(true);
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        updateState('content', text);
        setLoading(false);
      } catch (error) {
        console.error('Error reading DOCX file:', error);
        updateState('content', `Error reading DOCX file: ${error.message}`); // Provide user feedback
        setLoading(false);
      }
    };

    reader.onerror = (error) => { // Add error handling for FileReader
       console.error('Error reading file:', error);
       updateState('content', `Error reading file: ${error.message}`); // Provide user feedback
       setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };






  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const typingTimeoutRef = useRef(null);
  const rotationTimeoutRef = useRef(null);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const fullPlaceholder = placeholders[currentPlaceholderIndex];
    let charIndex = 0;
    setDisplayedPlaceholder('');
    setIsTypingComplete(false);

    const typeCharacter = () => {
      if (charIndex < fullPlaceholder.length) {
        setDisplayedPlaceholder((prev) => prev + fullPlaceholder.charAt(charIndex));
        charIndex++;
        typingTimeoutRef.current = setTimeout(typeCharacter, 50);
      } else {
        setIsTypingComplete(true);
      }
    };

    typeCharacter();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
    };
  }, [currentPlaceholderIndex, placeholders]);

  useEffect(() => {
    if (isTypingComplete) {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }

      rotationTimeoutRef.current = setTimeout(() => {
        setCurrentPlaceholderIndex((prevIndex) =>
          (prevIndex + 1) % placeholders.length
        );
        setIsTypingComplete(false);
      }, 3000);

      return () => {
        if (rotationTimeoutRef.current) {
          clearTimeout(rotationTimeoutRef.current);
        }
      };
    }
  }, [isTypingComplete, placeholders.length]);




  const handleManualContentChange = (e) => {
    const value = e.target.value;
    // setManualContent(value); // This state update is not strictly needed if using updateState
    updateState('content', value);
    updateState('documentFileName', "Manual Content Provided"); // This might overwrite actual file name if switching tabs
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    updateState('activeTab', tab);
    // if (tab === 'manual') {
    //   updateState('documentFileName', "Manual Content Provided"); // Set filename for manual tab
    // } else {
    //    updateState('documentFileName', ""); // Clear filename for upload tab? Depends on desired behavior
    // }
  };


  return (
    <div className="document-upload-container" style={{width:'100%'}}> {/* Updated container class */}
      <div className="document-upload-tabs"> {/* Updated tabs container class */}
        <button
          onClick={() => handleTabSwitch('manual')}
          className={`document-upload-tab ${activeTab === 'manual' ? 'active' : ''}`}
        >
          Ask Vb2 to build...
        </button>
        <button
          onClick={() => handleTabSwitch('upload')}
          className={`document-upload-tab ${activeTab === 'upload' ? 'active' : ''}`}
        >
          Attach Document...
        </button>
      </div>

      <div className="document-upload-tab-content"> {/* Updated tab content container class */}
        {activeTab === 'upload' && (
          <div className="upload-tab-panel" style={{ height:  '20vh' }} > 
            <FileDropzone onDrop={onDrop} loading={loading} documentFileName={documentFileName} />
       <div  className='flex align-center' style={{width:'100%',justifyContent:"space-between"}} >

  <CustomSelect
    state={state}
    updateState={updateState}
    originalOptions={originalOptions}
    isOpen={isOpen}
    setClose={setClose}
     
  />
          </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="manual-tab-panel" style={{ height:   '20vh' }}> {/* Panel for manual content */}
            <textarea style={{border:'0px solid',color:'black',border: '2px dashed gray',height:'16vh'}} 
              value={state.content || ''} placeholder={displayedPlaceholder.slice(1)} 
              onChange={handleManualContentChange} 
              className="manual-textarea" // Updated textarea class
            />
   
           
<div  className='flex align-center' style={{width:'100%',justifyContent:"space-between"}} >

  <CustomSelect
    state={state}
    updateState={updateState}
    originalOptions={originalOptions}
       isOpen={isOpen}
    setClose={setClose}
     
  />
          <div  className='flex align-center text-gray-500'  >    <LucideMoonStar onClick={()=>alert("Enhance")} className="h-6 rounded-full hover:bg-gray-500 hover:text-white bg-gray-200 text-gray-500 p-1 mx-3 " /> v 1.0.6

          </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FileDropzone = ({ onDrop, loading,documentFileName }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ // Get isDragActive
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'], // Added CSV explicitly
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], // Added DOCX explicitly
      // You might want to add other text or word document types if needed
    }
  });

  return (
    <div  style={{height:'16vh',marginBottom:'6px'}}
      {...getRootProps({
        className: `document-dropzone ${isDragActive ? 'drag-active' : ''}` // Add drag-active class
      })}
    >
      <input {...getInputProps()} />
      {loading ?
        <img src={SRA} alt="Loading..." className="loading-spinner" /> // Add alt text and class
        :
        <div className="upload-icon-area"> {/* Container for icon and text */}
        
         <svg width="44px" height="44px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M736.68 435.86a173.773 173.773 0 0 1 172.042 172.038c0.578 44.907-18.093 87.822-48.461 119.698-32.761 34.387-76.991 51.744-123.581 52.343-68.202 0.876-68.284 106.718 0 105.841 152.654-1.964 275.918-125.229 277.883-277.883 1.964-152.664-128.188-275.956-277.883-277.879-68.284-0.878-68.202 104.965 0 105.842zM285.262 779.307A173.773 173.773 0 0 1 113.22 607.266c-0.577-44.909 18.09-87.823 48.461-119.705 32.759-34.386 76.988-51.737 123.58-52.337 68.2-0.877 68.284-106.721 0-105.842C132.605 331.344 9.341 454.607 7.379 607.266 5.417 759.929 135.565 883.225 285.262 885.148c68.284 0.876 68.2-104.965 0-105.841z" fill="#4A5699"></path><path d="M339.68 384.204a173.762 173.762 0 0 1 172.037-172.038c44.908-0.577 87.822 18.092 119.698 48.462 34.388 32.759 51.743 76.985 52.343 123.576 0.877 68.199 106.72 68.284 105.843 0-1.964-152.653-125.231-275.917-277.884-277.879-152.664-1.962-275.954 128.182-277.878 277.879-0.88 68.284 104.964 68.199 105.841 0z" fill="#C45FA0"></path><path d="M545.039 473.078c16.542 16.542 16.542 43.356 0 59.896l-122.89 122.895c-16.542 16.538-43.357 16.538-59.896 0-16.542-16.546-16.542-43.362 0-59.899l122.892-122.892c16.537-16.542 43.355-16.542 59.894 0z" fill="#F39A2B"></path><path d="M485.17 473.078c16.537-16.539 43.354-16.539 59.892 0l122.896 122.896c16.538 16.533 16.538 43.354 0 59.896-16.541 16.538-43.361 16.538-59.898 0L485.17 532.979c-16.547-16.543-16.547-43.359 0-59.901z" fill="#F39A2B"></path><path d="M514.045 634.097c23.972 0 43.402 19.433 43.402 43.399v178.086c0 23.968-19.432 43.398-43.402 43.398-23.964 0-43.396-19.432-43.396-43.398V677.496c0.001-23.968 19.433-43.399 43.396-43.399z" fill="#E5594F"></path></g></svg>
        </div>
      }
      <p className="dropzone-text">Click to upload document, or drag files onto this area.</p> {/* Styled text */}
      <p className="accepted-formats">Accepted formats: PDF, TXT, CSV, DOCX</p> {/* Styled text */}

         {documentFileName && (
              <div className="uploaded-file-info"> 
                <p className='text-dark' >File Selected: <span className="file-name">{documentFileName}</span></p> 
              </div>
            )}

    </div>
  );
};

export default DocumentUploadTabs;