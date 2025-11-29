// src/pages/Albums.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const Albums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/albums")
            .then((res) => setAlbums(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="content">
            <div className="content-header">
                <h2>Albums</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card-grid">
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            to={`/albums/${album.id}`}
                            className="card"
                        >
                            <div className="card-body">
                                <h3>{album.title}</h3>
                                {album.description && (
                                    <p className="card-subtitle">{album.description}</p>
                                )}
                            </div>
                            <div className="card-meta">
                                <span>Album #{album.id}</span>
                            </div>
                        </Link>
                    ))}
                    {albums.length === 0 && <p>No albums yet.</p>}
                </div>
            )}
        </main>
    );
};

export default Albums;
