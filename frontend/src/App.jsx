import { AuthRoutes } from "./routes/AuthRoutes";
import { BrowserRouter } from "react-router-dom"

export const App = () => {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
};
