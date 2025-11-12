import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import Layout from './components/Layout';
import SearchFilter from './components/SearchFilter';
import Transactions from './components/Transactions';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="search" element={<SearchFilter />} />
                </Route>
            </Routes>
        </Router>
    );
}
