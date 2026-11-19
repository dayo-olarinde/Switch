"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface CommentAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    isEdited?: boolean;
    author: CommentAuthor;
  };
  canEdit: boolean;
  canDelete: boolean;
  onSave: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export function CommentItem({
  comment,
  canEdit,
  canDelete,
  onSave,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);

  const isOptimistic = comment.id.startsWith("temp-");
  const showActions = (canEdit || canDelete) && !isOptimistic && !isEditing;

  const startEditing = () => {
    setEditValue(comment.content);
    setIsEditing(true);
  };

  const commitEdit = () => {
    if (!editValue.trim()) return;
    if (editValue !== comment.content) onSave(comment.id, editValue);
    setIsEditing(false);
  };

  return (
    <li
      className={cn(
        "group flex gap-3 transition-opacity",
        isOptimistic && "pointer-events-none opacity-50",
      )}
    >
      <Avatar
        firstName={comment.author.firstName}
        lastName={comment.author.lastName}
        avatarUrl={comment.author.avatarUrl}
        size="md"
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-body font-semibold text-fg">
              {comment.author.firstName} {comment.author.lastName}
            </span>
            <span className="shrink-0 text-2xs font-medium text-fg-muted">
              {isOptimistic
                ? "Posting"
                : formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
            </span>
            {comment.isEdited && !isOptimistic && (
              <span className="shrink-0 text-2xs text-fg-muted">(edited)</span>
            )}
          </div>

          {showActions && (
            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Edit comment"
                  title="Edit comment"
                  onClick={startEditing}
                  icon={<Pencil size={13} aria-hidden />}
                  className="size-8 px-0 text-fg-muted hover:text-fg"
                />
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Delete comment"
                  title="Delete comment"
                  onClick={() => onDelete(comment.id)}
                  icon={<Trash2 size={13} aria-hidden />}
                  className="size-8 px-0 text-fg-muted hover:bg-danger-dim hover:text-danger"
                />
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="overflow-hidden rounded-xl border border-accent bg-surface ring-1 ring-accent-dim">
            <textarea
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  commitEdit();
                }
                if (event.key === "Escape") setIsEditing(false);
              }}
              aria-label="Edit comment"
              className="custom-scrollbar min-h-20 w-full resize-none bg-transparent p-3 text-body text-fg outline-none placeholder:text-fg-muted"
              autoFocus
            />
            <div className="flex items-center justify-between border-t border-border bg-fill-1 p-2">
              <span className="ml-1 hidden items-center gap-1 text-2xs text-fg-muted sm:flex">
                <kbd className="font-sans">Ctrl</kbd> +
                <kbd className="font-sans">Enter</kbd> to save
              </span>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={commitEdit}
                  disabled={!editValue.trim() || editValue === comment.content}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl rounded-tl-sm border border-border bg-fill-1 px-3.5 py-2.5 text-body leading-relaxed break-words whitespace-pre-wrap text-fg">
            {comment.content}
          </div>
        )}
      </div>
    </li>
  );
}
