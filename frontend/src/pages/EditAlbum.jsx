// src/pages/EditAlbum.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const EditAlbum = ({ currentUser }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", description: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .get(`/albums/${id}`)
            .then((res) => {
                setForm({
                    title: res.data.title || "",
                    description: res.data.description || "",
                });
            })
            .catch((err) => {
                console.error(err);
                setError("Album not found or cannot be loaded.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (!currentUser) {
        return (
            <main className="content">
                <p>You need to be logged in to edit albums.</p>
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
            };
            await api.put(`/albums/${id}`, payload);
            navigate(`/albums/${id}`);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("You do not have permission to edit this album.");
            } else {
                setError("Could not update album.");
            }
        }
    };

    return (
        <main className="content">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="form-card">
                    <h2>Edit album</h2>
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

export default EditAlbum;
