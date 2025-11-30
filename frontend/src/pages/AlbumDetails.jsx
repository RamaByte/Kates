// src/pages/AlbumDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import Modal from "../components/Modal";

const AlbumDetails = ({ currentUser }) => {
    const { id } = useParams(); // album id
    const navigate = useNavigate();

    const [album, setAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentError, setCommentError] = useState("");
    const [newComment, setNewComment] = useState("");

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

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

    // ----- Album permission helpers -----
    const canEditAlbum =
        currentUser &&
        (currentUser.role === "admin" || album?.userId === currentUser.id);

    const handleEditAlbum = () => {
        if (!album) return;
        navigate(`/albums/${id}/edit`);
    };

    const handleDeleteAlbum = async () => {
        if (!album) return;
        const confirmed = window.confirm("Delete this album?");
        if (!confirmed) return;
        try {
            await api.delete(`/albums/${id}`);
            navigate("/albums");
        } catch (err) {
            console.error(err);
            alert("Could not delete album.");
        }
    };

    // ----- Photo modal + comments -----
    const openPhotoModal = async (photo) => {
        setSelectedPhoto(photo);
        setComments([]);
        setNewComment("");
        setEditingCommentId(null);
        setEditingCommentText("");
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

    const canEditPhoto = (photo) => {
        if (!currentUser) return false;
        if (currentUser.role === "admin") return true;
        return photo.uploadedById === currentUser.id;
    };

    const handleDeletePhoto = async () => {
        if (!selectedPhoto) return;
        const confirmed = window.confirm("Delete this photo?");
        if (!confirmed) return;
        try {
            await api.delete(`/photos/${selectedPhoto.id}`);
            setPhotos((prev) => prev.filter((p) => p.id !== selectedPhoto.id));
            setSelectedPhoto(null);
        } catch (err) {
            console.error(err);
            setCommentError("Could not delete photo.");
        }
    };

    const handleEditPhoto = () => {
        if (!selectedPhoto) return;
        navigate(`/photos/${selectedPhoto.id}/edit`);
    };

    // ----- Comments: create, delete, update -----

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
            // jei backend grąžina sukurtą komentarą:
            const created = res.data || payload;
            setComments((prev) => [
                ...prev,
                { ...created, id: created.id ?? Date.now(), userId: currentUser?.id },
            ]);
            setNewComment("");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setCommentError("You must be logged in to comment.");
            } else if (err.response?.status === 404) {
                setCommentError("Photo not found.");
            } else {
                setCommentError("Could not add comment.");
            }
        }
    };

    const canModifyComment = (comment) => {
        if (!currentUser) return false;
        if (currentUser.role === "admin") return true;
        return comment.userId === currentUser.id;
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

    const startEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const handleUpdateComment = async () => {
        if (!editingCommentId || !editingCommentText.trim() || !selectedPhoto) return;
        setCommentError("");
        try {
            const payload = {
                content: editingCommentText.trim(),
                photoId: selectedPhoto.id,
            };
            await api.put(`/comments/${editingCommentId}`, payload);

            setComments((prev) =>
                prev.map((c) =>
                    c.id === editingCommentId
                        ? { ...c, content: editingCommentText.trim() }
                        : c
                )
            );
            setEditingCommentId(null);
            setEditingCommentText("");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setCommentError("You do not have permission to edit this comment.");
            } else {
                setCommentError("Could not update comment.");
            }
        }
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

                    {canEditAlbum && (
                        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                            <button className="btn-secondary" onClick={handleEditAlbum}>
                                Edit album
                            </button>
                            <button className="btn-secondary" onClick={handleDeleteAlbum}>
                                Delete album
                            </button>
                        </div>
                    )}

                    {canEditAlbum && (
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
                onClose={() => {
                    setSelectedPhoto(null);
                    setComments([]);
                    setEditingCommentId(null);
                    setEditingCommentText("");
                    setCommentError("");
                }}
            >
                {selectedPhoto && (
                    <div className="modal-photo">
                        {/* Kairė pusė – didelė nuotrauka */}
                        <div className="modal-photo-left">
                            <img
                                src={selectedPhoto.imageUrl}
                                alt={selectedPhoto.title}
                                className="photo-img modal-photo-img"
                            />
                        </div>

                        {/* Dešinė pusė – aprašymas + komentarai + forma */}
                        <div className="modal-photo-right">
                            {/* Aprašymas + Edit/Delete */}
                            <div className="modal-photo-meta">
                                {selectedPhoto.description && (
                                    <p className="modal-text">{selectedPhoto.description}</p>
                                )}

                                {canEditPhoto(selectedPhoto) && (
                                    <div
                                        className="modal-actions"
                                        style={{
                                            marginTop: "0.5rem",
                                            display: "flex",
                                            gap: "0.5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button className="btn-secondary" onClick={handleEditPhoto}>
                                            Edit photo
                                        </button>
                                        <button className="btn-secondary" onClick={handleDeletePhoto}>
                                            Delete photo
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Scroll'inami komentarai */}
                            <div className="modal-comments-scroll">
                                <h4>Comments</h4>

                                {commentsLoading && <p>Loading comments...</p>}
                                {!commentsLoading && comments.length === 0 && (
                                    <p>No comments yet.</p>
                                )}

                                <ul className="comment-list">
                                    {comments.map((comment) => (
                                        <li key={comment.id} className="comment-item">
                                            {editingCommentId === comment.id ? (
                                                <>
                                                    <textarea
                                                        className="form-textarea"
                                                        rows="2"
                                                        value={editingCommentText}
                                                        onChange={(e) =>
                                                            setEditingCommentText(e.target.value)
                                                        }
                                                    />
                                                    <div
                                                        className="modal-actions"
                                                        style={{
                                                            marginTop: "0.35rem",
                                                            display: "flex",
                                                            gap: "0.5rem",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn-secondary"
                                                            onClick={cancelEditComment}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-primary"
                                                            onClick={handleUpdateComment}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* KOMENTUOTOJO USERNAME */}
                                                    <p className="comment-author">
                                                        {comment.user?.name ?? "Unknown user"}
                                                    </p>
                                                    <p>{comment.content}</p>
                                                    {canModifyComment(comment) && (
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "0.5rem",
                                                                marginTop: "0.25rem",
                                                            }}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn-text"
                                                                onClick={() => startEditComment(comment)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn-text"
                                                                onClick={() =>
                                                                    handleDeleteComment(comment.id)
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {commentError && <p className="form-error">{commentError}</p>}
                            </div>

                            {/* Forma apačioje – visada matoma */}
                            <form
                                className="form modal-comment-form"
                                onSubmit={handleCreateComment}
                            >
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
                    </div>
                )}
            </Modal>

        </main>
    );
};

export default AlbumDetails;
