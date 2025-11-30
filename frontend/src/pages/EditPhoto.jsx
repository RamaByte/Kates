// src/pages/EditPhoto.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const EditPhoto = ({ currentUser }) => {
    const { id } = useParams(); // photo id
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
        albumId: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .get(`/photos/${id}`)
            .then((res) => {
                const p = res.data;
                setForm({
                    title: p.title || "",
                    description: p.description || "",
                    imageUrl: p.imageUrl || "",
                    albumId: p.albumId,
                });
            })
            .catch((err) => {
                console.error(err);
                setError("Photo not found or cannot be loaded.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (!currentUser) {
        return (
            <main className="content">
                <p>You need to be logged in to edit photos.</p>
            </main>
        );
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const payload = {
                title: form.title,
                description: form.description,
                imageUrl: form.imageUrl,
                albumId: Number(form.albumId),
            };
            await api.put(`/photos/${id}`, payload);
            navigate(`/albums/${form.albumId}`);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("You do not have permission to edit this photo.");
            } else if (err.response?.status === 404) {
                setError("Photo or album not found.");
            } else {
                setError("Could not update photo.");
            }
        }
    };

    return (
        <main className="content">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="form-card">
                    <h2>Edit photo</h2>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="title">
                                Title
                            </label>
                            <input
                                className="form-input"
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="imageUrl">
                                Image URL
                            </label>
                            <input
                                className="form-input"
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                required
                                value={form.imageUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">
                                Description (optional)
                            </label>
                            <textarea
                                className="form-textarea"
                                id="description"
                                name="description"
                                rows="3"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}

                        <button type="submit" className="btn-primary full-width">
                            Save changes
                        </button>
                    </form>
                </div>
            )}
        </main>
    );
};

export default EditPhoto;
