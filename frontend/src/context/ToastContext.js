import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // Type: 'success' | 'error' | 'info'
    const addToast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container - Fixed Position */}
            <div className="fixed top-5 right-5 z-[9999] space-y-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm min-w-[300px] animate-in slide-in-from-right duration-300 ${toast.type === "success"
                                ? "bg-white/90 dark:bg-gray-800/90 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400"
                                : toast.type === "error"
                                    ? "bg-white/90 dark:bg-gray-800/90 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
                                    : "bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
                            }`}
                    >
                        {/* Icon */}
                        <div className={`p-1 rounded-full ${toast.type === "success" ? "bg-green-100 dark:bg-green-900/30" :
                                toast.type === "error" ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"
                            }`}>
                            {toast.type === "success" && <FiCheckCircle size={18} />}
                            {toast.type === "error" && <FiAlertCircle size={18} />}
                            {toast.type === "info" && <FiAlertCircle size={18} />}
                        </div>

                        {/* Message */}
                        <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                            {toast.message}
                        </p>

                        {/* Close Button */}
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
