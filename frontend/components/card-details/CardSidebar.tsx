"use client";

import {
  CardPriority,
  useMoveCard,
  useToggleAssignee,
  useUpdateCard,
} from "@/hooks/useCards";
import {
  useCreateLabel,
  useDeleteLabel,
  useToggleLabel,
} from "@/hooks/useLabels";
import { useGetMembers, useWorkspaceRole } from "@/hooks/useWorkspace";
import {
  cn,
  formatDate,
  formatDateShort,
  getConsistentColor,
} from "@/lib/utils";
import { useBoardStore } from "@/store/board.store";
import { BoardCard, BoardColumn } from "@/types/board.types";
import {
  differenceInCalendarDays,
  format,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronRight, Clock, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useCardMenus } from "./useCardMenu";
import { generateKeyBetween } from "fractional-indexing";

const PRIORITIES = [
  { label: "Urgent", value: "urgent", color: "bg-danger" },
  { label: "High", value: "high", color: "bg-accent-dim" },
  { label: "Medium", value: "medium", color: "bg-warning" },
  { label: "Low", value: "low", color: "bg-success" },
  { label: "None", value: "none", color: "bg-fill-3" },
];

interface CardSidebarProps {
  card: BoardCard;
  columns: BoardColumn[];
  workspaceSlug: string;
  projectSlug: string;
}

export function CardSidebar({
  card,
  columns,
  workspaceSlug,
}: CardSidebarProps) {
  const { toggleMenu, isStatusOpen, isPriorityOpen } = useCardMenus();

  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [labelSearch, setLabelSearch] = useState("");

  const [isCreatingLabelMode, setIsCreatingLabelMode] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#7C6EF5");

  const LABEL_COLORS = [
    "#7C6EF5",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EC4899",
    "#8B5CF6",
  ];

  const { data: workspaceMembers, isLoading: membersLoading } =
    useGetMembers(workspaceSlug);
  const workspaceLabels = useBoardStore((s) => s.workspaceLabels);
  const boardId = useBoardStore((s) => s.board?.id);

  const { mutate: updateCard } = useUpdateCard(card.id);
  const { mutate: moveCard } = useMoveCard();
  const { mutate: toggleAssignee, isPending: isTogglingAssignee } =
    useToggleAssignee(card.id);
  const { mutate: toggleLabel } = useToggleLabel(card);
  const { mutate: createLabel, isPending: isCreatingLabel } =
    useCreateLabel(workspaceSlug);
  const { canManageWorkspace } = useWorkspaceRole();
  const { mutate: deleteLabel } = useDeleteLabel(workspaceSlug);

  const filteredMembers = workspaceMembers?.filter(
    (m) =>
      m.firstName.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
      m.lastName.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(assigneeSearch.toLowerCase()),
  );

  const filteredLabels = workspaceLabels?.filter((l) =>
    l.name.toLowerCase().includes(labelSearch.toLowerCase()),
  );

  const handleContainerClick = (e: React.MouseEvent) => e.stopPropagation();

  const currentColumn = columns.find((c) =>
    c.cards.some((c2) => c2.id === card.id),
  );
  const currentPriority =
    PRIORITIES.find(
      (p) => p.value === (card.priority?.toLowerCase() || "none"),
    ) ?? PRIORITIES[4];

  const dueDateObj = card.dueDate ? new Date(card.dueDate) : null;
  const diffDays = dueDateObj
    ? differenceInCalendarDays(dueDateObj, new Date())
    : 0;
  const isOverdue = dueDateObj
    ? isBefore(startOfDay(dueDateObj), startOfDay(new Date()))
    : false;
  const dateInputValue = dueDateObj ? format(dueDateObj, "yyyy-MM-dd") : "";
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside
      className="w-[320px] shrink-0 border-l border-border overflow-y-auto custom-scrollbar p-6 bg-surface"
      onClick={handleContainerClick}
    >
      <div className="space-y-6">
        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
            Status
          </label>
          <button
            onClick={() => toggleMenu("status")}
            className="w-full flex items-center justify-between p-2.5 bg-card hover:bg-overlay border border-border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-2 h-2 rounded-full bg-accent-dim shrink-0" />
              <span className="text-[13px] font-semibold text-fg truncate">
                {currentColumn?.name || "Unknown"}
              </span>
            </div>
            <ChevronRight
              size={14}
              className={cn(
                "text-fg-muted transition-transform shrink-0",
                isStatusOpen && "rotate-90 text-fg-secondary",
              )}
            />
          </button>
          {isStatusOpen && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-1.5">
              {columns.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    if (col.id !== currentColumn?.id) {
                      const lastCard = col.cards[col.cards.length - 1];
                      const lastCardOrder = lastCard?.order || null;

                      const newOrder = generateKeyBetween(lastCardOrder, null);

                      moveCard({
                        cardId: card.id,
                        data: {
                          columnId: col.id,
                          status: col.mappedStatus,
                          order: newOrder,
                        },
                      });
                    }
                    toggleMenu(null);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-fg-secondary hover:bg-fill-2 hover:text-fg transition-colors text-left"
                >
                  <span className="truncate">{col.name}</span>
                  {col.id === currentColumn?.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-solid shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
            Priority
          </label>
          <button
            onClick={() => toggleMenu("priority")}
            className="w-full flex items-center justify-between p-2.5 bg-card hover:bg-overlay border border-border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <div
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  currentPriority.color,
                )}
              />
              <span className="text-[13px] font-semibold text-fg truncate">
                {currentPriority.label}
              </span>
            </div>
            <ChevronRight
              size={14}
              className={cn(
                "text-fg-muted transition-transform shrink-0",
                isPriorityOpen && "rotate-90 text-fg-secondary",
              )}
            />
          </button>
          {isPriorityOpen && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 py-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    if (p.value !== (card.priority?.toLowerCase() || "none"))
                      updateCard({ priority: p.value as CardPriority });
                    toggleMenu(null);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-medium text-fg-secondary hover:bg-fill-2 hover:text-fg transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn("w-2 h-2 rounded-full shrink-0", p.color)}
                    />
                    <span>{p.label}</span>
                  </div>
                  {p.value === (card.priority?.toLowerCase() || "none") && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-solid shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
            Due Date
          </label>
          <div className="relative w-full">
            <input
              ref={dateInputRef}
              type="date"
              value={dateInputValue}
              onChange={(e) => {
                if (e.target.value) {
                  updateCard({ dueDate: new Date(e.target.value) });
                } else {
                  updateCard({ dueDate: null });
                }
              }}
              className="absolute bottom-0 left-0 w-0 h-0 opacity-0 pointer-events-none scheme-dark"
            />
            <button
              onClick={() => {
                try {
                  dateInputRef.current?.showPicker();
                } catch {
                  dateInputRef.current?.focus();
                }
              }}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors border",
                isOverdue
                  ? "bg-danger-dim hover:bg-danger-dim border-danger"
                  : "bg-card hover:bg-overlay border-border",
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  isOverdue ? "text-danger" : "text-fg-secondary",
                )}
              >
                <Clock size={14} />
                <span className="text-[13px] font-semibold">
                  {dueDateObj
                    ? formatDateShort(dueDateObj.toISOString())
                    : "Set due date"}
                </span>
              </div>
              {isOverdue && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger-dim text-danger">
                  {Math.abs(diffDays)}d overdue
                </span>
              )}
              {!isOverdue && dueDateObj && diffDays === 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning-dim text-warning">
                  Today
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
            Assignees
          </label>

          <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-inner">
            <div className="p-2 border-b border-border bg-card">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted"
                />
                <input
                  type="text"
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  placeholder="Search members..."
                  className="w-full bg-surface hover:bg-surface focus:bg-surface border border-border focus:border-accent/50 rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-fg placeholder:text-fg-muted outline-none transition-all"
                />
              </div>
            </div>

            <div className="max-h-45 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
              {membersLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
              ) : filteredMembers?.length === 0 ? (
                <div className="text-center py-6 text-[12px] text-fg-muted">
                  No members found
                </div>
              ) : (
                filteredMembers?.map((member) => {
                  const isAssigned = card.assignees?.some(
                    (a) => a.id === member.userId,
                  );

                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        if (isTogglingAssignee) return;
                        toggleAssignee({ member, isAssigned: !!isAssigned });
                      }}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg hover:bg-fill-2 cursor-pointer group transition-colors",
                        isTogglingAssignee && "pointer-events-none opacity-50",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.avatarUrl ? (
                          <Image
                            src={member.avatarUrl}
                            alt={`${member.firstName} ${member.lastName}`}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover border border-border-md shrink-0"
                            unoptimized
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-fg shrink-0 border border-border shadow-sm"
                            style={{
                              backgroundColor: getConsistentColor(
                                member.userId,
                              ),
                            }}
                          >
                            {member.firstName[0].toUpperCase()}
                            {member.lastName[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-medium text-fg truncate">
                            {member.firstName} {member.lastName}
                          </span>
                          <span className="text-[11px] text-fg-muted truncate group-hover:text-fg-muted transition-colors">
                            {member.email}
                          </span>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out",
                          isAssigned
                            ? "bg-accent-solid"
                            : "bg-fill-3 group-hover:bg-fill-3",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-3.5 w-3.5 transform rounded-full bg-card shadow-sm transition duration-200 ease-in-out",
                            isAssigned ? "translate-x-4" : "translate-x-0.5",
                          )}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
            Labels
          </label>

          <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-inner">
            <div className="p-2 border-b border-border bg-card">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted"
                />
                <input
                  type="text"
                  value={labelSearch}
                  onChange={(e) => setLabelSearch(e.target.value)}
                  placeholder="Search labels..."
                  className="w-full bg-surface hover:bg-surface focus:bg-surface border border-border focus:border-accent/50 rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-fg placeholder:text-fg-muted outline-none transition-all"
                />
              </div>
            </div>

            <div className="max-h-45 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
              {filteredLabels?.length === 0 && !isCreatingLabelMode ? (
                <div className="text-center py-6 text-[12px] text-fg-muted">
                  No labels found
                </div>
              ) : (
                filteredLabels?.map((label) => {
                  const hex = label.colour || "#7C6EF5";
                  const isAttached = card.labels?.some(
                    (l) => l.id === label.id,
                  );

                  return (
                    <div
                      key={label.id}
                      onClick={() =>
                        toggleLabel({
                          labelId: label.id,
                          isAttached: !!isAttached,
                        })
                      }
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-fill-2 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[13px] font-medium text-fg truncate group-hover:text-fg transition-colors">
                          {label.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {canManageWorkspace && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLabel({
                                labelId: label.id,
                                boardId: boardId ?? "",
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-fg-muted hover:text-danger hover:bg-danger-dim rounded transition-all"
                            title="Delete label"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}

                        <div
                          className={cn(
                            "relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out",
                            isAttached
                              ? "bg-accent-solid"
                              : "bg-fill-3 group-hover:bg-fill-3",
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-3.5 w-3.5 transform rounded-full bg-card shadow-sm transition duration-200 ease-in-out",
                              isAttached ? "translate-x-4" : "translate-x-0.5",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {canManageWorkspace &&
                (isCreatingLabelMode ? (
                  <div className="p-3 border-t border-border space-y-3 bg-surface mt-1 rounded-b-lg animate-in slide-in-from-top-2 duration-150">
                    <input
                      type="text"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      placeholder="Label name..."
                      autoFocus
                      className="w-full bg-card border border-border-md focus:border-accent/50 rounded-md px-3 py-1.5 text-[12px] text-fg outline-none placeholder:text-fg-muted transition-all"
                    />
                    <div className="flex flex-wrap gap-2">
                      {LABEL_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewLabelColor(c);
                          }}
                          className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                          style={{
                            backgroundColor: c,
                            borderColor:
                              newLabelColor === c ? "white" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCreatingLabelMode(false);
                        }}
                        className="text-[11px] font-medium text-fg-muted hover:text-fg px-2 py-1 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!newLabelName.trim()) return;

                          createLabel({
                            name: newLabelName.trim(),
                            colour: newLabelColor,
                            boardId: boardId || "",
                          });

                          setIsCreatingLabelMode(false);
                          setNewLabelName("");
                          setLabelSearch("");
                        }}
                        disabled={isCreatingLabel}
                        className="text-[11px] font-medium bg-accent-solid text-on-accent px-3 py-1 rounded-md hover:bg-accent-solid/90 transition-colors disabled:opacity-50"
                      >
                        {isCreatingLabel ? "Saving..." : "Create"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewLabelName(labelSearch);
                      setIsCreatingLabelMode(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 mt-1 border-t border-border text-[12px] font-medium text-fg-muted hover:text-fg hover:bg-fill-2 transition-all"
                  >
                    <Plus size={12} />
                    {labelSearch.trim()
                      ? `Create "${labelSearch.trim()}"`
                      : "Create new label"}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-fill-2 my-6" />

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
              Created
            </label>
            <div className="text-[12px] text-fg-muted font-medium">
              {card.createdAt ? formatDate(card.createdAt) : ""}{" "}
              <span className="opacity-50">by</span>{" "}
              <span className="text-fg-secondary">
                {card.creator?.firstName} {card.creator?.lastName}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
              Last Updated
            </label>
            <div className="text-[12px] text-fg-muted">
              {card.updatedAt ? formatDate(card.updatedAt) : ""}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
              Card ID
            </label>
            <div className="text-[12px] text-fg-muted font-mono mt-1">
              {card.id.slice(0, 6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
