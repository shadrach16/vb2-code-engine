import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import step_process, { generate_summary, generate_answers, generate_structure, generate_tech_stack,
    generate_task_breakdown, generate_task, generate_code_structure, generate_config_file, generate_ui_workflow,
    generate_quality_assurance, generate_code_correction,verify_missing
} from '../../assets/steps_process';
import {generate_web_task_breakdown,generate_mobile_task_breakdown,generate_gui_task_breakdown
, generate_cli_task_breakdown,generate_browser_ext_task_breakdown,
generate_data_pipeline_task_breakdown,generate_embedded_task_breakdown,
generate_backend_api_task_breakdown,generate_blockchain_task_breakdown,
generate_ai_ml_task_breakdown,generate_sdk_breakdown} from '../../assets/task_breakdown_prompts';

import  {   generate_web_structure,generate_mobile_structure,generate_api_structure,generate_cli_structure,
generate_extension_structure } from '../../assets/prd_prompt';
import '../../App.css'; // Keeping the CSS import
import './Build.css'; // Keeping the CSS import
import Select from "react-select"; // Keeping external libs
import Steps from 'react-steps'; // Keeping external libs
import FileUpload from '../file_upload'; // Keeping child components
import Samples from '../Samples';
import SideMenu from '../SideMenu';
import CustomSelect from '../CustomMainSelect';
import HorizontalLoader from '../HorizontalLoaderMain';
import CodeEditor from '../CodeEditor';
import TechSelection from '../TechSelection';
import { openDB } from 'idb'; // Keeping storage logic
// import {Banner300by250,Banner728by90} from "../Banner"; // Keeping if needed
import { v4 as uuidv4 } from 'uuid'; // Keeping utility
import Logo from '../../assets/images/logo-white.png'; // Keeping asset
import { useAuth } from '../../context/AuthContext';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Key, Settings,ChevronUp,ChevronDown  } from 'lucide-react';
// import ReactTreeExplorer from '../ReactTreeExplorer'
// Keeping AI related imports and setup
const { GoogleGenerativeAI } = require("@google/generative-ai");

let chatHistory = []; // Keeping chat history


const taskpromptMapper = {
  "Web Application":generate_web_task_breakdown,
  "Mobile Application":generate_mobile_task_breakdown,
  "Desktop GUI Application":generate_gui_task_breakdown,
  "Command-Line Interface (CLI) Tool":generate_cli_task_breakdown,
  "Browser Extension":generate_browser_ext_task_breakdown,
  "Backend API/Service":generate_backend_api_task_breakdown,
  "Data Processing Script/Pipeline":generate_data_pipeline_task_breakdown,
  "Embedded System Logic":generate_embedded_task_breakdown,
  "Blockchain Application/Smart Contract":generate_blockchain_task_breakdown,
  "AI/ML Application":generate_ai_ml_task_breakdown,
  "Library/SDK (Software Development Kit)":generate_sdk_breakdown,
  "Games":generate_task_breakdown,
  "IoT Application":generate_task_breakdown,
  "Cloud Function/Serverless Application":generate_task_breakdown,
  "Software Development (Others)":generate_task_breakdown,
}
const prdMapper = {
  "Mobile Application":generate_mobile_structure,
  "Web Application":generate_web_structure,
  "Command-Line Interface (CLI) Tool":generate_cli_structure,
  "Backend API/Service":generate_api_structure,
  "Browser Extension":generate_extension_structure,

  "Desktop GUI Application":generate_structure,
  "Data Processing Script/Pipeline":generate_structure,
  "Embedded System Logic":generate_structure,
  "Blockchain Application/Smart Contract":generate_structure,
  "AI/ML Application":generate_structure,
  "Library/SDK (Software Development Kit)":generate_structure,
  "Games":generate_structure,
  "IoT Application":generate_structure,
  "Cloud Function/Serverless Application":generate_structure,
  "Software Development (Others)":generate_structure,
}


const originalOptions = [
  "Web Application",
  "Mobile Application",
  // "Desktop GUI Application",
  // "Command-Line Interface (CLI) Tool",
  // "Browser Extension",
  // "Backend API/Service",
  // "Data Processing Script/Pipeline",
  // "Embedded System Logic",
  // "Library/SDK (Software Development Kit)",
  // "Games",
  // "IoT Application",
  // "AI/ML Application",
  // "Blockchain Application/Smart Contract",
  // "Cloud Function/Serverless Application",
  // 'Software Development (Others)'
];


const phasesMapper = {
  "Web Application":[
                  "Phase 0: Project Initialization & Configuration",  
                  "Phase 1: Database Design & Integration (Backend Foundation)",  
                  "Phase 2: Backend API Development (Server-Side Logic)",
                  "Phase 3: Client-Side Services & Global State Management",
                  "Phase 4: Reusable UI Components Design & Development",
                  "Phase 5: Screens & Pages Construction",
                  "Phase 6: Application Shell, Routing & Navigation",
                  "Phase 7: Documentation & Deployment Guides",
                ],
  "Mobile Application":[
                  'Phase 0: Project & Build Configuration',
                  "Phase 1: Core Data Layer & Domain Modeling",
                  "Phase 2: Domain Logic & Business Services", 
                  'Phase 3: Presentation Logic & State Management (Providers)',
                  'Phase 4: Reusable UI Widgets & Design System',
                  'Phase 5: Screen Construction & UI Composition',
                  'Phase 6: Application Shell, Navigation & Theming',
                  'Phase 7: Documentation & Deployment',
                ], 
                 // "Mobile Application":[
                //   'Phase 0: Project Initialization & Configuration',
                //   "Phase 1: Backend Data Model Design & Persistence (Core Data Foundation)",
                //   "Phase 2: Backend API Routes & Logic Implementation", 
                //   'Phase 3: Application Logic, Data Access & State Management (Client-Side)',
                //   'Phase 4: Reusable UI Elements Design & Development',
                //   'Phase 5: Application Screens/Views Construction',
                //   'Phase 6: Application Shell, Navigation & Flow',
                //   'Phase 7: Documentation & Deployment Guides',
                // ],
  "Desktop GUI Application":[
                  "Phase 1: Project Setup & Core Application Shell (Foundation)", 
                  'Phase 2: UI Design & Static Layout (View Definitions)',
                  'Phase 3: UI Element Logic & Event Handling (View-Models/Controllers/Code-Behind)', 
                  'Phase 4: Business Logic & Core Modules (Model/Services)',
                  'Phase 5: Data Persistence & Access Layer (Data Management)',
                  'Phase 6: Feature Integration & Workflow Implementation (Putting It Together)',
                  'Phase 7: Final Polish, Testing, Packaging & Deployment Preparation (Release Readiness)', 
                ],
  "Command-Line Interface (CLI) Tool":[
                  "Phase 0: Project Initialization & Core Configuration",
                  "Phase 1: External System Integration & Local Data Models",
                  "Phase 2: Core Command Logic & Processing",
                  "Phase 3: Reusable Utilities & Cross-Cutting Concerns",
                  "Phase 4: Command/Subcommand Definitions & Argument Parsing",
                  "Phase 5: CLI Entry Point, Help System & Global Execution",
                  "Phase 6: Packaging & Distribution",
                  "Phase 7: Documentation & Deployment Guides",
                ],
  "Browser Extension":[
                  "Phase 0: Project Initialization & Manifest Definition", 
                  "Phase 1: Local & Remote Data Handling", 
                  "Phase 2: Background Service Logic & API Integration", 
                  "Phase 3: Reusable Utilities & Cross-Context Communication", 
                  "Phase 4: Content Script Development & DOM Interaction", 
                  "Phase 5: User Interface Development (Popup & Options)", 
                  "Phase 6: Packaging & Distribution", 
                  "Phase 7: Documentation & Store Listing Guides", 
                                  ],
  "Backend API/Service":[
                  "Phase 0: Project Initialization & Core Configuration",  
                  "Phase 1: Database Design & Integration (Backend Foundation)",  
                  "Phase 2: Backend Core Logic & Processing",  
                  "Phase 3: Reusable Utilities & Cross-Cutting Concerns",  
                  "Phase 4: API Endpoint Definitions & Routing",  
                  "Phase 5: API Service Entry Point & Global Execution",  
                  "Phase 6: Packaging & Deployment Configurations",  
                  "Phase 7: Documentation & API Usage Guides",  
                ],
  "Data Processing Script/Pipeline":[
                  "Phase 1: Requirements Analysis & Data Source Profiling (Foundation & Understanding)", 
                  "Phase 2: Pipeline Architecture & Design (Blueprint)", 
                  "Phase 3: Data Extraction & Ingestion (Getting Data In)", 
                  "Phase 4: Data Validation & Cleaning (Ensuring Quality)", 
                  "Phase 5: Core Transformation Logic Implementation (Business Rules Engine)", 
                  "Phase 6: Data Loading & Target Integration (Delivering Processed Data)", 
                  "Phase 7: Orchestration, Scheduling & Monitoring (Automation & Oversight)", 
                  "hase 8: Documentation & Deployment Preparation (Quality Assurance & Handoff)", 
                ],
  "Embedded System Logic":[
                  "Phase 1: Project Setup & Hardware Abstraction Layer (HAL) Initialization",
                  "Phase 2: Core Driver Development & Peripheral Integration",
                  "Phase 3: RTOS Configuration & Application Logic Scaffolding",
                  "Phase 4: Feature Implementation & System Integration",
                  "Phase 5: Documentation, Release & Maintenance Planning",
                ],
  "Library/SDK (Software Development Kit)":[
                  "Phase 1: SDK Project Setup & Core Infrastructure (Foundation)",
                  "Phase 2: Core Logic & Algorithm Implementation (Engine Room)",
                  "Phase 3: Public API Definition & Module Implementation (Developer Interface)",
                  "Phase 4: Feature Implementation & Integration (Functionality Build-out)",
                  "Phase 5: Testing Framework & Comprehensive Test Cases (Quality Assurance)",
                  "Phase 6: Documentation & Example Code (Developer Enablement)",
                  "Phase 7: Build, Packaging & Distribution Setup (Deployment)",
                  "Phase 8: Final Review, Beta Testing & Release Preparation (Launch Readiness)",  
                ],
  "Games":[
                  "Phase 1: Project Kick-off & Core Infrastructure",
                  "Phase 2: Data Persistence & Modeling",
                  "Phase 3: Core Business Logic Services",
                  "Phase 4: API & Data Transformation",
                  "Phase 5: Component/Primitive Development & Assembly",
                  "Phase 6: Screen/Page Implementation & Interaction Flow",
                  "Phase 7: Application Initialization & System-Wide Concerns",
                  "Phase 8: API, Technical, User & Operational Documentation",  
                ],
  "IoT Application":[
                  "Phase 1: Project Kick-off & Core Infrastructure",
                  "Phase 2: Data Persistence & Modeling",
                  "Phase 3: Core Business Logic Services",
                  "Phase 4: API & Data Transformation",
                  "Phase 5: Component/Primitive Development & Assembly",
                  "Phase 6: Screen/Page Implementation & Interaction Flow",
                  "Phase 7: Application Initialization & System-Wide Concerns",
                  "Phase 8: API, Technical, User & Operational Documentation",  
                ],
  "AI/ML Application":[
                  "Phase 1: Project Setup & Data Ingestion (Foundation)",  
                  "Phase 2: Data Preprocessing & Feature Engineering (Data Preparation)",  
                  "Phase 3: Model Development & Experimentation (Core AI/ML Research)",  
                  "Phase 4: Model Training & Optimization (Refinement & Scaling)",  
                  "Phase 5: Model Evaluation & Validation (Quality Assurance)",  
                  "Phase 6: Model Deployment & API Development (Serving & Productionization)",  
                  "Phase 7: Integration & Application Interface (Consumption Layer - If Applicable)",  
                  "Phase 8: Monitoring, Maintenance & Documentation (MLOps & Governance)",  
                ],
  "Blockchain Application/Smart Contract":[
                  "Phase 1: Requirements Analysis & Blockchain Platform Strategy",
                  "Phase 2: Smart Contract Design & Data Modeling",
                  "Phase 3: Development Environment & Tooling Setup",
                  "Phase 4: Smart Contract Implementation",
                  "Phase 5: Smart Contract Testing & Quality Assurance",
                  "Phase 6: Frontend/Client-Side Integration (dApp UI/UX - if applicable)",
                  "Phase 7: Deployment & Network Operations",
                  "Phase 8: Oracles & Off-Chain Integration (if applicable)",
                  "Phase 9: Documentation, Community & Launch Preparation",
                ],
  "Cloud Function/Serverless Application":[
                  "Phase 1: Project Kick-off & Core Infrastructure",
                  "Phase 2: Data Persistence & Modeling",
                  "Phase 3: Core Business Logic Services",
                  "Phase 4: API & Data Transformation",
                  "Phase 5: Component/Primitive Development & Assembly",
                  "Phase 6: Screen/Page Implementation & Interaction Flow",
                  "Phase 7: Application Initialization & System-Wide Concerns",
                  "Phase 8: API, Technical, User & Operational Documentation",  
                ],
  "Database Application":[
                  "Phase 1: Project Kick-off & Core Infrastructure",
                  "Phase 2: Data Persistence & Modeling",
                  "Phase 3: Core Business Logic Services",
                  "Phase 4: API & Data Transformation",
                  "Phase 5: Component/Primitive Development & Assembly",
                  "Phase 6: Screen/Page Implementation & Interaction Flow",
                  "Phase 7: Application Initialization & System-Wide Concerns",
                  "Phase 8: API, Technical, User & Operational Documentation",  
                ],
  "Software Development (Others)":[
                  "Phase 1: Project Setup & Core Structure (Foundation)",
                  "Phase 2: Data Models & Persistence (Data Foundation)",  
                  "Phase 3: Core Logic & Algorithm Implementation (Tool Brain)",  
                  "Phase 4: Tool Interfaces & Integration Points (Interaction Layer)",  
                  "Phase 5: Reusable Modules & Utilities (Building Blocks)",  
                  "Phase 6: Feature Implementation & System Composition (Tool Functionality)",  
                  "Phase 7: Documentation, Packaging & Distribution",  
                ]
}

 

// Keeping IndexedDB functions
async function initDB() {
    const dbName = "vb2Database";
    const dbVersion = 1;

    const db = await openDB(dbName, dbVersion, {
        upgrade(db) {
            const objectStore = db.createObjectStore('codes', { keyPath: "id" });
            objectStore.createIndex("timestampIndex", "timestamp", { unique: false });
 

        },
    });

    console.log("Database initialized");
    return db;
}

// Updated function to add/merge data
async function addNoteIdb(db, note, types = "codes") {
   

    try {
        const tx = db.transaction(types, 'readwrite');
        const store = tx.objectStore(types);

        let itemToPut = note; // Assume we will put the new note by default
        if (store.keyPath) {
            const existingItem = await store.get(note[store.keyPath]);
            if (existingItem) {
                console.log(`Merging data for key '${note[store.keyPath]}' in store '${types}'.`);
                itemToPut = { ...existingItem, ...note };
            } else {
                 console.log(`Adding new item with key '${note[store.keyPath]}' to store '${types}'.`);
            }
        } else {
             console.log(`Adding item to keyless store '${types}'.`);
        }
        await store.put(itemToPut);
        await tx.done;
        console.log(`Item operation completed in store '${types}' with key: ${note[store.keyPath] || '(no keyPath)'}`);
    } catch (error) {
        console.error(`Error performing operation on store '${types}':`, error);
    }
}

async function getNoteIdb(db, id,types="codes") {
    const tx = db.transaction('codes', 'readonly');
    const store = tx.objectStore('codes');
    const note = await store.get(id);
    console.log("Note retrieved using idb:", note);
    return note[types];
}





// Refactored Navbar
function Navbar() {
  const [showModal, setShowModal] = React.useState(false);

    const { user, logout} = useAuth()
    const history = useHistory()

        const handleLogout = () => {
        logout()
        history.push('/')
      }


    return (
        <nav className="navbar"> {/* Use navbar class */}
    
            <div className="container" style={{maxWidth: "100% !important", width:"100vw !important"}} > {/* Use container for centering/max-width */}
                <div className="navbar-brand" onClick={() => window.location.href = "/"}> {/* Use brand classes */}
                    <img src={Logo} alt="VB2 Logo" className="navbar-brand-logo" style={{width:'51px',height:'51px'}} /> {/* Use logo class */}
                    <div className="navbar-brand-text ml-1 font-bold ">VB-2</div>  
                </div>
                
                <div className="navbar-actions"> {/* Use actions container class */}
               {user ?    
               <button style={{'zIndex':50}} className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700" onClick={handleLogout}>Logout</button>
               :
              <>
               <button
                className="px-3 py-1.5 flex items-center text-sm bg-gray-800 text-white rounded-md hover:bg-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={() => window.location.href = '/waitlist'}
              >
                Apply for Waitlist
                <svg version="1.1" id="designs" className='ml-2' width="20px" height="20px" viewBox="0 0 32 32" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path className="sketchy_een" d="M25.775,5.07c-0.031-0.334-0.052-0.661-0.048-0.997c0.006-0.392,0.002-0.785-0.006-1.179 c-0.008-0.462-0.379-0.849-0.849-0.849c-0.148,0-0.285,0.053-0.411,0.125c-0.133-0.039-0.275-0.049-0.42-0.018 c-0.027,0.005-0.053,0.01-0.08,0.015c-0.268,0.021-0.539,0.02-0.807,0.027c-0.35,0.008-0.698,0.027-1.046,0.041 c-0.665,0.023-1.33,0.013-1.995,0.008c-0.738-0.006-1.477-0.031-2.215-0.029c-0.725,0-1.45,0-2.173-0.004 c-0.644-0.004-1.286-0.015-1.929-0.015c-0.694,0-1.386-0.014-2.08-0.017c-0.259,0-0.518,0-0.777,0c-0.389,0-0.777,0-1.166-0.006 c-0.707-0.01-1.411-0.079-2.113-0.168C7.644,2.001,7.627,2,7.609,2c-0.09,0-0.185,0.029-0.274,0.071 C7.257,2.047,7.177,2.023,7.094,2.023c-0.224,0-0.443,0.091-0.601,0.249c-0.17,0.17-0.228,0.369-0.249,0.601 C6.188,3.554,6.18,4.24,6.17,4.922C6.166,5.125,6.168,5.328,6.172,5.531c0.002,0.263-0.014,0.545,0.07,0.798 c0.078,0.239,0.25,0.42,0.461,0.521c0.107,0.23,0.323,0.392,0.576,0.437C7.277,7.31,7.266,7.329,7.266,7.351 C7.252,7.867,7.26,8.383,7.26,8.899c-0.002,0.44,0.072,0.871,0.134,1.305c0.023,0.188,0.046,0.376,0.08,0.561 c0.039,0.205,0.114,0.402,0.184,0.599c0.133,0.375,0.274,0.754,0.468,1.102c0.068,0.12,0.133,0.242,0.199,0.361 c0.124,0.234,0.317,0.445,0.495,0.642c0.283,0.309,0.584,0.585,0.912,0.843c0.387,0.305,0.768,0.617,1.218,0.824 c0.401,0.185,0.793,0.378,1.182,0.586c0.015,0.037,0.01,0.079,0.031,0.114c0.036,0.084,0.074,0.167,0.11,0.25 c0.009,0.024,0.018,0.048,0.026,0.073c-0.005,0.008-0.009,0.017-0.014,0.025c-0.068,0.07-0.142,0.134-0.218,0.196 c-0.162,0.112-0.34,0.196-0.507,0.301c-0.261,0.162-0.52,0.346-0.737,0.564c-0.276,0.28-0.535,0.576-0.804,0.862 c-0.191,0.203-0.383,0.402-0.557,0.62c-0.274,0.346-0.549,0.694-0.806,1.054c-0.249,0.348-0.437,0.754-0.593,1.152 c-0.155,0.387-0.286,0.777-0.404,1.175c-0.112,0.373-0.174,0.752-0.238,1.135c-0.044,0.276-0.099,0.553-0.122,0.831 c-0.008,0.101-0.008,0.199-0.006,0.298c0,0.109-0.005,0.221-0.007,0.332c-0.28,0.054-0.501,0.277-0.578,0.551 c-0.208,0.143-0.359,0.368-0.345,0.631c0.016,0.307,0.044,0.615,0.056,0.922c0.012,0.269,0.012,0.537,0.021,0.806 c0.017,0.477,0.031,0.955,0.035,1.432c0.004,0.439,0.363,0.804,0.804,0.804c0.198,0,0.393-0.087,0.544-0.221 c0.19-0.001,0.38,0,0.569-0.002c0.394-0.008,0.791-0.014,1.185-0.004c0.296,0.008,0.593,0.029,0.891,0.025 c0.338-0.006,0.677-0.019,1.015-0.031c0.408-0.012,0.82-0.008,1.229-0.004c0.29,0.002,0.582,0.004,0.874,0 c0.74-0.008,1.483,0.002,2.225,0.006c0.692,0.006,1.382,0.019,2.072,0.025c0.777,0.008,1.556,0,2.331,0.058 c0.342,0.025,0.68,0.066,1.023,0.075c0.321,0.01,0.64,0.014,0.961,0.043c0.596,0.058,1.199,0.053,1.793,0.117 c0.107,0.014,0.209,0.017,0.308,0.003C24.389,29.976,24.484,30,24.583,30c0.211,0,0.416-0.085,0.564-0.234 c0.215-0.215,0.259-0.489,0.205-0.777c-0.002-0.011-0.004-0.022-0.006-0.033c-0.036-0.375-0.026-0.758-0.023-1.134 c0.008-0.661,0.039-1.322,0.056-1.983c0.011-0.41-0.336-0.746-0.733-0.776c-0.001-0.061,0.008-0.124-0.014-0.177 c-0.016-0.042-0.027-0.086-0.035-0.131c-0.094-0.769-0.147-1.542-0.306-2.301c-0.035-0.162-0.072-0.325-0.128-0.481 c-0.075-0.216-0.178-0.423-0.273-0.632c-0.147-0.331-0.278-0.669-0.437-0.996c-0.071-0.149-0.166-0.286-0.245-0.431 c-0.091-0.164-0.174-0.331-0.259-0.497c-0.193-0.377-0.41-0.744-0.68-1.073c-0.52-0.638-1.137-1.233-1.902-1.568 c-0.118-0.052-0.239-0.091-0.36-0.129c0.119-0.039,0.237-0.077,0.351-0.126c0.259-0.108,0.506-0.23,0.756-0.361 c0.619-0.323,1.106-0.872,1.502-1.436c0.22-0.313,0.421-0.64,0.63-0.963c0.201-0.309,0.4-0.619,0.549-0.957 c0.338-0.777,0.617-1.579,0.721-2.424c0.027-0.209,0.033-0.418,0.046-0.628c0.017-0.259,0.048-0.518,0.077-0.775 c0.06-0.564,0.135-1.125,0.207-1.688c0.003-0.02-0.003-0.042-0.003-0.062c0.044,0.007,0.085,0.026,0.13,0.026 c0.218,0,0.431-0.087,0.586-0.242c0.172-0.172,0.213-0.358,0.244-0.588C25.862,5.977,25.818,5.517,25.775,5.07z M10.046,3.681 c0.315,0.002,0.63,0.002,0.945,0.002c0.421-0.002,0.841-0.002,1.262,0c0.783,0.002,1.566,0.006,2.349,0.025 c0.738,0.017,1.477,0.006,2.215,0.004c1.305,0,2.608-0.002,3.913-0.006c0.613,0,1.227-0.002,1.84-0.037 c0.5-0.029,1-0.023,1.499-0.045c0.029,0.482,0.057,0.964,0.095,1.446c0.021,0.266,0.022,0.539,0.013,0.811 c-0.119,0.005-0.232,0.03-0.33,0.083c-0.644,0.026-1.289,0.021-1.934,0.019c-0.75-0.002-1.502-0.004-2.252-0.006 c-1.531-0.006-3.06,0.004-4.589-0.025c-0.617-0.012-1.233-0.017-1.848-0.039c-0.605-0.021-1.21-0.068-1.815-0.093 C10.218,5.772,9.023,5.742,7.828,5.74C7.827,5.625,7.829,5.509,7.829,5.394c0.002-0.195,0.004-0.391,0-0.584 C7.824,4.407,7.848,4.008,7.88,3.608C8.601,3.672,9.321,3.678,10.046,3.681z M13.925,21.156c0.063-0.026,0.125-0.052,0.188-0.078 c0.086-0.036,0.172-0.072,0.258-0.109c0.237-0.096,0.477-0.179,0.729-0.229c0.375-0.035,0.761-0.022,1.137,0.014 c0.573,0.098,1.115,0.295,1.669,0.472c0.29,0.093,0.574,0.211,0.854,0.331c0.302,0.126,0.607,0.247,0.909,0.371 c0.585,0.247,1.178,0.48,1.766,0.724c0.398,0.183,0.771,0.41,1.164,0.603c0.121,0.058,0.242,0.089,0.366,0.1 c0.028,0.175,0.057,0.35,0.081,0.523c0.032,0.244,0.065,0.489,0.086,0.735c0.012,0.137,0.023,0.272,0.032,0.407 c-0.479-0.008-0.96-0.06-1.433-0.081c-0.259-0.012-0.516-0.027-0.775-0.027c-0.284,0-0.566,0.023-0.851,0.025 c-0.738,0.004-1.477-0.006-2.215-0.016c-0.831-0.01-1.664-0.021-2.497-0.013c-1.258,0.012-2.513-0.081-3.771-0.081 c-0.634,0-1.268,0.004-1.902-0.019c-0.254-0.009-0.508-0.029-0.763-0.043c-0.004-0.051,0.01-0.1-0.005-0.151 c-0.001-0.002-0.001-0.003-0.002-0.005c-0.009-0.201,0.003-0.402,0-0.604c-0.002-0.125,0.016-0.248,0.027-0.371 c0.1-0.042,0.201-0.084,0.302-0.126c0.082-0.035,0.163-0.069,0.245-0.104c0.825-0.348,1.605-0.784,2.381-1.228 c0.715-0.408,1.45-0.775,2.208-1.096C14.048,21.103,13.987,21.13,13.925,21.156z M22.232,28.25c-0.68-0.041-1.365-0.068-2.047-0.097 c-1.558-0.068-3.12-0.077-4.68-0.085c-1.386-0.008-2.77-0.01-4.156,0.027c-0.313,0.01-0.624,0.004-0.936,0.002 c-0.296-0.002-0.592,0.019-0.885,0.029c-0.509,0.015-1.018-0.01-1.526-0.036c-0.013-0.251-0.021-0.502-0.025-0.751 c-0.007-0.367-0.018-0.735-0.031-1.103c0.746,0.027,1.491,0.047,2.238,0.046c0.787-0.002,1.577-0.012,2.364,0.019 c0.783,0.031,1.558,0.124,2.341,0.143c0.737,0.019,1.473,0.023,2.211,0.016c0.704-0.008,1.407-0.017,2.111-0.012 c0.309,0.002,0.617,0.008,0.926,0.029c0.242,0.015,0.481,0.039,0.723,0.044c0.497,0.012,0.994,0.019,1.49,0.023 c0.484,0.005,0.967,0.019,1.451,0.017c-0.004,0.588-0.008,1.177-0.01,1.765c-0.155-0.004-0.31-0.001-0.464-0.009 C22.961,28.298,22.597,28.271,22.232,28.25z M22.383,12.058c-0.164,0.356-0.38,0.686-0.585,1.021 c-0.199,0.324-0.404,0.646-0.63,0.952c-0.171,0.198-0.363,0.389-0.565,0.559c-0.14,0.097-0.29,0.18-0.435,0.265 c-0.124,0.073-0.248,0.145-0.377,0.207c-0.209,0.078-0.431,0.143-0.646,0.186c-0.029,0.006-0.049,0.027-0.077,0.036 c-0.046-0.022-0.085-0.055-0.137-0.069c-0.072-0.02-0.146-0.03-0.22-0.03c-0.377,0-0.75,0.248-0.839,0.631 c-0.043,0.186-0.077,0.369-0.099,0.559c-0.021,0.17,0,0.333,0.035,0.503c0.064,0.298,0.265,0.591,0.487,0.794 c0.274,0.251,0.622,0.412,0.984,0.495c0.135,0.031,0.265,0.059,0.395,0.103c0.268,0.13,0.524,0.288,0.766,0.463 c0.255,0.216,0.479,0.468,0.699,0.718c0.316,0.446,0.542,0.946,0.835,1.404c0.066,0.104,0.123,0.212,0.18,0.321 c-0.302-0.128-0.607-0.252-0.911-0.368c-0.766-0.294-1.531-0.588-2.297-0.883c-0.362-0.139-0.729-0.253-1.096-0.371 c-0.367-0.118-0.729-0.232-1.11-0.294c-0.376-0.063-0.766-0.104-1.154-0.104c-0.463,0-0.924,0.059-1.359,0.213 c-0.483,0.172-0.955,0.398-1.423,0.607c-0.429,0.191-0.849,0.404-1.26,0.626c-0.697,0.377-1.392,0.75-2.108,1.087 c0.03-0.082,0.054-0.167,0.086-0.25c0.098-0.22,0.203-0.436,0.32-0.648c0.095-0.173,0.218-0.333,0.339-0.49 c0.279-0.36,0.552-0.728,0.871-1.056c0.201-0.207,0.404-0.408,0.607-0.613c0.142-0.143,0.278-0.291,0.431-0.422 c0.184-0.126,0.383-0.224,0.582-0.328c0.255-0.135,0.489-0.311,0.706-0.499c0.244-0.209,0.414-0.52,0.489-0.829 c0.064-0.263,0.046-0.495,0.002-0.76c-0.035-0.201-0.133-0.398-0.213-0.586c-0.078-0.185-0.167-0.328-0.326-0.442 c-0.063-0.169-0.18-0.344-0.341-0.419c-0.377-0.178-0.742-0.379-1.121-0.553c-0.336-0.154-0.64-0.324-0.934-0.547 c-0.12-0.095-0.242-0.189-0.364-0.283c-0.309-0.248-0.59-0.536-0.842-0.843c-0.089-0.134-0.158-0.282-0.233-0.425 c-0.064-0.119-0.125-0.239-0.181-0.362c-0.164-0.407-0.304-0.834-0.376-1.267C8.916,9.868,8.896,9.671,8.872,9.473 C8.853,9.301,8.831,9.131,8.828,8.957C8.818,8.42,8.866,7.886,8.889,7.351C8.89,7.326,8.877,7.304,8.876,7.279 c0.293-0.008,0.586-0.02,0.878-0.022c0.655-0.006,1.309,0.031,1.962,0.044c1.407,0.029,2.815,0.054,4.224,0.044 c1.363-0.008,2.726,0.012,4.088,0.012c1.039,0,2.079,0.001,3.118,0.009c-0.103,0.94-0.128,1.887-0.238,2.826 C22.81,10.828,22.62,11.462,22.383,12.058z M9.69,14.279c0.014,0.011,0.028,0.022,0.042,0.033c0.001,0.001,0.002,0.002,0.003,0.002 C9.72,14.302,9.705,14.291,9.69,14.279z M9.519,23.404c0.001,0,0.001-0.001,0.001-0.001l0.002-0.001 C9.522,23.403,9.521,23.403,9.519,23.404z M9.154,23.558c0.041-0.017,0.082-0.035,0.122-0.052c0.024-0.01,0.047-0.02,0.071-0.029 C9.283,23.504,9.22,23.531,9.154,23.558z"></path> </g></svg>
              </button>
<button  onClick={e=>{
    localStorage.setItem('API_KEYRELOAD','true');
    window.location.href = '/'
}} >
               <Key size={23} color="black"/>
               </button>
               </>}
                </div>
            </div>
        </nav>
    );
}


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Footer container with basic styling using Tailwind CSS
    <footer className="mt-12 text-gray-600  text-center  " style={{    marginRight: '-18px',
    marginLeft: '-18px',marginBottom: '-18px',    height: '75px'}} >
      <div className="container mx-0">
        {/* Copyright notice */}
        <p className="text-sm">
          &copy; {currentYear} vb2. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-400">
          Please review the generated code carefully, as AI agents can sometimes make mistakes.
        </p>
      </div>
    </footer>
  );
};


export default function SignInPage() {

    const [show, setShow] = React.useState(false);
    const [askLoading, setAskLoading] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [currentStage, setCurrentStage] = React.useState();
    const [done, setDone] = React.useState(false);
    const [state, setState] = React.useState({
        'features': {
            'value': "Codes"
        },
        'software_type':  "Web Application", 
    });
    const [updatedContent, saveUpdatedContent] = React.useState({ 'id': "New Project" });
    const [showContent, setShowContent] = React.useState(false);
    const [showContentKey, setShowContentKey] = React.useState({ title: '', key: "" });
    const [chapter, setChapter] = React.useState(1);
    const [scene, setScene] = React.useState(1);
    const [loading_count, setLoadingCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loading_label, setLoadingLabel] = React.useState();
    const [tasks, setTasks] = React.useState([]);
    const [codes, setCodes] = React.useState({});
    const [error, setError] = React.useState();
    const [tasks_state, setTasksState] = React.useState({});
    const [generatingLabel, setGeneratingLabel] = React.useState("Processing Config");
    const [generatingIndex, setGeneratingIndex] = React.useState(0);
    const [generating, setGenerating] = React.useState(false);
    const [current_task, set_current_task] = React.useState(0);
    const [technicalSelection, setTechnicalSelection] = React.useState(false);
    const [isAppTypeOpen, setIsAppType] = React.useState(false);


    const history = useHistory();

    // Keeping step_json
    const step_json = [
        { step: 1, label: 'Requirements Upload & Processing' },
        { step: 2, label: 'Code Output' },
    ].map(e => ({
        "text": e.label,
        "isActive": e.step === step,
        "isDone": e.step < step
    }));

    // Keeping history from URL logic
    const getHistoryFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const historyValue = urlParams.get('history');

        if (historyValue) {
            try {
                return historyValue; // If the value is a JSON string, parse it
            } catch (error) {
                console.error("Error parsing 'history' from URL:", error);
                return null;
            }
        }
        return null; // Return null if the 'history' parameter is not found
    };

    // Keeping AI model setup
    const MAX_TOKENS = 80000; // Adjust based on Gemini's prompt size limit
    
    const APP_ID = String(uuidv4());

    // Keeping state update function
    const updateState = (label, value) => {
        setState(prev => ({ ...prev, [label]: value }));
    }

    // Keeping utility functions
    function splitText(text, delimiters = ['\n', '\t'], words = []) {
        const escapedDelimiters = delimiters.map(d => d.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
        const pattern = [...escapedDelimiters, ...words].join('|');
        const regex = new RegExp(`(${pattern})`, 'gi');
        return text.split(regex).filter(part => part.trim() !== ''); // Remove empty splits
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const removeConsecutiveJSONBr = (text) => {
        return removeTrailingCommas(cleanJsonWhitespace(text
            .replace('json', '')
            .replace(/`/g, '')
            .trim()));
    };


function removeTrailingCommas(jsonString) {
  const pattern = /,\s*([}\]])/g;
  return jsonString.replace(pattern, '$1');
}


function cleanJsonWhitespace(jsonString) {
    let cleanedString = jsonString.replace(/[\u00A0\uFEFF]/g, ' '); 
     cleanedString = cleanedString.replace(/\s+/g, ' '); // Replaces all whitespace sequences with a single space
    return cleanedString;
}


async function generateText(prompt, retries = 0) {
    const genAI = new GoogleGenerativeAI(localStorage.getItem('geminiApiKey') || process.env.API_KEY );
    const model = genAI.getGenerativeModel({ model: process.env.API_VERSION || "gemini-2.0-flash" });

    try {
        const chat = model.startChat({
            history: chatHistory, // Use the history passed in
        });

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const generatedText = response.text();

        setError(); // Clear any previous error messages

        return generatedText; // Return the text, let the caller validate and update history
    } catch (error) {
        setError(`${String(error).slice(0,20)}, (Attempt ${retries + 1}): Waiting for 1 minute`);
        console.error(`Error generating text (Attempt ${retries + 1}): Waiting for ${retries} minutes`, error);

        if (retries < 50) { // High retry limit for rate limits is good
            await delay(60000);
            return generateText(prompt, retries + 1); // Pass the same history for retries
        } else {
            console.error("Maximum retry attempts reached for generateText. Failing.");
            throw error;
        }
    }
}


const get_task_breakdown = async (structure, workflow, phase = "", previous_phases_json, retries = 0) => {
    const maxRetries = 30;
    const retryDelay = 3000;

    console.log('phase', phase);

    try {
        const use_prompt = taskpromptMapper[state.software_type];
        let promptText = use_prompt(structure, workflow, phase, previous_phases_json);

        if (retries > 0) {
            promptText += ` (Retry attempt: ${retries}, Timestamp: ${Date.now()})`;
        }



        const generatedText = await generateText(promptText);

        const cleanedText = removeConsecutiveJSONBr(generatedText);
        console.log('task_breakdown cleanedText', cleanedText);
        const toJSON = JSON.parse(cleanedText);  
        console.log('task_breakdown json', toJSON);

        chatHistory.push({ role: "user", parts: [{ text: promptText }] });
        chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
        setError(); // Clear error after success

        return toJSON;
    } catch (error) {
        console.error('Attempt', retries + 1, 'failed:', error);
        setError('Attempt ' + (retries + 1) + ' failed: ' + String(error));

        if (retries < maxRetries - 1) {
            await delay(retryDelay);
            return get_task_breakdown(structure, workflow, phase, previous_phases_json, retries + 1);
        } else {
            setIsLoading(false);
            console.error("task_breakdown failed after multiple retries:", error);
            throw error;
        }
    } finally {
        if (retries === maxRetries - 1) {
            setIsLoading(false);
        }
    }
};


 async function generateStreamingText(prompt, retries = 0) {
    const genAI = new GoogleGenerativeAI(localStorage.getItem('geminiApiKey') || process.env.API_KEY ||  'AIzaSyDvMNn215gSXGpjXH8Lb1Y7hScd1NMh32M');
    const model = genAI.getGenerativeModel({ model: process.env.API_VERSION || "gemini-2.0-flash" });
    try {
        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessageStream(prompt);

        let generatedText = '';

        console.log("Starting text streaming...");

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            generatedText += chunkText;
             console.log("Received chunk:", chunkText);
        }

        console.log("Streaming finished.");
        console.log('Final generatedText:', generatedText);

        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        chatHistory.push({ role: "model", parts: [{ text: generatedText }] });

        setError(null);

    } catch (error) {
        setError(`Error generating text (Attempt ${retries + 1}): Waiting for ${retries} minutes`);
        console.error(`Error generating text (Attempt ${retries + 1}): Waiting for ${retries} minutes`, error);

        if (retries < 50) {
            await delay(60000 * retries);
            return generateStreamingText(prompt, retries + 1);
        } else {
            console.error("Maximum retry attempts reached. Failing.");
            throw error;
        }
    }
}



    // Keeping navigation logic
    const goToCodeEditorPage = (key) => {
        window.location.href = "/code_output/?id=" + APP_ID;
    }

    function removeConsecutiveBr(inputText) {
        return inputText.replace(/(\*+\s*[^:]+\:\s*\*+)/g, (match) => {
            const text = match.replace(/\*\*/g, '');
            return `<br/><strong>${text}</strong>`;
        });
    }

    // Keeping generation functions
    const get_structure = async (content,note,software_type) => {

      const use_prompt =  prdMapper[software_type]
        try {
            const result = await generateText(use_prompt(content,note));
            const generatedText = result;
            console.log('prd', generatedText)
            updateState('structure', generatedText);
            return generatedText;
        } catch (error) {
            setIsLoading(false);
            console.error("structure:", error);
            throw error;
        }
    }

    const get_tech_stack = async (structure) => {
        try {
            const result = await generateText(generate_tech_stack(structure));
            const generatedText = result;
            updateState('tech_stack', generatedText);
            return generatedText;
        } catch (error) {
            setIsLoading(false);
            console.error("tech_stack:", error);
            throw error;
        }
    }



    const get_missing = async (structure, tech_stack) => {
        try {
            const result = await generateText(verify_missing(structure, tech_stack,state.software_type));
            const generatedText = result;
            const toJSON = JSON.parse(removeConsecutiveJSONBr(generatedText));
            return toJSON;
        } catch (error) {
            setIsLoading(false);
            console.error("get_missing:", error);
            throw error;
        }
    }
    const get_ui_workflow = async (structure) => {
        try {
            const result = await generateText(generate_ui_workflow(structure));
           return result;
        } catch (error) {
            setIsLoading(false);
            console.error("get_ui_workflow:", error);
            throw error;
        }
    }

    function removeFirstLine(text) {
        const firstNewlineIndex = String(text).indexOf('\n');
        if (firstNewlineIndex === -1) {
            return "";
        } else {
            return "\n" + text.substring(firstNewlineIndex + 1);
        }
    }
 
    const get_code_structure = async (summaries) => {
        try {
            setIsLoading(true);
            const result = await generateText(generate_code_structure(summaries));
            const generatedText = result;
            updateState('code_structure', generatedText);
            return generatedText;
        } catch (error) {
            console.error("code_structure:", error);
            throw error;
        }
    }

    const create_past_tasks_summaries = (summaries) => {
        return summaries.map((e, index) => `TASK ${index + 1} SUMMARY:
                ${e}

            `)
    }

const saveContent = () => {
 
  const id = encodeURIComponent(state.documentFileName || state.content.split("\n")[0].replace(/<\/?[^>]+(>|$)/g, "").slice(0, 40));
    const history = JSON.parse(localStorage.getItem('history')) || {};
  history[id] = {APP_ID,id};
  localStorage.setItem('history', JSON.stringify(history));
saveUpdatedContent( {...state,tasks,date:new Date(),id,chatHistory} ) 
};

const deleteContent = (id) => {
    const history = JSON.parse(localStorage.getItem('history')) || {};
    if (history[id]) {
        delete history[id];
        localStorage.setItem('history', JSON.stringify(history));
    }
};

    // Keeping goforward logic
    const goforward = async (tech_options = "") => {
let db = await initDB();

        setTechnicalSelection(false); // Clear technical selection
            setLoadingCount(0)
        if (!state.documentFileName) {
            toast.error("Provide idea or file to continue");
        } else if ( !state.software_type) {
            // toast.error("Select app type to continue");
            setIsAppType(true)
        } else {


            saveContent(); // Save initial state before processing

            setIsLoading(true);
            setLoadingLabel(tech_options ? 'Re-Building...':'Building process...');
            setLoadingCount(1);
            await delay(2000);

            setLoadingLabel(tech_options ? 'Updating Requirements...' : 'Extracting Requirements...');
            setLoadingCount(2);
            const tech_stack =""

            setLoadingLabel(tech_options ? "Updating Functionalities...": "Generating blueprint...")
            const verify_functionalities =  tech_options ? "": await get_missing(state.content, tech_stack, ""); 
            console.log(verify_functionalities)
            await delay( tech_options ? 500: 1000);
            setLoadingCount(3);

            let structure = state.content

            if (!tech_options && verify_functionalities.categories.length){
                setTechnicalSelection(verify_functionalities); // Set technical selection options
            } else {

            setLoadingLabel(tech_options ? "Building Product Requirements..." : 'Building Product Requirements...');
            setLoadingCount(4);
            structure = await get_structure(state.content,tech_options,state.software_type);
            await delay(2000);
     
           await  addNoteIdb(db, { 'id': APP_ID,structure} )
            localStorage.setItem(APP_ID + 'PRD', structure); // Save PRD

            setLoadingLabel('Building Worflow...');
            setLoadingCount(5);
            const workflow =  "" //await get_ui_workflow(structure) 
           
            await addNoteIdb(db, { 'id': APP_ID,workflow})
            await addNoteIdb(db, { 'id': APP_ID,software_type:state.software_type})
            delay(2000);

            setLoadingLabel('Building Agent(s) Task ...');
            let task_breakdown = []

            const phases = phasesMapper[state.software_type]

                 for (let i = 0; i < phases.length; i++) {
                    setLoadingLabel(phases[i]);
            setLoadingCount(5+i);
            const chunk =  await get_task_breakdown(structure,  workflow,phases[i],task_breakdown); 
            task_breakdown = [...task_breakdown, ...chunk]


                 }

        console.log('completed task_breakdown', task_breakdown)
     
        await addNoteIdb(db, { 'id': APP_ID,task_breakdown})
 
                setLoadingLabel('Generation completed...');
                goToCodeEditorPage(); // Navigate to the code output page
                // setIsLoading(false);
            // setLoadingCount(0);

            } 
        }
    };




 

    const RenderLoading = ({ label = "" }) => {
        return (
            <div className=" w-full flex-column items-center justify-center mt-3"> {/* Use flex/spacing classes */}
                
              <HorizontalLoader label={label}   currentValue={loading_count} error={error}
          endValue={5+Number(phasesMapper[state.software_type].length)} />
            </div>
        );
    }

    const renderStepOne = () => {

        return (
            <div className="flex-column items-center step-one-container mx-4 mt-8">  
            <div class="mb-2 mt-3 flex flex-col items-center px-4 text-center md:mb-4 md:mt-10"><div class="mb-4 flex w-full flex-col items-center justify-center gap-2">
            </div><h1 class="mb-2 flex items-center gap-1 text-2xl font-bold leading-none sm:text-3xl md:mb-3 md:gap-0 md:text-6xl">
            <span class="pt-0.5 md:pt-0 text-dark font-bolder gradient-text ">What can I help you Build? </span>
            <div class="flex flex-col gap-1.5 ml-2 hidden sm:ml-3 md:ml-4 md:flex">
            </div></h1><p style={{maxWidth:'93%'}} class="mb-12 max-w-[25ch] text-center text-base md:max-w-full md:text-2xl  text-gray-600">
            Your partner for rapid software development, built at Velo speed.</p></div>

            
                <FileUpload updateState={updateState} state={state}  isOpen={isAppTypeOpen} setClose={setIsAppType}  />


 
             {isAppTypeOpen ?  '': <Samples updateState={updateState} />}

                  <CustomSelect
    state={state}
    updateState={updateState}
    originalOptions={originalOptions}
    isOpen={isAppTypeOpen}
    setIsOpen={setIsAppType}
    onClick={goforward}


  />
            </div>
        );
    }


    const filterHistoryByDateRange = () => {
        const history = JSON.parse(localStorage.getItem('history')) || {};
        return Object.entries(history).map(([id, data]) => ({
            id,
            ...data,
            date: new Date(data.date),
            old: data.date
        }));
    }

    const handleSelectChange = (selectedId) => {
        if (selectedId) {
            history.push('/code_output/?id=' + selectedId);
        } else {
            // alert("No content found for the selected ID");
        }
    };

    const history_data = filterHistoryByDateRange();
    history_data.reverse();

    const [showAllHistory, setShowAllHistory] = React.useState(false);
    const itemsToShowInitially = 5;
    const [markedItems, setMarkedItems] = React.useState(new Set());



const seenIds = new Set();

let displayedHistory = history_data.filter(item => {
  if (seenIds.has(item.id)) {
    return false; // If the id is already in the set, it's a duplicate, so filter it out
  } else {
    seenIds.add(item.id); // If the id is not in the set, add it and keep the item
    return true; // Keep the item
  }
});

  displayedHistory = showAllHistory
  ? displayedHistory
  : displayedHistory.slice(0, itemsToShowInitially);

    const hasMoreItems = history_data.length > itemsToShowInitially;

    const toggleShowAll = () => {
        setShowAllHistory(!showAllHistory);
    };


    const toggleMarkItem = (itemId) => {
        setMarkedItems(prevMarkedItems => {
            const newMarkedItems = new Set(prevMarkedItems);
            if (newMarkedItems.has(itemId)) {
                newMarkedItems.delete(itemId);
            } else {
                newMarkedItems.add(itemId);
            }
            return newMarkedItems;
        });
    };

    const handleNewProjectClick = () => {
        window.location.href = '/'; // Navigate to home for new project
    };

    const PinIcon = ({ color = 'currentColor', size = 16 }) => (
        <svg viewBox="0 0 24 24" height='16' width='16' fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: color }}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M20 7L4 7" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M15 12L4 12" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M9 17H4" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
            </g>
        </svg>
    );


    return (
        <>
            <Navbar /> 
               <ToastContainer />
            <div className="container-layout">

               
                <div className="sidebar flex-column flex-gap-3">  
                    <button
                        onClick={handleNewProjectClick}
                        className="sidebar-new-project-button button button-primary button-rounded button-icon-left" 
                        style={{fontSize:"14px", height:"35px"}}
                    >
                        <svg width="24px" height="24px" viewBox="0 0 24 24">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M12 6V18" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M6 12H18" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                        </svg>
                        New Project
                    </button>

                    <p className="px-1 pt-1 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Recent
      </p> 

                    <div className="history-list"> 
                        {displayedHistory.map((e, index) => (
                            <div
                                key={index} style={{height:'33px'}}
                                className={` py-1 history-item ${markedItems.has(e.APP_ID) ? 'marked' : index === 0 ? 'marked': ''}`}
                                onClick={() => handleSelectChange(e.APP_ID)} // Use onClick
                            >
                                <div className="history-item-content">
                                    <PinIcon color={markedItems.has(e.APP_ID) ? '#b45309' :  index === 0 ? '#b45309':  '#888'} /> {/* Use hex colors or CSS vars */}
                                    <span className="history-title"> {/* Use span with title class */}
                                        {decodeURIComponent(e.id)}
                                    </span>
                                </div>
                                {/* Optional: Add menu/delete button here if needed, styled with CSS */}
                            </div>
                        ))}
                        

                    {hasMoreItems && (<div className='flex justify-center align-center w-full'>
        <button style={{width:'90%'}}
          className="mt-3  flex items-center justify-center px-3 py-1.5 text-xs font-medium
           text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md 
           transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
          onClick={toggleShowAll}
        >
          {showAllHistory ? (
            <>
              <ChevronUp size={14} className="mr-1" aria-hidden="true" /> Less
            </>
          ) : (
            <>
              <ChevronDown size={14} className="mr-1" aria-hidden="true" /> More
            </>
          )}
        </button></div>
      )}





                    </div>

                </div>

             
                <div className="main-content flex-column flex-gap-3"> {/* Use main-content, flex, and gap classes */}
                  
               


                    <div>
                       
                        <div className='mt-10' >
                           <>
                                    {technicalSelection   ?
                                        <TechSelection
                                            requirements={technicalSelection}
                                            onSuccess={data => goforward(data) }
                                            isOpen={technicalSelection && technicalSelection.length}
                                            onClose={() => setTechnicalSelection([])}
                                        />
                                        :loading_label &&
                                        <div className="flex-column flex-gap-8 items-center">  
                                            <RenderLoading label={loading_label} />
                                         
                                        </div>
                                    }
                                </>
                            
                        </div>

                        <div className="flex-column items-center" style={{ display: !showContent && !isLoading && step === 1 ? 'flex' : 'none', width: '100%', }}>
                            {renderStepOne()}
                        </div>

                     
                    </div>

                    {!isLoading && (
                        <div className="center-right gap-4 flex  " style={{justifyContent:'center', width:'93%'}} > {/* Use center-content class */}
                            {!showContent && step === 1 && <>
                                 
                                <button
                                    onClick={() => goforward()} // Use onClick
                                    className="button button-primary button-rounded mt-3 px-8" // Use button classes, add margin
                                > Start Blueprint
                                    <svg className='ml-2' width="20px" height="20px"  fill="#ffffff"  version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_8_" d="M120.4,22.9c0-9.3,7.5-16.8,16.8-16.8S154,13.6,154,22.9c0,9.3-7.5,16.8-16.8,16.8S120.4,32.2,120.4,22.9z M46,170.6c0,0,39.8-17.4,40-17.5c1.4-0.7,1.7-1.4,1.9-2.9c0-0.1,5.1-27.1,5.1-27.1l20.9,25.3l-6.4,43.1 c-0.4,14.4,17.9,13.7,19.7,0.1l6.3-42c0.3-4.8-1.3-8.8-2.8-11.4l-22.1-30L120,84.3l-0.2,12.9c0,4.3,3.5,7.9,7.8,7.9 c0,0,31.5,0,31.8,0c0.7,0,1.4-0.3,2.1-0.6c3.1-1.2,5.3-4.2,5.3-7.7c0-4.6-3.7-8.2-8.2-8.2c0,0-23.5-0.4-23.5-0.4V55.6 c0-2.8-0.8-6.7-3.4-9.8c-2.2-3.6-7.1-7.1-11.3-7.6c-7.3-0.9-13.6,2.6-17.4,8.3c0,0-22.5,41.1-23.4,43.5c-0.4,0.7-9.5,49-9.5,49 l-33.6,13.7C26.4,157.1,30.2,175.3,46,170.6z M246.2,218.1c-2.7,3.3-6.4,5.3-10.5,5.7l-2.6,0.3V256h-35v-28.6L53,241.2V256H19v-11.5 c-1,0-0.5,0-0.6,0c-3.6,0-7.3-1.3-10.2-3.6c-3.3-2.7-5.3-6.5-5.7-10.6c-0.4-4.2,0.9-8.3,3.5-11.5c2.7-3.3,6.5-5.3,10.6-5.7 l194.8-18.6l-34.9-84.8L170,116l-6.5-6.7l51.3-49.6l6.5,6.7l-32.9,31.8l39,94.7l5-0.5c4.2-0.4,8.3,0.9,11.5,3.5 c3.3,2.7,5.3,6.5,5.7,10.6C250,210.8,248.9,214.9,246.2,218.1z M240.7,207.5c-0.2-1.8-1-3.4-2.4-4.6c-1.2-1-2.7-1.6-4.3-1.6 c-0.2,0-0.4,0-0.6,0L17.6,222c-1.8,0.2-3.4,1-4.6,2.4c-1.2,1.4-1.7,3.1-1.5,4.9c0.2,1.8,1,3.4,2.4,4.6s3.1,1.7,4.9,1.5l215.8-20.6 c1.8-0.2,3.4-1,4.6-2.4S240.8,209.3,240.7,207.5z"></path> </g></svg>
                                </button>  

                                </>
                            }
                        </div>
                    )}
                <Footer />
                </div>
            </div>
           
        </>
    );
}
