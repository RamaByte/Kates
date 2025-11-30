// src/components/Footer.jsx
import React from "react";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <p className="footer-text">
                    Ramojus Drachneris IFF-2/2
                </p>
                <div className="footer-links">
                    <a href="https://kates.onrender.com/api-docs" target="_blank" rel="noreferrer">
                        API docs
                    </a>
                    <a href="https://github.com/RamaByte/Kates" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
