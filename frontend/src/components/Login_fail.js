import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';

export default function Login({ onSuccess }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Sign in to EEG Stress Detection
        </h2>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const user = jwtDecode(credentialResponse.credential);
            console.log("User Info:", user);
            onSuccess(user);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
}
