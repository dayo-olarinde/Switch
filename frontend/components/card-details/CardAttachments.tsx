"use client";

import {
  cn,
  formatDateShort,
  formattedTime,
  handleDownload,
} from "@/lib/utils";
import {
  Download,
  FileText,
  File as GenericFile,
  Image as ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

import {
  useDeleteAttachment,
  useUploadAttachment,
} from "@/hooks/useAttacments";
import { useMe } from "@/hooks/useAuth";
import { useWorkspaceRole } from "@/hooks/useWorkspace";
import { BoardCard } from "@/types/board.types";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon size={16} className="text-warning" aria-hidden />;
  }
  if (mimeType.includes("pdf") || mimeType.includes("document")) {
    return <FileText size={16} className="text-accent" aria-hidden />;
  }
  return <GenericFile size={16} className="text-accent" aria-hidden />;
}

export function CardAttachments({ card }: { card: BoardCard }) {
  const { data: currentUser } = useMe();
  const { canManageWorkspace } = useWorkspaceRole();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { mutate: upload, isPending: isUploading } = useUploadAttachment(
    card.id,
  );
  const { mutate: remove, isPending: isDeleting } = useDeleteAttachment(
    card.id,
  );

  const attachments = card.attachments ?? [];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) upload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-2xs font-semibold tracking-wider text-fg-muted uppercase">
          Attachments
          {attachments.length > 0 && (
            <span className="ml-1.5 font-normal">({attachments.length})</span>
          )}
        </h3>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-busy={isUploading}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-fill-2 px-2.5 text-body font-semibold text-fg-secondary transition-colors hover:border-border-md hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
        >
          <Upload size={13} aria-hidden />
          {isUploading ? "Uploading…" : "Upload"}
        </button>
      </div>

      {attachments.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {attachments.map((file) => {
            const canDelete =
              file.userId === currentUser?.id || canManageWorkspace;

            return (
              <li
                key={file.id}
                className="group/file flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5 transition-colors hover:border-border-md"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-fill-1">
                  <FileIcon mimeType={file.mimeType} />
                </span>

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-body font-medium text-fg">
                    {file.fileName}
                  </span>
                  <span className="truncate text-2xs text-fg-muted">
                    {formatBytes(file.fileSize)} · {file.user?.firstName} ·{" "}
                    {formatDateShort(file.createdAt)}{" "}
                    {formattedTime(file.createdAt)}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover/file:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    aria-label={`Download ${file.fileName}`}
                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                    className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    <Download size={14} />
                  </button>

                  {canDelete && (
                    <button
                      type="button"
                      aria-label={`Delete ${file.fileName}`}
                      onClick={() => remove(file.id)}
                      disabled={isDeleting}
                      className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-danger-dim hover:text-danger focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
          isDragging
            ? "border-accent bg-accent-dim"
            : "border-border-md bg-fill-1 hover:border-border-lg hover:bg-fill-2",
          isUploading && "pointer-events-none opacity-50",
        )}
      >
        <Upload
          size={16}
          aria-hidden
          className={cn(
            "mb-1.5",
            isDragging ? "text-accent" : "text-fg-muted",
          )}
        />
        <span className="text-2xs font-medium text-fg-muted">
          {isDragging ? "Drop to upload" : "Drop files here or click to upload"}
        </span>
      </div>
    </section>
  );
}
