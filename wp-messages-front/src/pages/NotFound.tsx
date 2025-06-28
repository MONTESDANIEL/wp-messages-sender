import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => (
    <div
        className="flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-950 text-gray-800 dark:text-gray-200 p-5 mt-16 min-h-[85vh]"
    >
        <motion.h1
            className="text-9xl font-bold text-green-600 dark:text-green-500 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            404
        </motion.h1>
        <motion.h2
            className="text-3xl font-semibold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
        >
            Página no encontrada
        </motion.h2>
        <motion.p
            className="text-md text-gray-600 dark:text-gray-400 mb-6 text-center max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
        >
            La página que buscas no existe, fue eliminada o el enlace es incorrecto.
        </motion.p>
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
        >
            <Link
                to="/"
                className="px-3 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 dark:hover:bg-green-600 transition duration-300"
            >
                Volver al inicio
            </Link>
        </motion.div>
    </div>
);

export default NotFound;
