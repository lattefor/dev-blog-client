import { useState, useEffect } from "react";
import classes from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { Home, Edit, LogIn, LogOut, X } from "lucide-react";
import { NavBar } from "../ui/tubelight-navbar";
import { useUser, useClerk } from "@clerk/clerk-react";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  
  // Define navigation items for the tubelight navbar
  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', url: '/', icon: Home },
      { name: 'Add Blog', url: '/add-blog', icon: Edit },
    ];
    
    // Add either Sign In or Sign Out based on authentication status
    if (isSignedIn) {
      baseItems.push({ 
        name: 'Sign Out', 
        url: '#', 
        icon: LogOut,
        onClick: () => handleSignOut()
      });
    } else {
      baseItems.push({ 
        name: 'Sign In', 
        url: '/sign-in', 
        icon: LogIn 
      });
    }
    
    return baseItems;
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
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

  const navItems = getNavItems();

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

      {/* User info display when signed in */}
      {isSignedIn && (
        <div className={classes.userInfo}>
          <img 
            src={user.imageUrl} 
            alt={user.fullName || "User"} 
            className={classes.userAvatar}
          />
        </div>
      )}
    </div>
  );
}