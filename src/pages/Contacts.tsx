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
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Import B2C types and utilities
import type { Customer } from '@/types/crm.types';
// import { mockCustomers } from '@/data/mockData';
import api from '@/lib/api';
import {
    formatCurrency,
    formatDate,
    formatPhoneNumber,
    getStatusColor,
    getChurnRiskColor,
    getInitials,
    daysBetween,
} from '@/utils/crm.utils';

const customerSources = [
    'WhatsApp', 'Instagram', 'Facebook', 'Google Ads',
    'Referral', 'Website', 'Offline Store', 'Marketplace'
];

const customerStatuses = ['New', 'Active', 'Inactive', 'Churned', 'VIP'];
const churnRisks = ['Low', 'Medium', 'High'];
const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
];

export default function Contacts() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        api.getCustomers().then(data => {
            if (data && data.customers) setCustomers(data.customers as any);
        }).catch(err => console.error(err));
    }, []);
    const [sortField, setSortField] = useState<keyof Customer>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const [filters, setFilters] = useState({
        customer_source: 'all',
        customer_status: 'all',
        churn_risk: 'all',
        city: '',
        minOrders: '',
        minRevenue: '',
    });

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery) ||
            (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSource = filters.customer_source === 'all' || customer.customer_source === filters.customer_source;
        const matchesStatus = filters.customer_status === 'all' || customer.customer_status === filters.customer_status;
        const matchesRisk = filters.churn_risk === 'all' || customer.churn_risk === filters.churn_risk;
        const matchesCity = !filters.city ||
            (customer.city && customer.city.toLowerCase().includes(filters.city.toLowerCase()));
        const matchesMinOrders = !filters.minOrders || customer.total_orders >= parseInt(filters.minOrders);
        const matchesMinRevenue = !filters.minRevenue || customer.total_revenue >= parseInt(filters.minRevenue);

        return matchesSearch && matchesSource && matchesStatus && matchesRisk &&
            matchesCity && matchesMinOrders && matchesMinRevenue;
    }).sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined || bValue === undefined) return 0;

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCustomers(filteredCustomers.map(c => c.id));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSort = (field: keyof Customer) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">
                        Manage and track your B2C customer relationships
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Customer
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center space-x-2 md:max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant={showFilterPanel ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFilterPanel(!showFilterPanel)}
                        className={showFilterPanel ? "bg-black text-white" : ""}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>

                    <div className="flex items-center border rounded-md">
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={viewMode === 'list' ? 'bg-black text-white' : ''}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={viewMode === 'grid' ? 'bg-black text-white' : ''}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
                <div className="rounded-lg border bg-card p-4">
                    <div className="grid gap-4 md:grid-cols-6">
                        <div className="space-y-2">
                            <Label>Source</Label>
                            <Select
                                value={filters.customer_source}
                                onValueChange={(value) => setFilters({ ...filters, customer_source: value })}
                            >
                                <SelectTrigger>
                                    < SelectValue placeholder="All Sources" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    {customerSources.map(source => (
                                        <SelectItem key={source} value={source}>{source}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={filters.customer_status}
                                onValueChange={(value) => setFilters({ ...filters, customer_status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {customerStatuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Churn Risk</Label>
                            <Select
                                value={filters.churn_risk}
                                onValueChange={(value) => setFilters({ ...filters, churn_risk: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Risks" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Risks</SelectItem>
                                    {churnRisks.map(risk => (
                                        <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                placeholder="Filter by city..."
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Min Orders</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={filters.minOrders}
                                onChange={(e) => setFilters({ ...filters, minOrders: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Min Revenue (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={filters.minRevenue}
                                onChange={(e) => setFilters({ ...filters, minRevenue: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters({
                                customer_source: 'all',
                                customer_status: 'all',
                                churn_risk: 'all',
                                city: '',
                                minOrders: '',
                                minRevenue: '',
                            })}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                            <p className="text-2xl font-bold">{filteredCustomers.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <p className="text-2xl font-bold">
                                {formatCurrency(
                                    filteredCustomers.reduce((sum, c) => sum + c.total_revenue, 0)
                                )}
                            </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">VIP Customers</p>
                            <p className="text-2xl font-bold">
                                {filteredCustomers.filter(c => c.customer_status === 'VIP').length}
                            </p>
                        </div>
                        <Star className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                            <p className="text-2xl font-bold">
                                {filteredCustomers.filter(c => c.churn_risk === 'High').length}
                            </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
                <div className="rounded-md border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr className="text-sm text-muted-foreground">
                                    <th className="p-4 text-left">
                                        <Checkbox
                                            checked={selectedCustomers.length === filteredCustomers.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4 text-left font-medium">
                                        <button
                                            className="flex items-center gap-2 hover:text-foreground"
                                            onClick={() => handleSort('customer_name')}
                                        >
                                            Customer Name
                                            <ArrowUpDown className="h-4 w-4" />
                                        </button>
                                    </th>
                                    <th className="p-4 text-left font-medium">Contact</th>
                                    <th className="p-4 text-left font-medium">Source</th>
                                    <th className="p-4 text-left font-medium">Status</th>
                                    <th className="p-4 text-left font-medium">
                                        <button
                                            className="flex items-center gap-2 hover:text-foreground"
                                            onClick={() => handleSort('total_orders')}
                                        >
                                            Orders
                                            <ArrowUpDown className="h-4 w-4" />
                                        </button>
                                    </th>
                                    <th className="p-4 text-left font-medium">
                                        <button
                                            className="flex items-center gap-2 hover:text-foreground"
                                            onClick={() => handleSort('total_revenue')}
                                        >
                                            Revenue
                                            <ArrowUpDown className="h-4 w-4" />
                                        </button>
                                    </th>
                                    <th className="p-4 text-left font-medium">Churn Risk</th>
                                    <th className="p-4 text-left font-medium">Location</th>
                                    <th className="p-4 text-left font-medium">Last Contact</th>
                                    <th className="p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4">
                                            <Checkbox
                                                checked={selectedCustomers.includes(customer.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedCustomers([...selectedCustomers, customer.id]);
                                                    } else {
                                                        setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                                                    {getInitials(customer.customer_name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{customer.customer_name}</div>
                                                    {customer.tags && customer.tags.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {customer.tags.slice(0, 2).map((tag, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                                    {formatPhoneNumber(customer.phone)}
                                                </div>
                                                {customer.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {customer.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="text-xs">
                                                {customer.customer_source || 'N/A'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={getStatusColor(customer.customer_status, 'customer')}>
                                                {customer.customer_status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{customer.total_orders}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">
                                                {formatCurrency(customer.total_revenue)}
                                            </div>
                                            {customer.average_order_value && (
                                                <div className="text-xs text-muted-foreground">
                                                    Avg: {formatCurrency(customer.average_order_value)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <Badge className={getChurnRiskColor(customer.churn_risk)}>
                                                {customer.churn_risk}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                {customer.city && customer.state
                                                    ? `${customer.city}, ${customer.state}`
                                                    : customer.city || customer.state || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {customer.last_contacted_at
                                                ? formatDate(customer.last_contacted_at, 'relative')
                                                : 'Never'}
                                        </td>
                                        <td className="p-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Send Message
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                        View Orders
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCustomers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No customers found</h3>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-lg">
                                        {getInitials(customer.customer_name)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{customer.customer_name}</h3>
                                        <Badge className={`${getStatusColor(customer.customer_status, 'customer')} mt-1`}>
                                            {customer.customer_status}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatPhoneNumber(customer.phone)}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{customer.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.city && customer.state ? `${customer.city}, ${customer.state}` : customer.city || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Orders</p>
                                    <p className="text-lg font-semibold">{customer.total_orders}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                                    <p className="text-lg font-semibold">{formatCurrency(customer.total_revenue)}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <Badge className={getChurnRiskColor(customer.churn_risk)}>
                                    {customer.churn_risk} Risk
                                </Badge>
                                {customer.customer_source && (
                                    <Badge variant="outline" className="text-xs">
                                        {customer.customer_source}
                                    </Badge>
                                )}
                            </div>

                            {customer.tags && customer.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {customer.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Customer Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Customer</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Customer Name *</Label>
                            <Input placeholder="Enter customer name" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Phone *</Label>
                                <Input placeholder="+91 98765 43210" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="customer@example.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Customer Source</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customerSources.map(source => (
                                            <SelectItem key={source} value={source}>{source}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Preferred Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(lang => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>City</Label>
                                <Input placeholder="Mumbai" />
                            </div>
                            <div className="grid gap-2">
                                <Label>State</Label>
                                <Input placeholder="Maharashtra" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Pincode</Label>
                                <Input placeholder="400001" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Tags (comma-separated)</Label>
                            <Input placeholder="Premium, VIP, Frequent Buyer" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea placeholder="Add any additional notes..." rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            Create Customer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
