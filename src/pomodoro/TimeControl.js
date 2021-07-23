import React from "react";

function TimeControl({
  sessionType,
  handleDecrease,
  handleIncrease,
  disabled,
}) {
  return (
    <div className="input-group-append">
      <button
        type="button"
        className="btn btn-secondary"
        data-testid={"decrease-" + sessionType}
        onClick={handleDecrease}
        disabled={disabled}
      >
        <span className="oi oi-minus" />
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        data-testid={"increase-" + sessionType}
        onClick={handleIncrease}
        disabled={disabled}
      >
        <span className="oi oi-plus" />
      </button>
    </div>
  );
}

export default TimeControl;
