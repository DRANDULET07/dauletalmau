import React from "react";
import "./MobileMenuButton.css";

export default function MobileMenuButton({ onClick }) {
  return (
    <button className="mobile-menu-btn" onClick={onClick}>
      ☰
    </button>
  );
}
