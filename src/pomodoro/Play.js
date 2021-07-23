import React from "react";
import classNames from "../utils/class-names";

function Play({ playPause, isTimerRunning }) {
    return (
        <button
        type="button"
        className="btn btn-primary"
        data-testid="play-pause"
        title="Start or pause timer"
        onClick={playPause}
      >
        <span
          className={classNames({
            oi: true,
            "oi-media-play": !isTimerRunning,
            "oi-media-pause": isTimerRunning,
          })}
        />
      </button>
    )
}

export default Play;