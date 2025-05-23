"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VideoCallButtonProps {
  projectId?: string;
  callId?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  userRole?: "entrepreneur" | "investor";
  userName?: string;
}

export function VideoCallButton({ 
  projectId, 
  callId, 
  variant = "default", 
  size = "default",
  userRole = "entrepreneur",
  userName = "User"
}: VideoCallButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [customCallId, setCustomCallId] = useState(callId || '');
  const router = useRouter();

  const generateCallId = () => {
    // Generate a random ID if not provided
    if (!customCallId) {
      const randomId = Math.random().toString(36).substring(2, 10);
      setCustomCallId(projectId ? `${projectId}-${randomId}` : randomId);
    }
  };

  const handleOpenDialog = () => {
    generateCallId();
    setIsDialogOpen(true);
  };

  const handleStartCall = () => {
    setIsCreating(true);
    
    // Store user information in localStorage
    localStorage.setItem("userName", userName);
    localStorage.setItem("userRole", userRole);
    
    // Navigate to the video call page
    if (customCallId) {
      router.push(`/video-call/${customCallId}`);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/video-call/${customCallId}`;
    navigator.clipboard.writeText(url);
    alert('Video call link copied to clipboard!');
  };

  return (
    <>
      <Button 
        onClick={handleOpenDialog} 
        variant={variant}
        size={size}
        className={size === "icon" ? "" : "gap-2"}
      >
        <Video className={size === "icon" ? "h-4 w-4" : "h-5 w-5"} />
        {size !== "icon" && <span>Video Call</span>}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userRole === "entrepreneur" ? "Start Video Call" : "Join Video Call"}
            </DialogTitle>
            <DialogDescription>
              {userRole === "entrepreneur" 
                ? "Create a new video call and share the invite link with investors."
                : "Enter a call ID to join an existing call or create a new one."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="callId">Call ID</Label>
              <Input
                id="callId"
                placeholder="Enter call ID"
                value={customCallId}
                onChange={(e) => setCustomCallId(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCopyLink}>
              Copy Invite Link
            </Button>
            <Button onClick={handleStartCall} disabled={isCreating}>
              {isCreating ? "Starting..." : userRole === "entrepreneur" ? "Start Call" : "Join Call"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 