import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
