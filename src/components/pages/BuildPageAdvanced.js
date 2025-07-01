import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import step_process, { generate_summary, generate_answers, generate_structure, generate_tech_stack,
    generate_task_breakdown, generate_task, generate_code_structure, generate_config_file, generate_ui_workflow,
    generate_quality_assurance, generate_code_correction,verify_missing
} from '../../assets/steps_process';
import '../../App.css'; // Keeping the CSS import
import './Build.css'; // Keeping the CSS import
import Select from "react-select"; // Keeping external libs
import Steps from 'react-steps'; // Keeping external libs
import FileUpload from '../file_upload'; // Keeping child components
import Samples from '../Samples';
import HorizontalLoader from '../HorizontalLoaderMain';
import CodeEditor from '../CodeEditor';
import TechSelection from '../TechSelection';
import { openDB } from 'idb'; // Keeping storage logic
// import {Banner300by250,Banner728by90} from "../Banner"; // Keeping if needed
import { v4 as uuidv4 } from 'uuid'; // Keeping utility
import Logo from '../../assets/images/logo-white.png'; // Keeping asset
import { useAuth } from '../../context/AuthContext';

// Keeping AI related imports and setup
const { GoogleGenerativeAI } = require("@google/generative-ai");

let chatHistory = []; // Keeping chat history

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

    const { user, logout} = useAuth()
    const history = useHistory()

        const handleLogout = () => {
        logout()
        history.push('/')
      }


    return (
        <nav className="navbar"> {/* Use navbar class */}
            <div className="container" style={{width:'100% !important'}} > {/* Use container for centering/max-width */}
                <div className="navbar-brand" onClick={() => window.location.href = "/"}> {/* Use brand classes */}
                    <img src={Logo} alt="VB2 Logo" className="navbar-brand-logo" /> {/* Use logo class */}
                    <div className="navbar-brand-text">VB2</div> {/* Use brand text class */}
                </div>
                {/* Removed hidden md:flex space-x-6 links as they were empty */}
                <div className="navbar-actions"> {/* Use actions container class */}
               {user ?    <button style={{'zIndex':50}} className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700" onClick={handleLogout}>Logout</button>:<></>}
                </div>
            </div>
        </nav>
    );
}

export default function SignInPage() {

    const [show, setShow] = React.useState(false);
    const [askLoading, setAskLoading] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [currentStage, setCurrentStage] = React.useState();
    const [done, setDone] = React.useState(false);
    const [state, setState] = React.useState({
        'features': {
            'value': "Codes"
        }
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
    const [technicalSelection, setTechnicalSelection] = React.useState();

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
    const genAI = new GoogleGenerativeAI(process.env.API_KEY || 'AIzaSyDvMNn215gSXGpjXH8Lb1Y7hScd1NMh32M');
    const model = genAI.getGenerativeModel({ model: process.env.API_VERSION || "gemini-2.0-flash" });
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
        return text
            .replace('json', '')
            .replace(/`/g, '')
            .trim();
    };

    // Keeping generateText with retry logic
    async function generateText(prompt, retries = 0) {
        try {
            const chat = model.startChat({
                history: chatHistory,
            });

            const result = await chat.sendMessage(prompt);
            const response = result.response;
            const generatedText = response.text();

            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
console.log('generatedText',generatedText)
setError()
            return generatedText;
        } catch (error) {
            setError(`Error generating text (Attempt ${retries + 1}): Waiting for ${retries} minutes`)
            console.error(`Error generating text (Attempt ${retries + 1}): Waiting for ${retries}  minutes`, error);

            if (retries < 50) {
                await delay(60000*retries);
                return generateText(prompt, retries + 1);
            } else {
                console.error("Maximum retry attempts reached. Failing.");
                throw error;
            }
        }
    }

 

 async function generateStreamingText(prompt, retries = 0) {
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
    const get_structure = async (content,note) => {
        try {
            const result = await generateText(generate_structure(content,note));
            const generatedText = result;
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


    const get_task_breakdown = async (structure, workflow,phase="",previous_phases_json ) => {
        const maxRetries = 5;
        const retryDelay = 2000;
console.log('phase',phase)
        for (let i = 0; i < maxRetries; i++) {
            try {
                const result = await generateText(generate_task_breakdown(structure, workflow,phase,previous_phases_json));
                const generatedText = result;
                const cleanedText = removeConsecutiveJSONBr(generatedText);
                const toJSON = JSON.parse(cleanedText);
                console.log('task_breakdown json',toJSON)
                return toJSON;
            } catch (error) {
                console.error('Attempt', i + 1, 'failed:', error);
                if (i === maxRetries - 1) {
                    setIsLoading(false);
                    console.error("task_breakdown failed after multiple retries:", error);
                    throw error;
                }
                await delay(retryDelay);
            }
        }
        setIsLoading(false);
        throw new Error("get_task_breakdown failed after multiple retries.");
    };

    const get_missing = async (structure, tech_stack) => {
        try {
            const result = await generateText(verify_missing(structure, tech_stack));
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

        setTechnicalSelection(); // Clear technical selection
            setLoadingCount(0)
        if (!state.documentFileName) {
            alert("Provide content or file to continue");
        } else {
            saveContent(); // Save initial state before processing

            setIsLoading(true);
            setLoadingLabel(tech_options ? 'Re-Building...':'Building process...');
            setLoadingCount(1);
            await delay(2000);

            setLoadingLabel(tech_options ? 'Updating Technical Requirements...' : 'Extracting Technical Requirements...');
            setLoadingCount(2);
            const tech_stack =""

            setLoadingLabel(tech_options ? "Updating Functionalities...": "Verifying Mising Functionalities/Requirements...")
            // const verify_functionalities =  tech_options ? "": await get_missing(state.content, tech_stack, ""); 
            // await delay( tech_options ? 500: 1000);
            setLoadingCount(3);

            let structure = state.content

            if (!tech_options){
                setTechnicalSelection(true); // Set technical selection options
            } else {

            setLoadingLabel(tech_options ? "Restructuring Product Requirements..." : 'Identifying Product Requirements...');
            setLoadingCount(4);
                if (state.documentFileName === 'Manual Content Provided'){
            structure = await get_structure(state.content,tech_options);
            await delay(2000);
        } else {
structure = state.content += "\n\n"+tech_options
        }
     
           await  addNoteIdb(db, { 'id': APP_ID,structure} )
            localStorage.setItem(APP_ID + 'PRD', structure); // Save PRD

            setLoadingLabel('Creating UI/UX Worflow...');
            setLoadingCount(5);
            const workflow = await get_ui_workflow(structure) 
           
            await addNoteIdb(db, { 'id': APP_ID,workflow})
            delay(5000);

            setLoadingLabel('Building Agent(s) Task ...');
            let task_breakdown = []
            const phases = ['Phase 1: Core Setup & Architecture','Phase 2: Core Logic & Module Implementation',
               'Phase 3: User Interface / Interaction Layer',
                 'Phase 4: System Integration & Orchestration','Phase 5: Security & Cross-Cutting Concerns',
                'Phase 6: Documentation, Testing & Distribution']
                 for (let i = 0; i < 6; i++) {
                    setLoadingLabel(phases[i]);
            setLoadingCount(6+i);
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


    // Refactored Render functions using plain HTML and CSS classes

    const renderHome = () => {
        return (
            <div className="center-content" style={{ minHeight: '90vh' }}> {/* Use center-content class */}
                <button className="button button-secondary button-rounded" onClick={e => setStep(step - 1)} style={{ width: 200 }}> {/* Use button classes */}
                    <span>Home</span>
                </button>
            </div>
        );
    }

 

    const RenderLoading = ({ label = "" }) => {
        return (
            <div className=" w-full flex-column items-center justify-center mt-3"> {/* Use flex/spacing classes */}
                
              <HorizontalLoader label={label}   currentValue={loading_count} error={error}
          endValue={12} />
            </div>
        );
    }

    const renderStepOne = () => {

        return (
            <div className="flex-column items-center step-one-container mx-4"> {/* Use flex/spacing classes */}
                <FileUpload updateState={updateState} state={state} />
                <Samples updateState={updateState} />
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
            {/* Use container-layout for the main flex structure */}
            <div className="container-layout">

               
                <div className="sidebar flex-column flex-gap-3"> {/* Use sidebar, flex, and gap classes */}
                    <button
                        onClick={handleNewProjectClick}
                        className="sidebar-new-project-button button button-primary button-rounded button-icon-left" // Use button classes
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

                    <p className="sidebar-heading">Recent</p> {/* Use heading class */}

                    <div className="history-list"> 
                        {displayedHistory.map((e, index) => (
                             // Use history-item class, conditionally add 'marked' class
                            <div
                                key={index}
                                className={`history-item ${markedItems.has(e.APP_ID) ? 'marked' : ''}`}
                                onClick={() => handleSelectChange(e.APP_ID)} // Use onClick
                            >
                                <div className="history-item-content">
                                    <PinIcon color={markedItems.has(e.APP_ID) ? '#b45309' : '#888'} /> {/* Use hex colors or CSS vars */}
                                    <span className="history-title"> {/* Use span with title class */}
                                        {decodeURIComponent(e.id)}
                                    </span>
                                </div>
                                {/* Optional: Add menu/delete button here if needed, styled with CSS */}
                            </div>
                        ))}
                        {/* More/Less Button */}
                        {hasMoreItems && (
                            <button className="more-less-button" onClick={toggleShowAll}> {/* Use button with class */}
                                {showAllHistory ? 'Less' : 'More'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="main-content flex-column flex-gap-3"> {/* Use main-content, flex, and gap classes */}
                    {/* Steps component - wrap in a div if it needs spacing/context */}
                    <div className="steps-container">
                       <Steps items={step_json} type={'point'} flat={true} />
                    </div>


                    <div>
                       
                        <div >
                            {state.task_breakdown ?

                                <div className="flex-column processing-container"> {/* Use flex/spacing classes */}

                                    <div className="divider"></div> {/* Use a div with divider class */}
                                    <div className="flex-row items-center justify-center processing-header flex-gap-1"> {/* Use flex/spacing/gap classes */}
                                         {/* Replace ThreeDotsIcon with SVG or CSS icon */}
                                         {/* Basic SVG for three dots */}
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="8" cy="8" r="1.5"/>
                                            <circle cx="3" cy="8" r="1.5"/>
                                            <circle cx="13" cy="8" r="1.5"/>
                                        </svg>
                                        <p className="processing-header-text"> {/* Use p with text class */}
                                            Processing Task ({Object.keys(Object.assign(tasks_state, {})).length} - {Object.assign(state.task_breakdown, []).length} Running Tasks) {error && <span style={{color:'red'}} > ({error}.)</span>}
                                        </p>
                                    </div>

                                    <HorizontalLoader end={Object.assign(state.task_breakdown, []).length} current={current_task} />

                                    {/* ScrollView replaced by div with overflow-y */}
                                    <div className="task-list-container"> {/* Use task list container class */}
                                        {Object.assign(state.task_breakdown, []).map((task, index) => (
                                           
                                            <div key={index} className="task-item flex-column flex-gap-4">  
                                                <div className="flex-row items-center justify-between flex-gap-4" style={{ width: '100%' }}>  

                                                    <div className="task-details flex-column flex-gap-1">  
                                                        <p className="task-title">Step {index + 1}: {task.task_title}</p>  
                                                        <p className="task-objective">{task.objective}</p>  
                                                    </div>

                                                    
  {tasks_state[task.task_title] && Object.assign(tasks_state[task.task_title],{}).status === 'loading' ?    <svg    
style={{    display: "block", shapeRendering: "auto",}} width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<g transform="translate(50 42)">
  <g transform="scale(0.8)">
    <g transform="translate(-50 -50)">
      <polygon fill="#e15b64" points="72.5 50 50 11 27.5 50 50 50">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 38.5;360 50 38.5" keyTimes="0;1"></animateTransform>
      </polygon>
      <polygon fill="#f8b26a" points="5 89 50 89 27.5 50">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 27.5 77.5;360 27.5 77.5" keyTimes="0;1"></animateTransform>
      </polygon>
      <polygon fill="#abbd81" points="72.5 50 50 89 95 89">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 72.5 77.5;360 72 77.5" keyTimes="0;1"></animateTransform>
      </polygon>
    </g>
  </g>
</g>
 </svg>   : <></>}

            {tasks_state[task.task_title] && Object.assign(tasks_state[task.task_title],{}).status === 'done' ? 
            <svg style={{coloe:"green"}} width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.594 1.593 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
</svg>  : <></>}

  {!tasks_state[task.task_title]  ?  <svg  style={{color:"silver"}} width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l1.594 1.593 3.473-4.425z"/>
</svg> : <></>}
                                               
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                : <>
                                    {technicalSelection  ?
                                        <TechSelection
                                            requirements={technicalSelection}
                                            onSuccess={goforward}
                                            isOpen={technicalSelection}
                                            onClose={() => setTechnicalSelection(false)}
                                            structure={state.content}
                                        />
                                        :loading_label &&
                                        <div className="flex-column flex-gap-8 items-center">  
                                            <RenderLoading label={loading_label} />
                                         
                                        </div>
                                    }
                                </>
                            }
                        </div>

                        <div className="flex-column items-center" style={{ display: !showContent && !isLoading && step === 1 ? 'flex' : 'none', width: '100%', }}>
                            {renderStepOne()}
                        </div>

                        <div style={{ display: !showContent && !isLoading && step === 0 ? 'block' : 'none' }}>
                             {renderHome()}
                        </div>
                    </div>

                    {!isLoading && (
                        <div className="center-content"> {/* Use center-content class */}
                            {!showContent && step === 1 &&
                                <button
                                    onClick={() => goforward()} // Use onClick
                                    className="button button-primary button-rounded mt-3 px-8" // Use button classes, add margin
                                >
                                    <svg width="26px" height="26px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                         <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                         <g id="SVGRepo_iconCarrier">
                                              <path d="M9 5.30423C6.33576 6.60253 4.5 9.33688 4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5V14.5" stroke="#ffffff" strokeWidth="1.2"></path>
                                              <path d="M16 11L12.5 14.5L9 11" stroke="#ffffff" strokeWidth="1.2"></path>
                                         </g>
                                    </svg>
                                    Generate
                                </button>
                            }
                        </div>
                    )}
                </div>
            </div>
           
        </>
    );
}