"use client";

import { useParams, useRouter } from "next/navigation";
import { useBoard } from "@/hooks/useBoard";
import { CardDetailModal } from "@/components/card-details/CardDetailModal";
import { useBoardSocket } from "@/hooks/useBoardSocket";
import { Button } from "@/components/ui/button";

export default function FullPageCard() {
  const router = useRouter();
  const { workspaceSlug, projectSlug, cardId } = useParams() as {
    workspaceSlug: string;
    projectSlug: string;
    cardId: string;
  };
  const { data: board, isLoading } = useBoard(projectSlug, workspaceSlug);
  const boardId = board?.id;
  useBoardSocket(boardId ?? "");

  if (isLoading || !board) {
    return <div className="min-h-screen bg-base" />;
  }

  const columns = board.columns ?? [];
  const projectHref = `/${workspaceSlug}/${projectSlug}`;

  if (!columns.some((column) => column.cards.some((c) => c.id === cardId))) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base text-center">
        <div>
          <p className="text-headline font-semibold text-fg">Card not found</p>
          <p className="mt-1.5 text-body text-fg-muted">
            This card was deleted or moved to another board.
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push(projectHref)}>
          Back to board
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      <CardDetailModal
        isOpen={true}
        onClose={() => router.push(projectHref)}
        cardId={cardId}
        columns={columns}
        projectSlug={projectSlug}
        workspaceSlug={workspaceSlug}
      />
    </div>
  );
}
