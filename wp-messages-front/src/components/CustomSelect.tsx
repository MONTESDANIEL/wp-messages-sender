import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    id: string;
    name: string;
    className?: string;
}

interface DropdownProps {
    options: Option[];
    onSelect?: (option: string) => void;
    className?: string;
    placeholder?: string;
    selectedOption?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    onSelect,
    className = "",
    placeholder = "Selecciona una opción",
    selectedOption,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (option: string) => {
        setIsOpen(false);
        if (onSelect) {
            onSelect(option);
        }
    };

    return (
        <div className="relative inline-block text-center w-full" ref={dropdownRef}>
            <button
                type="button"
                className={`
        inline-flex justify-between w-full px-3 py-3 text-sm font-medium rounded-md text-neutral-800 dark:text-neutral-100
        cursor-pointer ${className || ""} ${isOpen ? "bg-neutral-200 dark:bg-neutral-800" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption || placeholder}
                <svg
                    className="w-5 h-5 ml-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute w-full bg-neutral-200 dark:bg-neutral-800 mt-2 text-neutral-900 dark:text-neutral-200 rounded-md"
                        role="menu"
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                    >
                        <div className="max-h-60 overflow-auto rounded-md focus:outline-none">
                            {options.map((option) => (
                                <button
                                    key={option.id}
                                    className={`block w-full px-4 py-2 text-sm text-left cursor-pointer ${option.className || "hover:text-green-500"}`}
                                    onClick={() => handleOptionClick(option.name)}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;