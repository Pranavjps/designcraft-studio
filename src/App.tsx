import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import Analytics from './pages/Analytics';
import KnowledgeBase from './pages/KnowledgeBase';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import Orders from './pages/Orders';
import Campaigns from './pages/Campaigns';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
    return (
        <>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Dashboard Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="conversations" element={<Conversations />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="knowledge-base" element={<KnowledgeBase />} />
                    <Route path="integrations" element={<Integrations />} />
                    <Route path="settings" element={<Settings />} />

                    {/* CRM Module Routes */}
                    <Route path="leads" element={<Leads />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="contacts" element={<Contacts />} />
                    <Route path="deals" element={<Deals />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="campaigns" element={<Campaigns />} />
                    <Route path="documents" element={<Documents />} />

                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
