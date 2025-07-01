import React, { useState, useEffect } from 'react';
import { Pin, ChevronDown, ChevronUp } from 'lucide-react';

// Helper to decode URI component safely
const safeDecodeURIComponent = (str) => {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str; // Return original string if decoding fails
  }
};

// The core redesigned component for recent items
const RedesignedRecentItems = ({
  displayedHistory,
  markedItems,      // Set of APP_IDs for pinned items
  currentAppId,     // APP_ID of the currently active/selected item
  handleSelectChange, // (appId) => void, for selecting an item
  togglePin,          // (appId, event) => void, for pinning/unpinning
  toggleShowAll,
  showAllHistory,
  hasMoreItems,
}) => {
  return (
    // Main container for the "Recent" section with GitHub-like panel styling
    <div  style={{height:'80vh'}} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 py-3 px-2 font-sans">
      {/* Section Heading */}
      <p className="px-1 pt-1 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Recent
      </p>
      {/* List of history items */}
      <div className="space-y-1">
        {displayedHistory.map((item, index) => {
          const isActive = item.APP_ID === currentAppId;
          const isPinnedByMark = markedItems.has(item.APP_ID);
          const isPinIconFilled = isPinnedByMark || (index === 0 && markedItems.size === 0);

          return (
            <div
              key={item.APP_ID} 
              className={`
                flex items-center w-full space-x-2 
                py-1.5 px-2 rounded-md cursor-pointer group
                transition-colors duration-150 ease-in-out
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 dark:focus-within:ring-offset-gray-800
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-600/30 border-l-2 border-blue-500 dark:border-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/60'
                }
              `}
              onClick={() => handleSelectChange(item.APP_ID)}
              tabIndex={0} // Make div focusable
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectChange(item.APP_ID);}}
            >
              {/* Pin button and icon */}
              <button
                onClick={(event) => togglePin(item.APP_ID, event)}
                className={`
                  p-0.5 rounded-md flex-shrink-0
                  transition-opacity duration-150
                  hover:bg-gray-200 dark:hover:bg-gray-600
                  focus:outline-none focus:ring-1 focus:ring-blue-500
                  ${isPinIconFilled ? 'opacity-100' : 'opacity-50 group-hover:opacity-100 focus:opacity-100'}
                `}
                aria-label={isPinnedByMark ? "Unpin item" : "Pin item"}
              >
                <Pin
                  size={16}
                  className={
                    isPinIconFilled
                      ? 'text-amber-500 dark:text-amber-400 fill-amber-500/20 dark:fill-amber-400/20'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }
                  aria-hidden="true"
                />
              </button>
              {/* Item Title */}
              <span  style={{fontSize:'13px'}} className={`
                text-sm truncate flex-grow
                ${isActive
                  ? 'text-blue-700 dark:text-blue-200 font-medium'
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                }
              `}>
                {safeDecodeURIComponent(item.id)}
              </span>
            </div>
          );
        })}
      </div>
      {/* More/Less Button */}
      {hasMoreItems && (
        <button
          className="mt-3 w-full flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800"
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
        </button>
      )}
    </div>
  );
};

const SideMenu = ({initialHistoryLimit=5,initialHistory=[],AppId=""}) => {
  

  const [fullHistory, setFullHistory] = useState(initialHistory);
  const [displayedHistory, setDisplayedHistory] = useState(fullHistory.slice(0, initialHistoryLimit));
  const [markedItems, setMarkedItems] = useState(new Set(['app2'])); // 'app2' is pinned by default
  const [currentAppId, setCurrentAppId] = useState(AppId); // 'app1' is currently selected by default
  const [showAllHistory, setShowAllHistory] = useState(false);

  const hasMoreItems = fullHistory.length > initialHistoryLimit;

  // Handler for selecting an item
  const handleSelectChange = (appId) => {
    setCurrentAppId(appId);
    console.log("Selected App ID:", appId);
    // In a real application, this would typically navigate or load content
  };

  // Handler for toggling the pinned state of an item
  const togglePin = (appId, event) => {
    event.stopPropagation(); // Prevent handleSelectChange from firing when pin is clicked
    setMarkedItems(prevMarkedItems => {
      const newMarkedItems = new Set(prevMarkedItems);
      if (newMarkedItems.has(appId)) {
        newMarkedItems.delete(appId);
      } else {
        newMarkedItems.add(appId);
      }
      return newMarkedItems;
    });
  };

  // Handler for toggling between showing all items and a limited number
  const toggleShowAll = () => {
    setShowAllHistory(prevShowAll => {
      const newShowAll = !prevShowAll;
      if (newShowAll) {
        setDisplayedHistory(fullHistory);
      } else {
        setDisplayedHistory(fullHistory.slice(0, initialHistoryLimit));
      }
      return newShowAll;
    });
  };
  
  // Effect to update displayed history if fullHistory changes (e.g. items added/removed)
  useEffect(() => {
    if (showAllHistory) {
      setDisplayedHistory(fullHistory);
    } else {
      setDisplayedHistory(fullHistory.slice(0, initialHistoryLimit));
    }
  }, [fullHistory, showAllHistory, initialHistoryLimit]);


  return (
    <div className=" bg-gray-100 dark:bg-black min-h-screen" >
      <div className="w-full ">
       

        <RedesignedRecentItems
          displayedHistory={displayedHistory}
          markedItems={markedItems}
          currentAppId={currentAppId}
          handleSelectChange={handleSelectChange}
          togglePin={togglePin}
          toggleShowAll={toggleShowAll}
          showAllHistory={showAllHistory}
          hasMoreItems={hasMoreItems}
        />
      </div>
    </div>
  );
};

export default SideMenu;
