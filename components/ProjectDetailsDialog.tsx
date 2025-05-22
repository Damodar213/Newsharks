"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    _id: string;
    title: string;
    description: string;
    category: string;
    fundingGoal: number;
    currentFunding: number;
    investors: number;
    entrepreneur: {
      name: string;
      email: string;
    };
    approved: boolean;
    createdAt: string;
    matchScore?: number;
  } | null;
}

export function ProjectDetailsDialog({ isOpen, onClose, project }: ProjectDetailsDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{project.entrepreneur.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">Entrepreneur: {project.entrepreneur.name}</span>
            <span className="text-xs text-gray-500">({project.entrepreneur.email})</span>
          </div>
          <div className="text-sm text-gray-500">Created: {new Date(project.createdAt).toLocaleDateString()}</div>
          <div className="text-base font-semibold">Description</div>
          <div className="text-sm">{project.description}</div>
          <div className="flex flex-wrap gap-4 mt-2">
            <div><span className="text-gray-500">Category:</span> {project.category}</div>
            <div><span className="text-gray-500">Investors:</span> {project.investors}</div>
            <div><span className="text-gray-500">Approved:</span> {project.approved ? "Yes" : "No"}</div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Funding Progress</span>
              <span>${(project.currentFunding || 0).toLocaleString()} of ${(project.fundingGoal || 0).toLocaleString()}</span>
            </div>
            <Progress value={((project.currentFunding || 0) / (project.fundingGoal || 1)) * 100} />
          </div>
          {typeof project.matchScore === "number" && (
            <Badge variant="secondary">{project.matchScore}% Match</Badge>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 