// src/pages/Albums.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const Albums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                setLoading(true);
                const res = await api.get("/albums");
                setAlbums(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load albums");
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, []);

    return (
        <main className="content">
            <div className="content-header">
                <h2>Albums</h2>
                <p>Browse all cat albums from the community.</p>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="form-error">{error}</p>}

            {!loading && !error && (
                <div className="card-grid">
                    {albums.map((album) => (
                        <Link
                            key={album.id}
                            to={`/albums/${album.id}`}
                            className="card"
                        >
                            {/* FOTO PREVIEW KAIP FACEBOOK */}
                            {album.photos && album.photos.length > 0 && (
                                <div className="album-preview">
                                    <div className="album-preview-grid">
                                        {album.photos.slice(0, 4).map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="album-preview-item"
                                            >
                                                <img
                                                    src={photo.imageUrl}
                                                    alt={photo.title || album.title}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="card-body">
                                <h3>{album.title}</h3>
                                {album.description && (
                                    <p className="card-subtitle">{album.description}</p>
                                )}

                                <div className="card-meta">
                                    {/* CREATOR USERNAME */}
                                    {album.user && (
                                        <>
                                            by{" "}
                                            <span className="album-author-name">
                                                {album.user.name}
                                            </span>
                                            {" · "}
                                        </>
                                    )}
                                    {Array.isArray(album.photos) && (
                                        <span>
                                            {album.photos.length} photo
                                            {album.photos.length !== 1 && "s"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Albums;
