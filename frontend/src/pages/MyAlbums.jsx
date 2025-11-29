import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const MyAlbums = ({ currentUser }) => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        if (!currentUser) return;
        api
            .get("/albums")
            .then((res) => {
                setAlbums(res.data.filter((album) => album.userId === currentUser.id));
            })
            .catch((err) => console.error(err));
    }, [currentUser]);

    if (!currentUser) {
        return (
            <main className="content">
                <p>You need to be logged in to see your albums.</p>
            </main>
        );
    }

    return (
        <main className="content">
            <div className="content-header">
                <h2>My albums</h2>
            </div>
            <div className="card-grid">
                {albums.map((album) => (
                    <Link
                        key={album.id}
                        to={`/albums/${album.id}`}
                        className="card"
                    >
                        <div className="card-body">
                            <h3>{album.title}</h3>
                            {album.description && (
                                <p className="card-subtitle">{album.description}</p>
                            )}
                        </div>
                    </Link>
                ))}
                {albums.length === 0 && <p>You have not created any albums yet.</p>}
            </div>
        </main>
    );
};

export default MyAlbums;
