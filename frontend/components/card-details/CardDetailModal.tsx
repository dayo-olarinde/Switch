"use client";

import { CardDescription } from "@/components/card-details/CardDescription";
import { CardHeader } from "@/components/card-details/CardHeader";
import { CardSidebar } from "@/components/card-details/CardSidebar";
import { CardTitle } from "@/components/card-details/CardTitle";
import { DeleteCardModal } from "@/components/modals/DeleteCardModal";
import { SidePanel } from "@/components/ui/side-panel";
import { Tabs } from "@/components/ui/tabs";
import { useMe } from "@/hooks/useAuth";
import { useDeleteCard, useUpdateCard } from "@/hooks/useCards";
import { useGetProjectBySlug } from "@/hooks/useProjects";
import { useWorkspaceRole } from "@/hooks/useWorkspace";
import { useBoardStore } from "@/store/board.store";
import { BoardCard, BoardColumn } from "@/types/board.types";
import { useState } from "react";
import { ActivityTab } from "./ActivityTab";
import { CardAttachments } from "./CardAttachments";
import { CardComments } from "./CardComments";

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: string;
  columns: BoardColumn[];
  projectSlug: string;
  workspaceSlug: string;
}

export function CardDetailModal(props: CardDetailModalProps) {
  const card = useBoardStore((s) =>
    s.board?.columns.flatMap((c) => c.cards).find((c) => c.id === props.cardId),
  );

  if (!card) return null;

  return <CardDetailModalInner {...props} card={card} />;
}

export function CardDetailModalInner({
  isOpen,
  onClose,
  card,
  columns,
  projectSlug,
  workspaceSlug,
}: CardDetailModalProps & { card: BoardCard }) {
  const [activeTab, setActiveTab] = useState<"activity" | "comments">(
    "comments",
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: currentUser } = useMe();
  const { data: project } = useGetProjectBySlug(workspaceSlug, projectSlug);
  const { canManageWorkspace } = useWorkspaceRole();

  const { mutate: updateCard } = useUpdateCard(card.id);
  const currentColumn = columns.find((c) =>
    c.cards.some((c2) => c2.id === card.id),
  );
  const { mutate: deleteCard } = useDeleteCard(
    card.id,
    currentColumn?.id ?? "",
  );

  const canDeleteCard =
    currentUser?.id === card.creator?.id || canManageWorkspace;

  const handleTitleSave = (newTitle: string) => {
    updateCard({ title: newTitle });
  };

  const handleDescSave = (newDescription: string) => {
    updateCard({ description: newDescription });
  };

  return (
    <>
      <SidePanel
        open={isOpen}
        onClose={onClose}
        width="xl"
        headerless
        bodyClassName="overflow-hidden p-0"
        shouldCloseOnEscape={() => {
          const activeNode = document.activeElement;
          return !(
            activeNode &&
            (activeNode.tagName === "INPUT" || activeNode.tagName === "TEXTAREA")
          );
        }}
      >
        <div className="flex h-full min-h-0 flex-col">
          <CardHeader
            projectName={project?.name ?? ""}
            columnName={currentColumn?.name ?? ""}
            cardTitle={card.title}
            canDelete={canDeleteCard}
            onDelete={() => setIsDeleteModalOpen(true)}
            onClose={onClose}
          />

          <div className="flex min-h-0 flex-1 overflow-hidden">
            <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-base">
              <div className="mx-auto w-full max-w-3xl px-8 py-7">
                <CardTitle
                  title={card.title}
                  priority={card.priority}
                  onSave={handleTitleSave}
                />

                <div className="space-y-8">
                  <CardDescription
                    description={card.description || ""}
                    onSave={handleDescSave}
                  />

                  <CardAttachments card={card} />

                  <section className="border-t border-border pt-5">
                    <Tabs
                      className="mb-5"
                      value={activeTab}
                      onChange={setActiveTab}
                      items={[
                        {
                          value: "comments",
                          label: "Comments",
                          count: card.commentCount || 0,
                        },
                        { value: "activity", label: "Activity" },
                      ]}
                    />

                    <div className="pb-8">
                      {activeTab === "comments" ? (
                        <CardComments cardId={card.id} />
                      ) : (
                        <ActivityTab cardId={card.id} />
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </main>

            <CardSidebar
              card={card}
              columns={columns}
              workspaceSlug={workspaceSlug}
              projectSlug={projectSlug}
            />
          </div>
        </div>
      </SidePanel>

      <DeleteCardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          deleteCard();
          onClose();
        }}
        card={card}
        columnName={currentColumn?.name || "Unknown"}
        projectName={project?.name ?? ""}
      />
    </>
  );
}
