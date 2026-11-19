"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import {
  useCreateComment,
  useDeleteComment,
  useEditComment,
  useGetComments,
} from "@/hooks/useComments";
import { useGetMembers, useWorkspaceRole } from "@/hooks/useWorkspace";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CommentsSkeleton } from "../skeletons/CardComments";
import { CommentItem } from "./comment-item";

export function CardComments({ cardId }: { cardId: string }) {
  const params = useParams();
  const workspaceSlug = params.workspaceSlug as string;
  const { data: currentUser } = useMe();
  const { data: members } = useGetMembers(workspaceSlug);

  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  const [commentValue, setCommentValue] = useState("");
  const { data: comments = [], isLoading } = useGetComments(cardId);
  const { mutate: createComment, isPending } = useCreateComment(cardId);
  const { mutate: editComment } = useEditComment(cardId);
  const { mutate: deleteComment } = useDeleteComment(cardId);

  const { canManageWorkspace } = useWorkspaceRole();

  const handleSubmit = () => {
    if (!commentValue.trim()) return;
    createComment(commentValue);
    setCommentValue("");
  };

  if (isLoading || !members) {
    return <CommentsSkeleton />;
  }

  const currentMember = members.find((m) => m.userId === currentUser?.id);

  return (
    <div className="space-y-6 pb-4">
      {comments.length > 0 ? (
        <ul className="space-y-6">
          {comments.map((comment) => {
            const isAuthor = currentUser?.id === comment.author.id;
            const authorMember = members.find(
              (m) => m.userId === comment.author.id,
            );
            const isAuthorOwner =
              authorMember?.role?.toLowerCase() === "owner" ||
              activeWorkspace?.ownerId === comment.author.id;

            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                canEdit={isAuthor}
                canDelete={isAuthor || (canManageWorkspace && !isAuthorOwner)}
                onSave={(commentId, content) =>
                  editComment({ commentId, content })
                }
                onDelete={(commentId) => deleteComment(commentId)}
              />
            );
          })}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-fill-1 py-10 text-center">
          <p className="text-body font-medium text-fg-muted">
            No comments yet. Start the conversation.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar
          firstName={currentUser?.firstName ?? ""}
          lastName={currentUser?.lastName}
          avatarUrl={currentMember?.avatarUrl}
          size="md"
          className="mt-1"
        />

        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border-md bg-surface transition-colors focus-within:border-accent focus-within:ring-1 focus-within:ring-accent-dim">
          <textarea
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            className="custom-scrollbar min-h-20 w-full resize-none bg-transparent p-3 text-body text-fg outline-none placeholder:text-fg-muted"
          />
          <div className="flex items-center justify-between p-2">
            <span className="ml-1 hidden items-center gap-1 text-2xs text-fg-muted sm:flex">
              <kbd className="font-sans">Ctrl</kbd> +{" "}
              <kbd className="font-sans">Enter</kbd> to send
            </span>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={isPending}
              disabled={!commentValue.trim()}
              className="ml-auto"
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
