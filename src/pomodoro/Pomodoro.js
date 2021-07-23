import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import { minutesToDuration } from "../utils/duration";
import ProgressBar from "./ProgressBar";
import TimeControl from "./TimeControl";
import Play from "./Play";
import Stop from "./Stop";
import SessionTitles from "./SessionTitles";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // Allow the user to adjust the focus and break duration.
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  const handleStop = () => {
    // resets timer to inital state
    if (session) {
      setIsTimerRunning(false);
      setSession(null);
    }
  };

  // Click handlers for time control
  const handleFocusDecrease = () => {
    setFocusDuration((currentDuration) => Math.max(5, currentDuration - 5));
  };

  const handleFocusIncrease = () => {
    setFocusDuration((currentDuration) => Math.min(60, currentDuration + 5));
  };

  const handleBreakDecrease = () => {
    setBreakDuration((currentDuration) => Math.max(1, currentDuration - 1));
  };

  const handleBreakIncrease = () => {
    setBreakDuration((currentDuration) => Math.min(15, currentDuration + 1));
  }; 

  const percentTime =
    (1 -
      session?.timeRemaining /
        (session?.label === "Focusing"
          ? focusDuration * 60
          : breakDuration * 60)) *
    100;

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <TimeControl
              sessionType="focus"
              handleDecrease={handleFocusDecrease}
              handleIncrease={handleFocusIncrease}
              disabled={isTimerRunning}
            />
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <TimeControl
                sessionType="break"
                handleDecrease={handleBreakDecrease}
                handleIncrease={handleBreakIncrease}
                disabled={isTimerRunning}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <Play playPause={playPause} isTimerRunning={isTimerRunning} />
            <Stop handleStop={handleStop} isTimerRunning={isTimerRunning} />
          </div>
        </div>
      </div>
      {/* Displays only when there is a session*/}
      {session && (
        <div>
          <div className="row mb-2">
            <SessionTitles
              session={session}
              focusDuration={focusDuration}
              breakDuration={breakDuration}
            />
          </div>
          <div className="row mb-2">
            <div className="col">
              <ProgressBar percentTime={percentTime} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pomodoro;
