import classes from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  
  return (
    <div className={classes.header}>
      <div className={classes.logoContainer}>
        <h3>Dev Blog</h3>
        <FaPencilAlt 
          size={30} 
          onClick={() => navigate('/')} 
          className={classes.logoIcon}
        />
      </div>
      <ul>
        <Link to={"/"}>
          <li>Home</li>
        </Link>
        <Link to={"/add-blog"}>
          <li>Add Blog</li>
        </Link>
        <Link to={"/contact"}>
          <li>Contact</li>
        </Link>
      </ul>
    </div>
  );
}
