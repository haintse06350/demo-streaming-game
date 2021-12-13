import React, { useEffect, useState } from "react";
import StreamingView from "../appland/StreamingView";
import { StreamingController } from "streaming-view-sdk";

const StreamingGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameSessionId = urlParams.get("gameSessionId");
  const edgeNodeId = urlParams.get("edgeNodeId");
  const userId = urlParams.get("userId");
  const volume = urlParams.get("volume");
  const gameName = urlParams.get("gameName");
  const startImmediately = urlParams.get("startImmediately");

  const [isStreamReady, setIsStreamReady] = useState(false);
  const [startPlayGame, setStartPlayGame] = useState(false);

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
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {!isStreamReady && <p>Loading {gameName}...</p>}
      {isStreamReady && !startPlayGame && !startImmediately && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            opacity: "80%",
            zIndex: 1000,
            position: "absolute",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 40,
            }}
            onClick={onStartGame}
          >
            Start
          </button>
        </div>
      )}
      <div style={{ width: "100%", maxWidth: "100%", height: "100%" }}>
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
