import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

export const Timer = (props) => {
  const { isPause, resetTime } = props;
  const [currentTime, setcurrentTime] = useState(0);

  const convertTotalTimePlayed = (timePlayed) => {
    let mins = Math.floor(timePlayed / 1000 / 60);
    if (mins < 10) {
      mins = "0" + mins;
    }
    let secs = Math.floor((timePlayed / 1000) % 60);
    if (secs < 10) {
      secs = "0" + secs;
    }
    return mins + " : " + secs;
  };

  const requestProgress = () => {
    if (!isPause) {
      const timer = setInterval(() => {
        setcurrentTime(currentTime + 1000);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  };

  useEffect(() => {
    resetTime && setcurrentTime(0);
  }, [resetTime]);

  useEffect(requestProgress, [currentTime, isPause]);

  return (
    <Typography data-testid="span-time">
      {convertTotalTimePlayed(currentTime)}
    </Typography>
  );
};

export default Timer;
