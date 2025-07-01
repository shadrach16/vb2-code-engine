import React, { useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css'

import { Tooltip } from 'react-tooltip'

// --- Icon Components (Inline SVGs for self-containment) ---
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const FileIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const AlertCircleIcon = ({ className = "w-5 h-5" }) => ( // For SyntaxError
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const PackageXIcon = ({ className = "w-5 h-5" }) => ( // For ImportError
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
    <line x1="17" y1="14.5" x2="12" y2="12"></line>
    <line x1="7" y1="14.5" x2="12" y2="12"></line>
    <line x1="10" y1="9" x2="14" y2="11"></line>
    <line x1="14" y1="9" x2="10" y2="11"></line>
  </svg>
);

const PuzzleIcon = ({ className = "w-5 h-5" }) => ( // For PropsUsageError
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.439 7.932c.06.191.099.392.111.601.018.33.004.665-.028.995a4.404 4.404 0 0 1-1.312 3.018c-.7.803-1.633 1.307-2.663 1.47-.38.059-.762.077-1.142.077-.381 0-.763-.019-1.143-.078-.923-.14-1.753-.551-2.409-1.179a4.399 4.399 0 0 1-1.312-3.018c-.032-.33-.046-.664-.028-.995.012-.209.051-.41.111-.601M19.439 7.932c-.19-.625-.489-1.224-.878-1.75a3.639 3.639 0 0 0-2.949-1.425c-.781 0-1.5.268-2.061.725-.561-.457-1.28-.725-2.061-.725a3.639 3.639 0 0 0-2.949 1.425c-.389.526-.688 1.125-.878 1.75M19.439 7.932A4.399 4.399 0 0 0 21 10.5c0 1.691-.958 3.14-2.34 3.815M4.561 7.932A4.399 4.399 0 0 1 3 10.5c0 1.691.958 3.14 2.34 3.815m0 0c.38.059.762.077 1.142.077.381 0 .763-.019 1.143-.078m0 0c.656.628 1.486 1.039 2.409 1.179.38.059.762.077 1.142.077.381 0 .763-.019 1.143-.078.923-.14 1.753-.551 2.409-1.179M4.561 7.932c.19-.625.489-1.224.878-1.75M14.122 6.182c.561-.457 1.28-.725 2.061-.725M9.878 6.182c-.561-.457-1.28-.725-2.061-.725M12 14.315V17.5m0 0v2.5m0-2.5h2.5m-2.5 0H9.5"></path>
  </svg>
);

const LightbulbIcon = ({ className = "w-5 h-5" }) => ( // For LogicalErrorFromPRD
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3 2 5 2 5h10s2-2 2-5a7 7 0 0 0-7-7Z"></path>
    <path d="M12 14v0"></path>
  </svg>
);

const getErrorIcon = (errorType) => {
  switch (errorType) {
    case 'SyntaxError':
      return <AlertCircleIcon className="w-5 h-5 text-red-500" />;
    case 'ImportError':
      return <PackageXIcon className="w-5 h-5 text-orange-500" />;
    case 'PropsUsageError':
      return <PuzzleIcon className="w-5 h-5 text-yellow-600" />;
    case 'LogicalErrorFromPRD':
      return <LightbulbIcon className="w-5 h-5 text-blue-500" />;
    default:
      return <AlertCircleIcon className="w-5 h-5 text-gray-500" />;
  }
};

// --- ErrorItem Component ---
const ErrorItem = ({ error }) => {
  return (
    <div className="px-1 py-3 border-t border-gray-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-0.5">
          {getErrorIcon(error.error_type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">
            <span className="font-semibold">{error.error_type}</span> on line <span className="font-mono bg-gray-100 px-1 rounded-sm text-xs">{error.line_number}</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">{error.description}</p>
          {error.suggestion && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Suggestion:</p>
              <pre style={{background:'#edededcf !important'}} className="p-2 text-sm bg-gray-400 border border-gray-200 rounded-md overflow-x-auto text-gray-700 whitespace-pre-wrap font-mono">
                {error.suggestion}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- FileErrors Component ---
const FileErrors = ({ fileResult,debug_error,isDebugLoading,index,codes, handleAddFileToOpen }) => {
  const [isOpen, setIsOpen] = useState(index==0 ?true: false);

  if (!fileResult.errors_found || fileResult.errors_found.length === 0) {
    return null; // Or a message indicating no errors in this file
  }


  return (
    <div className="mb-2 bg-white border border-gray-300 shadow-sm">
    <Tooltip id="my-tooltip" />
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 border-b border-gray-200 focus:outline-none"
      >
        <div className="flex items-center space-x-2 truncate"  style={{width:"95%"}}>

         <span> <FileIcon className="w-5 h-5 text-gray-600"  /></span>
          <span onClick={()=>{
                                    const fp =  fileResult.filepath
                                    
                                     if (codes[fp]) handleAddFileToOpen(fp,codes[fp]);
                                   }} data-tooltip-id="my-tooltip" data-tooltip-content={fileResult.filepath}  className="font-mono text-sm font-medium text-gray-700 truncate" >{fileResult.filepath}</span>
          <span className="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full cursor-pointer">
            {fileResult.errors_found.length} error{fileResult.errors_found.length > 1 ? 's' : ''}
          </span>
        </div>
        {isOpen ? <ChevronDownIcon className="w-5 h-5 text-gray-500" /> : <ChevronRightIcon className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen  && (
        <div>
        

<div className='flex align-center w-full justify-start ml-2 '>
            <button className="
        bg-gray-800 text-white text-sm
        font-small py-1 px-3 my-2
        rounded-md shadow-md
        hover:bg-gray-700 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75
        transition duration-150 ease-in-out
        " onClick={()=>{
          console.log('debug',fileResult)
          debug_error(fileResult)
        }} >
      {
        isDebugLoading && isDebugLoading.filepath === fileResult.filepath ?  <div className="simple-spinner"></div> : 
        <> {`Fix ${fileResult.errors_found.length } error${fileResult.errors_found.length > 1 ? 's' : ''} `} </>
      }
    </button>
        </div>

          {fileResult.errors_found.map((error, index) => (
            <ErrorItem key={index} error={error} />
          ))}

        </div>
      )}

     

    </div>
  );
};

 
const AIReviewResults = ({ results=[],debug_error=f=>f,isDebugLoading,codes,handleAddFileToOpen=f=>f }) => {

  // console.log('resultsj',results)
  if (!results || results.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm">
        No issues found. Looks good!
      </div>
    );
  }

  return (
    <div className="   min-h-screen font-sans" style={{height:'85vh', overflowY:"scroll", width:'100%'}} >
      {results.map((fileResult, index) => (
        <FileErrors key={index} fileResult={fileResult} debug_error={debug_error} isDebugLoading={isDebugLoading} index={index} 
        codes={codes} handleAddFileToOpen={handleAddFileToOpen} />
      ))}
    </div>
  );
};
  


export default AIReviewResults