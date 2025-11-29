import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumDetails from "./pages/AlbumDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAlbums from "./pages/MyAlbums";
import CreateAlbum from "./pages/CreateAlbum";
import CreatePhoto from "./pages/CreatePhoto";
import Modal from "./components/Modal";
import api from "./api/client";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums" element={<Albums />} />
        <Route
          path="/albums/new"
          element={<CreateAlbum currentUser={currentUser} />}
        />
        <Route
          path="/albums/:id"
          element={<AlbumDetails currentUser={currentUser} />}
        />
        <Route
          path="/albums/:albumId/photos/new"
          element={<CreatePhoto currentUser={currentUser} />}
        />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<Register onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/my-albums"
          element={<MyAlbums currentUser={currentUser} />}
        />
      </Routes>

      <Footer />

      <Modal
        title="Logout"
        onClose={() => setShowLogoutModal(false)}
      >
        {showLogoutModal && (
          <div>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;
