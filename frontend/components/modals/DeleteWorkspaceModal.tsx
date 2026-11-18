"use client";

import { useDeleteWorkspace, Workspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { AlertTriangle, LayoutGrid, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Portal } from "../ui/Portal";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
  projectCount?: number;
  memberCount?: number;
}

export default function DeleteWorkspaceModal({
  isOpen,
  onClose,
  workspace,
  projectCount = 0,
  memberCount = 0,
}: DeleteWorkspaceModalProps) {
  const router = useRouter();

  const [confirmInput, setConfirmInput] = useState("");
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace(
    workspace!.slug,
  );

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setConfirmInput(""), 200);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !workspace) return null;

  const isMatch = confirmInput === workspace.slug;

  const handleDeleteWorkspace = () => {
    if (!isMatch) return;
    deleteWorkspace();
    router.push("/dashboard");
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div
          className="fixed inset-0 bg-scrim backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-125 bg-surface border border-overlay rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            disabled={isPending}
            className="absolute top-4 right-4 text-fg-secondary hover:text-fg transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>

          <div className="p-6">
            <div className="w-10 h-10 rounded-xl bg-danger-dim text-danger flex items-center justify-center mb-5 border border-danger-dim">
              <LayoutGrid size={20} />
            </div>

            <h2 className="text-xl font-bold text-fg mb-1.5 tracking-tight">
              Delete workspace
            </h2>
            <p className="text-[13px] text-fg-secondary mb-6 leading-relaxed">
              Permanently deletes the workspace, all projects, boards, cards,
              and member access.
            </p>

            <div className="bg-card border border-overlay rounded-xl p-4 mb-4 flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black text-on-accent shrink-0",
                  workspace.colour || "bg-accent-solid",
                )}
              >
                {workspace.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-fg truncate">
                  {workspace.name}
                </span>
                <span className="text-[13px] text-fg-secondary truncate mt-0.5">
                  {projectCount} projects · {memberCount} members
                </span>
              </div>
            </div>

            <div className="bg-danger-dim/80 border border-danger/40 rounded-xl p-4 mb-4 flex gap-3 items-start">
              <AlertTriangle
                size={16}
                className="text-danger shrink-0 mt-0.5"
              />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-danger mb-1">
                  This is irreversible
                </span>
                <p className="text-[13px] text-fg-secondary leading-relaxed">
                  All {projectCount} projects, attachments, comments, and member
                  access will be permanently deleted. Billing will stop
                  immediately. There is no way to recover this workspace.
                </p>
              </div>
            </div>

            <div className="bg-card border border-overlay rounded-xl p-4 mb-8">
              <label className="block text-[13px] text-fg-secondary mb-3 leading-relaxed">
                Type{" "}
                <span className="bg-danger-dim text-danger px-1.5 py-0.5 rounded font-mono text-xs">
                  {workspace.slug}
                </span>{" "}
                to confirm. This will immediately revoke access for all{" "}
                {memberCount} members.
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={workspace.slug}
                className="w-full h-10 bg-surface border border-overlay rounded-md px-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-danger transition-colors shadow-[0_0_0_1px_rgba(239,68,68,0.1)] focus:shadow-[0_0_0_1px_rgba(239,68,68,0.3)]"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isPending}
                className="px-4 h-10 rounded-lg text-sm font-semibold text-fg bg-transparent border border-overlay hover:bg-overlay transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkspace}
                disabled={isPending || !isMatch}
                className="px-4 h-10 rounded-lg text-sm font-semibold text-danger bg-danger-dim border border-danger/50 hover:bg-danger-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-fg" />
                    Deleting...
                  </>
                ) : (
                  "Delete workspace forever"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
