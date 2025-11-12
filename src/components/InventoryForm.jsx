import axios from 'axios';
import { useEffect, useState } from 'react';

export default function InventoryForm({ item, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        section: '',
        category: '',
        size: '',
        quantity: 0,
        unit: 'sq.m'
    });

    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (item) {
                await axios.put(`http://localhost:8000/api/inventory/${item.id}`, formData);
            } else {
                await axios.post('http://localhost:8000/api/inventory/', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving inventory:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">{item ? 'Edit' : 'Add'} Inventory Item</h3>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="Section (e.g., A)"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category (e.g., red granite)"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="Size (e.g., medium)"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                    className="border p-2 rounded"
                    step="0.01"
                    required
                />
                <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="sq.m">sq.m</option>
                    <option value="boxes">boxes</option>
                </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </div>
        </form>
    );
}
