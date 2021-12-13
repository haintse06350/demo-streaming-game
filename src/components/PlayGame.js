import React, { useState, useEffect } from "react";
import { GameSessions } from "../models/gameSession";
import { StreamingController } from "streaming-view-sdk";
import { useNavigate } from "react-router-dom";
import AuthAmplify from "@aws-amplify/auth";

export const PlayGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const userId = urlParams.get("userId");

  const [listGames, setListGames] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [startImmediately, setStartImmediately] = useState(true);
  const [volume, setVolume] = useState(0);
  const [enableGH, setEnableGH] = useState(false);

  const navigate = useNavigate();

  const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";

  const onClickSelectGame = (game) => {
    setSelectedGame(game);
  };

  const logout = async () => {
    await AuthAmplify.signOut();
    navigate("/");
  };

  const getDeviceInfo = async () => {
    const streamingController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
    });
    return JSON.stringify(await streamingController.getDeviceInfo());
  };

  const onClickPlayGame = async () => {
    setIsStarting(true);
    const deviceInfo = await getDeviceInfo();
    const gS = await GameSessions.playSoloMoment({
      device: { info: deviceInfo },
      gameId: selectedGame.moment.appId,
      momentId: selectedGame.moment.id,
      sessionType: selectedGame.moment.momentType,
    });

    navigate(
      `/streaming-view?userId=${userId}&gameSessionId=${gS.gameSessionId}&edgeNodeId=${gS.edgeNodeId}&gameName=${selectedGame.title}&startImmediately=${startImmediately}&volume=${volume}&showGameHeader=${enableGH}`
    );
  };

  const selectSubwaySurfersAsDefault = () => {
    const ss = listGames?.find((game) => game.id === "152144");
    setSelectedGame(ss);
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

  const onChangeStartMethod = (e) => {
    const checked = e.target.checked;
    setStartImmediately(checked);
  };

  const onToggleGH = (e) => {
    const checked = e.target.checked;
    setEnableGH(checked);
  };

  const onChangeVolume = (e) => {
    const checked = e.target.checked;
    setVolume(checked ? 0 : 0.5);
  };

  useEffect(() => {
    getListGamesAndListMoments();
  }, []);

  useEffect(() => {
    listGames && selectSubwaySurfersAsDefault();
  }, [listGames]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
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
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {listGames?.map((game) => (
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
              <button
                disabled={isStarting}
                onClick={() => onClickSelectGame(game)}
              >
                Select this game
              </button>
            </div>
          ))}
        </div>
        {listGames && (
          <form style={{ marginTop: 20 }}>
            <input
              value="start-immediately"
              name="start-immediately"
              type="checkbox"
              onChange={(e) => onChangeStartMethod(e)}
            />
            <label for="start-immediately">Start immediately</label>
            <br />
            <input
              value="sound-off"
              name="sound-off"
              type="checkbox"
              onChange={(e) => onChangeVolume(e)}
            />
            <label for="sound-off">Sound off</label>
            <br />
            <input
              value="game-header"
              name="game-header"
              type="checkbox"
              onChange={(e) => onToggleGH(e)}
            />
            <label for="game-header">Enable game header</label>
            <br />
          </form>
        )}

        {selectedGame && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <b>
              Game Selected:
              <span style={{ marginLeft: 4, fontWeight: "normal" }}>
                {selectedGame.title}
              </span>
            </b>
            <b>
              Id:
              <span style={{ marginLeft: 4, fontWeight: "normal" }}>
                {selectedGame.id}
              </span>
            </b>
            <b>
              MomentId:
              <span style={{ marginLeft: 4, fontWeight: "normal" }}>
                {selectedGame.moment.id}
              </span>
            </b>
            <b>
              SnapshotId:
              <span style={{ marginLeft: 4, fontWeight: "normal" }}>
                {selectedGame.moment.snapshotId}
              </span>
            </b>
          </div>
        )}
        {selectedGame && (
          <button
            disabled={isStarting}
            style={{ width: "100%", height: 80, margin: "auto", marginTop: 20 }}
            onClick={onClickPlayGame}
          >
            {isStarting ? "Starting..." : "Start"}
          </button>
        )}
        <button
          style={{
            width: 100,
            height: 40,
            position: "absolute",
            bottom: 20,
            right: 10,
          }}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default PlayGame;
