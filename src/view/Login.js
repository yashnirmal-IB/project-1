import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import allUsers from "../data/allUsers.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../state/slice/loggedUser";

export default function Login() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.loggedUser.value);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) {
      navigate("/");
    }
  }, [loggedUser, navigate]);

  function login() {
    const user = allUsers.find(
      (user) =>
        user.email === credentials.email &&
        user.password === credentials.password
    );

    if (!user) {
      setError("Either email or password is incorrect.");
      return;
    }

    dispatch(setLoggedUser(user.email));

    navigate("/");
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-[300px] px-2 flex flex-col items-center justify-center gap-6">
        <h1 className="font-semibold text-4xl">Login</h1>
        <TextField
          value={credentials.email}
          onChange={(e) => {
            setCredentials({ ...credentials, email: e.target.value });
          }}
          fullWidth
          variant="outlined"
          label="Email"
        />
        <TextField
          value={credentials.password}
          onChange={(e) => {
            setCredentials({ ...credentials, password: e.target.value });
          }}
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
        />
        <Button
          className="bg-primary"
          onClick={login}
          fullWidth
          variant="contained"
        >
          Login
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
