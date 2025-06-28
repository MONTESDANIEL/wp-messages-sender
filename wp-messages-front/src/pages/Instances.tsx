import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Trash } from 'lucide-react';
import Modal from '../components/Modal';

const Instances: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [newInstance, setNewInstance] = React.useState(false);
    const [viewQR, setViewQR] = React.useState(false);

    interface Instance {
        id: string;
        name: string;
        profilePictureUrl: string; // URL de la imagen del perfil
        phoneNumber: string;
        status: 'active' | 'inactive';
    }

    const instances: Instance[] = [
        { id: '1', name: 'Instancia 1', profilePictureUrl: 'https://pps.whatsapp.net/v/t61.24694-24/487883000_3644539025846804_98480690479458295_n.jpg?ccb=11-4&oh=01_Q5Aa1wFTDwa8FSR_1CrzxE832HdvUx0EC57ouLVYeq0uBCKdkQ&oe=686BED0E&_nc_sid=5e03e0&_nc_cat=109', phoneNumber: '3054171043', status: 'active' },
        { id: '2', name: 'Instancia 2', profilePictureUrl: 'avatar.png', phoneNumber: '3054171044', status: 'inactive' },
        { id: '3', name: 'Instancia 3', profilePictureUrl: 'avatar.png', phoneNumber: '3054171045', status: 'active' },
    ];

    return (
        <section className="flex flex-col items-center justify-center bg-white dark:bg-neutral-950 mt-16 p-6 min-h-[85vh]">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                className="m-4 mb-10 text-center dark:text-white"
            >
                <h1 className="text-4xl font-bold m-2">Instancias</h1>
                <p className="text-lg">Administra y controla tus instancias de mensajería fácilmente.</p>
            </motion.div>

            <div className="w-full max-w-6xl px-4 flex justify-end mb-6">
                <motion.button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer shadow-md"
                    onClick={() => {
                        setIsOpen(true);
                        setNewInstance(true);
                    }}
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    aria-label="Agregar instancia"
                >
                    <span>Agregar instancia</span>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
                {instances.map((instance) => (
                    <motion.div
                        key={instance.id}
                        className="bg-neutral-100 dark:text-white dark:bg-neutral-800 rounded shadow p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex justify-center items-center mb-4">
                            <img className="w-25 h-25 rounded-full border-2 border-green-500" src={instance.profilePictureUrl} alt="Avatar" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{instance.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{instance.phoneNumber}</p>
                        <div className='flex justify-between items-center'>
                            <span className={`text-sm font-medium ${instance.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                                {instance.status === 'active' ? 'Activa' : 'Inactiva'}
                            </span>
                            <div className="flex space-x-2">
                                {instance.status === 'inactive' && (
                                    <button
                                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition cursor-pointer"
                                        onClick={() => {
                                            setIsOpen(true);
                                            setViewQR(true);
                                        }}
                                    >
                                        <QrCode size={20} />
                                    </button>
                                )}
                                <button className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition cursor-pointer">
                                    <Trash size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>


            {
                newInstance === true &&
                <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setNewInstance(false); }} title="Agregar Instancia">
                    <div className="p-4">
                        <form className="space-y-2">
                            <input
                                type="text"
                                className="block w-full p-2 border border-gray-300 dark:border-neutral-700 dark:text-white rounded-md"
                                placeholder='Nombre de la instancia'
                            />
                            <input
                                type="number"
                                className="block w-full p-2 border border-gray-300 dark:border-neutral-700 dark:text-white rounded-md"
                                placeholder='Número de teléfono'
                            />
                            <input
                                type="text"
                                className="block w-full p-2 border border-gray-300 dark:border-neutral-700 dark:text-white rounded-md"
                                placeholder='Contraseña de la instancia'
                            />
                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer">
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            }

            {
                viewQR === true &&

                <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setViewQR(false); }} title="Escanear QR" size="xs">
                    <div className="p-4">
                        <QrCode size={200} className="mx-auto mb-4 dark:text-white" />
                    </div>

                </Modal>

            }



        </section>
    );
};

export default Instances;