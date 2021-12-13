import React, { useState, useEffect } from "react";
import { GameSessions } from "../models/gameSession";
import { StreamingController } from "streaming-view-sdk";
import { useNavigate } from "react-router-dom";
import AuthAmplify from "@aws-amplify/auth";
import { useStyles } from "./styles.style";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const PlayGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const userId = urlParams.get("userId");

  const [listGames, setListGames] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [startImmediately, setStartImmediately] = useState(false);
  const [volume, setVolume] = useState(0);

  const navigate = useNavigate();
  const classes = useStyles();

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
      `/streaming-view?userId=${userId}&gameSessionId=${gS.gameSessionId}&edgeNodeId=${gS.edgeNodeId}&gameName=${selectedGame.title}&startImmediately=${startImmediately}&volume=${volume}`
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
    <div className={classes.container}>
      <div className={classes.listGameContainer}>
        <Typography variant="h5">Hello {username}</Typography>
        {!listGames && <Typography>Fetching list games...</Typography>}
        <div className={classes.listGame}>
          {listGames?.map((game) => (
            <div className={classes.gameItem}>
              <Typography variant="subtitle1">{game.title}</Typography>
              <Button
                classes={{ root: classes.selectGameButton }}
                variant="outlined"
                disabled={isStarting}
                onClick={() => onClickSelectGame(game)}
              >
                Select this game
              </Button>
            </div>
          ))}
        </div>
        {listGames && (
          <FormGroup className={classes.form}>
            <FormControlLabel
              control={<Checkbox />}
              label="Start immediately"
              onChange={(e) => onChangeStartMethod(e)}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Turn off game sound"
              onChange={(e) => onChangeVolume(e)}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Enable Game Header"
            />
            <FormControlLabel control={<Checkbox />} label="Enable Timer" />
          </FormGroup>
        )}

        {selectedGame && (
          <div className={classes.selectedGame}>
            <Typography>
              Game Selected:
              <span>{selectedGame.title}</span>
            </Typography>
            <Typography>
              Id:
              <span>{selectedGame.id}</span>
            </Typography>
            <Typography>
              MomentId:
              <span>{selectedGame.moment.id}</span>
            </Typography>
            <Typography>
              SnapshotId:
              <span>{selectedGame.moment.snapshotId}</span>
            </Typography>
          </div>
        )}
        {selectedGame && (
          <Button
            variant="outlined"
            disabled={isStarting}
            className={classes.startButton}
            onClick={onClickPlayGame}
          >
            {isStarting ? "Starting..." : "Start"}
          </Button>
        )}
        <Button
          variant="outlined"
          className={classes.logoutButton}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default PlayGame;
