import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BackHome } from "./BackHome";

export const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    console.log(loginData);
    e.preventDefault();
    try {
      const response = await fetch(
        "https://project-auth-lh3p.onrender.com/login",
        {
          method: "POST",
          credentials: "include", // Include the session cookie in the request to the backend
          mode: "cors", // Ensure CORS is enabled
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );
      if (!response.ok) throw new Error("Failed to login");
      console.log("succesful", response);

      navigate("/sessions");
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoginData({
        username: "",
        password: "",
      });
    }
  };

  return (
    <>
      <BackHome />
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            id=""
            value={loginData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            id=""
            value={loginData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </>
  );
};
