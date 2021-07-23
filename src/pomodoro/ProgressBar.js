import React from "react";

function ProgressBar({ percentTime }) {
  return (
    <div className="progress" style={{ height: "20px" }}>
      <div
        className="progress-bar progress-bar-striped"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percentTime} 
        style={{ width: percentTime + "%" }} 
      />
    </div>
  );
}

export default ProgressBar;
