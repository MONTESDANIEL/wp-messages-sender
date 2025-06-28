import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación
        if (!email) {
            setError('Por favor, ingrega tu correo electrónico.');
            return;
        }
        setError('');
        // Simulación de login exitoso
        alert('Login exitoso');
    };

    return (
        <section className='flex flex-col items-center justify-center bg-white dark:bg-neutral-950 mt-16 p-6 min-h-[85vh]'>
            <motion.div
                className="bg-neutral-100 dark:bg-neutral-900 m-5 px-5 py-10 lg:p-10 rounded-xl shadow-md w-full max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className='dark:text-white mb-6 text-center'>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Recordar Contraseña</h1>
                    <p className="text-md text-neutral-500">
                        Ingresa tu correo para recuperar tu contraseña
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border-b p-2 dark:text-white focus:outline-none mb-4 ${error && email === '' ? 'border-red-500' : ''}`}
                        placeholder="Correo Electrónico"
                    />
                    <div className="text-red-500 mb-4">
                        {error && <small className="">{error}</small>}
                    </div>
                    <button type="submit" className='bg-green-500 w-full rounded-lg p-2 cursor-pointer'>Enviar</button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-sm text-green-700 hover:underline">
                        Iniciar Sesión
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default ForgotPassword;