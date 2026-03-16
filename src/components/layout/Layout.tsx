import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    BarChart3,
    BookOpen,
    Plug,
    Settings as SettingsIcon,

    Target,
    DollarSign,
    CheckSquare,
    FolderOpen,
    ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
    name: string;
    path: string;
    icon: any;
    section?: 'main' | 'crm' | 'analytics' | 'settings';
}

const navigation: NavItem[] = [
    // Main Section
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, section: 'main' },
    { name: 'Conversations', path: '/conversations', icon: MessageSquare, section: 'main' },

    // CRM Section
    { name: 'Leads', path: '/leads', icon: Target, section: 'crm' },
    { name: 'Contacts', path: '/contacts', icon: Users, section: 'crm' },
    { name: 'Deals', path: '/deals', icon: DollarSign, section: 'crm' },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, section: 'crm' },
    { name: 'Documents', path: '/documents', icon: FolderOpen, section: 'crm' },

    // Analytics Section
    { name: 'Analytics', path: '/analytics', icon: BarChart3, section: 'analytics' },
    { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen, section: 'analytics' },

    // Settings Section
    { name: 'Integrations', path: '/integrations', icon: Plug, section: 'settings' },
    { name: 'Settings', path: '/settings', icon: SettingsIcon, section: 'settings' },
];

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [crmExpanded, setCrmExpanded] = useState(true);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - ElevenLabs Style */}
            <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
                {/* Logo */}
                <div className="p-4">
                    <h1 className="font-bold text-lg text-foreground">Agentix</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 space-y-6">
                    {/* Home */}
                    <div>
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard'
                                ? 'bg-sidebar-active text-sidebar-active-foreground'
                                : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                }`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Home</span>
                        </Link>
                    </div>

                    {/* Configure Section */}
                    <div>
                        <p className="section-header">CONFIGURE</p>
                        <div className="space-y-0.5">
                            <Link
                                to="/conversations"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/conversations'
                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                    }`}
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Conversations</span>
                            </Link>
                            <Link
                                to="/knowledge-base"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/knowledge-base'
                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                    }`}
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Knowledge Base</span>
                            </Link>
                            <Link
                                to="/integrations"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/integrations'
                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                    }`}
                            >
                                <Plug className="h-4 w-4" />
                                <span>Integrations</span>
                            </Link>
                        </div>
                    </div>

                    {/* CRM Modules Section */}
                    <div>
                        <button
                            onClick={() => setCrmExpanded(!crmExpanded)}
                            className="flex items-center justify-between w-full section-header hover:text-foreground transition-colors"
                        >
                            <span>CRM MODULES</span>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${crmExpanded ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {crmExpanded && (
                            <div className="space-y-0.5">
                                {navigation
                                    .filter(item => item.section === 'crm')
                                    .map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* Monitor Section */}
                    <div>
                        <p className="section-header">MONITOR</p>
                        <div className="space-y-0.5">
                            <Link
                                to="/analytics"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/analytics'
                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                    }`}
                            >
                                <BarChart3 className="h-4 w-4" />
                                <span>Analytics</span>
                            </Link>
                            <Link
                                to="/campaigns"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/campaigns'
                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                    }`}
                            >
                                <Target className="h-4 w-4" />
                                <span className="flex-1">Campaigns</span>
                            </Link>
                        </div>
                    </div>

                    {/* Deploy Section */}
                    <div>
                        <p className="section-header">DEPLOY</p>
                        <div className="space-y-0.5">
                            <Link
                                to="/settings"
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/settings'
                                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                                    : 'text-sidebar-foreground hover:bg-sidebar-active hover:text-sidebar-active-foreground'
                                    }`}
                            >
                                <SettingsIcon className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-3 border-t border-sidebar-border">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-active cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user?.full_name || 'User'}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
