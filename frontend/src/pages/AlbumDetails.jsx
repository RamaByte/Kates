// src/pages/AlbumDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Modal from "../components/Modal";

const AlbumDetails = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [albumRes, photosRes] = await Promise.all([
                    api.get(`/albums/${id}`),
                    api.get(`/albums/${id}/photos`),
                ]);
                setAlbum(albumRes.data);
                setPhotos(photosRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    return (
        <main className="content">
            {loading && <p>Loading...</p>}
            {!loading && !album && <p>Album not found.</p>}

            {album && (
                <>
                    <div className="content-header">
                        <h2>{album.title}</h2>
                        {album.description && <p>{album.description}</p>}
                    </div>

                    <div className="card-grid">
                        {photos.map((photo) => (
                            <button
                                key={photo.id}
                                className="photo-card"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    className="photo-img"
                                />
                                <div className="photo-info">
                                    <h3>{photo.title}</h3>
                                    {photo.description && (
                                        <p className="card-subtitle">{photo.description}</p>
                                    )}
                                </div>
                            </button>
                        ))}
                        {photos.length === 0 && <p>No photos in this album yet.</p>}
                    </div>
                </>
            )}

            <Modal
                title={selectedPhoto?.title}
                onClose={() => setSelectedPhoto(null)}
            >
                {selectedPhoto && (
                    <div className="modal-photo">
                        <img
                            src={selectedPhoto.imageUrl}
                            alt={selectedPhoto.title}
                            className="photo-img"
                        />
                        {selectedPhoto.description && (
                            <p className="modal-text">{selectedPhoto.description}</p>
                        )}
                    </div>
                )}
            </Modal>
        </main>
    );
};

export default AlbumDetails;
