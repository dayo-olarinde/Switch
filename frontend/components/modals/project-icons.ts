import {
  BarChart3,
  Briefcase,
  Code2,
  Database,
  FileText,
  Layers3,
  Megaphone,
  Palette,
  PenTool,
  Rocket,
  Settings,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const PROJECT_ICONS: {
  value: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "Palette", label: "Design", Icon: Palette },
  { value: "Code2", label: "Development", Icon: Code2 },
  { value: "Database", label: "Backend", Icon: Database },
  { value: "Smartphone", label: "Mobile", Icon: Smartphone },
  { value: "PenTool", label: "Creative", Icon: PenTool },
  { value: "FileText", label: "Docs", Icon: FileText },
  { value: "Briefcase", label: "Business", Icon: Briefcase },
  { value: "Rocket", label: "Launch", Icon: Rocket },
  { value: "Layers3", label: "Product", Icon: Layers3 },
  { value: "Megaphone", label: "Marketing", Icon: Megaphone },
  { value: "BarChart3", label: "Analytics", Icon: BarChart3 },
  { value: "Settings", label: "Ops", Icon: Settings },
];

export const PROJECT_ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Code2,
  Database,
  Smartphone,
  PenTool,
  FileText,
  Briefcase,
  Rocket,
  Layers3,
  Megaphone,
  BarChart3,
  Settings,
};
