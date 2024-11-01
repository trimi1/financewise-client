import React from 'react';
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function DepenseChart({ categories, depenses }) {
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const chartData = {
        labels: categories.map(category => category.name),
        datasets: [{
            label: 'Montants par catégorie',
            data: categories.map(category => {
                return depenses
                    .filter(depense => depense.categorie && depense.categorie.name === category.name)
                    .reduce((sum, depense) => sum + depense.montant, 0);
            }),
            backgroundColor: categories.map(() => getRandomColor()),
            borderColor: categories.map(() => getRandomColor().replace(/0\.2$/, '1')),
            borderWidth: 2,
            responsive: true,
            maintainAspectRatio: true
        }]
    };

    return (
        <div style={{ width: '500px' }}>
            <Pie data={chartData} />
        </div>
    );
}

export default DepenseChart;
