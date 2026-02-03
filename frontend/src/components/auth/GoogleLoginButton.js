import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded user info:", decoded);
      onLoginSuccess(decoded);
    } catch (error) {
      console.error("JWT Decode Error:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.error("Login Failed")} />
    </div>
  );
};

export default GoogleLoginButton;
