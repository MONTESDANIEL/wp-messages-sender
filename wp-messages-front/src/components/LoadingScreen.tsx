import React from "react";

const LoadingScreen: React.FC = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900 z-50">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-neutral-900 border-t-neutral-300 dark:border-white dark:border-t-neutral-600 rounded-full animate-spin"></div>
            <span className="mt-4 text-neutral-900 dark:text-white font-semibold">Cargando...</span>
        </div>
    </div>
);

export default LoadingScreen;