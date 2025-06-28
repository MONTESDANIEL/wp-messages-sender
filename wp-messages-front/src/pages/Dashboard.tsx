import * as React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { MessageCircle, MessageCircleReply, MessageCircleWarning, MessageCircleX } from "lucide-react";
import { motion } from "framer-motion";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const mensajesPorHora = [
    12, 8, 5, 3, 2, 4, 10, 25, 40, 60, 20, 40,
    120, 110, 90, 70, 60, 55, 50, 45, 30, 20, 15, 10
];

const mensajesPorDia = [
    120, 180, 150, 200, 250, 300, 270, 310, 280, 260, 230, 290,
    320, 340, 360, 380, 400, 390, 370, 350, 330, 310, 290, 270,
    250, 230, 210, 190, 170, 150, 130
];

const instancias = [
    { name: "Instancia 1", value: 1020 },
    { name: "Instancia 2", value: 380 },
    { name: "Instancia 3", value: 300 },
    { name: "Instancia 4", value: 250 },
    { name: "Instancia 5", value: 500 },
];

const Dashboard: React.FC = () => {

    const barData = {
        labels: ["Enviados", "No Enviados", "Pendientes", "Contestados"],
        datasets: [
            {
                label: "Estado de Mensajes",
                data: [580, 320, 45, 10],
                backgroundColor: ["#22c55e", "#ef4444", "#facc15", "#2b7fff"],
                borderColor: ["#16a34a", "#dc2626", "#fbbf24", "#3361a9"],
                borderWidth: 2,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        }
    };

    const pieData = {
        labels: instancias.map(i => i.name),
        datasets: [
            {
                label: "Mensajes",
                data: instancias.map(i => i.value),
                backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0"],
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    };

    const lineData = {
        labels: days,
        datasets: [
            {
                label: "Mensajes por Día",
                data: mensajesPorDia,
                borderColor: "#8884d8",
                backgroundColor: "rgba(136,132,216,0.5)",
                tension: 0.4,
            },
        ],
    };

    const hoursLineData = {
        labels: hours,
        datasets: [
            {
                label: "Horas de Envío",
                data: mensajesPorHora,
                borderColor: "#82ca9d",
                backgroundColor: "rgba(130,202,157,0.5)",
                tension: 0.4,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                // 1) Forzar auto‐skip y máximo de ticks
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 8,       // Muestra como máximo 8 etiquetas
                    maxRotation: 0,
                    minRotation: 0
                },
                grid: { display: false }
            },
            y: { beginAtZero: true }
        }
    };

    const cardChartClass = "col-span-3 lg:col-span-1 bg-white dark:bg-neutral-800 rounded shadow p-4";

    return (
        <section className="flex flex-col items-center bg-white dark:bg-neutral-950 mt-16 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                className="m-4 mb-10 text-center dark:text-white"
            >
                <h1 className="text-4xl font-bold m-2">Dashboard</h1>
                <p className="text-lg">Manage Your Messaging Workflow Seamlessly.</p>
            </motion.div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full mb-8">
                {[
                    { title: 'Enviados', value: 580, color: 'text-green-600', icon: <MessageCircle size={30} /> },
                    { title: 'No Enviados', value: 320, color: 'text-red-600', icon: <MessageCircleX size={30} /> },
                    { title: 'Pendientes', value: 45, color: 'text-yellow-500', icon: <MessageCircleWarning size={30} /> },
                    { title: 'Contestados', value: 10, color: 'text-blue-500', icon: <MessageCircleReply size={30} /> },
                ].map((stat) => (
                    <div
                        key={stat.title}
                        className="flex bg-white dark:bg-neutral-800 rounded shadow p-5 hover:scale-105 transition-transform"
                    >
                        <div
                            className="bg-neutral-200 dark:bg-neutral-700 flex justify-center rounded-xl items-center w-18 aspect-square dark:text-white"
                        >
                            {stat.icon}
                        </div>
                        <div className="flex flex-col pl-5">
                            <div className={`text-lg font-semibold ${stat.color} dark:${stat.color.replace('-600', '-400')}`}>
                                {stat.title}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold dark:text-white">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráficos */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

                {/* Mensajes por Día */}
                <div className={`${cardChartClass} lg:col-span-2`}>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 dark:text-white text-center">
                        Mensajes diarios enviados en {new Date().toLocaleString('es-ES', { month: 'long' })}
                    </h2>
                    <div className="flex-1 relative w-full h-[400px] p-4">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                {/* Estado de Mensajes */}
                <div className={cardChartClass}>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 dark:text-white text-center">
                        Resumen de Estados de Mensajes
                    </h2>
                    <div className="flex-1 relative w-full h-[400px] p-4">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                {/* Mensajes por Instancia */}
                <div className={cardChartClass}>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 dark:text-white text-center">
                        Distribución de Mensajes por Instancia
                    </h2>
                    <div className="flex-1 relative w-full h-[400px] p-4">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>

                {/* Horas de Envío por Mes */}
                <div className={`${cardChartClass} lg:col-span-2`}>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 dark:text-white text-center">
                        Distribución de Mensajes Enviados por Horas del Día
                    </h2>
                    <div className="flex-1 relative w-full h-[400px] p-4">
                        <Line data={hoursLineData} options={lineOptions} />
                    </div>
                </div>

            </section>
        </section>
    );
};

export default Dashboard;
