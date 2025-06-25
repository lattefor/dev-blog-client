import classes from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu when theme changes to ensure styles update
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          // Force nav element to re-apply styles when theme changes
          if (menuRef.current) {
            menuRef.current.style.display = 'none';
            setTimeout(() => {
              menuRef.current.style.display = '';
            }, 10);
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
      
      {/* Hamburger icon for mobile */}
      <div className={classes.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
      
      {/* Navigation menu */}
      <nav 
        className={`${classes.nav} ${menuOpen ? classes.navOpen : ''}`}
        ref={menuRef}
      >
        <ul>
          <Link to={"/"} onClick={() => setMenuOpen(false)}>
            <li>Home</li>
          </Link>
          <Link to={"/add-blog"} onClick={() => setMenuOpen(false)}>
            <li>Add Blog</li>
          </Link>
          <Link to={"/contact"} onClick={() => setMenuOpen(false)}>
            <li>Contact</li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}
