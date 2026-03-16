import { useState, useEffect } from 'react';
import {
    DollarSign, Plus, Filter, Search, Grid, List, MoreVertical,
    Calendar, User, X, RefreshCw, Download,
    ChevronDown, Eye, Edit, Trash2, ArrowUpDown, Target,
    MessageSquare, ShoppingBag
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

// Import B2C types and utilities
import type { Deal, DealStage, AgentType } from '@/types/crm.types';
// import { mockDeals, mockCustomers } from '@/data/mockData';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/crm.utils';
import api from '@/lib/api'; // Import api

// B2C Deal Stages  
const stages: DealStage[] = [
    'Product Inquiry',
    'Price Discussion',
    'Ready to Buy',
    'Payment Pending',
    'Order Placed',
    'Closed Won',
    'Closed Lost',
    'Closed Lost - Price'
];

const agentTypes: AgentType[] = [
    'Sales', 'Marketing', 'PreSales', 'Finance',
    'CustomerSuccess', 'Support', 'RefundPolicy'
];

export default function Deals() {
    const [viewMode, setViewMode] = useState<'stage' | 'list'>('stage');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [deals, setDeals] = useState<Deal[]>([]);
    const [customers, setCustomers] = useState<any[]>([]); // To resolve customer names
    const [selectedDeals] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dealsData, customersData] = await Promise.all([
                api.getDeals(),
                api.getCustomers({ limit: 100 })
            ]);
            if (dealsData && dealsData.deals) setDeals(dealsData.deals as any);
            if (customersData && customersData.customers) setCustomers(customersData.customers);
        } catch (error) {
            console.error("Failed to load deals data", error);
        }
    };

    const [filters, setFilters] = useState({
        stage: 'all',
        customer: '',
        minAmount: '',
        agent: 'all'
    });

    const getStagePercentage = (stage: DealStage): number => {
        const percentages: Record<DealStage, number> = {
            'Product Inquiry': 15,
            'Price Discussion': 30,
            'Ready to Buy': 60,
            'Payment Pending': 85,
            'Order Placed': 95,
            'Closed Won': 100,
            'Closed Lost': 0,
            'Closed Lost - Price': 0
        };
        return percentages[stage];
    };

    const filteredDeals = deals.filter(deal => {
        const matchesSearch =
            deal.deal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (deal.product_names && deal.product_names.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesStage = filters.stage === 'all' || deal.stage === filters.stage;
        const matchesMinAmount = !filters.minAmount || (deal.final_amount && deal.final_amount >= parseInt(filters.minAmount) * 100);
        const matchesAgent = filters.agent === 'all' || deal.last_agent_interaction === filters.agent;

        return matchesSearch && matchesStage && matchesMinAmount && matchesAgent;
    });

    const dealsByStage = stages.reduce((acc, stage) => {
        acc[stage] = filteredDeals.filter(deal => deal.stage === stage);
        return acc;
    }, {} as Record<DealStage, Deal[]>);

    const calculateStageTotal = (stage: DealStage) => {
        return dealsByStage[stage].reduce((sum, deal) => sum + (deal.final_amount || 0), 0);
    };

    const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + (deal.final_amount || 0), 0);

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
                                <p className="text-sm text-slate-600">
                                    {filteredDeals.length} deals • {formatCurrency(totalPipelineValue)} pipeline
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilterPanel(!showFilterPanel)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="bg-black text-white hover:bg-gray-800"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Deal
                            </Button>
                        </div>
                    </div>

                    {/* Search and View Toggle */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search deals, products, customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <div className="flex items-center border rounded-md">
                            <Button
                                variant={viewMode === 'stage' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('stage')}
                                className={viewMode === 'stage' ? 'bg-black text-white' : ''}
                            >
                                <Grid className="h-4 w-4 mr-2" />
                                Pipeline View
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-black text-white' : ''}
                            >
                                <List className="h-4 w-4 mr-2" />
                                List View
                            </Button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilterPanel && (
                        <div className="mt-4 p-4 border rounded-lg bg-white">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label>Stage</Label>
                                    <Select value={filters.stage} onValueChange={(value) => setFilters({ ...filters, stage: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Stages" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Stages</SelectItem>
                                            {stages.map(stage => (
                                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Last Agent</Label>
                                    <Select value={filters.agent} onValueChange={(value) => setFilters({ ...filters, agent: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Agents" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Agents</SelectItem>
                                            {agentTypes.map(agent => (
                                                <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Min Deal Value (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={filters.minAmount}
                                        onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters({ stage: 'all', customer: '', minAmount: '', agent: 'all' })}
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
                {/* Pipeline View */}
                {viewMode === 'stage' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stages.map((stage) => (
                            <div key={stage} className="flex flex-col">
                                <div className="bg-white rounded-t-xl  border-b-4 border-indigo-500 p-4 shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-sm text-slate-700">{stage}</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {dealsByStage[stage].length}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        {formatCurrency(calculateStageTotal(stage))}
                                    </div>
                                    <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className="bg-indigo-600 h-1.5 rounded-full"
                                            style={{ width: `${getStagePercentage(stage)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 bg-slate-50 rounded-b-xl p-3 space-y-3 min-h-[500px] border-x border-b">
                                    {dealsByStage[stage].map((deal) => {
                                        const customer = customers.find(c => c.id === deal.customer_id);
                                        return (
                                            <div
                                                key={deal.id}
                                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-sm text-slate-900">{deal.deal_name}</h4>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {customer && (
                                                    <p className="text-xs text-slate-600 mb-2">
                                                        {customer.customer_name}
                                                    </p>
                                                )}

                                                {deal.product_names && deal.product_names.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {deal.product_names.slice(0, 2).map((product, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                {product}
                                                            </Badge>
                                                        ))}
                                                        {deal.product_names.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{deal.product_names.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                                    <span className="text-sm font-bold text-indigo-600">
                                                        {formatCurrency(deal.final_amount || 0)}
                                                    </span>
                                                    {deal.probability !== undefined && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {deal.probability}% prob
                                                        </Badge>
                                                    )}
                                                </div>

                                                {deal.expected_close_date && (
                                                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(deal.expected_close_date, 'short')}
                                                    </div>
                                                )}

                                                {deal.last_agent_interaction && (
                                                    <div className="mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {deal.last_agent_interaction}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {dealsByStage[stage].length === 0 && (
                                        <div className="flex items-center justify-center h-32 text-slate-400">
                                            <p className="text-sm">No deals in this stage</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr className="text-sm text-muted-foreground">
                                        <th className="p-4 text-left font-medium">Deal Name</th>
                                        <th className="p-4 text-left font-medium">Customer</th>
                                        <th className="p-4 text-left font-medium">Products</th>
                                        <th className="p-4 text-left font-medium">Stage</th>
                                        <th className="p-4 text-left font-medium">Amount</th>
                                        <th className="p-4 text-left font-medium">Discount</th>
                                        <th className="p-4 text-left font-medium">Final Amount</th>
                                        <th className="p-4 text-left font-medium">Probability</th>
                                        <th className="p-4 text-left font-medium">Close Date</th>
                                        <th className="p-4 text-left font-medium">Agent</th>
                                        <th className="p-4 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDeals.map((deal) => {
                                        const customer = customers.find(c => c.id === deal.customer_id);
                                        return (
                                            <tr key={deal.id} className="border-b hover:bg-muted/50">
                                                <td className="p-4 font-medium">{deal.deal_name}</td>
                                                <td className="p-4">{customer?.customer_name || 'N/A'}</td>
                                                <td className="p-4">
                                                    {deal.product_names && deal.product_names.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {deal.product_names.slice(0, 2).map((product, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">
                                                                    {product}
                                                                </Badge>
                                                            ))}
                                                            {deal.product_names.length > 2 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{deal.product_names.length - 2}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getStatusColor(deal.stage, 'deal')}>
                                                        {deal.stage}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">{formatCurrency(deal.amount || 0)}</td>
                                                <td className="p-4 text-green-600">
                                                    -{formatCurrency(deal.discount_applied)}
                                                </td>
                                                <td className="p-4 font-bold">{formatCurrency(deal.final_amount || 0)}</td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{deal.probability || 0}%</Badge>
                                                </td>
                                                <td className="p-4 text-sm">
                                                    {deal.expected_close_date
                                                        ? formatDate(deal.expected_close_date, 'short')
                                                        : 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    {deal.last_agent_interaction && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {deal.last_agent_interaction}
                                                        </Badge>
                                                    )}
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
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
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

                        {filteredDeals.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">No deals found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Deal</DialogTitle>
                    </DialogHeader>
                    {/* Simplified Form for brevity, assuming standard fields */}
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Deal Name *</Label>
                            <Input placeholder="Enter deal name" id="deal-name" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Customer *</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map(customer => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.customer_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => {
                            // Quick implementation of create deal
                            const name = (document.getElementById('deal-name') as HTMLInputElement).value;
                            // ... other fields
                            // For now basic implementation to satisfy the UI existence
                            if (name) {
                                api.createDeal({ deal_name: name, stage: 'Product Inquiry' }).then(() => {
                                    setShowCreateDialog(false);
                                    fetchData();
                                });
                            }
                        }}>
                            Create Deal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
