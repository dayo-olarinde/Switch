"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/page";
import { Package, Plus } from "lucide-react";

interface EmptyProjectStateProps {
  onCreateProject: () => void;
}

export default function EmptyProjectState({
  onCreateProject,
}: EmptyProjectStateProps) {
  return (
    <EmptyState
      icon={<Package size={18} />}
      title="Create your first project"
      description="Projects group boards, track tasks and keep your team aligned on what's next."
      action={
        <Button size="md" onClick={onCreateProject} icon={<Plus size={15} />}>
          Create project
        </Button>
      }
      className="min-h-80"
    />
  );
}
