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
    const [error, setError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const payload = {
                title: form.title,
                description: form.description,
                imageUrl: form.imageUrl,
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
                            placeholder="https://..."
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
                        Save photo
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreatePhoto;
