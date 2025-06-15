import React from 'react';

const Footer: React.FC = () => {
    return (
        <header className="w-full py-8 px-4 bg-neutral-100 dark:bg-neutral-900">
            {/* Contenedor del logo */}
            <div className="flex flex-col lg:flex-row gap-3 lg:justify-between text-sm text-center lg:text-left dark:text-neutral-400">
                <span>@ {new Date().getFullYear()} - Daniel Montes. Todos los derechos reservados.</span>
                <span>
                    <a href="/terms" className="hover:text-green-500">
                        Términos y condiciones
                    </a>{" "}
                    |{" "}
                    <a href="/privacy" className="hover:text-green-500">
                        Avisos de privacidad
                    </a>{" "}
                    |{" "}
                    <a href="/cookies" className="hover:text-green-500">
                        Política de cookies
                    </a>
                </span>
            </div>
        </header>
    );
};

export default Footer;
