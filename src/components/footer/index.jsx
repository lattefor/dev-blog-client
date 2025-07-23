import React from 'react';
import classes from './styles.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={classes.footer}>
      <p>© {currentYear} Devlogs, Inc.</p>
    </footer>
  );
}