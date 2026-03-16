import { useState, useEffect } from 'react';
import {
    Users, Plus, Filter, Download, Search, Grid, List,
    MoreVertical, Phone, Mail, MapPin, TrendingUp,
    X, Edit, Trash2, Eye, MessageSquare, ChevronDown,
    ArrowUpDown, RefreshCw, ShoppingBag, DollarSign,
    AlertTriangle, Star, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import api from '@/lib/api'; // Import api

// B2C Customer Interface (aligned with crm.customers schema)
interface Customer {
    id: string;
    customer_name: string;
    phone: string;
    email?: string;

    // WhatsApp Integration
    whatsapp_contact_id?: string;
    preferred_language: 'en' | 'hi' | 'es' | 'fr' | 'de';

    // Customer Classification
    customer_source?: string;
    customer_status: 'New' | 'Active' | 'Inactive' | 'Churned' | 'VIP';

    // Location (Simplified for B2C)
    city?: string;
    state?: string;
    country: string;
    pincode?: string;

    // Customer Behavior Metrics
    total_orders: number;
    total_revenue: number;
    average_order_value?: number;
    last_order_date?: string;
    days_since_last_order?: number;

    // Engagement Signals
    message_frequency: number;
    response_latency_minutes?: number;
    buying_intent_score: number;
    churn_risk: 'Low' | 'Medium' | 'High';

    // Customer Tone
    customer_tone?: 'Friendly' | 'Neutral' | 'Frustrated' | 'Angry';

    // Tags & Metadata
    tags?: string[];
    notes?: string;
    customer_owner?: string;

    // Timestamps
    created_at: string;
    last_contacted_at?: string;
}

// const mockCustomers: Customer[] = []; // Removed mock data

const customerSources = [
    'WhatsApp', 'Instagram', 'Facebook', 'Google Ads',
    'Referral', 'Website', 'Offline Store', 'Marketplace'
];

const customerStatuses: Customer['customer_status'][] = ['New', 'Active', 'Inactive', 'Churned', 'VIP'];
const churnRiskLevels: Customer['churn_risk'][] = ['Low', 'Medium', 'High'];

export default function Customers() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await api.getCustomers();
            if (data && data.customers) {
                setCustomers(data.customers as any);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [filters, setFilters] = useState({
        customerSource: 'all',
        customerStatus: 'all',
        churnRisk: 'all',
        minOrders: 0,
        minRevenue: 0,
        city: ''
    });

    const getStatusColor = (status: Customer['customer_status']) => {
        const colors = {
            'New': 'bg-blue-100 text-blue-700',
            'Active': 'bg-green-100 text-green-700',
            'Inactive': 'bg-yellow-100 text-yellow-700',
            'Churned': 'bg-red-100 text-red-700',
            'VIP': 'bg-purple-100 text-purple-700'
        };
        return colors[status];
    };

    const getChurnRiskColor = (risk: Customer['churn_risk']) => {
        const colors = {
            'Low': 'bg-green-50 text-green-700 border-green-200',
            'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'High': 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[risk];
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCustomers(filteredCustomers.map(c => c.id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectCustomer = (customerId: string, checked: boolean) => {
        if (checked) {
            setSelectedCustomers([...selectedCustomers, customerId]);
        } else {
            setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSource = filters.customerSource === 'all' || customer.customer_source === filters.customerSource;
        const matchesStatus = filters.customerStatus === 'all' || customer.customer_status === filters.customerStatus;
        const matchesChurnRisk = filters.churnRisk === 'all' || customer.churn_risk === filters.churnRisk;
        const matchesMinOrders = customer.total_orders >= filters.minOrders;
        const matchesMinRevenue = customer.total_revenue >= filters.minRevenue;
        const matchesCity = !filters.city || (customer.city && customer.city.toLowerCase().includes(filters.city.toLowerCase()));

        return matchesSearch && matchesSource && matchesStatus && matchesChurnRisk && matchesMinOrders && matchesMinRevenue && matchesCity;
    });

    // Calculate metrics
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.customer_status === 'Active' || c.customer_status === 'VIP').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.total_revenue, 0);
    const atRiskCustomers = customers.filter(c => c.churn_risk === 'High').length;

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-4">
                    {/* Top Stats Bar */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-600 font-medium">Total Customers</p>
                                    <p className="text-2xl font-bold text-blue-900">{totalCustomers}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-green-600 font-medium">Active Customers</p>
                                    <p className="text-2xl font-bold text-green-900">{activeCustomers}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-purple-600 font-medium">Total Revenue</p>
                                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalRevenue)}</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-purple-500 opacity-50" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-red-600 font-medium">At Risk</p>
                                    <p className="text-2xl font-bold text-red-900">{atRiskCustomers}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
                                <p className="text-sm text-slate-600">{filteredCustomers.length} total customers</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilterPanel(!showFilterPanel)}
                                className="gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {Object.values(filters).some(
                                    v => (typeof v === "string" && v !== "all" && v !== "") ||
                                        (typeof v === "number" && v !== 0)
                                ) && (
                                        <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                                            !
                                        </Badge>
                                    )}
                            </Button>

                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-8 w-8 p-0"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-8 w-8 p-0"
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Download className="w-4 h-4" />
                                        Export
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                                    <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                size="sm"
                                onClick={() => setShowCreateDialog(true)}
                                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30"
                            >
                                <Plus className="w-4 h-4" />
                                Add Customer
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search customers by name, phone, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                    </div>

                    {/* Selected Actions Bar */}
                    {selectedCustomers.length > 0 && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-emerald-900">
                                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Send Message
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    Bulk Edit
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCustomers([])}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Filter Panel */}
                {showFilterPanel && (
                    <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilters({
                                        customerSource: 'all',
                                        customerStatus: 'all',
                                        churnRisk: 'all',
                                        minOrders: 0,
                                        minRevenue: 0,
                                        city: ''
                                    })}
                                    className="text-emerald-600"
                                >
                                    Clear All
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Customer Source */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Customer Source</Label>
                                    <Select
                                        value={filters.customerSource}
                                        onValueChange={(value) => setFilters({ ...filters, customerSource: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Sources</SelectItem>
                                            {customerSources.map(source => (
                                                <SelectItem key={source} value={source}>{source}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Customer Status */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Customer Status</Label>
                                    <Select
                                        value={filters.customerStatus}
                                        onValueChange={(value) => setFilters({ ...filters, customerStatus: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {customerStatuses.map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Churn Risk */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Churn Risk</Label>
                                    <Select
                                        value={filters.churnRisk}
                                        onValueChange={(value) => setFilters({ ...filters, churnRisk: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Risk Levels</SelectItem>
                                            {churnRiskLevels.map(risk => (
                                                <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Minimum Orders */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                        Minimum Orders: {filters.minOrders}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={filters.minOrders}
                                        onChange={(e) => setFilters({ ...filters, minOrders: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                    />
                                </div>

                                {/* Minimum Revenue */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                                        Minimum Revenue: {formatCurrency(filters.minRevenue)}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100000"
                                        step="5000"
                                        value={filters.minRevenue}
                                        onChange={(e) => setFilters({ ...filters, minRevenue: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                    />
                                </div>

                                {/* City Filter */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">City</Label>
                                    <Input
                                        placeholder="Filter by city..."
                                        value={filters.city}
                                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {viewMode === 'list' ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-left">
                                                <Checkbox
                                                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                                                    Customer Name
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Source
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                                                    Orders
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                                                    Revenue
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Churn Risk
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredCustomers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="hover:bg-emerald-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <Checkbox
                                                        checked={selectedCustomers.includes(customer.id)}
                                                        onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                                                            {customer.customer_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900 flex items-center gap-2">
                                                                {customer.customer_name}
                                                                {customer.customer_status === 'VIP' && (
                                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                )}
                                                            </div>
                                                            {customer.tags && customer.tags.length > 0 && (
                                                                <div className="flex gap-1 mt-1">
                                                                    {customer.tags.map(tag => (
                                                                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Phone className="w-3 h-3" />
                                                            {customer.phone}
                                                        </div>
                                                        {customer.email && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                <Mail className="w-3 h-3" />
                                                                {customer.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className="font-normal">
                                                        {customer.customer_source}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={getStatusColor(customer.customer_status)}>
                                                        {customer.customer_status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-slate-400" />
                                                        <span className="font-semibold text-slate-900">{customer.total_orders}</span>
                                                    </div>
                                                    {customer.days_since_last_order !== undefined && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {customer.days_since_last_order}d ago
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        {formatCurrency(customer.total_revenue)}
                                                    </div>
                                                    {customer.average_order_value && (
                                                        <div className="text-xs text-slate-500">
                                                            AOV: {formatCurrency(customer.average_order_value)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={getChurnRiskColor(customer.churn_risk)} variant="outline">
                                                        {customer.churn_risk}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {customer.city && (
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <MapPin className="w-4 h-4 text-slate-400" />
                                                            <span>{customer.city}, {customer.state}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>View Orders</DropdownMenuItem>
                                                                <DropdownMenuItem>Send WhatsApp</DropdownMenuItem>
                                                                <DropdownMenuItem>Create Deal</DropdownMenuItem>
                                                                <DropdownMenuItem>Create Task</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCustomers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <Checkbox
                                            checked={selectedCustomers.includes(customer.id)}
                                            onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                                        />
                                        <div className="flex items-center gap-2">
                                            {customer.customer_status === 'VIP' && (
                                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="text-center mb-4">
                                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                                            {customer.customer_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <h3 className="font-semibold text-slate-900 text-lg">
                                            {customer.customer_name}
                                        </h3>
                                        {customer.city && (
                                            <p className="text-sm text-slate-500 mt-1">{customer.city}, {customer.state}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{customer.phone}</span>
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail className="w-4 h-4 text-slate-400" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ShoppingBag className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs text-slate-600">Orders</span>
                                            </div>
                                            <p className="text-lg font-bold text-slate-900">{customer.total_orders}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs text-slate-600">Revenue</span>
                                            </div>
                                            <p className="text-lg font-bold text-slate-900">
                                                {formatCurrency(customer.total_revenue)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-3">
                                        <Badge className={getStatusColor(customer.customer_status)}>
                                            {customer.customer_status}
                                        </Badge>
                                        <Badge className={getChurnRiskColor(customer.churn_risk)} variant="outline">
                                            {customer.churn_risk} Risk
                                        </Badge>
                                    </div>

                                    {customer.tags && customer.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {customer.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <MessageSquare className="w-4 h-4 mr-1" />
                                            Message
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
                            <p className="text-slate-600 mb-4">
                                {searchQuery || Object.values(filters).some(
                                    v => (typeof v === "string" && v !== "all" && v !== "") ||
                                        (typeof v === "number" && v !== 0)
                                )
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by adding your first customer'}
                            </p>
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Customer
                            </Button>
                        </div>
                    )}
                </main>
            </div>

            {/* Create Customer Dialog - TODO: Implement */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8 text-slate-500">
                        Create customer form coming soon...
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
