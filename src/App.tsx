import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Conversations = lazy(() => import('./pages/Conversations'));
const Analytics = lazy(() => import('./pages/Analytics'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Settings = lazy(() => import('./pages/Settings'));
const Customers = lazy(() => import('./pages/Customers'));
const Leads = lazy(() => import('./pages/Leads'));
const Deals = lazy(() => import('./pages/Deals'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Documents = lazy(() => import('./pages/Documents'));
const Orders = lazy(() => import('./pages/Orders'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
);

function App() {
    return (
        <>
            <Suspense fallback={<LoadingFallback />}>
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
            </Suspense>
            <Toaster />
        </>
    );
}

export default App;
