import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import InventoryList from '../components/InventoryList';
import Layout from '../components/Layout';
import SearchFilter from '../components/SearchFilter';
import Transactions from '../components/Transactions';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'inventory',
                element: <InventoryList />,
            },
            {
                path: 'transactions',
                element: <Transactions />,
            },
            {
                path: 'search',
                element: <SearchFilter />,
            },
        ]
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;