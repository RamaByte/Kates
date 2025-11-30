// src/pages/Photos.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const Photos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/photos")
            .then((res) => setPhotos(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="content">
            <div className="content-header">
                <h2>All photos</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card-grid">
                    {photos.map((photo) => (
                        <Link
                            key={photo.id}
                            to={`/albums/${photo.albumId}`}
                            className="photo-card"
                        >
                            <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="photo-img"
                            />
                            <div className="photo-info">
                                <h3>{photo.title}</h3>
                                <p className="card-subtitle">Album #{photo.albumId}</p>
                            </div>
                        </Link>
                    ))}
                    {photos.length === 0 && <p>No photos yet.</p>}
                </div>
            )}
        </main>
    );
};

export default Photos;
