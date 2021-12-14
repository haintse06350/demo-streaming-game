import React, { useEffect, useState } from "react";
import StreamingView from "../appland/StreamingView";
import { StreamingController } from "streaming-view-sdk";
import { CircularProgress, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./styles.style";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { GameSessions } from "../models/gameSession";
import Timer from "./Timer";

const StreamingGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameSessionId = urlParams.get("gameSessionId");
  const edgeNodeId = urlParams.get("edgeNodeId");
  const userId = urlParams.get("userId");
  const volume = parseInt(urlParams.get("volume"));
  const gameName = urlParams.get("gameName");
  const startImmediately = urlParams.get("startImmediately") === "true";
  const showGameHeader = urlParams.get("showGameHeader") === "true";

  const [isStreamReady, setIsStreamReady] = useState(false);
  const [startPlayGame, setStartPlayGame] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [resetTime, setResetTime] = useState(false);
  const [score, setScore] = useState(0);
  const [gameSession, setGameSession] = useState({ gameSessionId, edgeNodeId });
  const navigate = useNavigate();

  const classes = useStyles();

  const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";

  const resumeStream = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: gameSession?.edgeNodeId,
    });
    await streamController.resume();
  };

  const pauseStream = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: gameSession?.edgeNodeId,
    });
    await streamController.pause();
  };

  const getDeviceInfo = async () => {
    const streamingController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
    });
    return JSON.stringify(await streamingController.getDeviceInfo());
  };

  const replayMoment = async () => {
    setScore(0);
    setGameSession(null);
    setIsReplay(true);
    const deviceInfo = await getDeviceInfo();
    const res = await GameSessions.playSoloMoment({
      gameSessionId: gameSession?.gameSessionId,
      device: { info: deviceInfo },
    });
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: res.edgeNodeId,
    });

    await streamController.pause();
    setGameSession(res);
  };

  const onStartGame = async () => {
    console.log("start game");
    setStartPlayGame(true);
    setIsReplay(false);
    await resumeStream();
  };

  const onStreamEvent = async (event, payload) => {
    if (event === StreamingController.EVENT_STREAM_READY) {
      console.log("stream ready");
      setIsStreamReady(true);
    } else if (event === "stream-video-can-play") {
      setIsStreamReady(true);
      if (!startImmediately || isReplay) {
        pauseStream();
      } else {
        resumeStream();
      }
    } else if (event === "moment-detector-event") {
      const payloadParsed = JSON.parse(payload.payload);
      let currentScore;
      let stateIdFromPayload;
      switch (payloadParsed?.event_type) {
        case "score":
          currentScore = Math.floor(payloadParsed?.data?.score);
          stateIdFromPayload = payloadParsed?.data?.stateId;
          // setStateId(stateIdFromPayload);
          if (currentScore) {
            setScore(currentScore);
          }
          break;
        case "calculate":
          setIsEnd(true);
          setStartPlayGame(false);
          setIsStreamReady(false);
          setResetTime(true);
          break;
        case "final_score":
          break;
      }
    }
  };

  const gameHeader = () => {
    return (
      <div className={classes.gameHeader}>
        <div
          className={classes.backIcon}
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
        </div>
        <div className={classes.score}>
          <Typography variant="h4">{score}</Typography>
          <Timer isPause={!startPlayGame} resetTime={resetTime} />
        </div>
        <div className={classes.replay} onClick={replayMoment}>
          <SettingsBackupRestoreIcon />
        </div>
      </div>
    );
  };

  const showPlayButton =
    (isStreamReady && !startPlayGame && !startImmediately && gameSession) ||
    (isReplay && gameSession && isStreamReady);
  const showReplayButton = isEnd && !startPlayGame && !isReplay;

  return (
    <div className={classes.gamePanel}>
      {Array.from(new Array(10)).map((o, index) => (
        <img
          id={index}
          className={classes.gameImg}
          src={`https://assets.onmostealth.com/assets/games/152144/GameInfo/Image_750x522.png?v=${Date.now()}`}
        />
      ))}
      {showGameHeader && gameHeader()}
      {!isStreamReady && !isEnd && (
        <div className={classes.loading}>
          <Typography variant="h6">Loading {gameName}...</Typography>
        </div>
      )}
      {showPlayButton && (
        <div className={classes.startGamePanel}>
          <Button
            variant="contained"
            className={classes.startGameButton}
            onClick={onStartGame}
          >
            Play
          </Button>
        </div>
      )}
      {showReplayButton && (
        <div className={classes.startGamePanel}>
          <Button
            variant="contained"
            className={classes.replayButton}
            onClick={replayMoment}
          >
            RePlay this moment
          </Button>
          <Button
            className={classes.backButton}
            variant="contained"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
        </div>
      )}
      {isReplay && !isStreamReady && (
        <div className={classes.loading}>
          <CircularProgress size={30} />
          <Typography variant="subtitle1">Loading {gameName}...</Typography>
        </div>
      )}
      <div className={classes.streamingView}>
        {gameSession && (
          <StreamingView
            key={gameSession.gameSessionId}
            userClickedPlayAt={new Date().getTime()}
            apiEndpoint={STREAM_ENDPOINT}
            edgeNodeId={gameSession.edgeNodeId}
            userId={userId}
            enableControl={true}
            enableDebug={false}
            enableFullScreen={false}
            muted={false}
            volume={volume || 0}
            onEvent={(evt, payload) => onStreamEvent(evt, payload)}
          ></StreamingView>
        )}
      </div>
    </div>
  );
};

export default StreamingGame;
