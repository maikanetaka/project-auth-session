import { Route, Routes } from "react-router-dom"
import { SignupForm } from "../components/SignupForm";
import { LoginForm } from "../components/LoginForm";
import {Homepage} from "../components/Homepage";
import { Sessions } from "../components/Sessions";
import { Secrets } from "../components/Secrets"

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/secrets" element={<Secrets />} />
    </Routes>
  );
}