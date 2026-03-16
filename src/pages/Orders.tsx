import { useState, useEffect } from 'react';
import {
    Package, Filter, Download, Search, Grid, List,
    MoreVertical, MapPin, Truck, AlertCircle,
    Edit, Trash2, Eye, RefreshCw, DollarSign
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import type { Order, PaymentMethod, PaymentStatus, OrderStatus, IssueType } from '@/types/crm.types';
// import { mockOrders, mockCustomers } from '@/data/mockData';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/crm.utils';
import api from '@/lib/api'; // Import api

const paymentMethods: PaymentMethod[] = ['UPI', 'COD', 'Card', 'Wallet', 'EMI'];
const paymentStatuses: PaymentStatus[] = ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'];
const orderStatuses: OrderStatus[] = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
const issueTypes: IssueType[] = ['Delayed', 'Damaged', 'Wrong Product', 'Not Received', 'Quality Issue'];

export default function Orders() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersData, customersData] = await Promise.all([
                    api.getOrders(),
                    api.getCustomers({ limit: 100 })
                ]);
                if (ordersData && ordersData.orders) setOrders(ordersData.orders as any);
                if (customersData && customersData.customers) setCustomers(customersData.customers);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, []);

    const [filters, setFilters] = useState({
        paymentStatus: 'all',
        orderStatus: 'all',
        hasIssue: false,
        minAmount: ''
    });

    const filteredOrders = orders.filter(order => {
        const customer = customers.find(c => c.id === order.customer_id);
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer && customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (order.tracking_number && order.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPaymentStatus = filters.paymentStatus === 'all' || order.payment_status === filters.paymentStatus;
        const matchesOrderStatus = filters.orderStatus === 'all' || order.order_status === filters.orderStatus;
        const matchesIssue = !filters.hasIssue || order.has_issue;
        const matchesMinAmount = !filters.minAmount || order.total_amount >= parseInt(filters.minAmount) * 100;

        return matchesSearch && matchesPaymentStatus && matchesOrderStatus && matchesIssue && matchesMinAmount;
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedOrders(filteredOrders.map(o => o.id));
        } else {
            setSelectedOrders([]);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">
                        Track and manage customer orders with fulfillment status
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center space-x-2 md:max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders, customers, tracking..."
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
                    <div className="grid gap-4 md:grid-cols-5">
                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <Select
                                value={filters.paymentStatus}
                                onValueChange={(value) => setFilters({ ...filters, paymentStatus: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {paymentStatuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Order Status</Label>
                            <Select
                                value={filters.orderStatus}
                                onValueChange={(value) => setFilters({ ...filters, orderStatus: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {orderStatuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Min Amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={filters.minAmount}
                                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Has Issues</Label>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    checked={filters.hasIssue}
                                    onCheckedChange={(checked) => setFilters({ ...filters, hasIssue: checked as boolean })}
                                />
                                <span className="text-sm">Show only orders with issues</span>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFilters({
                                    paymentStatus: 'all',
                                    orderStatus: 'all',
                                    hasIssue: false,
                                    minAmount: ''
                                })}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                            <p className="text-2xl font-bold">{filteredOrders.length}</p>
                        </div>
                        <Package className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                            <p className="text-2xl font-bold">
                                {formatCurrency(filteredOrders.reduce((sum, o) => sum + o.total_amount, 0))}
                            </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                            <p className="text-2xl font-bold">
                                {filteredOrders.filter(o => o.order_status === 'Delivered').length}
                            </p>
                        </div>
                        <Truck className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Issues</p>
                            <p className="text-2xl font-bold">
                                {filteredOrders.filter(o => o.has_issue).length}
                            </p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-gray-400" />
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
                                            checked={selectedOrders.length === filteredOrders.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-4 text-left font-medium">Order #</th>
                                    <th className="p-4 text-left font-medium">Customer</th>
                                    <th className="p-4 text-left font-medium">Products</th>
                                    <th className="p-4 text-left font-medium">Qty</th>
                                    <th className="p-4 text-left font-medium">Amount</th>
                                    <th className="p-4 text-left font-medium">Payment</th>
                                    <th className="p-4 text-left font-medium">Order Status</th>
                                    <th className="p-4 text-left font-medium">Tracking</th>
                                    <th className="p-4 text-left font-medium">Ordered</th>
                                    <th className="p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const customer = customers.find(c => c.id === order.customer_id);
                                    return (
                                        <tr key={order.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={selectedOrders.includes(order.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedOrders([...selectedOrders, order.id]);
                                                        } else {
                                                            setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{order.order_number}</div>
                                                {order.has_issue && (
                                                    <Badge variant="outline" className="bg-red-50 text-red-700 mt-1">
                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                        {order.issue_type}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium">{customer?.customer_name || 'N/A'}</div>
                                                {order.delivery_city && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {order.delivery_city}, {order.delivery_state}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {order.product_names && order.product_names.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {order.product_names.slice(0, 2).map((product, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                {product}
                                                            </Badge>
                                                        ))}
                                                        {order.product_names.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{order.product_names.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </td>
                                            <td className="p-4">{order.quantity}</td>
                                            <td className="p-4">
                                                <div className="font-medium">{formatCurrency(order.total_amount)}</div>
                                                {order.payment_method && (
                                                    <div className="text-xs text-muted-foreground">{order.payment_method}</div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(order.payment_status, 'payment')}>
                                                    {order.payment_status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(order.order_status, 'order')}>
                                                    {order.order_status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {order.tracking_number ? (
                                                    <div className="text-sm">
                                                        <div className="font-medium">{order.tracking_number}</div>
                                                        {order.courier_name && (
                                                            <div className="text-xs text-muted-foreground">{order.courier_name}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {formatDate(order.ordered_at, 'short')}
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
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Truck className="mr-2 h-4 w-4" />
                                                            Track Shipment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Cancel Order
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No orders found</h3>
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
                    {filteredOrders.map((order) => {
                        const customer = customers.find(c => c.id === order.customer_id);
                        return (
                            <div key={order.id} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold">{order.order_number}</h3>
                                        <p className="text-sm text-muted-foreground">{customer?.customer_name}</p>
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
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Products ({order.quantity} items)</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {order.product_names?.slice(0, 2).map((product, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {product}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Amount</p>
                                            <p className="text-lg font-bold">{formatCurrency(order.total_amount)}</p>
                                        </div>
                                        <Badge className={getStatusColor(order.payment_status, 'payment')}>
                                            {order.payment_status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Badge className={getStatusColor(order.order_status, 'order')}>
                                            {order.order_status}
                                        </Badge>
                                        {order.has_issue && (
                                            <Badge variant="outline" className="bg-red-50 text-red-700">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                Issue
                                            </Badge>
                                        )}
                                    </div>

                                    {order.tracking_number && (
                                        <div className="text-xs">
                                            <p className="text-muted-foreground">Tracking: {order.tracking_number}</p>
                                            <p className="text-muted-foreground mt-1">{order.courier_name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
