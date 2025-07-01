import React, { useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react'; // Import necessary Lucide icons

const GitHubModalSelect = ({ state, updateState, originalOptions, isOpen, setIsOpen, onClick=f=>f }) => {
  const modalRef = useRef(null); // Ref for the modal div

  const handleOptionClick = (optionValue) => {
    updateState('software_type', optionValue);
    setIsOpen(false); // Close the modal after selection
    onClick()
  };

  // Effect to handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when modal open state changes

  if (!isOpen) return null; // Don't render anything if the modal is closed

  return (
    <>
      {/* Overlay background */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out z-[999999998]" // Darker overlay
        onClick={() => setIsOpen(false)} // Close on overlay click
      ></div>

      {/* Centered Modal */}
      <div
        ref={modalRef}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                    z-[999999999] font-sans`} // Added font-sans
        style={{ maxHeight: '90vh' }} // Limit height for responsiveness
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select Software Type</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="py-2 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}> {/* Adjusted max-height */}
          {originalOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`px-5 py-2 cursor-pointer text-gray-800 text-base flex items-center justify-between
                          transition-colors duration-150 ease-in-out
                          ${option === state.software_type
                            ? 'bg-blue-50 text-blue-700 font-medium' // Selected style
                            : 'hover:bg-gray-50 hover:text-gray-900' // Hover style
                          }`}
            >
              <span>{option}</span>
              {option === state.software_type && (
                <Check className="h-4 w-4 text-blue-600 ml-2" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default GitHubModalSelect;