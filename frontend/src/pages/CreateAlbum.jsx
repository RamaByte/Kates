import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const CreateAlbum = ({ currentUser }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
    });
    const [error, setError] = useState("");

    if (!currentUser) {
        return (
            <main className="content">
                <p>You need to be logged in to create an album.</p>
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
            const res = await api.post("/albums", payload);
            const created = res.data;
            if (created?.id) {
                navigate(`/albums/${created.id}`);
            } else {
                navigate("/albums");
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("You must be logged in to create albums.");
            } else {
                setError("Could not create album.");
            }
        }
    };

    return (
        <main className="content">
            <div className="form-card">
                <h2>Create album</h2>
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
                        Save album
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreateAlbum;
