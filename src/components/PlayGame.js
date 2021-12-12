import React, { useState, useEffect } from "react";
import StreamingView from "../appland/StreamingView";
import { GameSessions } from "../models/gameSession";
import { StreamingController } from "streaming-view-sdk";
import { map } from "lodash";

const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";

export const PlayGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const userId = urlParams.get("userId");

  const [listGames, setListGames] = useState(null);
  const [gameSession, setGameSession] = useState(null);
  const [startPlayGame, setStartPlayGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loadingTime, setLoadingTime] = useState(0);
  const [isStreamReady, setIsStreamReady] = useState(false);

  const getDeviceInfo = async () => {
    const streamingController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
    });
    return JSON.stringify(await streamingController.getDeviceInfo());
  };

  const resumeStream = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: gameSession?.edgeNodeId,
    });
    streamController.resume();
  };

  const pauseStream = async () => {
    const streamController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
      edgeNodeId: gameSession?.edgeNodeId,
    });
    streamController.pause();
  };

  const onClickPlayGame = async (game) => {
    window.scrollTo(0, 0);
    setSelectedGame(game);
    setGameSession(null);
    setIsStreamReady(false);
    setStartPlayGame(false);
    const deviceInfo = await getDeviceInfo();
    const gameSession = await GameSessions.playSoloMoment({
      device: { info: deviceInfo },
      gameId: game.moment.appId,
      momentId: game.moment.id,
      sessionType: game.moment.momentType,
    });

    setGameSession(gameSession);
  };

  const onStreamEvent = async (event, payload) => {
    if (event === StreamingController.EVENT_STREAM_READY) {
      console.log("stream ready");
      setIsStreamReady(true);
    } else if (event === "stream-video-can-play") {
      setIsStreamReady(true);
      pauseStream();
    }
  };

  const getListGamesAndListMoments = async () => {
    const listGames = await GameSessions.listGames(["LIVE"]);
    const cloneListGames = [...listGames];
    const mapMomentToListGames = await Promise.all(
      map(cloneListGames, async (game) => {
        const listMoments = await GameSessions.getListMoment(
          game.id,
          game.status
        );
        return { ...game, moment: listMoments[0] };
      })
    );
    setListGames(mapMomentToListGames);
  };

  const onStartGame = async () => {
    console.log("start gane");
    setStartPlayGame(true);
    await resumeStream();
  };

  useEffect(() => {
    getListGamesAndListMoments();
  }, []);

  useEffect(() => {
    if (isStreamReady) window.scrollTo(0, 150);
  }, [isStreamReady]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <p>Hello {username}</p>
        {!listGames && <p>Fetching list games...</p>}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            overflowX: "scroll",
          }}
        >
          {map(listGames, (game) => (
            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                minWidth: 120,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p style={{ margin: 0 }}>{game.title}</p>
              <button onClick={() => onClickPlayGame(game)}>
                Play this game
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {selectedGame && !isStreamReady && (
          <p>Loading {selectedGame.title}...</p>
        )}
        {isStreamReady && !startPlayGame && gameSession && (
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
              volume={0.5}
              onEvent={(evt, payload) => onStreamEvent(evt, payload)}
            ></StreamingView>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayGame;
