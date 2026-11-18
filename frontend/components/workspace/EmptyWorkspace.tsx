"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/page";
import { LayoutGrid, Plus } from "lucide-react";

interface EmptyWorkspaceStateProps {
  onCreateWorkspace: () => void;
}

export default function EmptyWorkspaceState({
  onCreateWorkspace,
}: EmptyWorkspaceStateProps) {
  return (
    <EmptyState
      icon={<LayoutGrid size={18} />}
      title="Create your first workspace"
      description="A workspace brings your team, projects and boards together in one place. Create one to get started."
      action={
        <Button size="md" onClick={onCreateWorkspace} icon={<Plus size={15} />}>
          Create workspace
        </Button>
      }
      className="min-h-90"
    />
  );
}
