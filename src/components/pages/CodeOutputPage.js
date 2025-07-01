import React from 'react';
import { Link, useHistory /*, useParams */ } from 'react-router-dom'; // Removed unused useParams
// Removed all native-base imports
// import {VStack,HStack,Divider,Text,Stack,Center,Button,useMediaQuery } from 'native-base' // REMOVED

import '../../App.css'; // Keeping the CSS import
import './CodeOutputPage.css'; // Keeping the CSS import
import CodeEditor from '../CodeEditor'; // Keeping child component
// Removed unused uuidv4
import { openDB } from 'idb'; // Keeping storage logic
import Logo from '../../assets/images/logo-white.png'; // Keeping asset
// Removed unused GoogleGenerativeAI import
// const { GoogleGenerativeAI } = require("@google/generative-ai"); // REMOVED
import { useAuth } from '../../context/AuthContext';


// Keeping IndexedDB functions
async function initDB() {
    const dbName = "vb2Database";
    const dbVersion = 1;

    const db = await openDB(dbName, dbVersion, {
        upgrade(db) {
            const objectStore = db.createObjectStore("codes", { keyPath: "id" });
            objectStore.createIndex("timestampIndex", "timestamp", { unique: false });
        },
    });

    console.log("Database initialized");
    return db;
}

async function getNoteIdb(db, id,types="codes") {
    const tx = db.transaction('codes', 'readonly');
    const store = tx.objectStore('codes');
    const note = await store.get(id);
    console.log("Note retrieved using idb:", note);
    return note[types];
}


// Main Component
export default function CodeOutput() {
    // Removed unused state: show, state
    const [codes, setCodes] = React.useState({}); // Keep codes state
    const [PRD, setPRD] = React.useState("");     // Keep PRD state
    const { user, logout} = useAuth()
    const history = useHistory()

    // Keeping function to get ID from URL
    const getIDFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    const handleLogout = () => {
        logout()
        history.push('/')
      }

    const APP_ID = getIDFromURL(); // Get APP_ID from URL

    // Effect hook to fetch data
    React.useEffect(() => {
        const fetchData = async () => {
            if (!APP_ID) {
                console.warn("No APP_ID found in URL.");
                // Optionally redirect or show an error message
                return;
            }
            const db = await initDB();
            const data = await getNoteIdb(db, APP_ID);

            setCodes(data|| {'PROJECT_ID':APP_ID});  

            const prd_data = localStorage.getItem(APP_ID + 'PRD') || "";
            setPRD(prd_data); // Set fetched PRD
        }
        fetchData();
    }, [APP_ID]); // Depend on APP_ID

    // Keeping function to get project name from history
    const getIdByAppId = (dataObject, targetAppId) => {
         // Ensure dataObject is valid before iterating
         if (!dataObject || typeof dataObject !== 'object') {
             return undefined;
         }
        for (const key in dataObject) {
            if (Object.prototype.hasOwnProperty.call(dataObject, key)) {
                const value = dataObject[key];
                // Check if value is an object and has the expected properties
                if (value && typeof value === 'object' && value.hasOwnProperty('APP_ID') && value.hasOwnProperty('id')) {
                    if (String(value.APP_ID) === String(targetAppId)) { // Ensure comparison is robust
                        return decodeURIComponent(value.id);
                    }
                }
            }
        }
        return undefined;
    };

    // Refactored Navbar function using standard HTML and CSS classes
    function Navbar({ projectId, projectName }) { // Accept project info as props

        const handleNewProjectClick = () => {
            window.location.href = '/'; // Navigate to home for new project
        };

        return (
             // Use nav tag or a div with navbar class
            <nav className="navbar">
                {/* Use container for centering and max-width */}
                <div className=" flex-row items-center justify-between" style={{
                alignItems:'space-between',width:'100%'}} > {/* Use flexbox classes */}

                    {/* Left section: Logo, Brand, New Project Button */}
                    <div className="flex-row items-center flex-gap-3"> {/* Use flexbox and gap classes */}
                        <div className="navbar-brand" onClick={() => window.location.href = "/"}> {/* Use brand class */}
                           <img src={Logo} alt="VB2 Logo" className="navbar-brand-logo" style={{width:'45px', height:'45px'}} /> {/* Use logo class */}
                            <div className="navbar-brand-text ml-1">VB-2</div> {/* Use brand text class */}
                        </div>

                        <button
                            onClick={handleNewProjectClick} // Use onClick
                            className="button button-primary button-rounded button-icon-left" // Use button classes
                        >
                             {/* SVG for New Project Icon */}
                            <svg width="18px" height="18px" viewBox="0 0 24 24"> {/* Adjusted size slightly */}
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M12 6V18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M6 12H18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </g>
                            </svg>
                            New Project
                        </button>
                    </div>

                    {/* Center section: Project Title */}
                    <div className="flex-row items-center flex-gap-1"> {/* Use flexbox and gap classes */}
                         {/* SVG for Project Icon */}
                        <svg className="project-title-icon" fill="currentColor" viewBox="0 0 16 16">
                             <path d="M3.5 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m9-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5M16 3.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-9 9a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m5.5 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-9-11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                        <p className="project-title"> {/* Use title class */}
                            Project: { projectName || projectId } {/* Display name if found, otherwise ID */}
                        </p>
                    </div>

                    <div className="navbar-actions">
                          {user ?    <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700" onClick={handleLogout}>Logout</button>:<></>}
                    </div>

                </div>
            </nav>
        );
    }


    return (
        <>
            {/* Pass project info to Navbar */}
            <Navbar
                 projectId={APP_ID}
                 projectName={getIdByAppId(JSON.parse(localStorage.getItem('history')) || {}, APP_ID)}
            />

             {/* Main content area below the navbar */}
            <div className=""> {/* Use main content and flex classes */}
                {/* Render CodeEditor component, passing fetched data */}
                <CodeEditor fileStructure={codes} APP_ID={APP_ID} PRD={PRD} />
            </div>
        </>
    );
}