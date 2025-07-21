import classes from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { Home, Edit, Phone, Menu } from "lucide-react";
import { NavBar } from "../ui/tubelight-navbar";

export default function Header() {
  const navigate = useNavigate();
  
  // Define navigation items for the tubelight navbar
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Add Blog', url: '/add-blog', icon: Edit },
    { name: 'Contact', url: '/contact', icon: Phone }
  ];

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
      
      {/* Tubelight Navigation Bar */}
      <NavBar items={navItems} className={classes.tubelightNav} />
    </div>
  );
}