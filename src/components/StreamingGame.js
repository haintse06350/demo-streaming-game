import React, { useEffect, useState } from "react";
import StreamingView from "../appland/StreamingView";
import { StreamingController } from "streaming-view-sdk";
import Button from "@mui/material/Button";
import { useStyles } from "./styles.style";

const StreamingGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameSessionId = urlParams.get("gameSessionId");
  const edgeNodeId = urlParams.get("edgeNodeId");
  const userId = urlParams.get("userId");
  const volume = parseInt(urlParams.get("volume"));
  const gameName = urlParams.get("gameName");
  const startImmediately = urlParams.get("startImmediately") === "true";

  const [isStreamReady, setIsStreamReady] = useState(false);
  const [startPlayGame, setStartPlayGame] = useState(false);
  const classes = useStyles();

  const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";

  const resumeStream = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId,
    });
    streamController.resume();
  };

  const pauseStream = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId,
    });
    streamController.pause();
  };

  const onStartGame = async () => {
    console.log("start gane");
    setStartPlayGame(true);
    await resumeStream();
  };
  console.log("startImmediately", startImmediately);
  const onStreamEvent = async (event, payload) => {
    if (event === StreamingController.EVENT_STREAM_READY) {
      console.log("stream ready");
      setIsStreamReady(true);
    } else if (event === "stream-video-can-play") {
      setIsStreamReady(true);
      if (!startImmediately) {
        pauseStream();
      } else {
        resumeStream();
      }
    }
  };

  return (
    <div className={classes.gamePanel}>
      {!isStreamReady && <p>Loading {gameName}...</p>}
      {isStreamReady && !startPlayGame && !startImmediately && (
        <div className={classes.startGamePanel}>
          <Button
            variant="contained"
            className={classes.startGameButton}
            onClick={onStartGame}
          >
            Start
          </Button>
        </div>
      )}
      <div className={classes.streamingView}>
        {gameSessionId && (
          <StreamingView
            key={gameSessionId}
            userClickedPlayAt={new Date().getTime()}
            apiEndpoint={STREAM_ENDPOINT}
            edgeNodeId={edgeNodeId}
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
