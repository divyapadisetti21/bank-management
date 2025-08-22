import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axiosConfig from '../api/axiosConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

const Summary = ({ refreshTrigger }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const { data: movements } = await axiosConfig.get('/transactions');
                const inflows = movements
                    .filter(m => m.amount > 0)
                    .reduce((acc, m) => acc + parseFloat(m.amount || 0), 0);
                const outflows = movements
                    .filter(m => m.amount < 0)
                    .reduce((acc, m) => acc + Math.abs(parseFloat(m.amount || 0)), 0);

                setChartData(
                    inflows > 0 || outflows > 0
                        ? {
                              labels: ['Inflows', 'Outflows'],
                              datasets: [
                                  {
                                      data: [inflows, outflows],
                                      backgroundColor: ['#22c55e', '#ef4444'],
                                  },
                              ],
                          }
                        : null
                );
            } catch (error) {
                console.error("Failed to fetch summary", error);
                setChartData(null);
            }
        };
        fetchAndProcessData();
    }, [refreshTrigger]);

    return (
        <div className="card">
            <h3>Transaction Summary</h3>
            <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
                {chartData ? <Pie data={chartData} /> : <p>No transaction data to display.</p>}
            </div>
        </div>
    );
};

export default Summary;
