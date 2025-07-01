import React, { useState, useEffect, useRef, useMemo } from 'react';
import AceEditor from 'react-ace';
import step_process,{ generate_copilot_response,generate_quality_assurance,generate_debug_task} from '../assets/steps_process'
import {  generate_web_coder} from '../assets/coder_prompt'

import { NotebookPen, ListTodo, Layout, UserPlus, Calculator, ShieldCheck, FileText, Code, MessageSquare } from 'lucide-react'; // Importing icons from lucide-react
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import './CodeViewer.css';
import { openDB } from 'idb'; // Keeping storage logic
import { v4 as uuidv4 } from 'uuid'; // Keeping utility
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-searchbox';
import TaskGenerator from './TaskGenerator'
import { Share } from 'lucide-react'; // Importing icons from lucide-react
import ComingSoon from './ComingSoon'
import AIReviewResults from './QTestCheck'
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { GoogleGenerativeAI } = require("@google/generative-ai");











const FolderIcon = () => <span>📂</span>;
const FileIcon = () => <span>📄</span>;
const ChatIcon = () => <span>💬</span>; // Icon for Co-pilot


const genAI = new GoogleGenerativeAI(localStorage.getItem('geminiApiKey') || process.env.API_KEY||'AIzaSyBgcWvdOTpCXlxPu11LtOLqjxpDa9Yi6Eo');
const model = genAI.getGenerativeModel({ model: process.env.API_VERSION || "gemini-2.0-flash"});
let chatHistory = [];


const aiTools = [
  { name: 'Code Copilot', icon: MessageSquare }, // Using MessageSquare for Copilot chat
  { name: 'Track Features', icon: ListTodo },
  { name: 'Quality Test Check', icon: ShieldCheck },
  { name: 'Write Test Cases', icon: NotebookPen },
  { name: 'Write Documentation', icon: FileText },
  // Add more tools here as needed
  // { name: 'Another Tool', icon: AnotherIconFromLucide }
];





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






// Helper function to get file name from path
const getFileNameFromPath = (filePath) => filePath.split('/').pop();

// Helper function to guess MIME type based on file extension
const getMimeTypeFromFilePath = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
        // Web Technologies
        case 'js': return 'text/javascript';
        case 'jsx': return 'text/javascript';
        case 'html': return 'text/html';
        case 'htm': return 'text/html';
        case 'css': return 'text/css';
        case 'json': return 'application/json';
        case 'xml': return 'text/xml'; // Added XML
        case 'yaml': return 'text/yaml'; // Added YAML
        case 'yml': return 'text/yaml';
        case 'svg': return 'image/svg+xml'; // Added SVG

        // Backend/Scripting Languages
        case 'py': return 'text/x-python';
        case 'rb': return 'text/x-ruby'; // Added Ruby
        case 'php': return 'application/x-php'; // Added PHP
        case 'go': return 'text/x-go'; // Added Go
        case 'rs': return 'text/x-rust'; // Added Rust

        // Mobile/Application Development Languages
        case 'dart': return 'text/x-dart'; // Added Dart
        case 'swift': return 'text/x-swift'; // Added Swift
        case 'kt': return 'text/x-kotlin'; // Added Kotlin (for Android)
        case 'java': return 'text/x-java-source';
        case 'c': return 'text/x-csrc'; // Added C
        case 'cpp': return 'text/x-c++src'; // Added C++
        case 'h': return 'text/x-c++hdr'; // Added C/C++ Header

        // Markup/Documentation
        case 'md': return 'text/markdown';
        case 'txt': return 'text/plain';
        case 'log': return 'text/plain'; // Added log files

        // TypeScript variations (Ace Editor often uses 'typescript' mode)
        case 'ts': return 'text/typescript';
        case 'tsx': return 'text/typescript';

        // Default to plain text for unknown extensions
        default: return 'text/plain';
    }
};

// --- FileTree Component ---
const FileTree = React.memo(({ treeData, onFileSelect, activeFile }) => {
  const [openFolders, setOpenFolders] = useState({});

  useEffect(() => {
    if (activeFile) {
      const pathParts = activeFile.split('/');
      const foldersToOpen = {};
      for (let i = 0; i < pathParts.length - 1; i++) {
        foldersToOpen[pathParts[i]] = true;
      }
      setOpenFolders(prev => {
          const newOpen = { ...prev, ...foldersToOpen };
          if (JSON.stringify(newOpen) === JSON.stringify(prev)) {
              return prev;
          }
          return newOpen;
      });
    }
  }, [activeFile]);


  const toggleFolder = (folderName) => {
    setOpenFolders(prevState => ({
      ...prevState,
      [folderName]: !prevState[folderName],
    }));
  };

  const renderTree = (items, level = 0) => {
    const indentClass = level > 0 ? `file-tree-indent-level-${level}` : '';

    return items.map((item) => (
      <div key={item.path || item.name} className={`${indentClass}`}>
        {item.type === 'folder' ? (
          <div>
            <div
              className="file-tree-item file-tree-folder-toggle"
              onClick={() => toggleFolder(item.name)}
            >
              <FolderIcon className="file-icon-folder" />
              <strong>{item.name}</strong>
            </div>
            {openFolders[item.name] && item.children && item.children.length > 0 && (
              <div>
                {renderTree(item.children, level + 1)}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`file-tree-item ${activeFile === item.path ? 'file-tree-selected' : ''}`}
            onClick={() => onFileSelect(item.path)}
          >
            <FileIcon className="file-icon-file" />
            {item.name}
          </div>
        )}
      </div>
    ));
  };

  return <div className="file-tree">{renderTree(treeData)}</div>;
});


// --- Helper Function to build the hierarchical file tree data structure ---
const buildFileTree = (fileStructure) => {
    const root = [];
    const nodes = { '': { children: root } };

    for (const filePath in fileStructure) {
        const parts = filePath.split('/');
        let currentPath = '';
        let currentNode = nodes[''];

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const segmentPath = currentPath ? `${currentPath}/${part}` : part;

            if (!currentNode.children) {
                currentNode.children = [];
            }

            let existingNode = currentNode.children.find(node => node.name === part);

            if (!existingNode) {
                existingNode = {
                    name: part,
                    type: isFile ? 'file' : 'folder',
                    path: isFile ? filePath : segmentPath,
                    children: isFile ? undefined : [],
                };
                currentNode.children.push(existingNode);
                currentNode.children.sort((a, b) => {
                    if (a.type === 'folder' && b.type !== 'folder') return -1;
                    if (a.type !== 'folder' && b.type === 'folder') return 1;
                    return a.name.localeCompare(b.name);
                });
            }

            if (!isFile) {
                currentNode = existingNode;
            }
            currentPath = segmentPath;
        });
    }
    return root;
};

// Helper to find the first file in the tree (for potential auto-opening)
const findFirstFile = (items) => {
    for (const item of items) {
        if (item.type === 'file') {
            return item;
        }
        if (item.type === 'folder' && item.children && item.children.length > 0) {
            const firstChildFile = findFirstFile(item.children);
            if (firstChildFile) {
                return firstChildFile;
            }
        }
    }
    return null;
};


function CodeViewer({ fileStructure,APP_ID,PRD }) {
  // Internal state to hold the current, potentially modified, file structure
  const [internalFileStructure, setInternalFileStructure] = useState({});
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileTreeData, setFileTreeData] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isFSApiSupported, setIsFSApiSupported] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setSharing] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const [copilotMessages, setCopilotMessages] = useState([
    {sender:'ai',text:"Hello! How can I help you? Do you have any specific questions about the code, the product requirements, or a task you'd like me to assist with?"}
    ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  const [selectedTool, setSelectedTool] = useState('Track Features');
  const [aiResponse, setAiResponse] = useState('');
    const [codes, setCodes] = React.useState({});
    const [testCase, setTestCase] = React.useState([]);
    const [testLoading, setTestLoading] = React.useState(false);
    const [error, setError] = React.useState("");

  const [isDebugLoading, setDebugLoading] = useState(false);



  // Ref to hold the Ace Editor instance
  const editorRef = useRef(null);
  // Ref to hold the chat messages container for scrolling
  const messagesEndRef = useRef(null);


  // Effect to initialize internalFileStructure when the prop changes
  useEffect(() => {
      if (fileStructure) {
          setInternalFileStructure({ ...fileStructure });
      } else {
          setInternalFileStructure({});
      }
       setOpenFiles([]);
       setActiveFile(null);
       setIsDirty(false);
       // setCopilotMessages([]);

  }, [fileStructure]); // Re-run when the external fileStructure prop changes


  const generatedFileTree = useMemo(() => {
      if (!internalFileStructure || Object.keys(internalFileStructure).length === 0) {
          return [];
      }
      return buildFileTree(internalFileStructure);
  }, [internalFileStructure]);  

  useEffect(() => {
      setFileTreeData(generatedFileTree);

       // Auto-open the first file if structure is provided and no files are open
       if (generatedFileTree.length > 0 && openFiles.length === 0 && !activeFile && internalFileStructure && Object.keys(internalFileStructure).length > 0) {
            // Find the first file in the generated tree structure (which correctly identifies files vs folders)
            const firstFileInTree = findFirstFile(generatedFileTree);
            if (firstFileInTree && internalFileStructure[firstFileInTree.path] !== undefined) {
                 handleAddFileToOpen(firstFileInTree.path, internalFileStructure[firstFileInTree.path]);
            } else if (Object.keys(internalFileStructure).length > 0) {
               // Fallback if findFirstFile didn't work, try the first key from the flat structure
               const firstFlatPath = Object.keys(internalFileStructure)[0];
               // Ensure this path is actually a file path before attempting to open
               if (firstFlatPath && internalFileStructure[firstFlatPath] !== undefined && !firstFlatPath.endsWith('/') && getFileNameFromPath(firstFlatPath) !== '') {
                   handleAddFileToOpen(firstFlatPath, internalFileStructure[firstFlatPath]);
               }
            }
       } else if (!internalFileStructure || Object.keys(internalFileStructure).length === 0) {
            // Reset if internalFileStructure becomes empty
            setOpenFiles([]);
            setActiveFile(null);
            setIsDirty(false);
       }

       // If internalFileStructure changes while a file is open, and the file still exists, update its content in openFiles.
       // This ensures the open file reflects external changes to internalFileStructure (less common in this model, but good practice).
       if (activeFile && internalFileStructure && internalFileStructure[activeFile] !== undefined) {
           const currentOpenFile = openFiles.find(f => f.path === activeFile);
           const contentInInternalStructure = internalFileStructure[activeFile];

           // Check if the content in openFiles is different from the content in internalFileStructure
           if (currentOpenFile && currentOpenFile.content !== contentInInternalStructure) {
                 setOpenFiles(prevOpenFiles =>
                     prevOpenFiles.map(file =>
                         file.path === activeFile ? { ...file, content: contentInInternalStructure } : file
                     )
                 );
                 // Re-evaluate dirty state based on the updated content vs the original content from the *initial* prop
                 // The useEffect below that depends on activeFile, openFiles, and fileStructure (original)
                 // will handle setting the dirty state correctly after this update.
            }
       }

  }, [generatedFileTree, internalFileStructure, openFiles, activeFile, fileStructure]); // Added fileStructure dependency for dirty state comparison


  // Check for File System Access API support on mount
  useEffect(() => {
      setIsFSApiSupported('showDirectoryPicker' in window);
  }, []);


 
  const handleToolClick = (toolName) => {
    if (toolName === selectedTool){
        setSelectedTool()
    }  else {

    setSelectedTool(toolName);
    }
    console.log(`AI response for "${toolName}" goes here.`);
  };



  // --- Effect to handle window resize and trigger editor resize ---
  useEffect(() => {
      const handleResize = () => {
          if (editorRef.current) {
              editorRef.current.editor.resize();
          }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup the event listener on component unmount
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

   useEffect(() => {
       if (editorRef.current && activeFile) {
           const timeoutId = setTimeout(() => {
               if (editorRef.current && editorRef.current.editor) {
                   editorRef.current.editor.resize(true); // Pass true to force a full repaint
                   editorRef.current.editor.renderer.updateFull(); // Force full renderer update
               }
           }, 50); // A short delay (e.g., 50ms)

           return () => clearTimeout(timeoutId); // Cleanup the timeout if activeFile changes again
       }
   }, [activeFile]); // Re-run this effect when the active file changes

   // // --- Effect to scroll chat messages to the bottom ---
   // useEffect(() => {
   //     if (messagesEndRef.current) {
   //         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
   //     }
   // }, [copilotMessages, isCopilotOpen]); // Scroll when messages update or sidebar opens


  useEffect(() => {
    if (activeFile) {
      const file = openFiles.find(f => f.path === activeFile);
      if (file) {
        // Compare content in openFiles with the content from the *initial* fileStructure prop
        const originalContent = fileStructure ? fileStructure[activeFile] : undefined;
        setIsDirty(file.content !== originalContent);

      } else {
        console.error(`Active file "${activeFile}" not found in open files state.`);
        setActiveFile(null);
        setIsDirty(false);
      }
    } else {
      setIsDirty(false);
    }
    // Depend on fileStructure (original) to check against initial content
  }, [activeFile, openFiles, fileStructure]);


  const handleEditorChange = (newValue) => {
    // Update the content directly in the openFiles state
    setOpenFiles(prevOpenFiles => {
         const updatedOpenFiles = prevOpenFiles.map(file => {
             if (file.path === activeFile) {
                 // --- Update the internalFileStructure state here ---
                 setInternalFileStructure(prevInternalStructure => ({
                     ...prevInternalStructure,
                     [activeFile]: newValue, // Update the content for the active file
                 }));
                 // --- End Update ---

                 // Check dirty state against the original content from the *initial* prop
                 const originalContent = fileStructure ? fileStructure[activeFile] : undefined;
                 const isNowDirty = originalContent !== undefined && newValue !== originalContent;
                 setIsDirty(isNowDirty);

                 return { ...file, content: newValue };
             }
             return file;
         });
         return updatedOpenFiles;
    });
  };

  const handleAddFileToOpen = (filePath, content) => {
      // --- Added check for valid file path before adding to open files ---
      // Ensure the path is not a directory path and has a valid file name
       if (filePath.endsWith('/') || getFileNameFromPath(filePath) === '') {
           console.warn(`Attempted to open a path that is not a valid file: "${filePath}". Skipping.`);
           return; // Do not add directory paths or paths without filenames to open files
       }
      // --- End Check ---

      setOpenFiles(prevOpenFiles => {
          if (prevOpenFiles.some(file => file.path === filePath)) {
              setActiveFile(filePath);
              // Re-evaluate dirty state when activating an already open file
              const openFile = prevOpenFiles.find(f => f.path === filePath);
              const originalContent = fileStructure ? fileStructure[filePath] : undefined;
              setIsDirty(openFile && openFile.content !== originalContent);
              return prevOpenFiles;
          }
          const newOpenFile = { path: filePath, content: content };
          const newOpenFiles = [...prevOpenFiles, newOpenFile];
          // Corrected sort key from getFileNameFromFileName to getFileNameFromPath
          newOpenFiles.sort((a, b) => getFileNameFromPath(a.path).localeCompare(getFileNameFromPath(b.path)));
          setActiveFile(filePath);
          // A newly added file is dirty if its content differs from the original structure content
          const originalContent = fileStructure ? fileStructure[filePath] : undefined;
          setIsDirty(content !== originalContent);
          return newOpenFiles;
      });
  };


  const handleFileSelect = (filePath) => {
    // Prevent selecting directory paths from the tree if they exist as keys
    // Also prevent selecting paths that would result in no filename
    if (filePath.endsWith('/') || getFileNameFromPath(filePath) === '') {
        console.log(`Selected path is not a valid file: ${filePath}. Not opening.`);
        return;
    }

    // Get content from the internal state
    const fileContent = internalFileStructure ? internalFileStructure[filePath] : undefined;

    if (fileContent !== undefined) {
      handleAddFileToOpen(filePath, fileContent);
    } else {
      console.warn(`Content for file "${filePath}" not found in internalFileStructure.`);
    }
  };

  const handleTabClick = (filePath) => {
    setActiveFile(filePath);
  };

  const handleCloseFile = (filePathToClose) => {
    setOpenFiles(prevOpenFiles => {
        const updatedOpenFiles = prevOpenFiles.filter(file => file.path !== filePathToClose);

        if (activeFile === filePathToClose) {
            const closedIndex = prevOpenFiles.findIndex(file => file.path === filePathToClose);
             if (updatedOpenFiles.length > 0) {
                const nextActiveFileIndex = Math.max(0, closedIndex - 1);
                 setActiveFile(updatedOpenFiles[nextActiveFileIndex].path);
             } else {
                setActiveFile(null);
             }
        }
        return updatedOpenFiles;
    });
  };

  const getModeFromFilePath = (filePath) => {
    if (!filePath) return 'text';
    const extension = filePath.split('.').pop().toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx': return 'javascript';
      case 'py': return 'python';
      case 'html':
      case 'htm': return 'html';
      case 'css': return 'css';
      case 'java': return 'java';
      case 'c': return 'c';
      case 'cpp': return 'cpp';
      case 'cs': return 'cs';
      case 'go': return 'go';
      case 'rs': return 'rs';
      case 'rb': return 'rb';
      case 'ts':
      case 'tsx': return 'typescript';
      case 'md':
      case 'markdown': return 'markdown';
      case 'json': return 'json';
      default: return 'text';
    }
  };


  // --- Saving Functions ---

  // Save the content of the currently active file (Download single file)
  const handleSaveCurrentFile = () => {
      if (!activeFile) {
          toast.error('No file selected to save.');
          return;
      }

      // Get content from the internal state
      const fileToSaveContent = internalFileStructure ? internalFileStructure[activeFile] : undefined;

      if (fileToSaveContent === undefined) {
          console.error(`Content for active file "${activeFile}" not found in internalFileStructure.`);
          toast.error('Could not find the content for the active file.');
          return;
      }

      try {
          const blob = new Blob([fileToSaveContent], { type: getMimeTypeFromFilePath(activeFile) });
          saveAs(blob, getFileNameFromPath(activeFile));

           // Check dirty state against the original content from the *initial* prop
           const originalContent = fileStructure ? fileStructure[activeFile] : undefined;
           if (originalContent !== undefined && fileToSaveContent === originalContent) {
              setIsDirty(false);
           }

      } catch (error) {
          console.error('Error saving file:', error);
          toast.error('Failed to save file. See console for details.');
      }
  };

  // Download the entire project structure as a ZIP file (Alternative Save All)
  const handleDownloadProjectZip = async () => {
      if (!internalFileStructure || Object.keys(internalFileStructure).length === 0) {
          toast.error('No project structure to download.');
          return;
      }

      const zip = new JSZip();
      setIsSaving(true); // Indicate saving is in progress

      try {
          // Iterate through all paths in the internal state
          const filePaths = Object.keys(internalFileStructure);

          await Promise.all(filePaths.map(async (filePath) => {
              // Skip directory paths when creating the zip
              if (filePath.endsWith('/')) {
                 return; // Skip this path
              }

              // Use content from the internal state
              const contentToSave = internalFileStructure[filePath];

              if (contentToSave !== undefined) {
                 zip.file(filePath, contentToSave);
              } else {
                 console.warn(`Content for path "${filePath}" is undefined in internal state, skipping ZIP inclusion.`);
              }
          }));


          const zipBlob = await zip.generateAsync({ type: "blob" });

          saveAs(zipBlob, "project.zip");

      } catch (error) {
          console.error('Error generating or downloading ZIP:', error);
          toast.error('Failed to download project. See console for details.');
      } finally {
          setIsSaving(false); // Saving is complete (success or failure)
      }
  };

    // --- Function to save the whole directory using File System Access API ---
    const handleSaveAllToFolder = async () => {
        if (!isFSApiSupported) {
             toast.error('Saving directly to folders is not supported in this browser.');
             return;
        }
        if (!internalFileStructure || Object.keys(internalFileStructure).length === 0) {
            toast.error('No project structure to save.');
            return;
        }

        setIsSaving(true); // Indicate saving is in progress

        try {
            // Open a directory picker dialog
            const directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite', // Request read and write access
                // Optional: Add filters or suggested start directory
                // startIn: 'downloads'
            });

            // Verify permissions (optional but good practice)
            const permissionStatus = await directoryHandle.requestPermission({ mode: 'readwrite' });
            if (permissionStatus !== 'granted') {
                toast.error('Permission to save to the selected directory was denied.');
                setIsSaving(false);
                return;
            }

            // Iterate through all paths in the internal state
            const filePaths = Object.keys(internalFileStructure);

            // Helper function to get or create a directory handle recursively
            const getOrCreateDirectoryHandle = async (baseHandle, pathSegments) => {
                let currentHandle = baseHandle;
                for (const segment of pathSegments) {
                     // Basic validation for directory segment names
                     if (segment === '' || segment === '.' || segment === '..') {
                         throw new Error(`Invalid directory segment in path: ${pathSegments.join('/')}`);
                     }
                    currentHandle = await currentHandle.getDirectoryHandle(segment, { create: true });
                }
                return currentHandle;
            };

            // Iterate through all entries and save files
            for (let filePath of filePaths) {
                // --- Check to SKIP DIRECTORY PATHS and handle LEADING SLASH ---
                // If the path ends with a slash, assume it's a directory and skip it.

                if (filePath.endsWith('/')) {
                    console.log(`Skipping directory path: ${filePath}`);
                    continue;
                }

                // Use content from the internal state
                const contentToSave = internalFileStructure[filePath];

                if (contentToSave === undefined) {
                    console.warn(`Content for path "${filePath}" is undefined in internal state, skipping save.`);
                    continue;
                }

                filePath = filePath.replace('./',"")
                let pathSegments = filePath.split('/');

                // If the path started with a '/', the first segment will be "". Remove it.
                if (pathSegments.length > 0 && pathSegments[0] === '' && filePath.startsWith('/')) {
                    pathSegments = pathSegments.slice(1);
                }
                 // --- END Check ---


                const fileName = pathSegments.pop(); // Get the file name
                const dirSegments = pathSegments; // Remaining segments are directories

                // Basic validation for the extracted file name
                if (!fileName || fileName === '.' || fileName === '..') {
                     console.warn(`Skipping invalid file name derived from path: "${filePath}"`);
                     continue;
                }

                try {
                    // Get the handle for the directory where the file should reside
                    // If dirSegments is empty after processing, the file is at the root of the selected directory
                    const targetDirectoryHandle = dirSegments.length > 0
                        ? await getOrCreateDirectoryHandle(directoryHandle, dirSegments)
                        : directoryHandle; // Use the root handle if no subdirectories


                    const fileHandle = await targetDirectoryHandle.getFileHandle(fileName, { create: true });
                    const writableStream = await fileHandle.createWritable();
                    await writableStream.write(String(contentToSave)); // Ensure content is string or Blob/BufferSource
                    await writableStream.close();

                    localStorage.setItem(APP_ID, JSON.stringify(internalFileStructure));
                    setIsDirty(false)

                    console.log(`Saved: ${filePath}`);

                } catch (writeError) {
                     console.error(`Failed to save file "${filePath}":`, writeError);
                     toast.error(`Failed to save file "${filePath}". See console for details.`);
                }
            }

            toast.success('Project saving process finished.');

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('User cancelled directory picker.');
                toast.warning('Saving cancelled by user.');
            } else {
                console.error('An unhandled error occurred during Save All to Folder:', error);
                toast.error(`An unexpected error occurred during saving. See console for details.`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Function to toggle the Co-pilot sidebar visibility
    const toggleCopilot = () => {
        setIsCopilotOpen(prevState => !prevState);
        // Trigger editor resize after the sidebar visibility changes
        // Use a small delay to allow the DOM to update its layout
        setTimeout(() => {
            if (editorRef.current && editorRef.current.editor) {
                editorRef.current.editor.resize();
            }
        }, 100); // Adjust delay as needed
    };

    // --- Co-pilot Chat Functions ---
    const handleCopilotInputChange = (event) => {
        setCopilotInput(event.target.value);
    };



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





async function generateText(prompt, retries = 0,message=null) { // Added retries parameter
  try {

    const chat = model.startChat({
      history: chatHistory.slice(-6),
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    // Extract the generated text (handle different response structures if needed)
    const generatedText = response.text();

    console.log("Generated Text:", generatedText);

    chatHistory.push({ role: "user", parts: [{ text: message ? message: prompt }] });
    chatHistory.push({ role: "model", parts: [{ text: generatedText }] });

    return generatedText; // Return the generated text
  } catch (error) {
    console.error(`Error generating text (Attempt ${retries + 1}):`, error);

    if (retries < 6) { // Retry up to 4 more times (5 total attempts)
      await delay(10000);
      return generateText(prompt, retries + 1,message); 
    } else {
      console.error("Maximum retry attempts reached. Failing.");
      throw error; // Re-throw the error if retries are exhausted
    }
  }
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





const chat_with_copilot = async (codes, prd, user_question) => {
setError()
  const map_file = {};

  Object.keys(codes).forEach(path => {
    if (isCode(path)) {  
      map_file[path] = codes[path];
    }
  });

  if (Object.keys(map_file).length === 0) {
      console.warn("No code files identified after filtering. Proceeding with empty code context.");
  }

  try {

      const result = await generateText(generate_copilot_response(map_file, prd, user_question), 5, user_question);
      const generatedText = result;
      const toJSON = JSON.parse(removeConsecutiveJSONBr(generatedText));
      return toJSON;

    } catch (error) {
    setIsCopilotLoading(false);
        console.error("chat_with_copilot:", error);
        setError(String(error))
    }

 
};




const debug_copilot = async (codes, prd, errors, software_type) => {
  const map_file = {};
  setDebugLoading(errors)

  Object.keys(codes).forEach(path => {
    if (isCode(path)) {  
      map_file[path] = codes[path];
    }
  });

  if (Object.keys(map_file).length === 0) {
      console.warn("No code files identified after filtering. Proceeding with empty code context.");
  }

  try {

      const result = await generateText(generate_debug_task(map_file, prd, errors,software_type));
      const generatedText = result;
      const toJSON = JSON.parse(removeConsecutiveJSONBr(generatedText));
      return toJSON;

    } catch (error) {
    setDebugLoading(false);
        console.error("chat_with_copilot:", error);
        setError(String(error))
    }

 
};



function removeFirstCommentLine(inputString) {
    const singleLineCommentTags = [
        "// ",   // JavaScript, C++, C#, Java, Go, Rust, etc.
        "# ",    // Python, Ruby, Perl, Bash, etc.
        "-- ",   // SQL, Ada, Haskell, Lua (for single line comments), etc.
        "<!-- ", // HTML, XML (start of comment block, but often used for single lines)
        "% ",    // LaTeX, Prolog
        "rem "   // Batch files, some BASIC dialects
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



 useEffect(()=>{
 
if (selectedTool==='Quality Test Check' && !testCase.length ) handleQualityTest();
 },[selectedTool])



    const handleSendMessage = async (mes) => {
        const messageText = copilotInput.trim()||mes;
        if (!messageText) {
            return; // Don't send empty messages
        }

        // Add user message to state
        setCopilotMessages(prevMessages => [...prevMessages, { sender: 'user', text: messageText }]);
        setCopilotInput(''); // Clear input

        setIsCopilotLoading(true); // Indicate AI is thinking

  const ai_response =   await chat_with_copilot(internalFileStructure, PRD,messageText)
    let db =   await initDB( );

     const existingData = await getNoteIdb(db, APP_ID) || {};

let updatedData = {}



  if (ai_response.code_changes && ai_response.code_changes.length){


    const software_type =   await getNoteIdb(db, APP_ID,'software_type');


                
ai_response.code_changes.forEach(async task => {
  
  const filePath = task.file_path;
  let generatedText = '';
  let maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    generatedText = await generateText(
      generate_web_coder(PRD, task, [], internalFileStructure[String(filePath).split(",")[0]], software_type) +
      `\n (Timestamp: ${Date.now()}).\n MANDATORY: GENERATE CODE FOR ${filePath}.`
    );

    if (!generatedText.includes('QA CHECK FAILED') && (generatedText.includes(String(filePath)) || generatedText.includes(String(filePath).split("/").splice(-1)[0]))) {
      setInternalFileStructure(prevInternalStructure => ({
        ...prevInternalStructure,
        [task.file_path]: removeFirstCommentLine(generatedText.replaceAll("```", "")),
      }));

      updatedData =  {
                ...internalFileStructure,
                [task.file_path]: removeFirstCommentLine(generatedText.replaceAll("```", ""))
  }

console.log('adjusted',updatedData)
updatedData['id'] = APP_ID
    await addNoteIdb(db, updatedData);

      break;
    } else {
      console.log(`Attempt ${attempt + 1} failed for ${filePath}. Retrying...`);
      attempt++;
      await delay(1000);
    }
  }

  if (attempt === maxRetries) {
    console.error(`Failed to generate code for ${filePath} after ${maxRetries} attempts.`);
  }
});


    setIsDirty(true)
  }

if (ai_response.remove_changes && ai_response.remove_changes.length > 0) {
  setInternalFileStructure( async prevInternalStructure => {
    const nextInternalStructure = { ...prevInternalStructure };
    ai_response.remove_changes.forEach(filePathToRemove => {
      if (nextInternalStructure.hasOwnProperty(filePathToRemove)) {
        delete nextInternalStructure[filePathToRemove];
        console.log(`Removed file: ${filePathToRemove}`);
      } else {
        console.warn(`Attempted to remove file not found in structure: ${filePathToRemove}`);
      }
    });

    updatedData = nextInternalStructure
    updatedData['id'] = APP_ID

    console.log('adjusted',updatedData)
    await addNoteIdb(db, updatedData);





    return nextInternalStructure;
  });
}

if (ai_response.rename_changes && ai_response.rename_changes.length > 0) {
  setInternalFileStructure( async prevInternalStructure => {
    const nextInternalStructure = { ...prevInternalStructure };

    ai_response.rename_changes.forEach(renameChange => {
      const oldFilePath = renameChange.old_file_path;
      const newFilePath = renameChange.new_file_path;

      // Ensure both old and new paths are valid strings before proceeding
      if (typeof oldFilePath === 'string' && typeof newFilePath === 'string' && oldFilePath !== newFilePath) {
        if (nextInternalStructure.hasOwnProperty(oldFilePath)) {
          // Get the content of the old file
          const fileContent = nextInternalStructure[oldFilePath];

          // Add the content to the new file path
          nextInternalStructure[newFilePath] = fileContent;

          // Delete the old file path
          delete nextInternalStructure[oldFilePath];

          console.log(`Renamed file: "${oldFilePath}" to "${newFilePath}"`);
        } else {
          console.warn(`Attempted to rename file not found in structure: "${oldFilePath}". Cannot rename to "${newFilePath}".`);
        }
      } else {
        console.warn(`Invalid rename change data received:`, renameChange);
      }
    });

    updatedData = nextInternalStructure
     console.log('adjusted',updatedData)
     updatedData['id'] = APP_ID
    await addNoteIdb(db, updatedData);


    return nextInternalStructure;
  });
}





        const aiResponse = ai_response.discussion

        // Add AI message to state
        setCopilotMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
        setIsCopilotLoading(false); // Indicate AI is thinking

    };


    const handleQualityTest = async () => {
        
        setError()
     setTestLoading(true); 

  try {

      const result = await generateText(generate_quality_assurance(PRD, internalFileStructure), 5);
      const ai_response = JSON.parse(removeConsecutiveJSONBr(result));

  if (ai_response && ai_response.length){
    setTestCase(ai_response)

  }
 
  setTestLoading(false);

    } catch (error) {
    setTestLoading(false);
        console.error("setTestLoading:", error);
        setError(String(error));  
    }




          

    };









const debug_error = async (errors) => {

        try {


setDebugLoading(errors);

errors['file_content_with_errors'] = internalFileStructure[errors.filepath]
let db =   await initDB( );
 const software_type =   await getNoteIdb(db, APP_ID,'software_type');

const debug_response =   await debug_copilot(internalFileStructure, PRD,errors,software_type )
console.log('debug_response',debug_response)

let updatedData = internalFileStructure


if (debug_response.code_changes && debug_response.code_changes.length){
                
debug_response.code_changes.forEach(async task => {
  
  const filePath = errors.filepath;
  let generatedText = '';
  let maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    generatedText = await generateText(
      generate_web_coder(PRD, task, [], updatedData[String(filePath).split(",")[0]], software_type) +
      `\n (Timestamp: ${Date.now()}).\n MANDATORY: GENERATE CODE FOR ${filePath}.`
    );

    if (!generatedText.includes('QA CHECK FAILED') && (generatedText.includes(String(filePath)) || generatedText.includes(String(filePath).split("/").splice(-1)[0]))) {
      setInternalFileStructure(prevInternalStructure => ({
        ...prevInternalStructure,
        [errors.filepath]: removeFirstCommentLine(generatedText.replaceAll("```", "")),
      }));

      updatedData =  {
                ...internalFileStructure,
                [errors.filepath]: removeFirstCommentLine(generatedText.replaceAll("```", ""))
  }

// console.log('adjusted',updatedData)
updatedData['id'] = APP_ID
    await addNoteIdb(db, updatedData);
       setIsDirty(true)

      break;
    } else {
      console.log(`Attempt ${attempt + 1} failed for ${filePath}. Retrying...`);
      attempt++;
      await delay(1000);
    }
  }

  if (attempt === maxRetries) {
    console.error(`Failed to generate code for ${filePath} after ${maxRetries} attempts.`);
  }
});


 setTimeout(() => {
        setTestCase(testCase.filter(e=>e.filepath !== errors.filepath ))
setDebugLoading(false);
        }, 2000*debug_response.code_changes.length); 



 

}

} catch (err){
setDebugLoading(false);
    console.error(`Failed to debug code for ${String(err)}`);
    return debug_error(errors)


}

}















    const handleCopilotKeyPress = (event) => {
        if (event.key === 'Enter' && !isCopilotLoading) {
            handleSendMessage();
        }
    };
   


  return (
    <div className="code-viewer-container">
      <div className="code-viewer-header flex  " style={{justifyContent:'space-between'}} >
          {fileTreeData && fileTreeData.length > 0 && (
              <>
              <div   >
              {isDirty ?  <span style={{color:'red',fontSize:'11px'}} >There's changes ...</span>:<></>}
                <button className='mr-4' onClick={handleDownloadProjectZip} disabled={isSaving}>
                    {isSaving ? 'Generating ZIP...' : 'Download Project (ZIP)'}
                </button>
                {isFSApiSupported && ( // Only show if API is supported
                   <button onClick={handleSaveAllToFolder} disabled={isSaving}>
                       {isSaving ? 'Saving...' : 'Save All to Folder'}
                   </button>
                )}
                 {!isFSApiSupported && fileTreeData && fileTreeData.length > 0 && (
                     <span className="feature-note">
                         Save to Folder not supported. Use Download ZIP.
                     </span>
                 )}

</div>

                  <button style={{background:"green"}} className='px-4 flex' onClick={e=>e} disabled={true}>
                    {isSharing ? 'Sharing...' : 'Share Project'} <Share className="ml-2 h-5 w-4" />
                </button>


     
              </>
          )}
           {/* Add other header elements here if needed */}
      </div>
      {/* --- Code Viewer Content Container (Flexbox) --- */}
      <div className={`code-viewer-content ${isCopilotOpen ? 'copilot-open' : ''}`}>

        {/* File Tree Sidebar */}
        {fileTreeData && fileTreeData.length > 0 && (
          <div className="file-tree-sidebar">
            <h4 className="file-tree-title">Files</h4>
            <FileTree
              treeData={fileTreeData}
              onFileSelect={handleFileSelect}
              activeFile={activeFile}
            />
          </div>
        )}

        {/* Editor Area */}
        <div className="editor-container">
          {/* File Tabs */}
          {openFiles.length > 0 && (
            <div className="file-tabs-container">
              {openFiles.map((file) => {
                  // Compare content in openFiles with the original content from the *initial* prop
                  const originalContent = fileStructure ? fileStructure[file.path] : undefined;
                  const tabIsDirty = originalContent !== undefined && file.content !== originalContent;

                  return (
                      <div
                        key={file.path}
                        className={`file-tab ${activeFile === file.path ? 'file-tab-active' : ''}`}
                        onClick={() => handleTabClick(file.path)}
                        title={file.path}
                      >
                        <span className="file-tab-name">{getFileNameFromPath(file.path)}</span>
                          {tabIsDirty && <span className="file-tab-dirty-indicator">*</span>}
                        <button
                          className="file-tab-close"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseFile(file.path);
                          }}
                          aria-label={`Close ${getFileNameFromPath(file.path)}`}
                        >
                          &times;
                        </button>
                      </div>
                   );
              })}
            </div>
          )}

          {/* Ace Editor or Placeholder */}
          {activeFile && openFiles.length > 0 ? (
            <AceEditor
              key={activeFile} // Added key prop here
              ref={editorRef} // Added ref here
              mode={getModeFromFilePath(activeFile)}
              theme="monokai"
              onChange={handleEditorChange}
              value={openFiles.find(f => f.path === activeFile)?.content || ''}
              name="code-editor"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: false, // Disabled autocompletion
                enableLiveAutocompletion: false, // Disabled autocompletion
                enableSnippets: false, // Disabled snippets
                showLineNumbers: true,
                tabSize: 4, // Changed tab size to 4 for common code style
                useWorker: true,
              }}
              style={{ flexGrow: 1 }}
              width="100%"
              height="100%"
              onLoad={(editor) => {
                  // Focus the editor for better user experience
                  editor.focus();
                  // Manually trigger a resize after load to ensure correct layout calculation
                  editor.resize();
              }}
            />
          ) : (
            <div className="no-file-message">
              {fileTreeData && fileTreeData.length > 0
                  ? "Select a file from the sidebar to view its content."
                  : "No code structure provided."}
            </div>
          )}
        </div>

      

    <div className="flex h-screen bg-gray-900 text-gray-100">

    {selectedTool && <div className="vercel-dark-tool-container">

    {selectedTool === 'Code Copilot' && (
        <div className="tool-content-wrapper">
            <div className="vercel-dark-chat-container">
                <div className="vercel-dark-chat-panel">
               
                   <div className="chat-header">
    <span className="copilot-icon text-white">🤖 VB2-Co-Pilot</span>  
</div>

                    <div className="chat-messages">
                        {copilotMessages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.sender}-message`}>
                                <span className="message-icon">
                                    {message.sender === 'user' ? '👤' : '🤖'}
                                </span>
                                <div className="message-bubble">
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isCopilotLoading && (
                            <div className="chat-message ai-message loading">
                                <span className="message-icon">🤖</span>
                                <div className="message-bubble">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">

                        <input
                            type="text"
                            placeholder="Chat with vb2..."
                            value={copilotInput}
                            onChange={handleCopilotInputChange}
                            onKeyPress={handleCopilotKeyPress}
                            disabled={isCopilotLoading}
                        />
                      
                    </div>
                </div>
            </div>
        </div>
    )}

    {selectedTool === 'Track Features' && (
        <div className="tool-content-wrapper">
             <TaskGenerator APP_ID={APP_ID} codes={internalFileStructure} setCodes={setInternalFileStructure} 

             handleAddFileToOpen={handleAddFileToOpen}  

              />
        </div>
    )}

    {selectedTool === 'Quality Test Check' && (
         <div className="tool-content-wrapper">
            <div className="vercel-dark-chat-container">
                <div className="vercel-dark-chat-panel flex " style={{justifyContent:'space-between', alignItems:'center'}}>
                   <div className="chat-header w-full">
    <span className="copilot-icon text-white">🤖 QA Checks ({testCase.length}) </span>  
      <button className="
        bg-gray-800 text-white text-sm
        font-small py-1 px-3  my-0 ml-3
        rounded-md shadow-md
        hover:bg-gray-700 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
        transition duration-150 ease-in-out
        " onClick={()=>{
         handleQualityTest()
        }} >
       Run QA
    </button>

</div>

{error && (
            <div className="mb-4 p-2 bg-red-800 text-red-200 border border-red-700 rounded-md text-xs flex items-center justify-center text-center">
                <span>Error: {error}.</span>
            </div>
          )}

            {testLoading ? <>   <div className="simple-spinner"></div><div></div></> :   error ? <></>: 
            <AIReviewResults results={testCase} debug_error={debug_error} isDebugLoading={isDebugLoading} 
            handleAddFileToOpen={handleAddFileToOpen} codes={internalFileStructure} /> }
         </div>
         </div>
         </div>
    )}

    {selectedTool === 'Write Documentation' && (
        <div className="tool-content-wrapper">
            <ComingSoon featureName={selectedTool} />
        </div>
    )}

    {selectedTool === 'Write Test Cases' && (
        <div className="tool-content-wrapper">
              <ComingSoon featureName={selectedTool} />
        </div>
    )}

</div>
  }

      {/* Right Sidebar - Vertical menu of AI tool icons */}
      <div className="flex flex-col items-center p-2 bg-gray-800 shadow-lg">
        <h2 className="text-MD font-semibold mb-6 text-green-400 py-2" style={{borderBottom:'1px solid silver'}} >MENU</h2>
       
        {aiTools.map((tool) => (
          // Each icon button
          <button
            key={tool.name}
            className={`p-2 mb-4 rounded-lg transition-colors duration-200
                       ${selectedTool === tool.name ? 'bg-blue-600 text-white shadow-xl' : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'}
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            onClick={() => handleToolClick(tool.name)}
            title={tool.name} // Add tooltip for accessibility
          >
            {/* Render the Lucide icon component */}
            <tool.icon size={24} />
          </button>
        ))}
      </div>
    </div>


      </div>
      {/* --- End Code Viewer Content Container --- */}
    </div>
  );
}

export default CodeViewer;
