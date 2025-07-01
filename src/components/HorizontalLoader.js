import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import './HorizontalLoader.css'


const HorizontalLoader = ({ start = 0, current = 5, end = 10, label = "" }) => {
    // Ensure end is not equal to start to prevent division by zero
    const denominator = end - start;
    const initialProgress = denominator === 0 ? 0 : Math.max(0, Math.min(100, ((current - start) / denominator) * 100));

    const [progress, setProgress] = useState(initialProgress);

    // Update the progress state when current, start, or end changes
    useEffect(() => {
        const newDenominator = end - start;
        const newProgress = newDenominator === 0 ? 0 : Math.max(0, Math.min(100, ((current - start) / newDenominator) * 100));
        setProgress(newProgress);
    }, [current, start, end]); // Added start and end to dependencies

    // Define Framer Motion animation variants for width
    const progressBarVariants = {
        initial: { width: `${initialProgress}%` },
        animate: { width: `${progress}%` },
    };

    return (
        // Use a div with CSS class for the container
        <div className="horizontal-loader-container">
            {/* Use motion.div directly for the animated bar */}
            <motion.div
                className="progress-bar" // Use CSS class for base styles, gradient, and wave animation
                variants={progressBarVariants} // Use Framer Motion variants for width
                initial="initial" // Set initial state using variants
                animate="animate" // Animate to 'animate' state using variants
                transition={{ duration: 0.8, ease: "easeInOut" }} // Adjust transition duration/ease
            >
                 {/* The animated bar content */}
            </motion.div>

             {/* Use a span with CSS class for the label */}
             {/* Conditionally show label if progress is > 0 */}
            {progress > 0 && (
                <span className="loader-label">
                    {label} {progress.toFixed(0)}%
                 </span>
            )}
        </div>
    );
};

export default HorizontalLoader;