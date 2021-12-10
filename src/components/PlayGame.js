import React, { useState } from "react";
import StreamingView from "../appland/StreamingView";
import { GameSessions } from "../models/gameSession";
import { StreamingController } from "streaming-view-sdk";

const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";
const LIST_GAMES = [
  {
    name: "Tower Builder",
    gameId: "145350",
    momentId: "97546c9f-70f3-447a-bb21-1f41e7952607",
  },
  {
    name: "Air Strike",
    gameId: "152540",
    momentId: "37ed10b2-c81a-4d28-87e9-b8193da6f728",
  },
  {
    name: "Cut the ropes",
    gameId: "141753",
    momentId: "75cdd9a2-121b-4e71-957d-649ae31713f8",
  },
  {
    name: "Fern Flower",
    gameId: "152265",
    momentId: "ec44b70f-0c47-4370-a796-126e466ff434",
  },
  {
    name: "Fruit match",
    gameId: "152549",
    momentId: "3b540c29-b2f8-4b70-b6b5-8056f5e94ef4",
  },
  {
    name: "Pizza",
    gameId: "153895",
    momentId: "e005b4d9-3c7b-4d24-9f31-10a14ea9bfa4",
  },
  {
    name: "Run and Gun",
    gameId: "152989",
    momentId: "58385022-1e3b-4c28-87ff-ffbe4b14db90",
  },
  {
    name: "Subway Surfers",
    gameId: "152144",
    momentId: "b72b30ee-aeef-4717-9728-357fb35ea6ae",
  },
];
export const PlayGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const userId = urlParams.get("userId");

  const [gameSession, setGameSession] = useState(null);
  const [startPlayGame, setStartPlayGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

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

  const onClickPlayGame = async (game) => {
    setStartPlayGame(true);
    setSelectedGame(game);
    const deviceInfo = await getDeviceInfo();
    const gameSession = await GameSessions.playSoloMoment({
      device: { info: deviceInfo },
      gameId: game.gameId,
      momentId: game.momentId,
      sessionType: "CASUAL",
    });
    setGameSession(gameSession);
  };

  const onStreamEvent = async (event, payload) => {
    if (event === StreamingController.EVENT_STREAM_READY) {
      console.log("stream ready");
    } else if (event === "stream-video-can-play") {
      setStartPlayGame(false);
      resumeStream();
    }
  };

  return (
    <div>
      <div>Hello {username}</div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        {LIST_GAMES.map((game) => (
          <div>
            <p>{game.name}</p>
            <button onClick={() => onClickPlayGame(game)}>
              Play this game
            </button>
          </div>
        ))}
      </div>
      {startPlayGame && <p>Loading {selectedGame.name}...</p>}
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
  );
};

export default PlayGame;
