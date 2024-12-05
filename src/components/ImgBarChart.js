import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function LabelBarChart({ imgArray, title, color="rgba(75, 192, 192, 0.7)", borderColor="rgba(75, 192, 192, 1)"}) {

    // Count the occurrences of each label
    
    const labelCounts = imgArray.reduce((acc, img) => {
        acc[img.label] = (acc[img.label] || 0) + 1;
        return acc;
    }, {});
    if (Object.keys(labelCounts).length < 1) {
        return null;
    }

    const totalImages = imgArray.length; // Total number of images

    const data = {
        labels: Object.keys(labelCounts), // Unique labels
        datasets: [
            {
                label: "Number of Images",
                data: Object.values(labelCounts), // Count of each label
                backgroundColor: color, // Bar color
                borderColor: borderColor, // Bar border color
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `${title} (${totalImages} images)`,
                font: {
                    size: 13,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Force ticks to increment by 1
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null; // Display only integers
                    },
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};
