import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Inventory Management</h1>
                    <div className="space-x-4">
                        <Link to="/" className="hover:underline">Dashboard</Link>
                        <Link to="/inventory" className="hover:underline">Inventory</Link>
                        <Link to="/transactions" className="hover:underline">Transactions</Link>
                        <Link to="/search" className="hover:underline">Search</Link>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}
