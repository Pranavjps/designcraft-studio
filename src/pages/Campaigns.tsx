import { useState, useEffect } from 'react';
import {
    Megaphone, Plus, Filter, Download, Search, Grid, List,
    MoreVertical, TrendingUp, Users, MessageSquare, X,
    ChevronDown, RefreshCw, Calendar, Target
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

// Import B2C types and utilities
import type { Campaign, CampaignType, CampaignStatus } from '@/types/crm.types';
// import { mockCampaigns } from '@/data/mockData';
import api from '@/lib/api'; // Import api


const campaignTypes: CampaignType[] = ['Lead Generation', 'Nurture', 'Re-engagement', 'Win-Back', 'Promotional'];
const campaignStatuses: CampaignStatus[] = ['Draft', 'Active', 'Paused', 'Completed'];



export default function Campaigns() {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        api.getCampaigns().then(data => {
            if (data && data.campaigns) setCampaigns(data.campaigns as any);
        }).catch(err => console.error(err));
    }, []);

    const [filters, setFilters] = useState({
        campaignType: 'all',
        status: 'all'
    });

    const getStatusColor = (status: CampaignStatus) => {
        const colors: Record<CampaignStatus, string> = {
            'Draft': 'bg-gray-100 text-gray-700',
            'Active': 'bg-green-100 text-green-700',
            'Paused': 'bg-yellow-100 text-yellow-700',
            'Completed': 'bg-purple-100 text-purple-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getTypeColor = (type: CampaignType) => {
        const colors: Record<CampaignType, string> = {
            'Lead Generation': 'bg-blue-100 text-blue-700',
            'Nurture': 'bg-green-100 text-green-700',
            'Re-engagement': 'bg-yellow-100 text-yellow-700',
            'Win-Back': 'bg-orange-100 text-orange-700',
            'Promotional': 'bg-purple-100 text-purple-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCampaigns(filteredCampaigns.map(c => c.id));
        } else {
            setSelectedCampaigns([]);
        }
    };

    const handleSelectCampaign = (campaignId: string, checked: boolean) => {
        if (checked) {
            setSelectedCampaigns([...selectedCampaigns, campaignId]);
        } else {
            setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
        }
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filters.campaignType === 'all' || campaign.campaign_type === filters.campaignType;
        const matchesStatus = filters.status === 'all' || campaign.status === filters.status;

        return matchesSearch && matchesType && matchesStatus;
    });

    const totalSent = filteredCampaigns.reduce((sum, c) => sum + c.total_sent, 0);
    const totalDelivered = filteredCampaigns.reduce((sum, c) => sum + c.total_delivered, 0);
    const totalConversions = filteredCampaigns.reduce((sum, c) => sum + (c.total_conversions || 0), 0);

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg">
                                <Megaphone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
                                <p className="text-sm text-slate-600">{filteredCampaigns.length} total campaigns</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Stats */}
                            <div className="flex items-center gap-4 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="text-center">
                                    <div className="text-xs text-purple-600 font-medium">Sent</div>
                                    <div className="text-lg font-bold text-purple-700">{totalSent.toLocaleString()}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-pink-600 font-medium">Delivered</div>
                                    <div className="text-lg font-bold text-pink-700">{totalDelivered.toLocaleString()}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs text-emerald-600 font-medium">Avg Conv.</div>
                                    <div className="text-lg font-bold text-emerald-700">{(totalConversions / (filteredCampaigns.length || 1)).toFixed(0)}</div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilterPanel(!showFilterPanel)}
                                className="gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {Object.values(filters).some(
                                    v => (typeof v === "string" && v !== "all") ||
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
                                    <DropdownMenuItem>Export Report</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                size="sm"
                                className="gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg shadow-pink-500/30"
                            >
                                <Plus className="w-4 h-4" />
                                Create Campaign
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search campaigns..."
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
                    {selectedCampaigns.length > 0 && (
                        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-purple-900">
                                {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    Pause
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    Duplicate
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                                    Delete
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCampaigns([])}
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
                                        campaignType: 'all',
                                        status: 'all'
                                    })}
                                    className="text-purple-600"
                                >
                                    Clear All
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Campaign Type */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Campaign Type</Label>
                                    <Select
                                        value={filters.campaignType}
                                        onValueChange={(value: string) => setFilters({ ...filters, campaignType: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            {campaignTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Status</Label>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(value: string) => setFilters({ ...filters, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {campaignStatuses.map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                                    checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Campaign Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Sent</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Delivered</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Replies</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Conversion</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredCampaigns.map((campaign) => (
                                            <tr
                                                key={campaign.id}
                                                className="hover:bg-purple-50/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <Checkbox
                                                        checked={selectedCampaigns.includes(campaign.id)}
                                                        onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{campaign.campaign_name}</div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'No start date'}
                                                        {campaign.end_date && campaign.start_date && ` - ${new Date(campaign.end_date).toLocaleDateString()}`}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={getTypeColor(campaign.campaign_type)} variant="outline">
                                                        {campaign.campaign_type}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={getStatusColor(campaign.status)}>
                                                        {campaign.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-slate-900">
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                        {campaign.total_sent.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-900">{campaign.total_delivered.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-slate-900">
                                                        <MessageSquare className="w-4 h-4 text-slate-400" />
                                                        {campaign.total_replied.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 font-semibold text-green-600">
                                                        <TrendingUp className="w-4 h-4" />
                                                        {campaign.total_conversions || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <Target className="w-4 h-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                                                <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                                                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                                <DropdownMenuItem>Pause</DropdownMenuItem>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCampaigns.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 mb-1">{campaign.campaign_name}</h3>
                                            <Badge className={getTypeColor(campaign.campaign_type)} variant="outline">
                                                {campaign.campaign_type}
                                            </Badge>
                                        </div>
                                        <Badge className={getStatusColor(campaign.status)}>
                                            {campaign.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Sent</div>
                                            <div className="text-lg font-bold text-slate-900">{campaign.total_sent.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Delivered</div>
                                            <div className="text-lg font-bold text-slate-900">{campaign.total_delivered.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Replies</div>
                                            <div className="text-lg font-bold text-purple-600">{campaign.total_replied.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Conversions</div>
                                            <div className="text-lg font-bold text-green-600">{campaign.total_conversions || 0}</div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                                        {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'No start date'}
                                        {campaign.end_date && campaign.start_date && ` - ${new Date(campaign.end_date).toLocaleDateString()}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredCampaigns.length === 0 && (
                        <div className="text-center py-12">
                            <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No campaigns found</h3>
                            <p className="text-slate-600 mb-4">
                                {searchQuery || Object.values(filters).some(
                                    v => (typeof v === "string" && v !== "all") ||
                                        (typeof v === "number" && v !== 0)
                                )
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by creating your first campaign'}
                            </p>
                            <Button className="gap-2 bg-gradient-to-r from-pink-600 to-purple-600">
                                <Plus className="w-4 h-4" />
                                Create Campaign
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
