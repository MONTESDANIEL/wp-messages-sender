import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    ></motion.div>

                    {/* Modal Content */}
                    <motion.div
                        className={`bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full relative m-5 ${size ? "max-w-" + size : "max-w-lg"}`}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, type: "spring" }}
                    >
                        <div className="flex justify-between p-4">
                            {title && (
                                <h2 className="text-xl font-semibold dark:text-white">
                                    {title}
                                </h2>
                            )}
                            <button
                                className="text-gray-500 dark:text-gray-300 hover:text-red-500 cursor-pointer"
                                onClick={onClose}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <hr className="text-neutral-300" />

                        {/* Content */}
                        <div>{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
