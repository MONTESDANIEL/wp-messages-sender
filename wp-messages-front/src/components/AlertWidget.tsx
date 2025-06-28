import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para claves únicas

type AlertType = {
    id: string; // Cambiar a string para soportar identificadores UUID
    message: string;
    type: 'info' | 'success' | 'error' | 'default';
};

type AlertWidgetProps = {
    message: string;
    type: AlertType['type'];
};

const AlertWidget: React.FC<AlertWidgetProps> = ({ message, type }) => {
    const [alerts, setAlerts] = useState<AlertType[]>([]);

    const addAlert = (message: string, type: AlertType['type'] = 'info', duration = 3000) => {
        const id = uuidv4();
        setAlerts((prev) => {
            if (prev.some((alert) => alert.message === message && alert.type === type)) {
                return prev; // No añadir si ya existe una alerta similar
            }
            return [...prev, { id, message, type }];
        });

        setTimeout(() => {
            setAlerts((prev) => prev.filter((alert) => alert.id !== id));
        }, duration);
    };

    const removeAlert = (id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    useEffect(() => {
        if (message && !alerts.some((alert) => alert.message === message && alert.type === type)) {
            addAlert(message, type);
        }
    }, [message, type]);

    return (
        <div className="fixed bottom-4 right-4 space-y-4 z-50">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id} // Ahora cada clave será única
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center p-4 space-x-4 rounded-lg shadow-md text-white ${alert.type === 'info'
                            ? 'bg-blue-600'
                            : alert.type === 'success'
                                ? 'bg-green-600'
                                : alert.type === 'error'
                                    ? 'bg-red-600'
                                    : 'bg-gray-600'
                            }`}
                    >
                        <span>{alert.message}</span>
                        <button
                            onClick={() => removeAlert(alert.id)}
                            className="text-white hover:text-gray-200 cursor-pointer transition-colors"
                            aria-label="Close alert"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AlertWidget;
