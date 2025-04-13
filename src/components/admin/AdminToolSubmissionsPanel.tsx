
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchToolSubmissions, 
  updateToolSubmissionStatus, 
  deleteToolSubmission,
  convertSubmissionToTool
} from '@/services/adminService';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminToolSubmissionsPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  
  // Fetch all tool submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin', 'toolSubmissions'],
    queryFn: fetchToolSubmissions
  });
  
  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string, status: string }) => 
      updateToolSubmissionStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'toolSubmissions'] });
      toast({
        title: "Success",
        description: "Submission status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  });
  
  // Delete submission mutation
  const deleteSubmissionMutation = useMutation({
    mutationFn: deleteToolSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'toolSubmissions'] });
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete submission",
        variant: "destructive"
      });
    }
  });
  
  // Convert to tool mutation
  const convertToToolMutation = useMutation({
    mutationFn: convertSubmissionToTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'toolSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tools'] });
      toast({
        title: "Success",
        description: "Submission converted to tool successfully",
      });
      setIsViewDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to convert submission to tool",
        variant: "destructive"
      });
    }
  });
  
  // View submission details
  const handleViewSubmission = (submission: any) => {
    setCurrentSubmission(submission);
    setIsViewDialogOpen(true);
  };
  
  // Update submission status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  // Delete submission
  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteSubmissionMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };
  
  // Convert submission to tool
  const handleConvertToTool = async () => {
    if (!currentSubmission) return;
    
    try {
      await convertToToolMutation.mutateAsync(currentSubmission);
    } catch (error) {
      console.error('Error converting submission to tool:', error);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return (
    <div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length > 0 ? (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.category}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>{formatDate(submission.submitted_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select 
                          defaultValue={submission.status}
                          onValueChange={(value) => handleUpdateStatus(submission.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approve</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteSubmission(submission.id)}
                          className="text-red-500 h-8"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No tool submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {currentSubmission && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Submission Details: {currentSubmission.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p>{currentSubmission.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">URL</h3>
                  <p className="break-all">
                    <a href={currentSubmission.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {currentSubmission.url}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pricing Model</h3>
                  <p>{currentSubmission.pricing_model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                  <p>{formatDate(currentSubmission.submitted_at)}</p>
                </div>
                {currentSubmission.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                    <p>{currentSubmission.email}</p>
                  </div>
                )}
                {currentSubmission.image_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Image URL</h3>
                    <p className="break-all">
                      <a href={currentSubmission.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {currentSubmission.image_url}
                      </a>
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 whitespace-pre-wrap">{currentSubmission.description}</p>
              </div>
              
              {currentSubmission.tags && currentSubmission.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentSubmission.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex items-center">
                <Select 
                  defaultValue={currentSubmission.status}
                  onValueChange={(value) => handleUpdateStatus(currentSubmission.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="approved">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => handleDeleteSubmission(currentSubmission.id)}
                >
                  Delete Submission
                </Button>
                {currentSubmission.status !== 'approved' && (
                  <Button 
                    type="button" 
                    onClick={handleConvertToTool}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Convert to Tool
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminToolSubmissionsPanel;
