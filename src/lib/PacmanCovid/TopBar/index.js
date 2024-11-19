import React from "react";
import PropTypes from "prop-types";

export default function TopBar({ ...props }) {
  const { score, strategy } = props;

  return (
    <div className="pacmancovid-topbar">
      <span className="running-score">Score: {score}</span>
      <br />
      <span>Strategy: {strategy}</span>
    </div>
  );
}

TopBar.propTypes = {
  lost: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
};
