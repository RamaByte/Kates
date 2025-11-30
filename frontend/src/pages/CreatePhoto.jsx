// src/pages/CreatePhoto.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const CreatePhoto = ({ currentUser }) => {
    const navigate = useNavigate();
    const { albumId } = useParams();

    const [form, setForm] = useState({
        title: "",
        description: "",
        imageUrl: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!currentUser) {
        return (
            <main className="content">
                <p>You need to be logged in to upload a photo.</p>
            </main>
        );
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        setFile(f || null);
        if (f) {
            setPreview(URL.createObjectURL(f));
        } else {
            setPreview("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            let finalImageUrl = form.imageUrl.trim();

            // Jei vartotojas neįrašė URL, bet pasirinko failą – pirmiausia uploadinam failą
            if (!finalImageUrl && file) {
                const data = new FormData();
                data.append("file", file);

                const uploadRes = await api.post("/upload/photo", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                finalImageUrl = uploadRes.data.url;
            }

            if (!finalImageUrl) {
                setError("Please provide an image URL or upload a file.");
                setSubmitting(false);
                return;
            }

            const payload = {
                title: form.title,
                description: form.description,
                imageUrl: finalImageUrl,
                albumId: Number(albumId),
            };

            await api.post("/photos", payload);
            navigate(`/albums/${albumId}`);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("You must be logged in to upload photos.");
            } else {
                setError("Could not create photo.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="content">
            <div className="form-card">
                <h2>Add photo</h2>
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
                            Image URL (optional if you upload a file)
                        </label>
                        <input
                            className="form-input"
                            id="imageUrl"
                            name="imageUrl"
                            type="url"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="file">
                            Or upload from your computer
                        </label>
                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {preview && (
                            <div style={{ marginTop: "0.5rem" }}>
                                <p style={{ margin: "0 0 0.25rem" }}>Preview:</p>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "180px",
                                        borderRadius: "8px",
                                    }}
                                />
                            </div>
                        )}
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

                    <button
                        type="submit"
                        className="btn-primary full-width"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save photo"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreatePhoto;
