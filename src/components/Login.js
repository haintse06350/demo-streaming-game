import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Auth } from "@aws-amplify/auth";
import AuthAmplify from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";

const containerStyles = {
  width: "100vw",
  height: "100vh",
  margin: 0,
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const boxStyles = {
  width: 320,
  height: 140,
  margin: "auto",
  padding: 16,
  backgroundColor: "rgba(255, 255, 255)",
  boxShadow: "rgba(0 0 0 / 15%) 0px 2px 4px",
  borderRadius: 4,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const inputField = {
  width: 288,
  minHeight: "2.375rem",
  maxHeight: 48,
  marginBottom: 16,
};

const inputStyles = {
  textAlign: "left",
  height: "100%",
  color: "rgb(51, 51, 51)",
  fontSize: "1.25rem",
  outline: "none",
  border: "0.125rem solid rgb(204, 204, 204)",
  borderRadius: 4,
  backgroundColor: "rgb(255, 255, 255)",
  padding: "0.25rem 0.375rem",
};

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, e) => {
    setLoading(true);
    const { email, password } = data;
    const cognitoUserRes = await Auth.signIn(email.toLowerCase(), password);
    if (cognitoUserRes) {
      const user = await AuthAmplify.currentAuthenticatedUser();
      const username = user.attributes.preferred_username;
      console.log(user);
      setLoading(false);
      navigate(`/play-game?username=${username}&userId=${user.username}`);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <div style={containerStyles}>
      <form onSubmit={handleSubmit(onSubmit, onError)} style={boxStyles}>
        <div style={inputField}>
          <input
            {...register("email")}
            type="email"
            style={inputStyles}
            placeholder={"Enter your email..."}
          />
        </div>
        <div style={inputField}>
          <input
            {...register("password")}
            type={"password"}
            style={inputStyles}
            placeholder={"Enter your password..."}
          />
        </div>
        <button type="submit">{loading ? "Logging in" : "Submit"}</button>
      </form>
    </div>
  );
};

export default Login;
