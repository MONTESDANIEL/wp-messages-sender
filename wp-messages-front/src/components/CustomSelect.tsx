import { useEffect, useRef, useState } from "react";

interface Option {
    id: string;
    name: string;
}

interface DropdownProps {
    options: Option[]; // Cambiado para aceptar un array de objetos Option
    onSelect?: (option: string) => void;
    placeholder?: string;
    selectedOption?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    onSelect,
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
        <div className="relative inline-block text-left w-full" ref={dropdownRef}>
            <button
                type="button"
                className="inline-flex justify-between w-full px-2 py-3 text-sm font-medium text-gray-700 dark:text-neutral-500 bg-white dark:bg-neutral-900 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer"
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
            {isOpen && (
                <div
                    className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                >
                    <div className="py-1 max-h-60 overflow-auto">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left cursor-pointer"
                                onClick={() => handleOptionClick(option.name)}
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;