"use client";

import { Button } from "@/components/ui/button";
import { useCreateLabel, useDeleteLabel, useToggleLabel } from "@/hooks/useLabels";
import { useWorkspaceRole } from "@/hooks/useWorkspace";
import { LABEL_COLORS, cn, getLabelClasses, pickLabelColor } from "@/lib/utils";
import { useBoardStore } from "@/store/board.store";
import { BoardCard } from "@/types/board.types";
import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  SidebarEmpty,
  SidebarListShell,
  SidebarSearch,
  ToggleSwitch,
} from "./sidebar-parts";

const SWATCHES = LABEL_COLORS.map((color) => color.hex);

export function LabelPicker({
  card,
  workspaceSlug,
}: {
  card: BoardCard;
  workspaceSlug: string;
}) {
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftColour, setDraftColour] = useState(
    pickLabelColor("", []) ?? SWATCHES[0],
  );

  const workspaceLabels = useBoardStore((state) => state.workspaceLabels);
  const boardId = useBoardStore((state) => state.board?.id) ?? "";
  const { canManageWorkspace } = useWorkspaceRole();

  const { mutate: toggleLabel } = useToggleLabel(card);
  const { mutate: createLabel, isPending: isCreatingLabel } =
    useCreateLabel(workspaceSlug);
  const { mutate: deleteLabel } = useDeleteLabel(workspaceSlug);

  const attachedIds = new Set((card.labels ?? []).map((label) => label.id));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return workspaceLabels;

    return workspaceLabels.filter((label) =>
      label.name.toLowerCase().includes(query),
    );
  }, [workspaceLabels, search]);

  const openCreate = () => {
    const name = search.trim();
    setDraftName(name);
    setDraftColour(
      pickLabelColor(
        name,
        workspaceLabels.map((label) => label.colour),
      ) ?? SWATCHES[0],
    );
    setIsCreating(true);
  };

  const submitLabel = () => {
    const name = draftName.trim();
    if (!name) return;

    createLabel(
      { name, colour: draftColour, boardId },
      {
        onSuccess: () => {
          setIsCreating(false);
          setDraftName("");
          setSearch("");
        },
      },
    );
  };

  return (
    <SidebarListShell>
      <SidebarSearch
        value={search}
        onChange={setSearch}
        placeholder="Search labels…"
      />

      <div className="custom-scrollbar max-h-44 overflow-y-auto p-1">
        {filtered.length === 0 && !isCreating ? (
          <SidebarEmpty>No labels found</SidebarEmpty>
        ) : (
          filtered.map((label) => {
            const isAttached = attachedIds.has(label.id);

            return (
              <div
                key={label.id}
                className="group/label flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-fill-2"
              >
                <button
                  type="button"
                  aria-pressed={isAttached}
                  onClick={() => toggleLabel({ labelId: label.id, isAttached })}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span
                    className={cn(
                      "truncate rounded border px-1.5 py-0.5 text-2xs font-medium",
                      getLabelClasses(label.colour),
                    )}
                  >
                    {label.name}
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  {canManageWorkspace && (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Delete ${label.name} label`}
                      onClick={() => deleteLabel({ labelId: label.id, boardId })}
                      icon={<Trash2 size={12} aria-hidden />}
                      className="size-6 px-0 text-fg-muted opacity-0 transition-opacity group-hover/label:opacity-100 hover:bg-danger-dim hover:text-danger focus-visible:opacity-100"
                    />
                  )}

                  <button
                    type="button"
                    aria-label={`Toggle ${label.name} label`}
                    aria-pressed={isAttached}
                    onClick={() => toggleLabel({ labelId: label.id, isAttached })}
                  >
                    <ToggleSwitch checked={isAttached} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-border">
        {isCreating ? (
          <div className="space-y-2 p-2">
            <input
              autoFocus
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitLabel();
                if (event.key === "Escape") setIsCreating(false);
              }}
              placeholder="Label name"
              aria-label="New label name"
              className="h-8 w-full rounded-md border border-accent bg-fill-1 px-2.5 text-body text-fg outline-none placeholder:text-fg-muted"
            />

            <div className="flex items-center gap-1.5">
              {SWATCHES.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  aria-label={`Use colour ${colour}`}
                  aria-pressed={draftColour === colour}
                  onClick={() => setDraftColour(colour)}
                  className={cn(
                    "size-4 rounded-full transition-transform hover:scale-110",
                    draftColour === colour &&
                      "ring-2 ring-fg ring-offset-2 ring-offset-surface",
                  )}
                  style={{ backgroundColor: colour }}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submitLabel}
                loading={isCreatingLabel}
                disabled={!draftName.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        ) : (
          canManageWorkspace && (
            <button
              type="button"
              onClick={openCreate}
              className="flex h-8 w-full items-center gap-1.5 px-2.5 text-2xs font-semibold text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg"
            >
              <Plus size={12} aria-hidden />
              Create label
            </button>
          )
        )}
      </div>
    </SidebarListShell>
  );
}
