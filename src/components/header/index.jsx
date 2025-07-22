import { useState, useEffect } from "react";
import classes from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { Home, Edit, Phone, X } from "lucide-react";
import { NavBar } from "../ui/tubelight-navbar";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Define navigation items for the tubelight navbar
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Add Blog', url: '/add-blog', icon: Edit },
    { name: 'Contact', url: '/contact', icon: Phone }
  ];
  
  // Check if we're on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={classes.header}>
      <div className={classes.logoContainer}>
        <h3>Dev Blog</h3>
        <img 
          src="/eightball.png" 
          alt="Magic 8 Ball" 
          onClick={() => navigate('/')} 
          className={classes.logoIcon}
        />
      </div>
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          className={classes.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <div className={classes.closeIcon}>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div className={classes.hamburgerIcon}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </button>
      )}
      
      {/* Desktop Navigation */}
      {!isMobile && (
        <NavBar items={navItems} className={classes.tubelightNav} />
      )}
      
      {/* Mobile Navigation Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className={classes.mobileOverlay}>
          <NavBar 
            items={navItems} 
            className={classes.mobileNav} 
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
}