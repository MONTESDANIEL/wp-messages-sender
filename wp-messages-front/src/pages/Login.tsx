import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
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
                    <h1 className="text-4xl font-bold mb-2">Iniciar Sesión</h1>
                    <p className="text-md text-neutral-500">
                        Ingresa tus credenciales para comenzar
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="user"
                        name="user"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border-b p-2 dark:text-white focus:outline-none mb-4 ${error && email === '' ? 'border-red-500' : ''}`}
                        placeholder="Usuario"
                    />
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full border-b p-2 dark:text-white focus:outline-none mb-4 ${error && password === '' ? 'border-red-500' : ''}`}
                        placeholder="Contraseña"
                    />
                    <div className="flex items-center my-5">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:bg-gray-700 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 bg-white border border-gray-300 dark:border-gray-600 h-4 w-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                        <span className="ml-3 text-sm dark:text-white">Recordarme</span>
                    </div>
                    <div className="text-red-500 mb-4">
                        {error && <small className="">{error}</small>}
                    </div>
                    <button type="submit" className='bg-green-500 w-full rounded-lg p-2 cursor-pointer'>Entrar</button>
                </form>
                <div className="mt-4 text-center">
                    <a href="/forgot-password" className="text-sm text-green-700 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </motion.div>
        </section>
    );
};

export default Login;