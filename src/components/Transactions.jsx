import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        customer: { name: '', address: '', phone: '' },
        inventory_id: '',
        type: 'sale',
        quantity: 0,
        invoice_no: '',
        remarks: ''
    });
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        fetchTransactions();
        fetchInventory();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/transactions/');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('customer.')) {
            setFormData({
                ...formData,
                customer: { ...formData.customer, [name.split('.')[1]]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/transactions/', formData);
            setFormData({
                customer: { name: '', address: '', phone: '' },
                inventory_id: '',
                type: 'sale',
                quantity: 0,
                invoice_no: '',
                remarks: ''
            });
            fetchTransactions();
            fetchInventory(); // Refresh inventory after transaction
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Transactions</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-6">
                <h3 className="text-lg font-bold mb-4">Record Transaction</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="customer.name"
                        value={formData.customer.name}
                        onChange={handleChange}
                        placeholder="Customer Name"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="customer.address"
                        value={formData.customer.address}
                        onChange={handleChange}
                        placeholder="Customer Address"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="customer.phone"
                        value={formData.customer.phone}
                        onChange={handleChange}
                        placeholder="Customer Phone"
                        className="border p-2 rounded"
                    />
                    <select
                        name="inventory_id"
                        value={formData.inventory_id}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Inventory Item</option>
                        {inventory.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.section} - {item.category} - {item.size} ({item.quantity} {item.unit})
                            </option>
                        ))}
                    </select>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="sale">Sale</option>
                        <option value="return">Return</option>
                    </select>
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
                    <input
                        type="text"
                        name="invoice_no"
                        value={formData.invoice_no}
                        onChange={handleChange}
                        placeholder="Invoice No."
                        className="border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Remarks"
                        className="border p-2 rounded"
                    />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Record Transaction
                </button>
            </form>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className="border-t">
                                <td className="px-4 py-2">{t.customer_name}</td>
                                <td className="px-4 py-2">{t.inventory}</td>
                                <td className="px-4 py-2">{t.type}</td>
                                <td className="px-4 py-2">{t.quantity}</td>
                                <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{t.invoice_no || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
