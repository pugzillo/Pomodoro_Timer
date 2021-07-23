import React from "react";

function Stop({ handleStop, isTimerRunning}) {
    return (
        <button
        type="button"
        className="btn btn-secondary"
        data-testid="stop"
        title="Stop the session"
        onClick={handleStop}
        disabled={!isTimerRunning}
      >
        <span className="oi oi-media-stop" />
      </button>
    )
}

export default Stop; 