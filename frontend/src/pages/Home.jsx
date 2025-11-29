// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <main className="content">
            <section className="hero">
                <div className="hero-text">
                    <h1>All your cat photos in one place</h1>
                    <p>
                        Browse albums, upload your favourite cat photos and share them with
                        the world.
                    </p>
                    <div className="hero-actions">
                        <Link to="/albums" className="btn-primary">
                            Browse albums
                        </Link>
                        <Link to="/register" className="btn-secondary">
                            Create an account
                        </Link>
                    </div>
                </div>
                <div className="hero-image-card">
                    <img
                        src="https://i.pinimg.com/736x/19/0c/89/190c896f8a426d778f36ae781a7485a3.jpg"
                        alt="Cute cat"
                        className="hero-image"
                    />
                </div>
            </section>
        </main>
    );
};

export default Home;
