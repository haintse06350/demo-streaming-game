import React, { useState, useEffect } from "react";
import StreamingView from "../appland/StreamingView";
import { GameSessions } from "../models/gameSession";
import { StreamingController } from "streaming-view-sdk";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStyles } from "./styles.style";

const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";

export const PlayGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const userId = urlParams.get("userId");
  const classes = useStyles();
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
      cloneListGames.map(async (game) => {
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
    <div className={classes.container}>
      <div className={classes.listGameContainer}>
        <Typography variant="h5">Hello {username}</Typography>
        {!listGames && <p>Fetching list games...</p>}
        <div className={classes.listGame}>
          {listGames?.map((game) => (
            <div className={classes.gameItem}>
              <Typography variant="subtitle1">{game.title}</Typography>
              <Button variant="outlined" onClick={() => onClickPlayGame(game)}>
                Play this game
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.gamePanel}>
        {selectedGame && !isStreamReady && (
          <p>Loading {selectedGame.title}...</p>
        )}
        {isStreamReady && !startPlayGame && gameSession && (
          <div className={classes.startGamePanel}>
            <Button
              variant="contained"
              className={classes.startButton}
              onClick={onStartGame}
            >
              Start
            </Button>
          </div>
        )}
        <div className={classes.streamingView}>
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
