import { Link } from "react-router-dom"

export const Homepage = () => {
  return (
    <div>
      <h1>Welcome to TOP secret saver!</h1>
      <nav>
        <ul>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
