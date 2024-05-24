import { useEffect, useState } from "react";

export const Secrets = () => {
  const [secrets, setSecrets] = useState(null);
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("accessToken"));
        const response = await fetch(
          "https://project-auth-session.onrender.com/secrets",
          {
            headers: {
              Authorization: `${accessToken}`,
              credentials: "include", // Include the session cookie in the request to the backend
              mode: "cors", // Ensure CORS is enabled
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch secrets", response);
        const data = await response.json();
        setSecrets(data.secret);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSecrets();
  }, []);

  return (
    <>
      {secrets ? (
        <div>
          <p>{secrets}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
