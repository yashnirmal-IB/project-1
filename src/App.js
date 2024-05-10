import LoggedInContainer from "./view/LoggedInContainer";
import Login from "./view/Login";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route exact path="/*" element={<LoggedInContainer />} />
      <Route exact path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
