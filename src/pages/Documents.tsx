import { useState } from 'react';
import {
    FolderOpen, Filter, Search, Grid, List, MoreVertical,
    Upload, Download, File, FileText, FileSpreadsheet, Image,
    Video, Music, Link, Eye, Edit, Trash2, Share2, Lock,
    Unlock, ChevronRight, ChevronDown, RefreshCw, X,
    Clock, User, ArrowUpDown
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

type FileType = 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'audio' | 'video' | 'link';
type DocumentStatus = 'draft' | 'approved' | 'processing' | 'ready';

interface Document {
    id: string;
    name: string;
    type: FileType;
    size?: number;
    owner: string;
    folder?: string;
    status: DocumentStatus;
    modifiedTime: string;
    description?: string;
    version?: number;
    isLocked?: boolean;
    sharedWith?: string[];
}

const mockDocuments: Document[] = [
    {
        id: '1',
        name: 'Product Guide',
        type: 'pdf',
        size: 2500000,
        owner: 'Pranav A',
        folder: 'Sales Materials',
        status: 'ready',
        modifiedTime: '2026-01-15T10:30:00',
        version: 3,
        description: 'Complete product guide for sales team'
    },
    {
        id: '2',
        name: 'User Manual',
        type: 'document',
        size: 1800000,
        owner: 'Pranav A',
        folder: 'Documentation',
        status: 'ready',
        modifiedTime: '2026-01-14T14:20:00',
        version: 2
    },
    {
        id: '3',
        name: 'FAQ Document',
        type: 'document',
        size: 450000,
        owner: 'Pranav A',
        folder: 'Support',
        status: 'ready',
        modifiedTime: '2026-01-16T09:15:00',
        version: 1
    },
    {
        id: '4',
        name: 'Policy Document',
        type: 'document',
        size: 890000,
        owner: 'Pranav A',
        folder: 'Legal',
        status: 'ready',
        modifiedTime: '2026-01-13T11:00:00',
        version: 1,
        isLocked: true
    },
    {
        id: '5',
        name: 'Sales Presentation',
        type: 'presentation',
        size: 3200000,
        owner: 'Pranav A',
        folder: 'Sales Materials',
        status: 'processing',
        modifiedTime: '2026-01-17T15:30:00',
        version: 1
    },
    {
        id: '6',
        name: 'Monthly Report',
        type: 'spreadsheet',
        size: 1500000,
        owner: 'Pranav A',
        folder: 'Reports',
        status: 'draft',
        modifiedTime: '2026-01-18T08:00:00',
        version: 1
    },
    {
        id: '7',
        name: 'Product Demo',
        type: 'video',
        size: 15000000,
        owner: 'Pranav A',
        folder: 'Marketing',
        status: 'ready',
        modifiedTime: '2026-01-12T16:45:00',
        version: 2
    }
];

const folders = ['Sales Materials', 'Documentation', 'Support', 'Legal', 'Reports', 'Marketing', 'Templates'];

export default function Documents() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [documents] = useState<Document[]>(mockDocuments);
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        fileType: 'all',
        status: 'all',
        owner: 'all',
        folder: 'all'
    });

    const getFileIcon = (type: FileType) => {
        const icons: Record<FileType, any> = {
            folder: FolderOpen,
            document: FileText,
            spreadsheet: FileSpreadsheet,
            presentation: FileText,
            pdf: File,
            image: Image,
            audio: Music,
            video: Video,
            link: Link
        };
        return icons[type];
    };

    const getFileColor = (type: FileType) => {
        const colors: Record<FileType, string> = {
            folder: 'text-blue-600 bg-blue-50',
            document: 'text-indigo-600 bg-indigo-50',
            spreadsheet: 'text-green-600 bg-green-50',
            presentation: 'text-orange-600 bg-orange-50',
            pdf: 'text-red-600 bg-red-50',
            image: 'text-purple-600 bg-purple-50',
            audio: 'text-pink-600 bg-pink-50',
            video: 'text-cyan-600 bg-cyan-50',
            link: 'text-teal-600 bg-teal-50'
        };
        return colors[type];
    };

    const getStatusBadge = (status: DocumentStatus) => {
        const statusConfig: Record<DocumentStatus, { label: string; color: string }> = {
            draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-700' },
            approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
            processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700' },
            ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700' }
        };
        return statusConfig[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-700' };
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'N/A';
        const kb = bytes / 1024;
        const mb = kb / 1024;
        if (mb >= 1) return `${mb.toFixed(2)} MB`;
        return `${kb.toFixed(2)} KB`;
    };

    const filteredDocuments = documents
        .filter(doc => doc && doc.id) // Remove undefined/null documents
        .filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filters.fileType === 'all' || doc.type === filters.fileType;
            const matchesStatus = filters.status === 'all' || doc.status === filters.status;
            const matchesFolder = filters.folder === 'all' || doc.folder === filters.folder;
            const matchesActiveFolder = !activeFolder || doc.folder === activeFolder;

            return matchesSearch && matchesType && matchesStatus && matchesFolder && matchesActiveFolder;
        });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedDocuments(filteredDocuments.map(d => d.id));
        } else {
            setSelectedDocuments([]);
        }
    };

    const handleSelectDocument = (docId: string, checked: boolean) => {
        if (checked) {
            setSelectedDocuments([...selectedDocuments, docId]);
        } else {
            setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                                <FolderOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-foreground">Documents</h1>
                                <p className="text-sm text-muted-foreground">
                                    {filteredDocuments.length} items
                                    {activeFolder && ` in ${activeFolder}`}
                                </p>
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
                                Filter
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
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-8 w-8 p-0"
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-8 w-8 p-0"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>

                            <Button
                                size="sm"
                                onClick={() => setShowUploadDialog(true)}
                                className="gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Upload
                            </Button>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    {activeFolder && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            <button
                                onClick={() => setActiveFolder(null)}
                                className="hover:text-slate-900 transition-colors"
                            >
                                Documents
                            </button>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-900 font-medium">{activeFolder}</span>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search documents..."
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
                    {selectedDocuments.length > 0 && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-amber-900">
                                {selectedDocuments.length} item{selectedDocuments.length > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedDocuments([])}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                {showFilterPanel && (
                    <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0">
                        <div className="p-4">
                            {/* My Folders */}
                            <div className="mb-6">
                                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                                    <FolderOpen className="w-4 h-4" />
                                    My Folders
                                    <ChevronDown className="w-4 h-4 ml-auto" />
                                </button>
                            </div>

                            {/* Team Folders */}
                            <div className="mb-6">
                                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    TEAM FOLDERS
                                </h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setActiveFolder(null)}
                                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors ${!activeFolder
                                            ? 'bg-amber-50 text-amber-700 font-medium'
                                            : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <FolderOpen className="w-4 h-4" />
                                        All Documents
                                    </button>
                                    {folders.map((folder) => (
                                        <button
                                            key={folder}
                                            onClick={() => setActiveFolder(folder)}
                                            className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors ${activeFolder === folder
                                                ? 'bg-amber-50 text-amber-700 font-medium'
                                                : 'text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            <FolderOpen className="w-4 h-4" />
                                            {folder}
                                            <ChevronRight className="w-3 h-3 ml-auto" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    FILTERS
                                </h3>
                                <div className="space-y-4 px-3">
                                    <div>
                                        <Label className="text-xs text-slate-600 mb-2 block">File Type</Label>
                                        <Select
                                            value={filters.fileType}
                                            onValueChange={(value) => setFilters({ ...filters, fileType: value })}
                                        >
                                            <SelectTrigger className="h-9 text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="folder">Folders</SelectItem>
                                                <SelectItem value="document">Documents</SelectItem>
                                                <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                                                <SelectItem value="presentation">Presentations</SelectItem>
                                                <SelectItem value="pdf">PDFs</SelectItem>
                                                <SelectItem value="image">Images</SelectItem>
                                                <SelectItem value="audio">Audio</SelectItem>
                                                <SelectItem value="video">Videos</SelectItem>
                                                <SelectItem value="link">Links</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className="text-xs text-slate-600 mb-2 block">Status</Label>
                                        <Select
                                            value={filters.status}
                                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                                        >
                                            <SelectTrigger className="h-9 text-sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="ready">Ready</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFilters({
                                            fileType: 'all',
                                            status: 'all',
                                            owner: 'all',
                                            folder: 'all'
                                        })}
                                        className="w-full text-amber-600 hover:text-amber-700"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {filteredDocuments.map((doc) => {
                                const Icon = getFileIcon(doc.type);
                                const statusBadge = getStatusBadge(doc.status);

                                return (
                                    <div
                                        key={doc.id}
                                        className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-amber-300 transition-all duration-200 group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <Checkbox
                                                checked={selectedDocuments.includes(doc.id)}
                                                onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                                            />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Share2 className="w-4 h-4 mr-2" />
                                                        Share
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        {doc.isLocked ? (
                                                            <>
                                                                <Unlock className="w-4 h-4 mr-2" />
                                                                Unlock
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="w-4 h-4 mr-2" />
                                                                Lock
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3 ${getFileColor(doc.type)}`}>
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        <h3 className="font-medium text-slate-900 text-center mb-1 truncate">
                                            {doc.name}
                                        </h3>

                                        {doc.folder && (
                                            <p className="text-xs text-slate-500 text-center mb-2">{doc.folder}</p>
                                        )}

                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <Badge className={statusBadge.color} variant="secondary">
                                                {statusBadge.label}
                                            </Badge>
                                            {doc.isLocked && (
                                                <Lock className="w-3 h-3 text-slate-400" />
                                            )}
                                        </div>

                                        <div className="text-xs text-slate-500 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span>Size:</span>
                                                <span className="font-medium">{formatFileSize(doc.size)}</span>
                                            </div>
                                            {doc.version && (
                                                <div className="flex items-center justify-between">
                                                    <span>Version:</span>
                                                    <span className="font-medium">v{doc.version}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span>Modified:</span>
                                                <span className="font-medium">
                                                    {new Date(doc.modifiedTime).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                                                <Eye className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                                                <Download className="w-3 h-3 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-4 text-left">
                                                <Checkbox
                                                    checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                                                    Name
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Folder
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Size
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                                <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors">
                                                    Modified
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Owner
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredDocuments.map((doc) => {
                                            const Icon = getFileIcon(doc.type);
                                            const statusBadge = getStatusBadge(doc.status);

                                            return (
                                                <tr
                                                    key={doc.id}
                                                    className="hover:bg-amber-50/50 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <Checkbox
                                                            checked={selectedDocuments.includes(doc.id)}
                                                            onCheckedChange={(checked) => handleSelectDocument(doc.id, checked as boolean)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileColor(doc.type)}`}>
                                                                <Icon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900">{doc.name}</div>
                                                                {doc.description && (
                                                                    <div className="text-sm text-slate-500 truncate max-w-xs">{doc.description}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600 capitalize">{doc.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{doc.folder || '-'}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">{formatFileSize(doc.size)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={statusBadge.color}>
                                                                {statusBadge.label}
                                                            </Badge>
                                                            {doc.isLocked && (
                                                                <Lock className="w-3 h-3 text-slate-400" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Clock className="w-4 h-4" />
                                                            {new Date(doc.modifiedTime).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <User className="w-4 h-4" />
                                                            {doc.owner}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                                                    <DropdownMenuItem>Version History</DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        {doc.isLocked ? 'Unlock' : 'Lock'}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {filteredDocuments.length === 0 && (
                        <div className="text-center py-12">
                            <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No documents found</h3>
                            <p className="text-slate-600 mb-4">
                                {searchQuery || Object.values(filters).some(
                                    v => (typeof v === "string" && v !== "all") ||
                                        (typeof v === "number" && v !== 0)
                                )
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by uploading your first document'}
                            </p>
                            <Button onClick={() => setShowUploadDialog(true)}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Document
                            </Button>
                        </div>
                    )}
                </main>
            </div>

            {/* Upload Dialog */}
            <UploadDialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
            />
        </div>
    );
}

// Upload Dialog Component
function UploadDialog({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        folder: '',
        description: '',
        status: 'draft' as DocumentStatus
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle upload logic here
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                        Upload Document
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-700 font-medium mb-1">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500">
                            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (max. 50MB)
                        </p>
                    </div>

                    {/* Document Details */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Document Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Enter document name..."
                            />
                        </div>

                        <div>
                            <Label htmlFor="folder">Folder</Label>
                            <Select
                                value={formData.folder}
                                onValueChange={(value) => setFormData({ ...formData, folder: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    {folders.map(folder => (
                                        <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: DocumentStatus) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="Enter document description..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-amber-600 to-orange-600">
                            Upload
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
