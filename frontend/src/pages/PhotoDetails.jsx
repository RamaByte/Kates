// src/pages/PhotoDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const PhotoDetails = ({ currentUser }) => {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [error, setError] = useState("");

    const canDeleteComment = (comment) => {
        if (!currentUser) return false;
        if (currentUser.role === "admin") return true;
        return comment.userId === currentUser.id;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [photoRes, commentsRes] = await Promise.all([
                    api.get(`/photos/${id}`),
                    api.get(`/photos/${id}/comments`), // hierarchinis endpointas
                ]);
                setPhoto(photoRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        setError("");

        if (!currentUser) {
            setError("You must be logged in to comment.");
            return;
        }

        try {
            const res = await api.post(`/photos/${id}/comments`, {
                content: commentText,
            });
            setComments((prev) => [...prev, res.data]);
            setCommentText("");
        } catch (err) {
            setError("Failed to add comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error(err);
            setError("Failed to delete comment.");
        }
    };

    return (
        <main className="content">
            {loading && <p>Loading...</p>}
            {!loading && !photo && <p>Photo not found.</p>}

            {photo && (
                <>
                    <div className="content-header">
                        <h2>{photo.title}</h2>
                        {photo.description && (
                            <p className="card-subtitle">{photo.description}</p>
                        )}
                    </div>

                    <div className="hero-image-card" style={{ marginBottom: "1.5rem" }}>
                        <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="hero-image"
                        />
                    </div>

                    <section>
                        <h3>Comments</h3>
                        <div className="card-grid" style={{ marginBottom: "1rem" }}>
                            {comments.map((comment) => (
                                <div key={comment.id} className="card">
                                    <div className="card-body">
                                        <p>{comment.content}</p>
                                    </div>
                                    <div className="card-meta">
                                        <span>
                                            Comment #{comment.id}
                                            {comment.user && ` by ${comment.user.name}`}
                                        </span>
                                    </div>
                                    {canDeleteComment(comment) && (
                                        <button
                                            className="btn-secondary"
                                            style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                            {comments.length === 0 && <p>No comments yet.</p>}
                        </div>

                        <div className="form-card" style={{ maxWidth: 600, padding: "1rem" }}>
                            <h4>Leave a comment</h4>
                            <form className="form" onSubmit={handleSubmitComment}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="comment">
                                        Comment
                                    </label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        className="form-textarea"
                                        rows="3"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && <p className="form-error">{error}</p>}
                                <button type="submit" className="btn-primary">
                                    Post comment
                                </button>
                            </form>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};

export default PhotoDetails;
