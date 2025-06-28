import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Check, Timer, X } from "lucide-react";
import { FixedSizeList as List } from "react-window";

const Queue: React.FC = () => {
    const rows = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        number: Math.floor(1000000000 + Math.random() * 9000000000),
        status: ["sended", "error", "pending"][i % 3],
    }));

    const containerVariants = {
        hidden: { opacity: 0, height: 20 },
        visible: { opacity: 1, height: "auto" },
    };

    const RowComponent = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const row = rows[index];
        return (
            <div
                style={style}
                className={`flex justify-between p-4 ${index % 2 === 0
                    ? "bg-neutral-200 dark:bg-neutral-800"
                    : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
            >
                <div className="flex flex-col">
                    <span className="font-bold text-gray-700 dark:text-gray-200">{row.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{row.number}</span>
                </div>
                <span
                    className={`flex items-center font-semibold ${row.status === "sended"
                        ? "text-green-500"
                        : row.status === "error"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                >
                    {row.status === "sended" ? <Check /> : row.status === "error" ? <X /> : <Timer />}
                </span>
            </div>
        );
    };

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

            {[...Array(3)].map((_, index) => {
                const [isOpen, setIsOpen] = useState(false);

                return (
                    <motion.div
                        key={index}
                        className="w-full bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg shadow-md my-2 max-w-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="font-bold cursor-pointer hover:text-green-500 flex justify-between items-center group dark:text-white p-4"
                        >
                            <h2 className="text-xl font-bold text-center flex-grow">
                                INSTANCE {index + 1}
                            </h2>
                            <span
                                className={`ml-2 text-lg transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            >
                                <ArrowDown />
                            </span>
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="w-full p-2 my-2 rounded focus:outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    />
                                    <List
                                        height={500}
                                        itemCount={rows.length}
                                        itemSize={80}
                                        width="100%"
                                        className="rounded-lg"
                                    >
                                        {({ index, style }) => (
                                            <RowComponent key={rows[index].id} index={index} style={style} />
                                        )}
                                    </List>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </section>
    );
};

export default Queue;
