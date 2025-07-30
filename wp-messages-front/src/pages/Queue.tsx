import React, { useEffect, useState } from "react";
import { getTextQueueForInstance, getMediaQueueForInstance } from "../api/Queue.js";
import LoadingScreen from "../components/LoadingScreen.js";
import QueueList from "../components/QueueList.js";
import { motion } from "framer-motion";
import { ListX } from "lucide-react";
import { useStatusUpdates } from "../hooks/UseStatusUpdate.tsx";

interface TextMessage {
    id: number;
    instance: string;
    number: string;
    status: "pending" | "sended" | "failed";
    text: string;
    createdAt?: string;
}

interface MediaMessage {
    id: number;
    number: string;
    instance: string;
    mediatype: "image" | "video";
    media: string;
    caption?: string;
    status?: "pending" | "sended" | "failed";
    createdAt?: string;
}

interface QueueInstance {
    textQueue: TextMessage[];
    mediaQueue: MediaMessage[];
    searchText: string;
}

const Queue: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [queues, setQueues] = useState<Record<string, QueueInstance>>({});
    const [activeTab, setActiveTab] = useState<string>("");

    const instanceNames = ["WP_DANIEL"];

    useEffect(() => {
        const fetchQueuesForInstances = async () => {
            try {
                const fetched = await Promise.all(
                    instanceNames.map(async (instance) => {
                        const textQueue = await getTextQueueForInstance(instance);
                        const mediaQueue = await getMediaQueueForInstance(instance);
                        return { instance, textQueue, mediaQueue };
                    })
                );

                const result: Record<string, QueueInstance> = {};
                fetched.forEach(({ instance, textQueue, mediaQueue }) => {
                    result[instance] = {
                        textQueue,
                        mediaQueue,
                        searchText: queues[instance]?.searchText ?? "",
                    };
                });

                setQueues(result);
            } catch (e) {
                console.error("Error obteniendo colas:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchQueuesForInstances();
    }, []);

    useStatusUpdates((update: TextMessage | MediaMessage) => {
        const isText = "text" in update;
        const { id, instance, status } = update;

        if (!status) return; // Seguridad: MediaMessage sin status no se actualiza

        setQueues((prev) => {
            const current = prev[instance];
            if (!current) return prev;

            if (isText) {
                // Only update textQueue, keeping type safety
                const updatedTextQueue = current.textQueue.map((msg) =>
                    msg.id === id ? { ...msg, status } : msg
                );
                return {
                    ...prev,
                    [instance]: {
                        ...current,
                        textQueue: updatedTextQueue,
                    },
                };
            } else {
                // Only update mediaQueue, keeping type safety
                const updatedMediaQueue = current.mediaQueue.map((msg) =>
                    msg.id === id ? { ...msg, status } : msg
                );
                return {
                    ...prev,
                    [instance]: {
                        ...current,
                        mediaQueue: updatedMediaQueue,
                    },
                };
            }
        });
    });

    const handleSearchChange = (instance: string, value: string) => {
        setQueues((prev) => ({
            ...prev,
            [instance]: {
                ...prev[instance],
                searchText: value,
            },
        }));
    };

    const clearTextQueue = (instance: string) => {
        setQueues((prev) => ({
            ...prev,
            [instance]: {
                ...prev[instance],
                textQueue: [],
            },
        }));
    };

    const clearMediaQueue = (instance: string) => {
        setQueues((prev) => ({
            ...prev,
            [instance]: {
                ...prev[instance],
                mediaQueue: [],
            },
        }));
    };

    if (loading) return <LoadingScreen />;

    return (
        <section className="flex flex-col justify-center items-center bg-white dark:bg-neutral-950 mt-16 p-6 min-h-[85vh] w-full">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                className="m-4 mb-6 text-center dark:text-white"
            >
                <h1 className="text-4xl font-bold m-2">Queue</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-300">Visualiza y administra la cola de mensajes pendientes por enviar.</p>
            </motion.div>

            {/* Tabs */}
            <div className="rounded-lg max-w-5xl mx-auto mb-4">
                <nav className="flex justify-center space-x-4">
                    {Object.keys(queues).map((instance) => (
                        <button
                            key={instance}
                            className={`px-4 py-2 rounded-md font-semibold text-sm dark:text-white cursor-pointer ${activeTab === instance
                                ? "bg-neutral-200 dark:bg-neutral-800"
                                : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                }`}
                            onClick={() => setActiveTab(instance)}
                        >
                            {instance}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {activeTab && (
                <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 w-full max-w-7xl">
                    <div className="flex justify-between items-center gap-2 my-4">
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="w-full p-2 rounded bg-neutral-200 dark:bg-neutral-800 dark:text-white "
                            value={queues[activeTab].searchText}
                            onChange={(e) => handleSearchChange(activeTab, e.target.value)}
                        />
                        <div className="flex justify-center items-center rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-400 dark:hover:bg-neutral-700 p-2 cursor-pointer">
                            <button
                                onClick={() => clearMediaQueue(activeTab)}
                                className="text-sm text-red-500 cursor-pointer"
                            >
                                <ListX />
                            </button>
                        </div>
                    </div>

                    <div className="lg:flex flex-row gap-5">
                        {/* Text Queue */}
                        <div className="w-full mb-6 lg:mb-0">
                            <h2 className="text-2xl font-bold dark:text-white mb-4 lg:text-center">Text Queue</h2>
                            <QueueList
                                messages={queues[activeTab].textQueue
                                    .filter(
                                        (msg) =>
                                            msg.text.toLowerCase().includes(queues[activeTab].searchText.toLowerCase()) ||
                                            msg.number.includes(queues[activeTab].searchText)
                                    )
                                    .slice()
                                    .reverse()
                                }
                                type="text"
                            />
                        </div>
                        {/* Media Queue */}
                        <div className="w-full">
                            <h2 className="text-2xl font-bold dark:text-white mb-4 lg:text-center">Media Queue</h2>
                            <QueueList
                                messages={queues[activeTab].mediaQueue
                                    .filter(
                                        (msg) =>
                                            (msg.caption?.toLowerCase().includes(queues[activeTab].searchText.toLowerCase()) ?? false) ||
                                            msg.number.includes(queues[activeTab].searchText)
                                    )
                                    .slice()
                                    .reverse()
                                }
                                type="media"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Queue;
