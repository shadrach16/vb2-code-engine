import React from 'react';
import './HorizontalLoaderMain.css';

const TaskLoader = ({ currentValue, endValue,label="Generating tasks... Please wait.",error="" }) => {
  // Ensure endValue is a positive number to avoid division issues
  const safeEndValue = endValue > 0 ? endValue : 1;

  let calculatedPercentage = (currentValue / safeEndValue) * 100;

  const progressWidth = Math.max(0, Math.min(100, calculatedPercentage));

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-bar-track">
          <div
            className="loader-bar-fill"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
       
        <div style={{alignItems:'center'}} className="loader-percentage flex justify-center align-center">{`${Math.round(progressWidth)}%`} 
         <div className="simple-spinner ml-3  "></div> </div>
     
        <div className="loader-message">{label}</div>
     {error &&   <div className="mb-2 mt-2 p-2 bg-red-800 text-red-200 border border-red-700 rounded-md text-xs flex items-center justify-center text-center">
                <span>Error: {error}.</span>
            </div>}
      </div>
    </div>
  );
};

export default TaskLoader;