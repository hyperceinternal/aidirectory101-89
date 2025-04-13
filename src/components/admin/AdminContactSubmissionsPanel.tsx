
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchContactSubmissions, 
  updateContactStatus, 
  deleteContactSubmission 
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
  DialogFooter
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
import { Mail, Eye, CheckCircle, XCircle } from 'lucide-react';

const AdminContactSubmissionsPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<any>(null);
  
  // Fetch all contact submissions
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin', 'contactSubmissions'],
    queryFn: fetchContactSubmissions
  });
  
  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string, status: string }) => 
      updateContactStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contactSubmissions'] });
      toast({
        title: "Success",
        description: "Contact status updated",
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
  
  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: deleteContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contactSubmissions'] });
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      setIsViewDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive"
      });
    }
  });
  
  // View contact details
  const handleViewContact = (contact: any) => {
    setCurrentContact(contact);
    setIsViewDialogOpen(true);
    
    // If message is unread, mark it as read
    if (contact.status === 'unread') {
      updateStatusMutation.mutate({ id: contact.id, status: 'read' });
    }
  };
  
  // Update contact status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  // Delete contact
  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        await deleteContactMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Unread</Badge>;
      case 'read':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Read</Badge>;
      case 'replied':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Replied</Badge>;
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
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts && contacts.length > 0 ? (
                contacts.map((contact) => (
                  <TableRow key={contact.id} className={contact.status === 'unread' ? 'bg-blue-50' : ''}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>{formatDate(contact.submitted_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewContact(contact)}
                          className={contact.status === 'unread' ? 'bg-blue-100' : ''}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-500"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No contact submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {currentContact && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {currentContact.subject}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">From</h3>
                  <p>{currentContact.name} ({currentContact.email})</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p>{formatDate(currentContact.submitted_at)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                  {currentContact.message}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <div className="flex items-center">
                <Select 
                  defaultValue={currentContact.status}
                  onValueChange={(value) => handleUpdateStatus(currentContact.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-blue-500" />
                        Unread
                      </div>
                    </SelectItem>
                    <SelectItem value="read">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-4 w-4 text-gray-500" />
                        Read
                      </div>
                    </SelectItem>
                    <SelectItem value="replied">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Replied
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    window.location.href = `mailto:${currentContact.email}?subject=Re: ${currentContact.subject}`;
                    handleUpdateStatus(currentContact.id, 'replied');
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply via Email
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => handleDeleteContact(currentContact.id)}
                >
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminContactSubmissionsPanel;
