import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LossChart({ lossArray }) {
    // Prepare data for the chart
    const data = {
        labels: lossArray.map((entry) => `Train ${entry.trial}`), // X-axis labels
        datasets: [
            {
                label: "Loss",
                data: lossArray.map((entry) => entry.loss), // Y-axis values
                borderColor: "#8ACE00",    
                backgroundColor: "#8ACE00",
                tension: 0.3, // Smooth line
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: "top",
                
            },
            title: {
                display: true,
                text: "Loss Per Train",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => Number(value).toFixed(5), // Format Y-axis values
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}
