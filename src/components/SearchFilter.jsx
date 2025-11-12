import axios from 'axios';
import { useState } from 'react';

export default function SearchFilter() {
    const [filters, setFilters] = useState({
        section: '',
        category: '',
        size: ''
    });
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.section) params.append('section', filters.section);
            if (filters.category) params.append('category', filters.category);
            if (filters.size) params.append('size', filters.size);
            const response = await axios.get(`http://localhost:8000/api/inventory/search/?${params}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error searching inventory:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Search & Filter Inventory</h2>
            <div className="bg-white p-6 rounded shadow-md mb-6">
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="section"
                        value={filters.section}
                        onChange={handleChange}
                        placeholder="Section (e.g., A)"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        placeholder="Category (e.g., red granite)"
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="size"
                        value={filters.size}
                        onChange={handleChange}
                        placeholder="Size (e.g., medium)"
                        className="border p-2 rounded"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>
            {results.length > 0 && (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Section</th>
                                <th className="px-4 py-2 text-left">Category</th>
                                <th className="px-4 py-2 text-left">Size</th>
                                <th className="px-4 py-2 text-left">Quantity</th>
                                <th className="px-4 py-2 text-left">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(item => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">{item.section}</td>
                                    <td className="px-4 py-2">{item.category}</td>
                                    <td className="px-4 py-2">{item.size}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">{item.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
