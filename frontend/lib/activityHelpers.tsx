import {
  Activity,
  Plus,
  ArrowRightLeft,
  Tag,
  UserPlus,
  UserMinus,
  MessageSquare,
  Edit2,
  Trash2,
  Paperclip,
  Calendar,
  Flag,
  Layout,
  LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { CardActivity } from "@/hooks/useActivities";

export const getActivityConfig = (type: string) => {
  const config: Record<
    string,
    { icon: LucideIcon; color: string; bg: string }
  > = {
    card_created: {
      icon: Plus,
      color: "text-success",
      bg: "bg-success-dim border-success",
    },
    card_updated: {
      icon: Layout,
      color: "text-info",
      bg: "bg-info-dim border-info",
    },
    card_moved: {
      icon: ArrowRightLeft,
      color: "text-info",
      bg: "bg-info-dim border-info",
    },

    // Comments
    comment_added: {
      icon: MessageSquare,
      color: "text-success",
      bg: "bg-success-dim border-success",
    },
    comment_edited: {
      icon: Edit2,
      color: "text-info",
      bg: "bg-info-dim border-info",
    },
    comment_deleted: {
      icon: Trash2,
      color: "text-danger",
      bg: "bg-danger-dim border-danger",
    },

    // Assignees
    assignee_added: {
      icon: UserPlus,
      color: "text-accent",
      bg: "bg-accent-solid/10 border-accent/20",
    },
    assignee_removed: {
      icon: UserMinus,
      color: "text-danger",
      bg: "bg-danger-dim border-danger",
    },

    // Labels
    label_added: {
      icon: Tag,
      color: "text-warning",
      bg: "bg-warning-dim border-warning",
    },
    label_removed: {
      icon: Tag,
      color: "text-danger",
      bg: "bg-danger-dim border-danger",
    },

    // Attachments
    attachment_added: {
      icon: Paperclip,
      color: "text-success",
      bg: "bg-success-dim border-success",
    },
    attachment_removed: {
      icon: Paperclip,
      color: "text-danger",
      bg: "bg-danger-dim border-danger",
    },

    // Dates & Priority
    due_date_set: {
      icon: Calendar,
      color: "text-info",
      bg: "bg-info-dim border-info",
    },
    due_date_removed: {
      icon: Calendar,
      color: "text-danger",
      bg: "bg-danger-dim border-danger",
    },
    priority_changed: {
      icon: Flag,
      color: "text-warning",
      bg: "bg-warning-dim border-warning",
    },
  };

  // Fallback for unknown types
  return (
    config[type] || {
      icon: Activity,
      color: "text-fg-muted",
      bg: "bg-fill-2 border-border-md",
    }
  );
};

export const renderActivityText = (activity: CardActivity) => {
  const meta = activity.metadata || {};

  switch (activity.type) {
    case "card_created":
      return "created this card";
    case "card_updated":
      return "updated the card details";
    case "card_moved":
      return meta?.from && meta?.to ? (
        <>
          moved this card from{" "}
          <span className="font-semibold text-fg">{meta.from}</span> to{" "}
          <span className="inline-flex rounded border border-info/30 bg-info-dim px-1.5 py-0.5 text-2xs font-medium text-info">
            {meta.to}
          </span>
        </>
      ) : (
        "moved this card"
      );

    case "comment_added":
      return "left a comment";
    case "comment_edited":
      return "edited their comment";
    case "comment_deleted":
      return "deleted a comment";

    case "assignee_added":
      return (
        <>
          assigned{" "}
          <span className="font-bold text-accent">{meta.assigneeName}</span>{" "}
          to this card
        </>
      );

    case "assignee_removed":
      return (
        <>
          removed{" "}
          <span className="font-bold text-accent">{meta.assigneeName}</span>{" "}
          from this card
        </>
      );

    case "label_added":
      return (
        <>
          attached a label:{" "}
          <span className="inline-flex items-center rounded bg-fill-3 px-1.5 py-0.5 text-2xs font-semibold text-fg">
            {meta.labelName || "label"}
          </span>{" "}
        </>
      );
    case "label_removed":
      return (
        <>
          removed a label:{" "}
          <span className="inline-flex items-center rounded bg-fill-3 px-1.5 py-0.5 text-2xs font-semibold text-fg">
            {meta.labelName || "label"}
          </span>{" "}
        </>
      );

    case "attachment_added":
      return `attached ${meta.fileName || "a file"}`;
    case "attachment_removed":
      return `removed ${meta.fileName || "an attachment"}`;

    case "due_date_set":
      const dateString = meta.dueDate
        ? format(new Date(meta.dueDate), "MMM d, yyyy")
        : "a new date";
      return `set the due date to ${dateString}`;
    case "due_date_removed":
      return "removed the due date";

    case "priority_changed":
      return `changed the priority to ${meta.priority || "a new level"}`;

    default:
      return "made an update to this card";
  }
};
