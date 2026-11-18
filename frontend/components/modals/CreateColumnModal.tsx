"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { useCreateColumn } from "@/hooks/useColumns";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

type StatusEnum = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";

const STATUS_OPTIONS: {
  value: StatusEnum;
  label: string;
  description: string;
  fullWidth?: boolean;
}[] = [
  {
    value: "BACKLOG",
    label: "Backlog",
    description: "Not yet started",
  },
  {
    value: "TODO",
    label: "To do",
    description: "Ready to pick up",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
    description: "Actively being worked on",
  },
  {
    value: "DONE",
    label: "Done",
    description: "Completed work",
  },
  {
    value: "CANCELED",
    label: "Canceled",
    description: "Work that won't be completed — excluded from tracking",
    fullWidth: true,
  },
];

export default function CreateColumnModal({
  isOpen,
  onClose,
  boardId,
}: {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}) {
  const [name, setName] = useState("");
  const [mappedStatus, setMappedStatus] = useState<StatusEnum>("IN_PROGRESS");

  const { mutate: createCol, isPending } = useCreateColumn(boardId);

  const handleSubmit = () => {
    if (!name.trim() || !mappedStatus || !boardId) return;
    createCol({ name, mappedStatus });
    onClose();
    setName("");
    setMappedStatus("IN_PROGRESS");
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Add a column"
      description="Columns organise your board into stages. Give it a name and map it to a status."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || isPending}
            className="flex h-10 items-center gap-2 rounded-lg bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create column"
            )}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="column-name"
            className="flex gap-1 text-sm font-semibold text-fg"
          >
            Column name <span className="text-accent">*</span>
          </label>
          <input
            id="column-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. In Progress"
            autoFocus
            className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
          <span className="text-xs text-fg-muted">
            Shown as the column header on your board.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-fg">Status *</span>
          <span className="mb-1 text-xs text-fg-muted">
            Maps this column to a standard workflow stage used across reports and
            filters.
          </span>

          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isActive = mappedStatus === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMappedStatus(option.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    option.fullWidth && "col-span-2",
                    isActive
                      ? "border-accent bg-accent-dim"
                      : "border-border bg-fill-1 hover:bg-fill-2",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "mb-0.5 text-sm font-semibold",
                        isActive ? "text-accent" : "text-fg",
                      )}
                    >
                      {option.label}
                    </div>
                    <div className="text-xs leading-snug text-fg-secondary">
                      {option.description}
                    </div>
                  </div>

                  {isActive && (
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DialogShell>
  );
}
