import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { getTextQueueForInstance, getMediaQueueForInstance } from "../api/Queue.js";
import LoadingScreen from "../components/LoadingScreen.js";

interface TextMessage {
    number: string;
    instance: string;
    text: string;
}

interface MediaMessage {
    number: string;
    instance: string;
    mediatype: "image" | "video";
    caption?: string;
    media: string;
}
interface InstanceQueue {
    instance: string;
    textQueue: TextMessage[];
    mediaQueue: MediaMessage[];
    isOpen: boolean;
}

const Queue: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [instances, setInstances] = useState<InstanceQueue[]>([]);

    useEffect(() => {
        const fetchQueuesForInstances = async () => {
            const instanceNames = ["WP_DANIEL"]; // Lista de instancias
            try {
                const fetchedInstances = await Promise.all(
                    instanceNames.map(async (instance) => {
                        const textQueue = await getTextQueueForInstance(instance);
                        const mediaQueue = await getMediaQueueForInstance(instance);
                        return {
                            instance,
                            textQueue,
                            mediaQueue,
                            isOpen: false, // Estado inicial de cada instancia
                        };
                    })
                );
                setInstances(fetchedInstances);
            } catch (error) {
                console.error("Error obteniendo las colas de las instancias:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQueuesForInstances();
    }, []);

    const toggleInstance = (index: number) => {
        setInstances((prevInstances) =>
            prevInstances.map((instance, i) =>
                i === index ? { ...instance, isOpen: !instance.isOpen } : instance
            )
        );
    };

    const containerVariants = {
        hidden: { opacity: 0, height: 20 },
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
                <h1 className="text-4xl font-bold m-2">Queue</h1>
                <p className="text-lg">Monitor and manage your message queue efficiently.</p>
            </motion.div>

            {instances.map((instance, index) => (
                <motion.div
                    key={instance.instance}
                    className="w-full bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg shadow-md my-2 max-w-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div
                        onClick={() => toggleInstance(index)}
                        className="font-bold cursor-pointer hover:text-green-500 flex justify-between items-center group dark:text-white p-4"
                    >
                        <h2 className="text-xl font-bold text-center flex-grow">
                            {instance.instance}
                        </h2>
                        <span
                            className={`ml-2 text-lg transform transition-transform duration-200 ${instance.isOpen ? "rotate-180" : ""
                                }`}
                        >
                            <ArrowDown />
                        </span>
                    </div>
                    <AnimatePresence>
                        {instance.isOpen && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={containerVariants}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <h3 className="font-semibold text-xl m-2 dark:text-white">Text Queue</h3>
                                <div className="rounded-lg overflow-hidden mb-8">
                                    {instance.textQueue.length > 0 ? (
                                        <div
                                            style={{
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {instance.textQueue.map((message, index) => (
                                                <div
                                                    key={index}
                                                    className={`lg:flex justify-between p-4 ${index % 2 === 0
                                                        ? "bg-neutral-200 dark:bg-neutral-800"
                                                        : "bg-neutral-300 dark:bg-neutral-700"
                                                        }`}
                                                >
                                                    <p className="text-neutral-700 dark:text-neutral-200 font-bold">
                                                        {message.number.slice(2)}
                                                    </p>
                                                    <p className="text-neutral-500 dark:text-neutral-400">{message.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-900">
                                            <p className="text-neutral-500 dark:text-neutral-400">No hay mensajes de texto en cola.</p>
                                        </div>
                                    )}
                                </div>


                                <h3 className="font-semibold text-xl m-2 dark:text-white">Media Queue</h3>
                                <div className="rounded-lg overflow-hidden">
                                    {instance.mediaQueue.length > 0 ? (
                                        <div
                                            style={{
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                            }}
                                        >
                                            {instance.mediaQueue.map((message, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex justify-between p-4 ${index % 2 === 0
                                                        ? "bg-neutral-200 dark:bg-neutral-800"
                                                        : "bg-neutral-300 dark:bg-neutral-700"
                                                        } ${index === instance.mediaQueue.length - 1 ? "rounded-b-lg" : ""}`}
                                                >
                                                    <div>
                                                        <p className="text-neutral-700 dark:text-neutral-200 font-bold">{message.number.slice(2)}</p>
                                                        <p className="text-neutral-500 dark:text-neutral-400 truncate block md:hidden">
                                                            {message.caption || <span className="italic text-xs">Sin caption</span>}
                                                        </p>
                                                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">{message.mediatype === "image" ? "Imagen" : "Video"}</p>
                                                    </div>
                                                    <div className="flex items-center hidden md:flex justify-center w-full">
                                                        <p className="text-neutral-500 dark:text-neutral-400 truncate">
                                                            {message.caption || <span className="italic text-xs">Sin caption</span>}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center w-12 h-10">
                                                        {message.mediatype === "image" ? (
                                                            <img
                                                                src={message.media}
                                                                alt="preview"
                                                                className="w-10 h-10 object-cover rounded-full border border-gray-300 dark:border-gray-700"
                                                            />
                                                        ) : message.mediatype === "video" ? (
                                                            <video
                                                                src={message.media}
                                                                className="w-10 h-10 object-cover rounded-full border border-gray-300 dark:border-gray-700"
                                                                muted
                                                                playsInline
                                                                preload="metadata"
                                                            >
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-900">
                                            <p className="text-gray-500 dark:text-gray-400">No hay mensajes de media en cola.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </section>
    );
};

export default Queue;
