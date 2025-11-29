// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ currentUser, onLogout }) => {
    const [open, setOpen] = useState(false);

    const closeMenu = () => setOpen(false);

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="brand">
                    <span className="brand-icon" aria-hidden="true">
                        {/* paprasta SVG vektorine ikona (katės siluetas) */}
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M4 4l3 2 2-2 3 2 3-2 2 2 3-2v10c0 3.3-2.7 6-6 6H7c-3.3 0-6-2.7-6-6V4l3 2 0-2z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    <span className="brand-text">Kaciuku Forum</span>
                </Link>

                {/* desktop menu */}
                <nav className="nav-links desktop-only">
                    <NavLink to="/" className="nav-link">
                        Home
                    </NavLink>
                    <NavLink to="/albums" className="nav-link">
                        Albums
                    </NavLink>
                    {currentUser && (
                        <NavLink to="/my-albums" className="nav-link">
                            My albums
                        </NavLink>
                    )}
                </nav>

                <div className="header-right desktop-only">
                    {currentUser ? (
                        <>
                            <span className="user-chip">
                                {currentUser.name} ({currentUser.role})
                            </span>
                            <button className="btn-secondary" onClick={onLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <NavLink to="/login" className="btn-text">
                                Login
                            </NavLink>
                            <NavLink to="/register" className="btn-primary">
                                Sign up
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* mobile hamburger */}
                <button
                    className="hamburger mobile-only"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>
            </div>

            {/* mobile slide menu */}
            {open && (
                <nav className="nav-links-mobile mobile-only">
                    <NavLink to="/" className="nav-link" onClick={closeMenu}>
                        Home
                    </NavLink>
                    <NavLink to="/albums" className="nav-link" onClick={closeMenu}>
                        Albums
                    </NavLink>
                    {currentUser && (
                        <NavLink to="/my-albums" className="nav-link" onClick={closeMenu}>
                            My albums
                        </NavLink>
                    )}
                    <div className="nav-divider" />
                    {currentUser ? (
                        <>
                            <span className="user-chip">
                                {currentUser.name} ({currentUser.role})
                            </span>
                            <button
                                className="btn-secondary full-width"
                                onClick={() => {
                                    closeMenu();
                                    onLogout();
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="btn-text full-width"
                                onClick={closeMenu}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="btn-primary full-width"
                                onClick={closeMenu}
                            >
                                Sign up
                            </NavLink>
                        </>
                    )}
                </nav>
            )}
        </header>
    );
};

export default Navbar;
