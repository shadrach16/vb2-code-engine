import React, { useState, useCallback, useRef } from 'react'; // Import useRef
import { useDropzone } from 'react-dropzone';
import { Link, useHistory /*, useParams */ } from 'react-router-dom'; // Removed unused useParams
import Papa from 'papaparse';
import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import { openDB } from 'idb';

// Assuming these are local assets
import SRA from '../../assets/images/Spinner@1x-1.0s-200px-200px.svg';
import Logo from '../../assets/images/logo-white.png';
import { useAuth } from '../../context/AuthContext';
 
const APP_ID = String(uuidv4())



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



function Navbar() {
  const { user, logout} = useAuth()
  const history = useHistory()

  const handleLogout = () => {
    logout()
    history.push('/')
  }

  return (
    <nav className="bg-white w-full z-10" style={{ marginTop: -25, borderBottom: "1px solid silver", height: '50px' }}>
      <div className="container mx-auto px-6 py-2  flex justify-between items-center">
        <div className="flex items-center " style={{ cursor: 'pointer' }} onClick={() => window.location.href = "/"}>
          {/* Using the logo from assets */}
          <img src={Logo} alt="VB2 Logo"   style={{width:'45px',height:'45px'}} />
          <div className="text-2xl font-bold text-gray-800">VB2</div>
        </div>
        <div className="hidden md:flex space-x-6">
          {/* Navigation links can be added here if needed for this page */}
        </div>
        {/* Action Buttons */}
        <div className="flex items-center space-x-6">
         
          {user ?    <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-blue-700" onClick={handleLogout}>Logout</button>:<></>}
        </div>
      </div>
    </nav>
  );
}


const isCode = (filePath) => {
  if (!filePath) return null;

  const extension = filePath.split('.').pop().toLowerCase();

  // A more comprehensive list of common code file extensions
  const codeExtensions = new Set([
    'js', 'jsx', 'mjs', // JavaScript
    'py', // Python
    'html', 'htm', 'xhtml', // HTML
    'css', 'scss', 'less', // CSS and preprocessors
    'java', 'class', 'jar', // Java
    'ts', 'tsx', // TypeScript
    'c', 'cc', 'cpp', 'h', 'hpp', // C/C++
    'cs', // C#
    'go', // Go
    'rs', // Rust
    'rb', // Ruby
    'php', 'phtml', // PHP
    'swift', // Swift
    'kt', 'kts', // Kotlin
    'scala', 'sbt', // Scala
    'pl', 'pm', // Perl
    'sh', 'bash', // Shell scripts
    'r', // R
    'sql', // SQL
    'json', // JSON (often treated as data/config but can be code-like)
    'xml', // XML (often treated as data/config but can be code-like)
    'yaml', 'yml', // YAML (configuration, but code-adjacent)
    'groovy', // Groovy
    'lua', // Lua
    'dart', // Dart
    'vue', // Vue.js single-file components
    'svelte', // Svelte components
    'astro', // Astro components
    'cfc', 'cfm', // ColdFusion
    'clj', 'cljs', 'cljc', 'edn', // Clojure
    'coffee', // CoffeeScript
    'cr', // Crystal
    'd', // D
    'elm', // Elm
    'erl', 'hrl', // Erlang
    'f', 'for', 'f77', 'f90', 'f95', 'f03', 'f08', // Fortran
    'fs', 'fsi', 'fsx', 'ml', 'mli', // F# / OCaml
    'gradle', // Gradle (Groovy/Kotlin)
    'hs', 'lhs', // Haskell
    'jl', // Julia
    'lisp', 'lsp', // Lisp
    'nim', // Nim
    'nix', // Nix
    'pas', 'pp', // Pascal
    'ps1', // PowerShell
    'prolog', 'plg', // Prolog
    'purs', // PureScript
    'scm', 'ss', // Scheme
    'sol', // Solidity
    'v', // Verilog / VHDL / Coq
    'vb', 'vbnet', // Visual Basic .NET
    'zig', // Zig
    'md', 'markdown','txt'
  ]);

  if (codeExtensions.has(extension)) {
    return true;
  } else {
    return null;
  }
};


// Main Import Page Component
const ImportPage = ({ state = {}, updateState = f => f }) => {
  const [documentFileName, setDocumentFileName] = useState(state.documentFileName || ''); // This state seems unused in the current logic
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store file objects { path, content }
  const [codes, setCodes] = useState({}); // State to store file objects { path, content }


  const fileInputRef = useRef(null);

  // Function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // Function to recursively read directory entries and their content
  const readDirectoryEntriesWithContent = async (directoryReader, path = '') => {
    return new Promise((resolve) => {
      directoryReader.readEntries(async (entries) => {
        const files = [];
        for (const entry of entries) {
          if (entry.isFile) {
            try {
              const file = await new Promise((resolveFile, rejectFile) => entry.file(resolveFile, rejectFile));
              const content = await readFileContent(file);
              files.push({ path: `${path}${entry.name}`, content: content });
              // console.log(Content of ${path}${entry.name}:, content); // Print content to console
            } catch (error) {
              console.error(`Error reading file ${path}${entry.name}:`, error);
              files.push({ path: `${path}${entry.name}`, content: `Error reading file: ${error.message}`});
            }
          } else if (entry.isDirectory) {
            const subDirectoryReader = entry.createReader();
            const subFiles = await readDirectoryEntriesWithContent(subDirectoryReader,  `${path}${entry.name}/`);
            files.push(...subFiles);
          }
        }
        resolve(files);
      });
    });
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles, event) => {
    setLoading(true);
    setUploadedFiles([]); // Clear previous files

    const items = event.dataTransfer.items;
    if (items && items.length > 0) {
      const filesWithContent = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const entry = item.webkitGetAsEntry(); // Use webkitGetAsEntry for directory support

        if (entry) {
          if (entry.isFile) {
             try {
                const file = await new Promise((resolveFile, rejectFile) => entry.file(resolveFile, rejectFile));
                const content = await readFileContent(file);
                filesWithContent.push({ path: entry.fullPath, content: content });
                console.log(`Content of ${entry.fullPath}:`, content); // Print content to console

             } catch (error) {
                console.error(`Error reading file ${entry.fullPath}:`, error);
                filesWithContent.push({ path: entry.fullPath, content: `Error reading file: ${error.message}` });
             }
          } else if (entry.isDirectory) {
            // Handle directory drop
            const directoryReader = entry.createReader();
            const filesInDir = await readDirectoryEntriesWithContent(directoryReader, `${entry.name}/`);
            filesWithContent.push(...filesInDir);
          }
        }
      }

      setUploadedFiles(filesWithContent);
         const map_file = {'id':APP_ID}
        filesWithContent.forEach(file=>{
            if ( isCode(file.path)){
map_file[file.path] = file.content
            }

        })

        const db = await initDB();
        await addNoteIdb(db, map_file);


           // localStorage.setItem(APP_ID, JSON.stringify(map_file))
           window.location.href = "/code_output/?id="+APP_ID

    } else {
       console.warn("Directory upload may not be supported via direct file drop in this browser.");
       setLoading(false);
    }

    setLoading(false);
  }, []); // Dependencies array

  // Handle file selection via the input element and read content
  const handleFileSelect = async (event) => {
    setLoading(true);
    setUploadedFiles([]); // Clear previous files

    const files = event.target.files;
    if (files && files.length > 0) {
        const filesWithContent = [];
        // Note: When selecting a directory via input, the File objects have a webkitRelativePath property
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const content = await readFileContent(file);
                // Use webkitRelativePath for the path within the selected directory
                filesWithContent.push({ path: file.webkitRelativePath || file.name, content: content });

                console.log(`Content of ${file.webkitRelativePath || file.name}:`, content); // Print content to console
            } catch (error) {
                 console.error(`Error reading file ${file.webkitRelativePath || file.name}:`, error);
                 filesWithContent.push({ path: file.webkitRelativePath || file.name, content: `Error reading file: ${error.message}` });
            }
        }
        setUploadedFiles(filesWithContent);
    
            const map_file = {'id':APP_ID}
        filesWithContent.forEach(file=>{
    if ( isCode(file.path)){
map_file[file.path] = file.content
            }


        })

        const db = await initDB();
        await addNoteIdb(db, map_file);
        await  addNoteIdb(db, { 'id': APP_ID, status:"complete"} )

           window.location.href = "/code_output/?id="+APP_ID


        event.target.value = null;
    }

    setLoading(false);
  };

  const { user, logout} = useAuth()
  const history = useHistory()

  const handleLogout = () => {
    logout()
    history.push('/')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,  
  });

  // Function to trigger the hidden file input click
  const triggerFileInput = () => {
      fileInputRef.current.click();
  };


  return (
    <>
       

      <div className="flex flex-col items-center justify-center h-full   py-10 my-8"> {/* Centered and styled container */}
      
       <div className="flex items-center mb-7 " style={{ cursor: 'pointer' }} onClick={() => window.location.href = "/"}>
          {/* Using the logo from assets */}
          <img src={Logo} alt="VB2 Logo"   style={{width:'85px',height:'85px'}} />
          <div className="text-4xl font-bold text-gray-800">VB2</div>
        </div>

         <div className="bg-white rounded-lg   p-8 w-full max-w-3xl" style={{border:'1px solid silver'}} > {/* Card-like container */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Import Your Code Directory</h2>
          <p className="text-gray-600 text-center mb-8">
            Easily import your existing codebase into VB2. Drag and drop your project directory below or click to browse.
          </p>

          <div
            {...getRootProps({ // useDropzone root props for drag-and-drop overlay
              className: `border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-200 ${
                isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              } flex flex-col items-center justify-center` // Added flex properties for centering content
            })}
             onClick={triggerFileInput} // Trigger file input on click
             style={{ minHeight: '200px', cursor: 'pointer' }} // Set a minimum height and cursor
          >
             {/* Hidden file input */}
            <input
                {...getInputProps()} // useDropzone input props for drag-and-drop
                ref={fileInputRef} // Attach ref
                directory=""
                webkitdirectory=""
                type="file"
                className="hidden" // Hide the default input
                onChange={handleFileSelect} // Handle file selection via input
            />

            {loading ? (
              <img src={SRA} alt="Loading..." className="loading-spinner mx-auto h-16 w-16" /> // Center and size spinner
            ) : (
              <div className="flex flex-col items-center">
                {/* SVG Icon for Folder/Upload */}
                <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 005-5v-4a5 5 0 00-5-5H7a4 4 0 00-4 4v4zm0 0l.01 0H7m4 0h5m-9 0h2"></path>
                </svg>
                {isDragActive ? (
                  <p className="text-gray-700 text-lg">Drop the directory here ...</p>
                ) : (
                  <p className="text-gray-700 text-lg">Drag and drop your project directory here, or click to browse.</p>
                )}
                 <p className="text-sm text-gray-500 mt-2">Only directories are accepted.</p>  
              </div>
            )}
          </div>

          {/* Display uploaded file paths */}
          {uploadedFiles.length > 0 && (
              <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Files ({uploadedFiles.length}):</h4>
                  <ul className="list-disc list-inside text-gray-600 max-h-60 overflow-y-auto"> {/* Added max height and scroll */}
                      {uploadedFiles.map((file, index) => (
                          <li key={index} className="truncate">{file.path}</li>  
                      ))}
                  </ul>
                 
              </div>
          )}

   

        </div>
      </div>
    </>
  );
};
 

export default ImportPage;