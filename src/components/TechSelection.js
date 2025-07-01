import React, { useState, useEffect } from 'react';
import './TechSelection.css';
import BluePrint from './blueprint'

const TechSelection = ({ requirements, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);



  const formatSelectionsToString = (allCollectedAnswers) => {
let answers = []

allCollectedAnswers.map((categoryData, catIdx) => {
            if (categoryData.answers.length === 0) return null;
            answers = [...answers,...categoryData.answers.map((item,idx) => (
                    `Question: ${item.question}\nAnswer: ${item.answer}\n
========================================================================= \n  `
                  ))]  })

return answers.join('\n')
    
    
  };

  const handleStepComplete = (option) => {
      onSuccess(formatSelectionsToString(option));
      setIsVisible(false);
      setIsProcessing(false);
  };

 



  return (
 
 <BluePrint initialBlueprintData={requirements} handleStepComplete={handleStepComplete} />

  );
};

export default TechSelection;