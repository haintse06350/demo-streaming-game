import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(
  {
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
    },
    listGame: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      overflowX: "scroll",
      "&::-webkit-scrollbar": {
        display: "none",
      },
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
    selectGameButton: {
      textTransform: "none !important",
      padding: "5px 8px !important",
      lineHeight: 1,
      fontSize: "0.75rem !important",
    },
    form: {
      margin: "auto",
      marginTop: 20,
    },
    selectedGame: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      "& > p": {
        margin: 0,
        fontWeight: "bold",
        "& > span": {
          marginLeft: 4,
          fontWeight: "normal",
        },
      },
    },
    startButton: {
      width: "100%",
      height: 80,
      margin: "auto",
      marginTop: "20px !important",
    },
    logoutButton: {
      width: 100,
      height: 40,
      position: "absolute !important",
      bottom: 20,
      right: 10,
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
    startGameButton: {
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
  },
  { index: 1 }
);
