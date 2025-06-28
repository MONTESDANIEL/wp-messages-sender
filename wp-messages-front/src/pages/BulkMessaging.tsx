import React, { useEffect, useState } from 'react';
import { sendMassiveMediaMessages, fetchInstances } from '../api/EvolutionApi.js';
import LoadingScreen from '../components/LoadingScreen.js';
import { Workbook } from 'exceljs';
import AlertWidget from '../components/AlertWidget.js';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const BulkMessages: React.FC = () => {
    interface FormData {
        instance: string;
        mediaType: string;
        imagen: string;
        mensaje: string;
    }

    interface Instance {
        id: string;
        name: string;
        status: string;
    }

    interface ExcelData {
        number: string;
        name: string;
    }

    const [instances, setInstances] = useState<Instance[]>([]);
    const [excelData, setExcelData] = useState<ExcelData[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle'); // Usar un estado basado en cadenas
    const [formData, setFormData] = useState<FormData>({
        instance: '',
        mediaType: '',
        imagen: '',
        mensaje: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const instances = await fetchInstances();
                setInstances(instances);
            } catch (error) {
                console.error('Error obteniendo las instancias:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];

        const workbook = new Workbook();
        const reader = new FileReader();

        reader.onload = async (e) => {
            const buffer = e.target?.result;
            if (buffer instanceof ArrayBuffer) {
                await workbook.xlsx.load(buffer);
                const worksheet = workbook.getWorksheet(1);

                const extractedData: ExcelData[] = [];
                if (worksheet) {
                    worksheet.eachRow((row, rowIndex) => {
                        if (rowIndex > 1) { // Saltar encabezados
                            extractedData.push({
                                number: `57${row.getCell(1).text}`, // Asume que la columna A tiene los números
                                name: row.getCell(2).text, // Asume que la columna B tiene los nombres
                            });
                        }
                    });
                }

                setExcelData(extractedData);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const messageHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const messages = excelData.map(({ number, name }) => ({
                numberRecipient: number,
                media: formData.imagen,
                caption: formData.mensaje.replace("{name}", name),
                mediatype: formData.mediaType,
                instance: formData.instance,
            }));

            console.log(messages)

            await sendMassiveMediaMessages({ messages });
            window.location.reload();
            setStatus('success');

        } catch (error) {
            console.error('Error enviando mensajes:', error);
            setStatus('error');
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <section className="flex flex-col items-center justify-center bg-white dark:bg-neutral-950 mt-16 p-6 min-h-[85vh]">

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                className="m-4 text-center dark:text-white"
            >
                <h1 className="text-4xl font-bold m-2">Bulk Messaging</h1>
                <p className="text-lg"> Quickly send bulk messages with ease and efficiency.</p>
            </motion.div>

            <motion.div
                className="bg-neutral-100 dark:bg-neutral-900 m-5 p-5 rounded-xl shadow-md w-full max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <form className="flex flex-col gap-4" onSubmit={messageHandler}>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Subir archivo Excel
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="w-full border rounded-lg px-3 py-2 dark:text-white cursor-pointer"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Seleccione una instancia
                        </label>
                        <div className="relative w-full hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition">
                            <select
                                id="instance"
                                name="instance"
                                className="w-full border rounded-lg p-2 pr-10 dark:text-white appearance-none bg-neutral-100 dark:bg-neutral-900 cursor-pointer"
                                value={formData.instance}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione una instancia</option>
                                {instances.map((instance) => (
                                    <option key={instance.id} value={instance.name}>
                                        {instance.name}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600 pointer-events-none"
                            >
                                <ChevronDown />
                            </svg>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Tipo de mensaje
                        </label>
                        <div className="relative w-full hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition">
                            <select
                                id="mediaType"
                                name="mediaType"
                                className="w-full border rounded-lg p-2 pr-10 dark:text-white appearance-none bg-neutral-100 dark:bg-neutral-900 cursor-pointer"
                                value={formData.mediaType}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione un tipo de mensaje</option>
                                <option value="text">Texto</option>
                                <option value="video">Video</option>
                                <option value="image">Imagen</option>
                            </select>
                            <svg
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-600 pointer-events-none"
                            >
                                <ChevronDown />
                            </svg>
                        </div>
                    </div>
                    {
                        formData.mediaType === 'video' || formData.mediaType === 'image' ? (
                            <div>
                                <label className="block text-sm font-medium mb-2 dark:text-white">
                                    URL del adjunto
                                </label>
                                <input
                                    type="text"
                                    id="imagen"
                                    name="imagen"
                                    className="w-full border rounded-lg px-3 py-2 dark:text-white"
                                    placeholder="Ingresa la URL del archivo"
                                    value={formData.imagen}
                                    onChange={handleChange}
                                />
                            </div>
                        ) : null
                    }

                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                            Mensaje base
                        </label>
                        <textarea
                            id="mensaje"
                            name="mensaje"
                            className="w-full border rounded-lg px-3 py-2 dark:text-white"
                            placeholder="Escribe tu mensaje"
                            rows={5}
                            value={formData.mensaje}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enviar mensajes
                    </button>
                </form>
            </motion.div>

            {status === 'success' || status === 'error' ? (
                <AlertWidget
                    message={
                        status === 'success'
                            ? "Mensajes enviados"
                            : "Error al enviar mensajes"
                    }
                    type={status === 'success' ? "success" : "error"}
                />
            ) : null}

        </section>
    );
};

export default BulkMessages;
