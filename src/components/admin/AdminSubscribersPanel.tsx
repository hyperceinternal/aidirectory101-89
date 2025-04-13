
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSubscribers, deleteSubscriber } from '@/services/adminService';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const AdminSubscribersPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all subscribers
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin', 'subscribers'],
    queryFn: fetchSubscribers
  });
  
  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscribers'] });
      toast({
        title: "Success",
        description: "Subscriber deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscriber",
        variant: "destructive"
      });
    }
  });
  
  // Handle delete
  const handleDeleteSubscriber = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await deleteSubscriberMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting subscriber:', error);
      }
    }
  };
  
  // Export to CSV
  const exportToCsv = () => {
    if (!subscribers || subscribers.length === 0) return;
    
    const header = ['Email', 'Signup Date'];
    const csvData = subscribers.map((sub: Subscriber) => [
      sub.email,
      new Date(sub.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [
      header.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
        <Button onClick={exportToCsv} variant="outline">
          Export to CSV
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers && subscribers.length > 0 ? (
                subscribers.map((subscriber: Subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      {format(new Date(subscriber.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No subscribers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscribersPanel;
