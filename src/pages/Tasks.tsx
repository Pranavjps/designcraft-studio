import { useState, useEffect } from 'react';
import {
    CheckSquare, Plus, Filter, Search, MoreVertical,
    Clock, Flag, RefreshCw, Download, Eye, Edit, Trash2,
    Bot, Calendar, User
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
import type { Task, TaskStatus, TaskPriority, AgentType } from '@/types/crm.types';
// import { mockTasks, mockCustomers, mockDeals, mockOrders } from '@/data/mockData';
import { formatDate, getStatusColor, isOverdue } from '@/utils/crm.utils';
import api from '@/lib/api'; // Import api

const taskStatuses: TaskStatus[] = ['Open', 'In Progress', 'Done', 'Cancelled'];
const taskPriorities: TaskPriority[] = ['High', 'Normal', 'Low'];
const agentTypes: AgentType[] = [
    'Sales', 'Marketing', 'PreSales', 'Finance',
    'CustomerSuccess', 'Support', 'RefundPolicy', 'Analytics'
];

export default function Tasks() {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [deals, setDeals] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [t, c, d, o] = await Promise.all([
                    api.getTasks(),
                    api.getCustomers({ limit: 100 }),
                    api.getDeals(),
                    api.getOrders()
                ]);
                if (t && t.tasks) setTasks(t.tasks as any);
                if (c && c.customers) setCustomers(c.customers);
                if (d && d.deals) setDeals(d.deals as any);
                if (o && o.orders) setOrders(o.orders as any);
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        agent: 'all',
        autoCreated: false,
    });

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = filters.status === 'all' || task.status === filters.status;
        const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
        const matchesAgent = filters.agent === 'all' || task.assigned_to_agent === filters.agent;
        const matchesAutoCreated = !filters.autoCreated || task.auto_created;

        return matchesSearch && matchesStatus && matchesPriority && matchesAgent && matchesAutoCreated;
    });

    const tasksByStatus = taskStatuses.reduce((acc, status) => {
        acc[status] = filteredTasks.filter(task => task.status === status);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    const getRelatedEntity = (task: Task) => {
        if (task.customer_id) {
            const customer = customers.find(c => c.id === task.customer_id);
            return customer ? { type: 'Customer', name: customer.customer_name } : null;
        }
        if (task.deal_id) {
            const deal = deals.find(d => d.id === task.deal_id);
            return deal ? { type: 'Deal', name: deal.deal_name } : null;
        }
        if (task.order_id) {
            const order = orders.find(o => o.id === task.order_id);
            return order ? { type: 'Order', name: order.order_number } : null;
        }
        return null;
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">
                        Manage tasks and track team activities
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center space-x-2 md:max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
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
                            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('kanban')}
                            className={viewMode === 'kanban' ? 'bg-black text-white' : ''}
                        >
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Kanban
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={viewMode === 'list' ? 'bg-black text-white' : ''}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
                <div className="rounded-lg border bg-card p-4">
                    <div className="grid gap-4 md:grid-cols-5">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters({ ...filters, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {taskStatuses.map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={filters.priority}
                                onValueChange={(value) => setFilters({ ...filters, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    {taskPriorities.map(priority => (
                                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Assigned Agent</Label>
                            <Select
                                value={filters.agent}
                                onValueChange={(value) => setFilters({ ...filters, agent: value })}
                            >
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
                            <Label>Auto-Created</Label>
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    checked={filters.autoCreated}
                                    onCheckedChange={(checked) => setFilters({ ...filters, autoCreated: checked as boolean })}
                                />
                                <span className="text-sm">Show only auto-created tasks</span>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFilters({
                                    status: 'all',
                                    priority: 'all',
                                    agent: 'all',
                                    autoCreated: false
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
                            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                            <p className="text-2xl font-bold">{filteredTasks.length}</p>
                        </div>
                        <CheckSquare className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Open</p>
                            <p className="text-2xl font-bold">{tasksByStatus['Open']?.length || 0}</p>
                        </div>
                        <Flag className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                            <p className="text-2xl font-bold">{tasksByStatus['In Progress']?.length || 0}</p>
                        </div>
                        <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Done</p>
                            <p className="text-2xl font-bold">{tasksByStatus['Done']?.length || 0}</p>
                        </div>
                        <CheckSquare className="h-8 w-8 text-green-400" />
                    </div>
                </div>
            </div>

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {taskStatuses.map((status) => (
                        <div key={status} className="flex flex-col">
                            <div className="bg-white rounded-t-xl border-b-4 border-blue-500 p-4 shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-sm text-slate-700">{status}</h3>
                                    <Badge variant="outline" className="text-xs">
                                        {tasksByStatus[status]?.length || 0}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-50 rounded-b-xl p-3 space-y-3 min-h-[500px] border-x border-b">
                                {tasksByStatus[status]?.map((task) => {
                                    const relatedEntity = getRelatedEntity(task);
                                    const overdue = task.due_date ? isOverdue(task.due_date) : false;

                                    return (
                                        <div
                                            key={task.id}
                                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-sm text-slate-900">{task.subject}</h4>
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

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getStatusColor(task.priority, 'priority')}>
                                                        {task.priority}
                                                    </Badge>
                                                    {task.auto_created && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Bot className="h-3 w-3 mr-1" />
                                                            Auto
                                                        </Badge>
                                                    )}
                                                </div>

                                                {relatedEntity && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {relatedEntity.type}: {relatedEntity.name}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-xs">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className={overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                                                        {task.due_date ? formatDate(task.due_date, 'short') : 'No due date'}
                                                        {overdue && ' (Overdue)'}
                                                    </span>
                                                </div>

                                                {task.assigned_to_agent && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <User className="h-3 w-3" />
                                                        <Badge variant="outline" className="text-xs">
                                                            {task.assigned_to_agent}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {(!tasksByStatus[status] || tasksByStatus[status].length === 0) && (
                                    <div className="flex items-center justify-center h-32 text-slate-400">
                                        <p className="text-sm">No tasks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="rounded-md border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr className="text-sm text-muted-foreground">
                                    <th className="p-4 text-left">
                                        <Checkbox
                                            checked={selectedTasks.length === filteredTasks.length}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedTasks(filteredTasks.map(t => t.id));
                                                } else {
                                                    setSelectedTasks([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="p-4 text-left font-medium">Subject</th>
                                    <th className="p-4 text-left font-medium">Status</th>
                                    <th className="p-4 text-left font-medium">Priority</th>
                                    <th className="p-4 text-left font-medium">Assigned Agent</th>
                                    <th className="p-4 text-left font-medium">Due Date</th>
                                    <th className="p-4 text-left font-medium">Related To</th>
                                    <th className="p-4 text-left font-medium">Auto</th>
                                    <th className="p-4 text-left font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task) => {
                                    const relatedEntity = getRelatedEntity(task);
                                    const overdue = task.due_date ? isOverdue(task.due_date) : false;

                                    return (
                                        <tr key={task.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <Checkbox
                                                    checked={selectedTasks.includes(task.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTasks([...selectedTasks, task.id]);
                                                        } else {
                                                            setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="p-4 font-medium">{task.subject}</td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(task.status, 'task')}>
                                                    {task.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(task.priority, 'priority')}>
                                                    {task.priority}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {task.assigned_to_agent && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {task.assigned_to_agent}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={overdue ? 'text-red-600 font-medium text-sm' : 'text-sm text-muted-foreground'}>
                                                    {task.due_date ? formatDate(task.due_date, 'short') : 'No due date'}
                                                    {overdue && ' (Overdue)'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {relatedEntity ? `${relatedEntity.type}: ${relatedEntity.name}` : '—'}
                                            </td>
                                            <td className="p-4">
                                                {task.auto_created && (
                                                    <Bot className="h-4 w-4 text-blue-600" />
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

                    {filteredTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No tasks found</h3>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Subject *</Label>
                            <Input placeholder="Enter task subject" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select defaultValue="Open">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taskStatuses.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Priority</Label>
                                <Select defaultValue="Normal">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taskPriorities.map(priority => (
                                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Assigned Agent</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agentTypes.map(agent => (
                                            <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Due Date</Label>
                                <Input type="datetime-local" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Customer (Optional)</Label>
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
                        <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea placeholder="Add any additional notes..." rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => {
                            // Simple create task logic
                            // In real app, gather all fields.
                            api.createTask({ subject: 'New Task', status: 'Open', priority: 'Normal' }).then(() => {
                                setShowCreateDialog(false);
                                // prompt reload or just reload
                            });
                        }}>
                            Create Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
