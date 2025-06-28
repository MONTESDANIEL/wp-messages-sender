import React, { useEffect, useState } from 'react';
import { sendMassiveMediaMessages, fetchInstances } from '../api/EvolutionApi.js';
import LoadingScreen from '../components/LoadingScreen.js';
import { motion } from 'framer-motion';

const Status: React.FC = () => {
    interface FormData {
        instances: string[];
        imagen: string;
        mensaje: string;
    }

    interface Instance {
        id: string;
        name: string;
        status: string;
    }

    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState<FormData>({
        instances: [],
        imagen: '',
        mensaje: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const fetchedInstances = await fetchInstances();
                setInstances(fetchedInstances);
            } catch (error) {
                console.error('Error obteniendo las instancias:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInstanceToggle = (id: string) => {
        const isSelected = formData.instances.includes(id);
        const updatedInstances = isSelected
            ? formData.instances.filter((instanceId) => instanceId !== id)
            : [...formData.instances, id];
        setFormData({ ...formData, instances: updatedInstances });
    };

    const toggleAllInstances = () => {
        if (formData.instances.length === instances.length) {
            setFormData({ ...formData, instances: [] });
        } else {
            setFormData({ ...formData, instances: instances.map((instance) => instance.id) });
        }
    };

    const messageHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('submitting');

        try {
            await sendMassiveMediaMessages();
            setStatus('success');
        } catch (error) {
            console.error('Error enviando mensajes:', error);
            setStatus('error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <section className="flex flex-col items-center justify-center bg-white dark:bg-neutral-950 mt-16 p-6 min-h-[85vh]">

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                className="m-4 text-center dark:text-white"
            >
                <h1 className="text-4xl font-bold m-2">Status Publisher</h1>
                <p className="text-lg">Track and publish message statuses efficiently and effortlessly.</p>
            </motion.div>


            <motion.div
                className="bg-neutral-100 dark:bg-neutral-900 m-5 p-5 rounded-xl shadow-md w-full max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <form className="flex flex-col gap-4" onSubmit={messageHandler}>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Seleccione una o más instancias
                        </label>
                        <div className="flex flex-col gap-2">
                            {instances.map((instance) => (
                                <label key={instance.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.instances.includes(instance.id)}
                                        onChange={() => handleInstanceToggle(instance.id)}
                                        className="w-4 h-4 accent-green-600 cursor-pointer"
                                    />
                                    <span className="text-sm dark:text-white">{instance.name}</span>
                                </label>
                            ))}
                            <button
                                type="button"
                                className="bg-neutral-500 text-white py-2 rounded hover:bg-neutral-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={toggleAllInstances}
                            >
                                {formData.instances.length === instances.length
                                    ? 'Deseleccionar Todo'
                                    : 'Seleccionar Todo'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white" htmlFor="imagen">
                            URL de imagen
                        </label>
                        <input
                            type="text"
                            id="imagen"
                            name="imagen"
                            className="w-full border rounded-lg px-3 py-2 dark:text-white"
                            placeholder="https://..."
                            value={formData.imagen}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white" htmlFor="mensaje">
                            Mensaje base
                        </label>
                        <textarea
                            id="mensaje"
                            name="mensaje"
                            className="w-full border rounded-lg px-3 py-2 dark:text-white"
                            placeholder="Escribe tu mensaje"
                            rows={2}
                            value={formData.mensaje}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={status === 'submitting'}
                    >
                        {status === 'submitting' ? 'Enviando...' : 'Enviar mensajes'}
                    </button>
                </form>
            </motion.div>
        </section>
    );
};

export default Status;
