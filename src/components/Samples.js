import React from 'react';
import { NotebookPen, ListTodo, Layout, UserPlus, Calculator } from 'lucide-react'; // Importing icons from lucide-react

// Define an array of button configurations
const buttons = [
 { id: 'simple-notes', text: 'Simple Notes Web App', Icon: NotebookPen }, 
  { id: 'task-manager', text: 'Task Manager App', Icon: ListTodo }, 
  { id: 'landing-page', text: 'Landing Page', Icon: Layout },
  { id: 'sign-up-form', text: 'Sign Up Form', Icon: UserPlus },
  { id: 'calculate-factorial', text: 'React Calculator', Icon: Calculator },
];

// Functional React component for the button panel
const Samples = ({updateState }) => {
  const handleButtonClick = (text) => {
    console.log('dfdf',text)
       updateState('documentFileName', "sample");
       updateState('content', 'Build a '+ text);
  };

  return (
    // Container for the button panel, centered with padding
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 p-1" style={{zIndex:1}}>
      {/* Map over the buttons array to render each button */}
      {buttons.map((button) => (
        <button
          key={button.id} style={{border:'1px solid silver'}}
          className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          onClick={() => handleButtonClick(button.text)} // Attach click handler
        >
          {/* Render the icon component */}
          <button.Icon className="mr-2 h-5 w-4" />
          <span className='text-sm'   >{button.text}</span>
        </button>
      ))}
    </div>
  );
};

export default Samples; 
