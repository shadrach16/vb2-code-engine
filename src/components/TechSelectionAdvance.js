import React, { useState, useEffect } from 'react';
// import './TechSelection.css';
import PRDCANVAS from '../prd_canvas_app/App'

const TechSelection = ({ requirements, onSuccess,structure }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

 

  const formatSelectionsToString = (finalSelections) => {
    let result = "Additional Important & Required Notes :\n\n";

    for (const componentName in finalSelections) {
      if (Object.hasOwnProperty.call(finalSelections, componentName)) {
        const selectedOption = finalSelections[componentName];
        result += `\t${componentName}:\n`;
        result += `\t${selectedOption || 'Not Selected'}.\n\n`;
      }
    }
    return result;
  };

  const handleStepComplete = (option) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const currentComponentName = requirements[currentStep].component_name || requirements[currentStep].description;
    const updatedSelections = {
      ...selections,
      [currentComponentName]: option,
    };
    setSelections(updatedSelections);

    const nextStep = currentStep + 1;

    if (nextStep < requirements.length) {
      setCurrentStep(nextStep);
      setIsProcessing(false);
    } else {
      onSuccess(formatSelectionsToString(updatedSelections));
      setIsVisible(false);
      setIsProcessing(false);
    }
  };
 
 
   
 

  return (
    <PRDCANVAS initialIdea={structure} />
  );
};

export default TechSelection;