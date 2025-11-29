import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import Modal from "../components/Modal";

const AlbumDetails = ({ currentUser }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentError, setCommentError] = useState("");
    const [newComment, setNewComment] = useState("");

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

    const openPhotoModal = async (photo) => {
        setSelectedPhoto(photo);
        setComments([]);
        setNewComment("");
        setCommentError("");
        if (!photo?.id) return;
        setCommentsLoading(true);
        try {
            const res = await api.get(`/photos/${photo.id}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
            setCommentError("Failed to load comments.");
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleCreateComment = async (e) => {
        e.preventDefault();
        if (!selectedPhoto || !newComment.trim()) return;
        setCommentError("");
        try {
            const payload = {
                content: newComment.trim(),
                photoId: selectedPhoto.id,
            };
            const res = await api.post("/comments", payload);
            setComments((prev) => [...prev, res.data]);
            setNewComment("");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setCommentError("You must be logged in to comment.");
            } else {
                setCommentError("Could not add comment.");
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error(err);
            setCommentError("Could not delete comment.");
        }
    };

    const canDeleteComment = (comment) => {
        if (!currentUser) return false;
        if (currentUser.role === "admin") return true;
        return comment.userId === currentUser.id;
    };

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

                    {currentUser && (
                        <div style={{ marginBottom: "1rem" }}>
                            <Link
                                to={`/albums/${id}/photos/new`}
                                className="btn-secondary"
                            >
                                Add photo
                            </Link>
                        </div>
                    )}

                    <div className="card-grid">
                        {photos.map((photo) => (
                            <button
                                key={photo.id}
                                className="photo-card"
                                onClick={() => openPhotoModal(photo)}
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

                        <hr style={{ margin: "1rem 0" }} />
                        <h4>Comments</h4>

                        {commentsLoading && <p>Loading comments...</p>}
                        {!commentsLoading && comments.length === 0 && (
                            <p>No comments yet.</p>
                        )}

                        <ul className="comment-list">
                            {comments.map((comment) => (
                                <li key={comment.id} className="comment-item">
                                    <p>{comment.content}</p>
                                    {canDeleteComment(comment) && (
                                        <button
                                            type="button"
                                            className="btn-text"
                                            onClick={() => handleDeleteComment(comment.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {commentError && <p className="form-error">{commentError}</p>}

                        <form className="form" onSubmit={handleCreateComment}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="new-comment">
                                    Add a comment
                                </label>
                                <textarea
                                    id="new-comment"
                                    className="form-textarea"
                                    rows="3"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment…"
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                Post comment
                            </button>
                        </form>
                    </div>
                )}
            </Modal>
        </main>
    );
};

export default AlbumDetails;
