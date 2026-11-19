"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { useCreateColumn } from "@/hooks/useColumns";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

type StatusEnum = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";

const STATUS_OPTIONS: {
  value: StatusEnum;
  label: string;
  description: string;
  dot: string;
  fullWidth?: boolean;
}[] = [
  {
    value: "BACKLOG",
    label: "Backlog",
    description: "Not yet started",
    dot: "bg-fg-muted",
  },
  {
    value: "TODO",
    label: "To do",
    description: "Ready to pick up",
    dot: "bg-info",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
    description: "Actively being worked on",
    dot: "bg-accent",
  },
  {
    value: "DONE",
    label: "Done",
    description: "Completed work",
    dot: "bg-success",
  },
  {
    value: "CANCELED",
    label: "Canceled",
    description: "Work that won't be completed — excluded from tracking",
    dot: "bg-fg-muted",
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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={!name.trim()}
          >
            Create column
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="column-name"
            className="text-2xs font-semibold tracking-wider text-fg-muted uppercase"
          >
            Column name
          </label>
          <input
            id="column-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. In Progress"
            autoFocus
            className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-body text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
          <span className="text-2xs text-fg-muted">
            Shown as the column header on your board.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-2xs font-semibold tracking-wider text-fg-muted uppercase">
            Status
          </span>
          <span className="mb-1 text-2xs text-fg-muted">
            Maps this column to a standard workflow stage used across reports and
            filters.
          </span>

          <div role="radiogroup" className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isActive = mappedStatus === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setMappedStatus(option.value)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    option.fullWidth && "col-span-2",
                    isActive
                      ? "border-accent bg-accent-dim"
                      : "border-border bg-fill-1 hover:bg-fill-2",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      option.dot,
                    )}
                  />

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "mb-0.5 block text-body font-semibold",
                        isActive ? "text-accent" : "text-fg",
                      )}
                    >
                      {option.label}
                    </span>
                    <span className="block text-2xs leading-snug text-fg-secondary">
                      {option.description}
                    </span>
                  </span>

                  {isActive && (
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      aria-hidden
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
