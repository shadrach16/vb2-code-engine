import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, X,Check } from 'lucide-react'; // Import necessary Lucide icons

const CustomSideSelect = ({ state, updateState, originalOptions }) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const sideMenuRef = useRef(null); // Ref for the side menu div
  const toggleButtonRef = useRef(null); // Ref for the button that opens the menu

  const handleToggleMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleOptionClick = (optionValue) => {
    updateState('software_type', optionValue);
    setIsSideMenuOpen(false); // Close the menu after selection
  };

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the side menu and outside the toggle button
      if (
        sideMenuRef.current && !sideMenuRef.current.contains(event.target) &&
        toggleButtonRef.current && !toggleButtonRef.current.contains(event.target)
      ) {
        setIsSideMenuOpen(false);
      }
    };

    if (isSideMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSideMenuOpen]); // Re-run effect when menu open state changes

  return (
    <>
      <div style={{  }}>
       
        <div
          className="flex items-center justify-between   !rounded-xl !bg-gray-100 !border !border-gray-100 !text-gray-700 !text-base !shadow-none hover:!border-gray-400 !cursor-pointer font-inter customselect"
          style={{ padding: '0 0.65rem', height: '32px' }}
        >
          <span className="flex-grow truncate text-gray-500">
            {state.software_type || 'No app type selected'}
          </span>
          <button
            ref={toggleButtonRef}
            onClick={handleToggleMenu}
            className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open project selection menu"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div
        ref={sideMenuRef}
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 999999999,height:'100vh' }}  
      >
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 font-inter">Select Software Type</h2>
          <button
            onClick={() => setIsSideMenuOpen(false)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <ul className="py-2 font-inter" style={{'overflowX':'scroll',height: '95vh'}} >
          {originalOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`px-5 py-3 cursor-pointer text-gray-700 text-base flex items-center justify-between transition-colors 
              duration-150 ease-in-out
                ${option === state.software_type
                  ? 'bg-blue-50 text-blue-700 font-semibold' // Style for selected option
                  : 'hover:bg-gray-100' // Style for non-selected on hover
                }`}
            >
              <span>{option}</span>
              {option === state.software_type && (
                <Check className="h-5 w-5 text-blue-600 ml-2" /> // Checkmark for selected
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay background when menu is open */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ease-in-out"
          style={{ zIndex: 999999998 }} // Slightly lower z-index than the menu
          onClick={() => setIsSideMenuOpen(false)} // Close on overlay click
        ></div>
      )}
    </>
  );
};

export default CustomSideSelect;