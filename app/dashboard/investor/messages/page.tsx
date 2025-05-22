"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Send, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  receiver: {
    _id: string;
    name: string;
    role: string;
  };
  read: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    role: string;
  }>;
  project: {
    _id: string;
    title: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

export default function InvestorMessages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && user && !isCreatingConversation) {
      createOrFindConversation(projectId);
    }
  }, [searchParams, user, isCreatingConversation]);

  const createOrFindConversation = async (projectId: string) => {
    try {
      setIsCreatingConversation(true);
      // First, fetch the project details to get the entrepreneur's ID
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      const projectData = await projectResponse.json();
      
      if (!projectData.success) {
        throw new Error('Failed to fetch project details');
      }

      const entrepreneurId = projectData.project.entrepreneur._id;

      // Create a new conversation
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: [user?._id, entrepreneurId],
          project: projectId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSelectedConversation(data.conversation);
        // Remove the project parameter from the URL
        router.replace('/dashboard/investor/messages');
      } else {
        throw new Error(data.error || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/messages/conversations?userId=${user?._id}`);
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          content: newMessage,
          sender: user?._id,
          receiver: selectedConversation.participants.find(p => p._id !== user?._id)?._id,
          project: selectedConversation.project._id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage("");
        fetchConversations(); // Refresh conversations to update last message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startVideoCall = () => {
    if (!selectedConversation) return;
    router.push(`/dashboard/investor/video-call/${selectedConversation._id}`);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    conv.project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || isCreatingConversation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?._id === conversation._id ? "bg-gray-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {conversation.participants
                        .find(p => p._id !== user?._id)
                        ?.name.split(" ")
                        .map(n => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.participants.find(p => p._id !== user?._id)?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.project.title}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2">
          {selectedConversation ? (
            <div className="flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConversation.participants
                        .find(p => p._id !== user?._id)
                        ?.name.split(" ")
                        .map(n => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedConversation.participants.find(p => p._id !== user?._id)?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.project.title}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startVideoCall}
                  className="flex items-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Video Call</span>
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div>Loading messages...</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender._id === user?._id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender._id === user?._id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
