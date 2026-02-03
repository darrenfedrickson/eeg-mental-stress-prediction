import React from "react";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

const LoginPage = ({ onLogin }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-foreground">
    <h2 className="text-3xl font-semibold mb-6">Sign in to EEG Stress Detection</h2>
    <GoogleLoginButton onLoginSuccess={onLogin} />
  </div>
);

export default LoginPage;
