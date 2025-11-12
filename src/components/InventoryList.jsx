import axios from 'axios';
import { useEffect, useState } from 'react';
import InventoryForm from './InventoryForm';

export default function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/inventory/');
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://localhost:8000/api/inventory/${id}`);
                fetchInventory();
            } catch (error) {
                console.error('Error deleting inventory:', error);
            }
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setEditingItem(null);
        fetchInventory();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Add Item
                </button>
            </div>
            {showForm && (
                <div className="mb-4">
                    <InventoryForm onSave={handleSave} onCancel={() => setShowForm(false)} />
                </div>
            )}
            {editingItem && (
                <div className="mb-4">
                    <InventoryForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
                </div>
            )}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Section</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Size</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Unit</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">{item.section}</td>
                                <td className="px-4 py-2">{item.category}</td>
                                <td className="px-4 py-2">{item.size}</td>
                                <td className="px-4 py-2">{item.quantity}</td>
                                <td className="px-4 py-2">{item.unit}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
