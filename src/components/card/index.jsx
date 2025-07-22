import React from "react";
import "./styles.css";

export function Card({ children, onClick, onMouseMove }) {
  return (
    <div 
      className="card-container"
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, onClick }) {
  return (
    <div className="card-content" onClick={onClick}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return <h2 className="card-title">{children}</h2>;
}

export function CardMeta({ children }) {
  return <div className="card-meta">{children}</div>;
}

export function CardDescription({ children }) {
  return <div className="card-description">{children}</div>;
}

export function CardActions({ children }) {
  return <div className="card-actions">{children}</div>;
}