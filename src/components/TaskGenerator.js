import React, { useState, useEffect, useRef, useMemo } from 'react';
import AceEditor from 'react-ace';
import { generate_copilot_response} from '../assets/steps_process'
import {  generate_web_coder,generate_mobile_coder,generate_web_app_coder,generate_cli_coder,generate_ext_coder, 
generate_api_coder} from '../assets/coder_prompt'
import HorizontalLoader from './HorizontalLoader';
import './TaskGenerator.css'
import { openDB } from 'idb'; // Keeping storage logic
import { v4 as uuidv4 } from 'uuid'; // Keeping utility 
import { ChevronRight, Info,RefreshCcw   } from 'lucide-react';
import JsonModal from './JsonModal'
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.API_KEY );
const model = genAI.getGenerativeModel({ model: process.env.API_VERSION || "gemini-2.0-flash"});
let chatHistory = [];


const coderMapper = {
  "Web Application":generate_web_app_coder,
  "Mobile Application":generate_mobile_coder,
  "Command-Line Interface (CLI) Tool":generate_cli_coder,
  "Desktop GUI Application":generate_web_coder,
  "Browser Extension":generate_web_coder,
  "Backend API/Service":generate_web_coder,
  "Data Processing Script/Pipeline":generate_web_coder,
  "Embedded System Logic":generate_web_coder,
  "Blockchain Application/Smart Contract":generate_web_coder,
  "AI/ML Application":generate_web_coder,
  "Library/SDK (Software Development Kit)":generate_web_coder,
  "Games":generate_web_coder,
  "IoT Application":generate_web_coder,
  "Cloud Function/Serverless Application":generate_web_coder,
  "Software Development (Others)":generate_web_coder,
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
    if (types === 'codes'){
const update_codes = {...note}
delete update_codes['status']
delete update_codes['structure']
delete update_codes['task_breakdown']
delete update_codes['tasks_state']
delete update_codes['software_type']
delete update_codes['workflow']
return update_codes
    } else {
    return note[types];

    }
}



 


function TaskGenerator({ APP_ID,codes,setCodes=f=>f,handleAddFileToOpen=f=>f }) {

  const [task_breakdown, setTaskBreakdown] = useState([]);
    const [tasks_state, setTasksState] = React.useState({});
    const [current_task, set_current_task] = React.useState(0);
 const [isLoading, setIsLoading] = React.useState(false);
    const [loading_label, setLoadingLabel] = React.useState();
    const [tasks, setTasks] = React.useState([]);
    const [error, setError] = React.useState();
    const [jsonData, setJsonData] = React.useState([]);

 const [isOpen, setClose] = React.useState(false);
 const [task_title, setTaskTitle] = React.useState('');


function removeFirstCommentLine(inputString) {
    const singleLineCommentTags = [
        "//",   // JavaScript, C++, C#, Java, Go, Rust, Dart, Kotlin, Swift
        "#",    // Python, Ruby, Perl, Bash, YAML
        "--",   // SQL, Ada, Haskell, Lua (for single line comments)
        "<!--", // HTML, XML (start of comment block)
        "%",    // LaTeX, Prolog
        "rem",  // Batch files, some BASIC dialects
    ];

    const lines = inputString.split('\n');
    const filteredLines = []; // Array to store lines that are NOT comments

    for (let i = 0; i < lines.length; i++) {
        const originalLine = lines[i];
        const trimmedLine = originalLine.trim(); // Get the current line and trim whitespace

        if (trimmedLine.length === 0) {
            filteredLines.push(originalLine);
            continue;
        }

        let isCommentLine = false;

        for (const tag of singleLineCommentTags) {
            if (trimmedLine.startsWith(tag)) {
                isCommentLine = true;
                break; // Found a matching tag, no need to check other tags for this line
            }
        }

        if (!isCommentLine) {
            filteredLines.push(originalLine);
        }
    }

    return removeFirstLine(filteredLines.join('\n'))
}





function removeFirstLine(inputString) {
    const singleLineCommentTags = [
        "javascript",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "c#",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "c++",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "java",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "go",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "rust",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "dart",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "json",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "text",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "yaml",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "html",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "python",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "typescript",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "perl",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "markdown",   // JavaScript, C++, C#, Java, Go, Rust, etc.
    
    ];

    const lines = inputString.split('\n');
    let startIndex = 0; // Initialize the starting index for the output
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim(); // Get the current line and trim whitespace
        let foundTag = false;

        for (const tag of singleLineCommentTags) {
            if (line.startsWith(tag)) {
                foundTag = true;
                break; // Found a matching tag, no need to check other tags for this line
            }
        }

        if (foundTag) {
            startIndex = i + 1; // Change made here: increment by 1 to exclude the comment line
            break; // Found the first comment line, stop searching
        }
    }

    return lines.slice(startIndex).join('\n');
}



const getTaskState = ()=>{
 

}

const updateTaskState = async (task_state)=>{
   

}

  
  function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const duplicate = seen.has(item.task_id);
    seen.add(item.task_id);
    return !duplicate;
  });
}


  const fetchData = async (rerun) => {
            let db =   await initDB( );
            const data = removeDuplicates(await getNoteIdb(db, APP_ID,'task_breakdown')||[])
            setTaskBreakdown(data||[] ); 

                setTasksState({}); // Reset task state

                const app_status =   await getNoteIdb(db, APP_ID,'status');
                console.log('app_status',app_status)

                if (app_status === 'complete' && !rerun){
                console.log('app_statusc',await getNoteIdb(db, APP_ID))


                setCodes( await getNoteIdb(db, APP_ID) || {});
   for (let index = 0; index < data.length; index++) {
                    const task = data[index];
                    await setTasksState(prevState => ({...prevState,[task.task_id]: {status: 'done'}}));

                    set_current_task(index);
                }


                } else {

                   
                    for (let index = 0; index < data.length; index++) {
                    const task = data[index];
                    
                    await setTasksState(prevState => ({...prevState,[task.task_id]: {status: 'loading'}}));

                    console.log(`Running Task Agent: ${index + 1} of ${data.length} - ${task.task_id}`);
             
                    const structure = await getNoteIdb(db, APP_ID,'structure')
                    const software_type = await getNoteIdb(db, APP_ID,'software_type')

                    try {
                         await get_task( structure, task, data,  String(task.suggested_file_path||task.file_path ||task.modified_file_path).split(",")[0],software_type,rerun );
                         await setTasksState(prevState => ({...prevState,[task.task_id]: {status: 'done'}}));
                    } catch (taskError) {
                        console.error(`Error processing task ${task.task_id}:`, taskError); 
                      
                    await setTasksState(prevState => ({ ...prevState,[task.task_id]: {status: 'error'}}));
                    }
                    set_current_task(index);

                    await delay(5000);  


                }


        await  addNoteIdb(db, { 'id': APP_ID, status:"complete"} )

                }


               



        }



    // Effect hook to fetch data
React.useEffect(() => {
        
        fetchData();
    }, [APP_ID]);  





 const get_task = async (structure, task, task_breakdown,file_path,software_type,rerun) => {
        const db = await initDB();
        try {
            const generate_coder =  coderMapper[software_type]
            const existingData = await getNoteIdb(db, APP_ID) || {};
            const task_prompt = generate_coder(structure,  task, task_breakdown, rerun ? "":codes[String(file_path).split(",")[0]],software_type, existingData )+   `\n (  Timestamp: ${Date.now()}).\n MANDATORY: GENERATE CODE FOR ${file_path}.`
            const result = await generateText(task_prompt);
            const generatedText = result;
            console.log('coder',generatedText)
            
           if ( !generatedText.includes('QA CHECK FAILED')  ){

             await  setTasks(prevTasks => [...prevTasks, String(generatedText)]);

            setCodes(prevState => ({
                ...prevState,
                [file_path]: removeFirstCommentLine(generatedText.replaceAll("```", ""))
            }));

            const updatedData = {
                ...existingData,
                [String(task.suggested_file_path||task.file_path||task.modified_file_path).split(",")[0]]: removeFirstCommentLine(generatedText.replaceAll("```", ""))
            }
                updatedData['id'] = APP_ID

            await addNoteIdb(db, updatedData);

           } else {
console.log(`Error: generate code does not match file_path: ${file_path}`, generatedText)
await delay(1000)
            return get_task(structure, task, task_breakdown,file_path,software_type,rerun,existingData)

           }

         

        } catch (error) {
            setIsLoading(false);
           alert("task:"+ error);
            throw error;
        }
    }



  

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const removeConsecutiveJSONBr = (text) => {
    return text
        .replace('json', '')
        .replace('```', '')
        .trim();
};


  async function generateText(prompt, retries = 0) {
        try {
            const chat = model.startChat({
                history: chatHistory,
            });

// console.log('generatedText prompt',prompt)
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            const generatedText = response.text();

            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
// console.log('generatedText',generatedText)
setError()
            return generatedText;
        } catch (error) {
            setError(`Error generating text (Attempt ${retries + 1}): Waiting for 1 minute`)
            console.error(`Error generating text (Attempt ${retries + 1}): Waiting for 1  minutes`, error);

            if (retries < 50) {
                await delay(60000);
                return generateText(prompt, retries + 1);
            } else {
                console.error("Maximum retry attempts reached. Failing.");
                throw error;
            }
        }
    }



  const totalTasks = task_breakdown ? task_breakdown.length : 0;
  const completedTasks = tasks_state ? Object.keys(tasks_state).length : 0;
  const currentTaskDetails = task_breakdown && current_task != null && current_task < totalTasks
                             ? task_breakdown[current_task] : null;

const SimpleSpinner = () => (
  <div className="simple-spinner"></div>
);
 


  return (  

  <>

  <JsonModal isOpen={isOpen} onClose={()=>setClose(false)} jsonData={jsonData} title={task_title}  />
   <div className="flex flex-col h-full px-2 py-1  text-gray-100 rounded-lg shadow-xl processing-container" >

      {(totalTasks > 0) ? (
        <>
          <div className="flex flex-col items-center justify-center  mb-2 header-sec">
            <p className="text-lg font-bold text-gray-200 text-center processing-header mt-3">
                Track Features
            </p>
            <p className="text-sm font-medium text-gray-400 text-center flex">
                 <span className='mr-3'> ({completedTasks} of {totalTasks} completed) </span>{completedTasks >= (totalTasks-1) ? 

               <button>
                                  <RefreshCcw  size={22} color="#ffffff" onClick={ async ()=>{
                                  fetchData(true)
                                  }} />
                                  </button>:<SimpleSpinner />

                              }
            </p>
             {currentTaskDetails && (
                  <div className="flex flex-col items-center gap-1 text-center mt-1">
                      <p className="text-xs font-semibold text-blue-400 processing-current-task-label">Current Task:
                       <span className="text-sm font-medium text-gray-300 processing-current-task-id break-words px-2">
                           {currentTaskDetails.task_id}
                       </span></p>
                  </div>
              )}
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-800 text-red-200 border border-red-700 rounded-md text-xs flex items-center justify-center text-center">
                <span>Error: {error}.</span>
            </div>
          )}

          <HorizontalLoader current={current_task || 0} end={totalTasks > 0 ? totalTasks - 1 : 0} />

          <div className="flex-grow my-6  overflow-y-auto  custom-scrollbar w-full"  >
              <div className="flex flex-col gap-2 w-full    " style={{height:'60vh',width:'98%' }}>
                  {(task_breakdown || []).map((task, index) => {
                      const taskState = tasks_state?.[task.task_id];
                      const status = taskState?.status;
                      const isCurrent = index === current_task;

                      return (
                          <div
                              key={task.task_id || index}
                              className={`flex items-start justify-between w-full py-3 px-2 border border-gray-700 rounded-md ${isCurrent ? 'bg-gray-800 border-blue-500' : 'bg-gray-800'} ${status === 'done' ? 'border-green-600' : ''} ${status === 'error' ? 'border-red-600' : ''}`}
                          >
                              <div className="flex flex-col gap-0 flex-grow mr-3" style={{    width: '87%'}}>
                                  <p className={`text-xs font-medium ${isCurrent ? 'text-blue-400' : 'text-gray-200'} break-words`}>
                                      Task {index + 1}: {task.task_id}
                                  </p>
                                  <p className="text-xs text-gray-400 description break-words mt-1">
                                      {task.objective||task.description||task.modification_details}
                                  </p>
                                  <div className='flex' >
                                   <p style={{width:'90%'}} className=" flex text-xs text-gray-200 description break-words mt-1 cursor-pointer truncate " 

                                   onClick={()=>{
                                    const fp = task.suggested_file_path||task.file_path||task.modified_file_path
                                    if (codes[fp]) handleAddFileToOpen(fp,codes[fp]);
                                   }} >
                                   
          <ChevronRight size={24} />  
        {task.suggested_file_path||task.file_path||task.modified_file_path}
                                  </p>
   

                                  </div>
                              </div>
<div className='flex' style={{'flexDirection':'column', justifyContent:'space-between',height:'100%'}} >
                              <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-white ${status === 'loading' ? 'bg-blue-600' : ''} ${status === 'done' ? 'bg-green-600' : ''} ${status === 'error' ? 'bg-red-600' : ''} ${!status && isCurrent ? 'bg-blue-600' : ''} ${!status && !isCurrent ? 'bg-gray-700' : ''}`}>
                                  {status === 'loading' ? (
                                      <SimpleSpinner />
                                  ) : status === 'done' ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  ) : status === 'error' ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  ) : (
                                      isCurrent ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                                      ) : (
                                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"></circle></svg>
                                      )
                                  )}
                              </div>
                              <button>
                                  <Info size={24} color="#ffffff" onClick={ async ()=>{
                                    await setJsonData(task)
                                    await setClose(true)
                                    await setTaskTitle(task.task_id)
                                  }} />
                                  </button>
                          </div>
                          </div>
                      );
                  })}
              </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-grow items-center justify-center text-gray-400 text-center px-4">
          <p>No tasks available for project.</p>
        </div>
      )}
    </div>


</>
 
  );
}

export default TaskGenerator;
