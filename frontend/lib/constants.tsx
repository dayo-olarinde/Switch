import { Flag } from "lucide-react";

export const PRIORITY_COLOR: Record<string, string> = {
  urgent: "text-danger",
  high: "text-warning",
  medium: "text-warning",
  low: "text-info",
  none: "text-fg-muted",
};

export const PRIORITY_OPTIONS = [
  { label: "No Priority", value: "none", icon: <Flag size={13} /> },
  {
    label: "Low",
    value: "low",
    icon: <Flag size={13} />,
    colorClass: "text-info",
  },
  {
    label: "Medium",
    value: "medium",
    icon: <Flag size={13} />,
    colorClass: "text-warning",
  },
  {
    label: "High",
    value: "high",
    icon: <Flag size={13} />,
    colorClass: "text-warning",
  },
  {
    label: "Urgent",
    value: "urgent",
    icon: <Flag size={13} />,
    colorClass: "text-danger",
  },
];
