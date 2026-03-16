import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Eye, Archive, Trash2, Clock, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
;

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages', filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('messages')
        .update({
          status: 'read',
          read_at: new Date().toISOString(),
          read_by: user?.id
        })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast({
        title: "Message marked",
        description: "Message marked as read"
      });
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'archived' })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      setSelectedMessage(null);
      toast({
        title: "Message archived",
        description: "Message has been archived"
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      setSelectedMessage(null);
      toast({
        title: "Message deleted",
        description: "Message has been deleted"
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      unread: {
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        text: "Unread"
      },
      read: {
        color: "bg-green-500/10 text-green-500 border-green-500/20",
        text: "Read"
      },
      archived: {
        color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
        text: "Archived"
      }
    };

    const badge = badges[status as keyof typeof badges] || badges.unread;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {"Messages"}
            </h1>
            <p className="text-muted-foreground">
              {"Manage contact form submissions"}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/[0.03] text-foreground hover:bg-white/[0.06]'
            }`}
          >
            {"All"} {messages && `(${messages.length})`}
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'unread'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/[0.03] text-foreground hover:bg-white/[0.06]'
            }`}
          >
            {"Unread"} {messages && `(${messages.filter(m => m.status === 'unread').length})`}
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'read'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/[0.03] text-foreground hover:bg-white/[0.06]'
            }`}
          >
            {"Read"} {messages && `(${messages.filter(m => m.status === 'read').length})`}
          </button>
          <button
            onClick={() => setFilterStatus('archived')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'archived'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/[0.03] text-foreground hover:bg-white/[0.06]'
            }`}
          >
            {"Archived"} {messages && `(${messages.filter(m => m.status === 'archived').length})`}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">{"Loading..."}</p>
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'unread') {
                      markAsReadMutation.mutate(message.id);
                    }
                  }}
                  className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedMessage?.id === message.id
                      ? 'ring-2 ring-primary'
                      : ''
                  } ${message.status === 'unread' ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${message.status === 'unread' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${message.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {message.name}
                      </span>
                    </div>
                    {getStatusBadge(message.status)}
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">{message.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {message.message}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(message.created_at), 'MM/dd/yyyy HH:mm', {
                        locale: undefined
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {message.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 glass-card rounded-xl">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {"No messages found"}
                </p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="sticky top-6">
            {selectedMessage ? (
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      {selectedMessage.name} ({selectedMessage.email})
                    </div>
                  </div>
                  {getStatusBadge(selectedMessage.status)}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock className="w-4 h-4" />
                  {format(new Date(selectedMessage.created_at), 'MMMM dd, yyyy, HH:mm', {
                    locale: undefined
                  })}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {"Message"}
                  </h3>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    {"Reply"}
                  </a>
                  {selectedMessage.status !== 'archived' && (
                    <button
                      onClick={() => archiveMutation.mutate(selectedMessage.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] text-foreground rounded-lg hover:bg-white/[0.06] transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this message?')) {
                        deleteMutation.mutate(selectedMessage.id);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-12 text-center">
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {"Select a message to view"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
