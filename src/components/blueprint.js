import React, { useState, useEffect, useCallback } from 'react';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Key, Settings  } from 'lucide-react';


// --- Utility Functions ---
const questionUtils = {
  getQuestionPath: (categoryIdx, questionIdx, followUpIdx = null) => {
    let path = `${categoryIdx}.${questionIdx}`;
    if (followUpIdx !== null) {
      path += `.followUp.${followUpIdx}`;
    }
    return path;
  },

  checkFollowUpCondition: (answer, condition, options) => {
    if (!condition) return true; // No condition, always show follow-up

    if (condition.startsWith("If ")) {
      const targetString = condition.substring(3).trim();
      if (targetString === "Yes") return answer === true;
      if (targetString === "No") return answer === false;
      if (targetString.endsWith(" selected")) {
        const selectedOption = targetString.replace(" selected", "").slice(1, -1);
        if (Array.isArray(answer)) return answer.includes(selectedOption);
        if (options && options.includes(selectedOption)) return answer === selectedOption;
      }
    }
    return false;
  },

  collectAllAnswers: (categories, answers) => {
    let allCollected = [];
    categories.forEach((category, catIdx) => {
      let categoryAnswers = [];
      const collect = (questions, currentCategoryIdx, parentMainQuestionPath = null, isFollowUpCollection = false) => {
        questions.forEach((q, qIdx) => {
          // If this is a follow-up collection, qIdx is the followUpIdx.
          // parentMainQuestionPath is the path of the main question these follow-ups belong to.
          const path = isFollowUpCollection
            ? questionUtils.getQuestionPath(currentCategoryIdx, parseInt(parentMainQuestionPath.split('.')[1]), qIdx)
            : questionUtils.getQuestionPath(currentCategoryIdx, qIdx);
          
          const answer = answers[path];

          if (answer !== undefined) {
            categoryAnswers.push({
              question: q.question,
              answer: Array.isArray(answer) ? answer.join(', ') : String(answer),
              path: path,
              categoryName: category.name,
              categoryDescription: category.description,
            });

            // If the current question 'q' (which could be a main question) has follow-ups
            if (!isFollowUpCollection && q.follow_up_questions && q.follow_up_questions.length > 0) {
              const conditionMet = questionUtils.checkFollowUpCondition(answer, q.follow_up_condition, q.options);
              if (conditionMet) {
                 // 'path' here is the main question's path
                 collect(q.follow_up_questions, currentCategoryIdx, path, true);
              }
            }
          }
        });
      };
      collect(category.questions, catIdx); // Initial call for main questions
      if (categoryAnswers.length > 0) {
        allCollected.push({
          categoryName: category.name,
          description: category.description,
          answers: categoryAnswers,
        });
      }
    });
    return allCollected;
  },
};

// --- Custom Hook for Questionnaire Logic ---
const useQuestionnaire = (initialCategories) => {
  const [categories, setCategories] = useState(initialCategories || []);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index for main questions
  const [answers, setAnswers] = useState({});
  const [completedCategories, setCompletedCategories] = useState([]);

  useEffect(() => {
    setCategories(initialCategories || []);
    setCurrentCategoryIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCompletedCategories([]);
  }, [initialCategories]);

  const currentCategory = categories[currentCategoryIndex];

  const getCurrentQuestionAndPath = useCallback(() => {
    if (!currentCategory) return { question: null, path: null, isFollowUp: false, mainQuestionIndex: currentQuestionIndex };

    const mainQuestion = currentCategory.questions[currentQuestionIndex];
    if (!mainQuestion) return { question: null, path: null, isFollowUp: false, mainQuestionIndex: currentQuestionIndex };

    const mainPath = questionUtils.getQuestionPath(currentCategoryIndex, currentQuestionIndex);
    const mainAnswer = answers[mainPath];

    // If main question isn't answered, it's the current question
    if (mainAnswer === undefined && mainQuestion.type !== 'Prioritization') { // Prioritization can be "empty"
      return { question: mainQuestion, path: mainPath, isFollowUp: false, mainQuestionIndex: currentQuestionIndex };
    }

    // If main question has follow-ups and condition is met, check them
    if (mainQuestion.follow_up_questions && mainQuestion.follow_up_questions.length > 0) {
      const conditionMet = questionUtils.checkFollowUpCondition(mainAnswer, mainQuestion.follow_up_condition, mainQuestion.options);
      if (conditionMet) {
        for (let j = 0; j < mainQuestion.follow_up_questions.length; j++) {
          const followUpQuestion = mainQuestion.follow_up_questions[j];
          const followUpPath = questionUtils.getQuestionPath(currentCategoryIndex, currentQuestionIndex, j);
          if (answers[followUpPath] === undefined && followUpQuestion.type !== 'Prioritization') {
            return { question: followUpQuestion, path: followUpPath, isFollowUp: true, mainQuestionIndex: currentQuestionIndex };
          }
        }
      }
    }
    // If all follow-ups are answered or no relevant follow-ups, the main question is effectively the current one to move past
    return { question: mainQuestion, path: mainPath, isFollowUp: false, mainQuestionIndex: currentQuestionIndex };
  }, [categories, currentCategory, currentCategoryIndex, currentQuestionIndex, answers]);

  const { question: actualCurrentQuestion, path: actualCurrentQuestionPath, isFollowUp: actualIsFollowUp, mainQuestionIndex: actualMainQuestionIndex } = getCurrentQuestionAndPath();

  const handleAnswerChange = useCallback((value, path) => {
    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers, [path]: value };
      const pathParts = path.split('.');
      if (pathParts.length === 2) { // Main question path: "catIdx.qIdx"
        const categoryIdx = parseInt(pathParts[0]);
        const questionIdx = parseInt(pathParts[1]);
        const question = categories[categoryIdx]?.questions[questionIdx];

        if (question && question.follow_up_questions) {
          const conditionMet = questionUtils.checkFollowUpCondition(value, question.follow_up_condition, question.options);
          if (!conditionMet) {
            question.follow_up_questions.forEach((_, fuIdx) => {
              const followUpPath = questionUtils.getQuestionPath(categoryIdx, questionIdx, fuIdx);
              delete newAnswers[followUpPath];
            });
          }
        }
      }
      return newAnswers;
    });
  }, [categories]);

  const handleNext = useCallback(() => {
    if (!currentCategory || !actualCurrentQuestionPath || !actualCurrentQuestion) {
        toast.error("Cannot proceed, current question not identified.");
        return;
    }
    
    if (answers[actualCurrentQuestionPath] === undefined && actualCurrentQuestion.type !== 'Prioritization') {
        toast.error("Please answer the current question before proceeding or skip it.");
        return;
    }

    // Check if there are subsequent unanswered follow-ups for the current main question
    const mainQuestion = currentCategory.questions[actualMainQuestionIndex];
    if (mainQuestion && mainQuestion.follow_up_questions && mainQuestion.follow_up_questions.length > 0) {
        const mainAnswer = answers[questionUtils.getQuestionPath(currentCategoryIndex, actualMainQuestionIndex)];
        const conditionMet = questionUtils.checkFollowUpCondition(mainAnswer, mainQuestion.follow_up_condition, mainQuestion.options);
        
        if (conditionMet) {
            // Start checking from the beginning of follow-ups, or after current if on a follow-up
            let startFollowUpCheckIndex = 0;
            if(actualIsFollowUp) {
                const currentFollowUpIndex = parseInt(actualCurrentQuestionPath.split('.').pop());
                startFollowUpCheckIndex = currentFollowUpIndex + 1;
            }

            for (let j = startFollowUpCheckIndex; j < mainQuestion.follow_up_questions.length; j++) {
                const followUpPath = questionUtils.getQuestionPath(currentCategoryIndex, actualMainQuestionIndex, j);
                if (answers[followUpPath] === undefined && mainQuestion.follow_up_questions[j].type !== 'Prioritization') {
                    // Found next unanswered follow-up. State update (answering current) will trigger re-render,
                    // and getCurrentQuestionAndPath should pick this one. So, just return.
                    return; 
                }
            }
        }
    }

    // If all follow-ups for the current main question are answered or not applicable, move to the next main question
    if (actualMainQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else { // Move to next category
      if (currentCategoryIndex < categories.length - 1) {
        setCompletedCategories(prev => [...new Set([...prev, currentCategoryIndex])]);
        setCurrentCategoryIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setCompletedCategories(prev => [...new Set([...prev, currentCategoryIndex])]);
        // alert("All categories completed!"); // Removed alert, submit button will appear
      }
    }
  }, [currentCategory, categories, currentCategoryIndex, actualMainQuestionIndex, answers, actualCurrentQuestionPath, actualCurrentQuestion, actualIsFollowUp]);

  const handlePrevious = useCallback(() => {
    if (actualIsFollowUp) {
        setCurrentQuestionIndex(actualMainQuestionIndex); 
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentCategoryIndex > 0) {
      const prevCatIdx = currentCategoryIndex - 1;
      setCompletedCategories(prev => prev.filter(idx => idx !== prevCatIdx)); // Mark as not complete for progress bar
      setCurrentCategoryIndex(prevCatIdx);
      setCurrentQuestionIndex(categories[prevCatIdx].questions.length - 1);
    }
  }, [actualIsFollowUp, actualMainQuestionIndex, currentQuestionIndex, currentCategoryIndex, categories, setCompletedCategories, setCurrentQuestionIndex, setCurrentCategoryIndex]);
  
 const handleSkip = useCallback(() => {
    if (actualCurrentQuestionPath) {
      setAnswers(prev => {
        const newAnswers = {...prev};
        // Delete current question's answer
        delete newAnswers[actualCurrentQuestionPath];
        
        // If skipping a main question, also clear its follow-ups' answers
        const pathParts = actualCurrentQuestionPath.split('.');
        const catIdx = parseInt(pathParts[0]);
        const mainQIdx = parseInt(pathParts[1]);

        if (!actualIsFollowUp) { // Current is a main question
            const mainQ = categories[catIdx]?.questions[mainQIdx];
            if (mainQ?.follow_up_questions) {
                mainQ.follow_up_questions.forEach((_, fuIdx) => {
                    delete newAnswers[questionUtils.getQuestionPath(catIdx, mainQIdx, fuIdx)];
                });
            }
        }
        return newAnswers;
      });
    }

    // After clearing answer(s), advance to the next logical main question or category
    // This logic assumes skipping a follow-up means skipping all subsequent follow-ups of that main question too.
    if (actualMainQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(actualMainQuestionIndex + 1);
    } else { 
      if (currentCategoryIndex < categories.length - 1) {
        setCompletedCategories(prev => [...new Set([...prev, currentCategoryIndex])]);
        setCurrentCategoryIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setCompletedCategories(prev => [...new Set([...prev, currentCategoryIndex])]);
        // alert("Skipped. End of questionnaire."); // Removed alert
      }
    }
  }, [actualCurrentQuestionPath, categories, currentCategory, currentCategoryIndex, actualMainQuestionIndex, actualIsFollowUp, setAnswers, setCurrentQuestionIndex, setCurrentCategoryIndex, setCompletedCategories]);


  const goToCategory = useCallback((catIdx) => {
    if (catIdx < categories.length && (catIdx <= currentCategoryIndex || completedCategories.includes(catIdx))) {
        setCurrentCategoryIndex(catIdx);
        setCurrentQuestionIndex(0); 
    }
  }, [categories, currentCategoryIndex, completedCategories]);

  return {
    categories,
    currentCategory,
    currentCategoryIndex,
    actualCurrentQuestion,
    actualCurrentQuestionPath,
    actualIsFollowUp,
    actualMainQuestionIndex,
    answers,
    completedCategories,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    handleSkip,
    goToCategory,
    questionUtils
  };
};


// --- Child Components ---

const AnswerInput = React.memo(({ question, path, value, onChange }) => {
  const baseInputClasses = "w-full p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out font-inter";

  switch (question.type) {
    case 'Open-ended':
    case 'Input (text)':
      return (
        <textarea
          className={`${baseInputClasses} resize-y min-h-[250px] sm:min-h-[250px]`}
          rows="4" style={{    minHeight: '45vh',
    background: '#eeeeee3d'
}}
          value={value || ''}
          onChange={(e) => onChange(e.target.value, path)}
          placeholder={question.placeholder || "Type your answer here..."}
        />
      );
    case 'Input (numeric)':
      return (
        <input
          type="number"
          className={baseInputClasses}
          value={value || ''}
          onChange={(e) => onChange(e.target.value, path)}
          placeholder={question.placeholder || "Enter a number"}
        />
      );
    case 'Yes/No':
      return (
        <div className="flex flex-col space-y-3">
          {['Yes', 'No'].map(option => (
            <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                name={path}
                value={option === 'Yes'}
                checked={value === (option === 'Yes')}
                onChange={() => onChange(option === 'Yes', path)}
              />
              <span className="ml-3 text-gray-800 font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    case 'Multiple Choice': // Checkbox
      return (
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                value={option}
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(e) => {
                  const currentAnswers = Array.isArray(value) ? value : [];
                  const newSelectedOptions = e.target.checked
                    ? [...currentAnswers, option]
                    : currentAnswers.filter(item => item !== option);
                  onChange(newSelectedOptions, path);
                }}
              />
              <span className="ml-3 text-gray-800 font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    case 'Prioritization': // Multi-select
      return (
        <select
          className={`${baseInputClasses} h-auto min-h-[250px] `} style={{minHeight:"45vh"}}
          multiple={true}
          value={Array.isArray(value) ? value : []}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
            onChange(selectedOptions, path);
          }}
        >
          <option value="" disabled className="text-gray-500">Select one or more (Ctrl/Cmd + Click)</option>
          <hr className='my-2' style={{background:'silver'}} />
          {question.options && question.options.map((option, idx) => (
            <option key={idx} value={option} className="p-2 hover:bg-blue-100">{option}</option>
          ))}
        </select>
      );
    default:
      return <p className="text-red-500 font-inter">Unsupported question type: {question.type}</p>;
  }
});

const QuestionBlock = React.memo(({
  question,
  qIdentifier, 
  categoryIndex,
  isFollowUp,
  answers,
  onAnswerChange,
  utils,
  mainQuestionIndex,
  mainQuestionText // Added prop
}) => {
  const path = isFollowUp
    ? utils.getQuestionPath(categoryIndex, mainQuestionIndex, qIdentifier) 
    : utils.getQuestionPath(categoryIndex, qIdentifier); 

  const currentAnswer = answers[path];
  const showFollowUps = !isFollowUp && question.follow_up_questions && question.follow_up_questions.length > 0 &&
    utils.checkFollowUpCondition(currentAnswer, question.follow_up_condition, question.options);

  return (
    <div key={path} className={`mb-6 ${isFollowUp ? 'ml-6 pl-6 border-l-2 border-blue-200' : 'p-4 sm:p-6 bg-white rounded-xl  '}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-start">
        <div>
          <label style={{lineHeight:'2.2rem'}} className={` mt-3 pr-10 block text-lg sm:text-xl font-semibold mb-2 ${isFollowUp ? 'text-blue-700' : 'text-gray-800'} font-inter leading-relaxed`}>
            {isFollowUp ? `↪ ` : `${qIdentifier + 1}) `} {question.question}
          </label>
          {question.description && !isFollowUp && (
            <p className="text-sm text-gray-500 mb-3 font-inter">{question.description}</p>
          )}
           {isFollowUp && mainQuestionText && <p className="text-xs text-gray-500 mb-2 font-inter">(Follow-up to: "{mainQuestionText.substring(0,40)}...")</p>}
        </div>
        <div className="w-full ">
          <AnswerInput
            question={question}
            path={path}
            value={currentAnswer}
            onChange={onAnswerChange}
          />
        </div>
      </div>

      {showFollowUps && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Follow-up Questions:</h4>
          {question.follow_up_questions.map((fuQ, fuIdx) => (
            <QuestionBlock
              key={`${path}.followUp.${fuIdx}`} 
              question={fuQ}
              qIdentifier={fuIdx} 
              categoryIndex={categoryIndex}
              isFollowUp={true}
              answers={answers}
              onAnswerChange={onAnswerChange}
              utils={utils}
              mainQuestionIndex={qIdentifier} 
              mainQuestionText={question.question} // Pass current main question's text
            />
          ))}
        </div>
      )}
    </div>
  );
});

const QuestionnaireNavigation = React.memo(({ categories, currentCategoryIndex, completedCategories, onCategoryClick }) => {
  if (!categories || categories.length === 0) return null;
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex justify-between items-center relative mb-2 px-2 sm:px-0">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2 mx-4 sm:mx-8 z-0">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((completedCategories.includes(currentCategoryIndex) ? completedCategories.length : completedCategories.length +1 ) / categories.length) * 100}%` }}

            ></div>
        </div>
        {categories.map((category, idx) => (
          <div
            key={idx}
            className="relative z-10 flex flex-col items-center cursor-pointer transition-transform duration-300 w-1/6 sm:w-auto"
            onClick={() => onCategoryClick(idx)}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-lg shadow-md transition-all duration-300 ease-in-out
                ${completedCategories.includes(idx)
                  ? 'bg-gradient-to-br from-green-500 to-green-700'
                  : idx === currentCategoryIndex
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-blue-200'
                    : 'bg-gray-400'
                }`}
            >
              {completedCategories.includes(idx) ? (
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              ) : (
                idx + 1
              )}
            </div>
            <p className={`mt-2 text-xs sm:text-sm text-center font-medium truncate w-20 sm:w-32 ${idx === currentCategoryIndex ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

const ActionButtons = React.memo(({ onPrevious, onSkip, onNext, onPreview, disablePrevious, disableNext, showSubmit }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center align-end space-y-3 sm:space-y-0 sm:space-x-3">
      <button
        type="button"
        onClick={onPrevious}
        disabled={disablePrevious}
        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg  hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg  hover:bg-blue-200 disabled:opacity-50 transition-colors"
      >
        Skip
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disableNext && !showSubmit} // Next is disabled if it's the last step and answered, unless it's submit
        className="w-full sm:w-auto px-6 py-3 text-sm font-semibold  bg-gray-200  text-gray-700 rounded-lg  hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {showSubmit ? 'Finish & View Summary' : 'Next'}
      </button>
      <button
        type="button"
        onClick={onPreview}
        className=" button button-primary button-rounded w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center"
      >
        Preview Answers
        <svg className='ml-2 w-4 h-4' fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
});

const PreviewModal = ({ show, onClose, categories, answers, utils, handleStepComplete }) => {
  if (!show) return null;

  const allCollectedAnswers = utils.collectAllAnswers(categories, answers);
  const hasAnswers = allCollectedAnswers.some(cat => cat.answers.length > 0);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 font-inter">
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl" >
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Blueprint Summary</h2>
            <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-3xl font-light transition-colors"
            >
            &times;
            </button>
        </div>

        <div style={{maxHeight:'67vh',  overflowX: 'hidden',overflowY: 'scroll'}}>

        {!hasAnswers ? (
          <p className="text-gray-600 text-center text-lg py-10">No questions have been answered yet. Start filling out the blueprint!</p>
        ) : (
          allCollectedAnswers.map((categoryData, catIdx) => {
            if (categoryData.answers.length === 0) return null;
            return (
              <div key={catIdx} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-blue-700 mb-3">{categoryData.categoryName}</h3>
                <ul className="space-y-3">
                  {categoryData.answers.map((item) => (
                    <li key={item.path} className="text-sm border-b border-gray-100 pb-2 last:border-b-0">
                      <p className="font-medium text-gray-700">{item.question}</p>
                      <p className="text-gray-600 italic ml-2 mt-0.5">Answer: <span className="font-normal not-italic">{item.answer}</span></p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
              </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto">
                {hasAnswers ? 'Continue Editing' : 'Close'}
            </button>
            {hasAnswers && (
                 <button
                    type="button"
                    onClick={() => {
                        handleStepComplete(allCollectedAnswers); 
                        onClose();
                    }}
                    className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                >
                    Submit & Generate
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = ({ initialBlueprintData, handleStepComplete = () => {} }) => {
  const {
    categories,
    currentCategory,
    currentCategoryIndex,
    actualCurrentQuestion,
    actualCurrentQuestionPath,
    actualIsFollowUp,
    actualMainQuestionIndex,
    answers,
    completedCategories,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    handleSkip,
    goToCategory,
    questionUtils: utils,
  } = useQuestionnaire(initialBlueprintData?.categories);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  if (!initialBlueprintData || !categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 font-inter p-4">
        <p className="text-xl text-gray-600 text-center">No blueprint data provided or data is invalid. Please load a valid blueprint.</p>
      </div>
    );
  }
  
  const isLastQuestionOfLastCategory = () => {
    if (!currentCategory || !actualCurrentQuestion) return false;

    const onLastCategory = currentCategoryIndex >= categories.length - 1;
    const onLastMainQuestionOfCategory = actualMainQuestionIndex >= currentCategory.questions.length - 1;

    if (!onLastCategory || !onLastMainQuestionOfCategory) return false;

    const mainQuestionForLastStep = categories[currentCategoryIndex].questions[actualMainQuestionIndex];
    
    if (!mainQuestionForLastStep.follow_up_questions || mainQuestionForLastStep.follow_up_questions.length === 0) {
      return true; 
    }

    const mainAnswerPath = utils.getQuestionPath(currentCategoryIndex, actualMainQuestionIndex);
    const mainAnswer = answers[mainAnswerPath];
    const conditionMet = utils.checkFollowUpCondition(mainAnswer, mainQuestionForLastStep.follow_up_condition, mainQuestionForLastStep.options);

    if (!conditionMet) {
      return true; 
    }

    if (actualIsFollowUp) {
        const followUpIndex = parseInt(actualCurrentQuestionPath.split('.').pop());
        return followUpIndex >= mainQuestionForLastStep.follow_up_questions.length - 1;
    } else {
        // On main question, but follow-ups exist and condition is met.
        // Check if all follow-ups are answered.
        for(let i=0; i < mainQuestionForLastStep.follow_up_questions.length; i++) {
            const fuPath = utils.getQuestionPath(currentCategoryIndex, actualMainQuestionIndex, i);
            if(answers[fuPath] === undefined && mainQuestionForLastStep.follow_up_questions[i].type !== 'Prioritization') return false; // An unanswered follow-up exists
        }
        return true; // All follow-ups are answered
    }
  };
  const isActuallyAtTheEnd = isLastQuestionOfLastCategory();
  const isCurrentQuestionAnswered = answers[actualCurrentQuestionPath] !== undefined || actualCurrentQuestion?.type === 'Prioritization';


  return (



   <div className="tech-selection-overlay p-4 mx-2 rounded-lg bg-white my-4 "
    style={{  minHeight:"70vh"}}>
      <div className="w-full "   style={{ backgroundColor:'white', minHeight:"80vh"}} >
        <div className="tech-selection-header">
          <h1 className="tech-selection-title text-gray-500">Refine your product..</h1>
          <p className="tech-selection-progress">
            <span className="font-semibold text-blue-700">{currentCategory?.name}</span> ({currentCategoryIndex + 1} of {categories.length})
          </p>
        </div>
        <QuestionnaireNavigation
          categories={categories}
          currentCategoryIndex={currentCategoryIndex}
          completedCategories={completedCategories}
          onCategoryClick={goToCategory}
        />
<hr className='my-0' style={{border:'0.5px solid silver'}} />
        
        <div style={{minHeight:"50vh"}} > 
            {currentCategory && actualCurrentQuestion ? (
            <div className="animate-fade-in"> 
            
                <QuestionBlock
                    key={`${currentCategoryIndex}-${actualMainQuestionIndex}-${actualIsFollowUp ? actualCurrentQuestionPath.split('.').pop() : 'main'}`}
                    question={actualCurrentQuestion}
                    qIdentifier={actualIsFollowUp ? parseInt(actualCurrentQuestionPath.split('.').pop()) : actualMainQuestionIndex}
                    categoryIndex={currentCategoryIndex}
                    isFollowUp={actualIsFollowUp}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    utils={utils}
                    mainQuestionIndex={actualMainQuestionIndex}
                    mainQuestionText={actualIsFollowUp ? categories[currentCategoryIndex].questions[actualMainQuestionIndex].question : null}
                />
            </div>
            ) : (
            <div className="text-center py-10">
                {currentCategoryIndex >= categories.length ? (
                 <>
                    <p className="text-xl text-green-600 font-semibold">You've completed all categories!</p>
                    <p className="text-gray-600 mt-2">Click "Preview Answers" to review or "Submit Blueprint".</p>
                 </>
                ) : (
                <p className="text-lg text-gray-500">Loading question...</p>
                )}
            </div>
            )}
        </div>

        <ActionButtons
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          onNext={isActuallyAtTheEnd && isCurrentQuestionAnswered ? () => setShowPreviewModal(true) : handleNext}
          onPreview={() => setShowPreviewModal(true)}
          disablePrevious={currentCategoryIndex === 0 && actualMainQuestionIndex === 0 && !actualIsFollowUp}
          disableNext={isActuallyAtTheEnd && !isCurrentQuestionAnswered} // Disable "Next" if it's the end and not answered
          showSubmit={isActuallyAtTheEnd && isCurrentQuestionAnswered}
        />
      </div>

      <PreviewModal
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        categories={categories}
        answers={answers}
        utils={utils}
        handleStepComplete={(data) => {
            console.log("Blueprint Submitted:", data);
            handleStepComplete(data); 
        }}
      />
    </div>
  );
};

 

export default App
