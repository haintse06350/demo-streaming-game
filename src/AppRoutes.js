import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import Login from "./components/Login";
import PlayGame from "./components/PlayGame";

export default function AppRoutes() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path={"/"} element={<Login />} />
          <Route exact path={"/play-game"} element={<PlayGame />} />
        </Routes>
      </Fragment>
    </Router>
  );
}
