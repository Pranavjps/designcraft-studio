import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Download, Grid, List, Search, Plus, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api, { Document } from "@/lib/api";
import { cn } from "@/lib/utils";

// No mock data - all documents come from the backend

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddText, setShowAddText] = useState(false);
  const [textSnippet, setTextSnippet] = useState({ title: "", content: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, [statusFilter]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
      // Show empty state - no mock fallback
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await api.uploadDocument(file);
      toast.success("Document uploaded successfully!");
      loadDocuments();
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await api.deleteDocument(documentId);
      toast.success("Document deleted");
      setDocuments(documents.filter(d => d.id !== documentId));
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleAddTextSnippet = async () => {
    if (!textSnippet.title || !textSnippet.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await api.addTextSnippet(textSnippet.title, textSnippet.content);
      toast.success("Text snippet added!");
      setShowAddText(false);
      setTextSnippet({ title: "", content: "" });
      loadDocuments();
    } catch (error) {
      toast.error("Failed to add text snippet");
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType?.includes("pdf")) return "📄";
    if (contentType?.includes("word")) return "📝";
    if (contentType?.includes("text")) return "📃";
    return "📁";
  };

  const getStatusBadge = (status: Document["status"]) => {
    const config = {
      ready: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Ready" },
      processing: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Processing" },
      failed: { icon: AlertCircle, color: "text-red-600 bg-red-50", label: "Failed" }
    };
    const statusConfig = config[status] || { icon: AlertCircle, color: "text-gray-600 bg-gray-50", label: status || "Unknown" };
    const { icon: Icon, color, label } = statusConfig || { icon: AlertCircle, color: "text-gray-600 bg-gray-50", label: "Unknown" };
    return (
      <Badge variant="outline" className={cn("gap-1", color)}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const filteredDocuments = documents
    .filter(doc => doc && doc.id) // Remove undefined/null documents
    .filter(doc => {
      const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const processingCount = documents.filter(d => d.status === "processing").length;

  return (
    <div className="h-full bg-accent/20 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
            <p className="text-muted-foreground">
              {documents.length} documents • {processingCount} processing
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={showAddText} onOpenChange={setShowAddText}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Text Snippet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="e.g., FAQ - Shipping Policy"
                      value={textSnippet.title}
                      onChange={(e) => setTextSnippet({ ...textSnippet, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      placeholder="Enter your text content..."
                      rows={6}
                      value={textSnippet.content}
                      onChange={(e) => setTextSnippet({ ...textSnippet, content: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddText(false)}>Cancel</Button>
                  <Button onClick={handleAddTextSnippet}>Add Snippet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Document
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-border rounded-xl p-8 mb-6 text-center bg-card hover:border-primary/50 transition-colors">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Drop files here to upload</p>
          <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOC, DOCX, TXT files</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
        </div>

        {/* Documents */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{getFileIcon(doc.content_type || "")}</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground truncate mb-2">{doc.filename}</h3>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(doc.status)}
                    <span className="text-xs text-muted-foreground">{formatDate(doc.uploaded_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-accent/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Document</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Uploaded</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-b border-border hover:bg-accent/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFileIcon(doc.content_type || "")}</span>
                        <span className="font-medium text-foreground">{doc.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(doc.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(doc.uploaded_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredDocuments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">Upload your first document to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}