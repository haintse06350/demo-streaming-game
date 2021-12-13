import React, { useEffect, useState } from "react";
import StreamingView from "../appland/StreamingView";
import { StreamingController } from "streaming-view-sdk";
import { GameSessions } from "../models/gameSession";
import { useNavigate } from "react-router-dom";

const StreamingGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameSessionId = urlParams.get("gameSessionId");
  const edgeNodeId = urlParams.get("edgeNodeId");
  const userId = urlParams.get("userId");
  const volume = urlParams.get("volume");
  const gameName = urlParams.get("gameName");
  const startImmediately = urlParams.get("startImmediately");
  const showGameHeader = urlParams.get("showGameHeader") === "true";

  const [isStreamReady, setIsStreamReady] = useState(false);
  const [startPlayGame, setStartPlayGame] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [score, setScore] = useState(0);
  const [gameSession, setGameSession] = useState({ gameSessionId, edgeNodeId });
  const navigate = useNavigate();

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
    console.log("start gane");
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
          break;
        case "final_score":
          break;
      }
    }
  };

  const gameHeader = () => {
    return (
      <div
        style={{
          width: "100%",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          zIndex: 1001,
        }}
      >
        <div
          style={{ marginLeft: 10 }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <p>Back</p>
        </div>
        <div style={{ color: "#000000" }}>
          <p>{score}</p>
        </div>
        <div style={{ marginRight: 10 }} onClick={replayMoment}>
          <p>Replay</p>
        </div>
      </div>
    );
  };

  const showPlayButton =
    (isStreamReady && !startPlayGame && !startImmediately && gameSession) ||
    (isReplay && gameSession && isStreamReady);
  const showReplayButton = isEnd && !startPlayGame && !isReplay;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {showGameHeader && gameHeader()}
      {!isStreamReady && !isEnd && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <b>Loading {gameName}...</b>
        </div>
      )}
      {showPlayButton && (
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
            Play
          </button>
        </div>
      )}
      {showReplayButton && (
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
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
              width: 200,
              height: 40,
            }}
            onClick={replayMoment}
          >
            RePlay this moment
          </button>
          <button
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 200,
              height: 40,
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </div>
      )}
      {isReplay && !isStreamReady && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <b>Loading {gameName}...</b>
        </div>
      )}
      <div style={{ width: "100%", maxWidth: "100%", height: "100%" }}>
        {gameSession && (
          <StreamingView
            key={gameSession?.gameSessionId}
            userClickedPlayAt={new Date().getTime()}
            apiEndpoint={STREAM_ENDPOINT}
            edgeNodeId={gameSession?.edgeNodeId}
            userId={userId}
            enableControl={true}
            enableDebug={false}
            enableFullScreen={false}
            muted={false}
            volume={volume}
            onEvent={(evt, payload) => onStreamEvent(evt, payload)}
          ></StreamingView>
        )}
      </div>
    </div>
  );
};

export default StreamingGame;
