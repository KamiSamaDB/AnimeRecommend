import React from 'react';
import './GradientBorder.css';

const GradientBorder = ({ 
  children, 
  className = "",
  animate = true,
  borderWidth = "2px",
  borderRadius = "22px"
}) => {
  return (
    <div 
      className={`gradient-border-container ${animate ? 'animate' : ''} ${className}`}
      style={{
        '--border-width': borderWidth,
        '--border-radius': borderRadius
      }}
    >
      <div className="gradient-border-content">
        {children}
      </div>
    </div>
  );
};

export default GradientBorder;