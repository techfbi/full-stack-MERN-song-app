import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1> Error 404</h1>
      <h3>Page Not Found</h3>
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
