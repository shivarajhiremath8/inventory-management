import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [summary, setSummary] = useState({});
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        fetchSummary();
        fetchInventory();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/transactions/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/inventory/');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const groupedInventory = inventory.reduce((acc, item) => {
        const key = `${item.section}-${item.category}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Sales</h3>
                    <p className="text-2xl">{summary.total_sales_count || 0}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Returns</h3>
                    <p className="text-2xl">{summary.total_returns_count || 0}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Quantity Sold</h3>
                    <p className="text-2xl">{summary.total_quantity_sold || 0}</p>
                </div>
            </div>
            <h3 className="text-xl font-bold mb-4">Inventory Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedInventory).map(([key, items]) => (
                    <div key={key} className="bg-white p-4 rounded shadow">
                        <h4 className="font-semibold">{key}</h4>
                        <ul>
                            {items.map(item => (
                                <li key={item.id} className="text-sm">
                                    {item.size}: {item.quantity} {item.unit}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
