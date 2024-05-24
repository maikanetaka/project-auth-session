import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Sessions = () => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  localStorage.setItem("accessToken", JSON.stringify(accessToken));
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/sessions`,
          {
            credentials: "include", // Include the session cookie in the request to the
            mode: "cors", // Ensure CORS is enabled
          }
        );

        if (response.status === 401) navigate("/login"); // Send user back to login page if unauthorized
        if (!response.ok) throw new Error("Failed to fetch sessions", response);

        const sessions = await response.json();
        console.log(sessions);
        setUserData(sessions);
        setAccessToken(sessions.AccessToken);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSessions();
  }, [navigate]);

  if (!userData) {
    // Show loading while Sessions are being fetched
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>
        <h2>Your account information</h2>
        <ul>
          <li>ID: {userData.ID} </li>
          <li>Username: {userData.name}</li>
          <li>Access Token:{userData.AccessToken} </li>
        </ul>
      </div>
    </>
  );
};
