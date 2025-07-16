import { Route, Routes } from "react-router";
import Authpage from "./pages/Authpage";
import Chatpage from "./pages/Chatpage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Authpage />} />
      <Route path="/" element={<Chatpage />} />
    </Routes>
  );
};

export default AppRoutes;
