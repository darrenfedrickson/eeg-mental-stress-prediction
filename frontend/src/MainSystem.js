import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import EEGMSP from "./components/EEGMSP";
import LoadingScreen from "./components/LoadingScreen";

const MainSystem = ({ onLogout: onAppLogout }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fading, setFading] = useState(false);
    const navigate = useNavigate();

    // Simulate system initialization with fade out
    useEffect(() => {
        // Start fade out after 2s
        const fadeTimer = setTimeout(() => {
            setFading(true);
        }, 2000);

        // Remove loading screen after fade finishes (2s + 0.8s transition)
        const removeTimer = setTimeout(() => {
            setLoading(false);
        }, 2800);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    // Google Login Success
    const handleLogin = (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const userData = {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    };

    // Logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        if (onAppLogout) onAppLogout();
    };

    // Keep user logged in
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="min-h-screen relative">
            {/* Show Loading Screen until fully removed */}
            {loading && <LoadingScreen fading={fading} text="Initializing System..." />}

            {/* Main content is always rendered underneath to allow fade-in effect (reveal) */}
            <EEGMSP
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onBackToHome={() => navigate('/')}
            />
        </div>
    );
};

export default MainSystem;
