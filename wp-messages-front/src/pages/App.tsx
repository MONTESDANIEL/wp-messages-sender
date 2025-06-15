import React, { useEffect, useState } from 'react';
import { sendMassiveMediaMessages, fetchInstances } from '../api/EvolutionApi.js';
import LoadingScreen from '../components/LoadingScreen';
import CustomSelect from '../components/CustomSelect';
import { Workbook } from 'exceljs';

const App: React.FC = () => {
    interface FormData {
        instance: string;
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
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        instance: '',
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
        setSubmitting(true);

        try {
            const messages = excelData.map(({ number, name }) => ({
                numberRecipient: number,
                media: formData.imagen,
                caption: formData.mensaje.replace("{name}", name),
                mediatype: 'image',
                mimetype: 'image/jpeg',
                instance: formData.instance,
            }));

            console.log('Enviando mensajes:', messages);

            await sendMassiveMediaMessages({ messages });
        } catch (error) {
            console.error('Ocurrió un error inesperado', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || submitting) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-neutral-950 py-15 px-8">
            <h1 className="text-4xl font-bold mb-4 text-center dark:text-white">Enviar Mensajes Masivos</h1>
            <div className="bg-neutral-100 dark:bg-neutral-900 m-6 p-6 rounded-xl shadow-md w-full max-w-xl">
                <form className="flex flex-col gap-4" onSubmit={messageHandler}>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white" htmlFor="file">
                            Subir archivo Excel
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="w-full border rounded-lg px-3 py-2 dark:text-white"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-2 dark:text-white" htmlFor="instance">
                            Seleccione una instancia
                        </label>
                        <CustomSelect
                            options={instances.map((instance) => ({ id: instance.id, name: instance.name }))}
                            selectedOption={formData.instance}
                            onSelect={(value) => setFormData({ ...formData, instance: value })}
                            placeholder="Seleccione una instancia"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white" htmlFor="imagen">
                            URL de imagen
                        </label>
                        <input
                            type="text"
                            id="imagen"
                            name="imagen"
                            className="w-full border rounded-lg px-3 py-2 dark:text-white"
                            placeholder="https://..."
                            value={formData.imagen}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white" htmlFor="mensaje">
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
                        disabled={submitting}
                    >
                        {submitting ? 'Enviando...' : 'Enviar mensajes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
