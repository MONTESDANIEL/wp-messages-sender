import React from 'react';

const NavBar: React.FC = () => {
    return (
        <header className="w-full py-3 bg-neutral-100 dark:bg-neutral-900">
            {/* Contenedor del logo */}
            <div className="flex items-center justify-start w-full px-5">
                <a href="/" className="flex-none w-24">
                    <img className="p-2 h-12 object-contain" src="/whatsappIcon.png" alt="WhatsApp Sender Logo" />
                    <span className="sr-only">WhatsApp Sender</span>
                </a>
            </div>
        </header>
    );
};

export default NavBar;
