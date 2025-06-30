import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import Dropdown from "./CustomSelect";
import { motion, AnimatePresence } from "framer-motion";

export const NavBar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Bulk Messaging", href: "/bulkMessaging" },
        // { name: "Status Publisher", href: "/statusPublisher" },
        { name: "Queue", href: "/queue" },
        { name: "Instances", href: "/instances" },
    ];

    return (
        <header className="fixed top-0 w-full flex justify-between items-center py-2 px-5 z-10 bg-neutral-300 dark:bg-neutral-900">
            {/* Mobile Menu Button */}
            <div className="xl:hidden">
                <motion.button
                    type="button"
                    onClick={toggleMenu}
                    className="p-3 dark:text-white cursor-pointer"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: isMenuOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.div>
                </motion.button>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-end xl:justify-start w-[20%]">
                <a href="/">
                    <img className="p-2 h-12 object-contain" src="/whatsappIcon.png" alt="WhatsApp Sender Logo" />
                    <span className="sr-only">WhatsApp Sender</span>
                </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden xl:flex justify-center flex-grow gap-x-10 dark:text-white w-[60%]">
                {menuLinks.map((link) => (
                    <a key={link.name} href={link.href} className="hover:text-green-500 text-sm">
                        {link.name}
                    </a>
                ))}
            </div>

            {/* Profile Dropdown */}
            <div className="hidden xl:flex justify-end items-center w-[20%]">
                <div>
                    <Dropdown
                        options={[
                            { id: "1", name: "Profile", className: "text-neutral-500 hover:text-neutral-950 hover:dark:text-neutral-100" },
                            { id: "2", name: "Logout", className: "text-red-500 hover:text-red-700" },
                        ]}
                        className="w-auto"
                        selectedOption={"Daniel Amaya Montes"}
                        onSelect={(value) => console.log(value)}
                        placeholder="Menu"
                    />
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mt-16 z-20 fixed inset-y-0 left-0 w-full max-w-xs p-3 text-neutral-500 bg-neutral-200 dark:bg-neutral-800 shadow-lg"
                        role="dialog"
                        aria-modal="true"
                    >
                        <nav className="flow-root">
                            <motion.ul
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={{
                                    hidden: { opacity: 0, y: -20 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            staggerChildren: 0.1,
                                        },
                                    },
                                }}
                            >
                                {menuLinks.map((link) => (
                                    <motion.li
                                        key={link.name}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                    >
                                        <a
                                            href={link.href}
                                            className="block p-3 hover:text-black dark:hover:text-white text-sm"
                                        >
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                                <motion.li
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                >
                                    <div className="flex justify-end items-center py-3">
                                        <Dropdown
                                            options={[
                                                { id: "1", name: "Profile", className: "text-neutral-500 hover:text-neutral-950 hover:dark:text-neutral-100" },
                                                { id: "2", name: "Logout", className: "text-red-500 hover:text-red-700" },
                                            ]}
                                            selectedOption={"Daniel Amaya Montes"}
                                            onSelect={(value) => console.log(value)}
                                            placeholder="Menu"
                                        />
                                    </div>
                                </motion.li>
                            </motion.ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export const SmallNavBar: React.FC = () => {
    return (
        <header className="fixed top-0 w-full flex items-center py-2 px-5 bg-neutral-300 dark:bg-neutral-900">
            <a href="/login">
                <img className="p-2 h-12 object-contain" src="/whatsappIcon.png" alt="WhatsApp Sender Logo" />
                <span className="sr-only">WhatsApp Sender</span>
            </a>
        </header>
    );
}