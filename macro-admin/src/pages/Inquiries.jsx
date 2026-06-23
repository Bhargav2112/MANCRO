import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageSquare, Search, Mail, Phone, Calendar, Loader2, CheckCircle2, AlertCircle, RefreshCw, Trash2, MoreHorizontal } from 'lucide-react';
import moment from 'moment';

export default function Inquiries() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const { data: inquiries = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['inquiries', search, status],
    queryFn: () => base44.entities.Inquiry.list({ search, status }),
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await base44.entities.Inquiry.update(id, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await base44.entities.Inquiry.delete(id);
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    } catch (err) {
      console.error("Failed to delete inquiry", err);
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Pending':
        return <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</Badge>;
      case 'Contacted':
        return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">Contacted</Badge>;
      case 'Completed':
        return <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Completed</Badge>;
      default:
        return <Badge>{s}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">Customer Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage purchase requests and atelier viewings</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => refetch()} 
          disabled={isLoading || isRefetching}
          className="border-border hover:bg-secondary"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border h-11"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-card border-border h-11">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Inquiries</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50 border-b border-border">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground h-12">Client</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground h-12">Contact Details</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground h-12">Reference Product</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground h-12">Message</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground h-12">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground h-12 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inq) => (
                  <TableRow key={inq._id} className="hover:bg-secondary/20 transition-colors border-b border-border">
                    <TableCell className="align-top py-4">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{inq.customerName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {moment(inq.createdAt).format('lll')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <a href={`mailto:${inq.customerEmail}`} className="hover:text-primary transition-colors text-muted-foreground hover:underline">
                            {inq.customerEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <a href={`tel:${inq.customerPhone}`} className="hover:text-primary transition-colors text-muted-foreground hover:underline">
                            {inq.customerPhone}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      {inq.watchName ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-xs px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary">
                            {inq.watchName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">General Atelier Request</span>
                      )}
                    </TableCell>
                    <TableCell className="align-top py-4 max-w-xs">
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap truncate hover:text-clip hover:whitespace-normal">
                        {inq.message}
                      </p>
                    </TableCell>
                    <TableCell className="align-top py-4">
                      {getStatusBadge(inq.status)}
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inq._id, 'Contacted')}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-blue-400" />
                            Mark Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inq._id, 'Completed')}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-400" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(inq._id, 'Pending')}>
                            <AlertCircle className="w-3.5 h-3.5 mr-2 text-amber-400" />
                            Mark Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(inq._id)}>
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete Inquiry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {inquiries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm font-semibold">No inquiries found</p>
                      <p className="text-xs mt-1">Customers submissions will appear here</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
