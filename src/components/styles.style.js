import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  listGameContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  listGame: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    overflowX: "scroll",
  },
  gameItem: {
    border: "1px solid black",
    padding: "10px",
    minWidth: 120,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  gamePanel: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  startGamePanel: {
    width: "100%",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    opacity: "80%",
    zIndex: 1000,
    position: "absolute",
  },
  startButton: {
    position: "absolute !important",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 100,
    height: 40,
  },
  streamingView: {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
  },
});
