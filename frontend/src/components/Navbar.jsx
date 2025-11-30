// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import KatesLogo from "../assets/Kates.png";

const Navbar = ({ currentUser, onLogout }) => {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen((prev) => !prev);
    const closeMenu = () => setOpen(false);

    // Kad veiktų .nav-link.active stilius iš CSS
    const navLinkClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="brand">
                    <span className="brand-icon" aria-hidden="true">
                        <img
                            src={KatesLogo}
                            alt="Kates logo"
                            style={{ width: "70px", height: "70px", objectFit: "contain" }}
                        />
                    </span>
                    <span className="brand-text">Kates</span>
                </Link>


                {/* desktop menu */}
                <nav className="nav-links desktop-only">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/albums" className={navLinkClass}>
                        Albums
                    </NavLink>
                    <NavLink to="/photos" className={navLinkClass}>
                        Photos
                    </NavLink>
                    {currentUser && (
                        <>
                            <NavLink to="/my-albums" className={navLinkClass}>
                                My albums
                            </NavLink>
                            <NavLink to="/albums/new" className={navLinkClass}>
                                New album
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* desktop right side: user / auth */}
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
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>
            </div>

            {/* mobile menu */}
            {open && (
                <nav className="nav-links-mobile mobile-only">
                    <NavLink
                        to="/"
                        className={navLinkClass}
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/albums"
                        className={navLinkClass}
                        onClick={closeMenu}
                    >
                        Albums
                    </NavLink>
                    <NavLink
                        to="/photos"
                        className={navLinkClass}
                        onClick={closeMenu}
                    >
                        Photos
                    </NavLink>

                    {currentUser && (
                        <>
                            <NavLink
                                to="/my-albums"
                                className={navLinkClass}
                                onClick={closeMenu}
                            >
                                My albums
                            </NavLink>
                            <NavLink
                                to="/albums/new"
                                className={navLinkClass}
                                onClick={closeMenu}
                            >
                                New album
                            </NavLink>
                        </>
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
