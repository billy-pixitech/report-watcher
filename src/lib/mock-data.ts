export type ReportStatus = "Not Started" | "Draft" | "Published" | "Failed";
export type ChecklistStatus = "Pending" | "Completed" | "Failed";
export type ItemTone = "draft" | "final" | "failed";

export type ChecklistItem = {
  name: string;
  status: ChecklistStatus;
  summary: string;
};

export type GeneratedItem = {
  icon: string;
  name: string;
  result: string;
  tone: ItemTone;
  lines: string[];
};

export type Report = {
  id: string;
  title: string;
  category: "EP" | "Physio" | "POD" | "Psych" | "PBI";
  frequency: "Fortnight" | "Monthly";
  period: string;
  status: ReportStatus;
  checklistDone: number;
  checklistTotal: number;
  lastUpdated: string;
  lastUpdatedFull: string;
  checklist: ChecklistItem[];
  generated: GeneratedItem[];
};

const baseChecklist = (pendingLast: boolean, failIndex?: number): ChecklistItem[] => [
  {
    name: "Nookal Activity Extract",
    status: failIndex === 0 ? "Failed" : "Completed",
    summary:
      failIndex === 0
        ? "Failed to generate 20260802_Nookal_Activity.csv. Nookal API timeout."
        : "20260802_Nookal_Activity.csv generated — 1,245 records",
  },
  {
    name: "PracSuite Data Upload",
    status: failIndex === 1 ? "Failed" : "Completed",
    summary:
      failIndex === 1
        ? "Failed to import 20260802_PracSuite.xlsx. Source file not found."
        : "20260802_PracSuite.xlsx uploaded",
  },
  {
    name: "OM Data Upload",
    status: failIndex === 2 ? "Failed" : "Completed",
    summary:
      failIndex === 2
        ? "Failed to import 20260802_OM_Billing.xlsx. Source file not found."
        : "20260802_OM_Billing.xlsx uploaded",
  },
  {
    name: "eHero Data Upload",
    status: pendingLast ? "Pending" : "Completed",
    summary: pendingLast ? "Waiting for 20260802_eHero.xlsx" : "20260802_eHero.xlsx uploaded",
  },
];

const notStartedChecklist: ChecklistItem[] = [
  { name: "Nookal Activity Extract", status: "Pending", summary: "Scheduled for 05 Aug 02:00" },
  { name: "PracSuite Data Upload", status: "Pending", summary: "Waiting for YYYYMMDD_PracSuite.xlsx" },
  { name: "OM Data Upload", status: "Pending", summary: "Waiting for YYYYMMDD_OM_Billing.xlsx" },
  { name: "eHero Data Upload", status: "Pending", summary: "Waiting for YYYYMMDD_eHero.xlsx" },
];

const draftItems = (period: string, code: string, freq: string): GeneratedItem[] => [
  {
    icon: "📄",
    name: "Final Report",
    result: "Draft generated",
    tone: "draft",
    lines: ["20260802_Final_Report.xlsx"],
  },
  {
    icon: "📑",
    name: "Master Report",
    result: "Draft generated",
    tone: "draft",
    lines: [`Worksheet: ${period}`, `MASTER_${code}_${freq}_Performance_Report.xlsx`],
  },
  { icon: "👥", name: "Lead Reports", result: "Draft generated", tone: "draft", lines: ["42 Lead reports generated"] },
  { icon: "📊", name: "Power BI", result: "Draft published", tone: "draft", lines: ["Performance Dashboard"] },
];

const publishedItems = (period: string, code: string, freq: string): GeneratedItem[] => [
  { icon: "📄", name: "Final Report", result: "Final generated", tone: "final", lines: ["20260802_Final_Report.xlsx"] },
  {
    icon: "📑",
    name: "Master Report",
    result: "Final generated",
    tone: "final",
    lines: [`Worksheet: ${period}`, `MASTER_${code}_${freq}_Performance_Report.xlsx`],
  },
  { icon: "👥", name: "Lead Reports", result: "Final generated", tone: "final", lines: ["42 Lead reports generated"] },
  { icon: "📊", name: "Power BI", result: "Published", tone: "final", lines: ["Performance Dashboard"] },
];

const failedItems = (period: string, code: string, freq: string): GeneratedItem[] => [
  { icon: "📄", name: "Final Report", result: "Draft generated", tone: "draft", lines: ["20260802_Final_Report.xlsx"] },
  {
    icon: "📑",
    name: "Master Report",
    result: "Draft generated",
    tone: "draft",
    lines: [`Worksheet: ${period}`, `MASTER_${code}_${freq}_Performance_Report.xlsx`],
  },
  { icon: "👥", name: "Lead Reports", result: "Failed", tone: "failed", lines: ["2 of 42 Lead reports failed"] },
  { icon: "📊", name: "Power BI", result: "Publish failed", tone: "failed", lines: ["Performance Dashboard"] },
];

const FORTNIGHT = "20 Jul – 02 Aug 2026";
const MONTH = "Jul 2026";

export const reports: Report[] = [
  {
    id: "ep-fortnight",
    title: "EP Fortnight Performance",
    category: "EP",
    frequency: "Fortnight",
    period: FORTNIGHT,
    status: "Draft",
    checklistDone: 3,
    checklistTotal: 4,
    lastUpdated: "04 Aug 09:42",
    lastUpdatedFull: "04 Aug 2026 09:42",
    checklist: baseChecklist(true),
    generated: draftItems(MONTH, "EP", "Fortnight"),
  },
  {
    id: "physio-fortnight",
    title: "Physio Fortnight Performance",
    category: "Physio",
    frequency: "Fortnight",
    period: FORTNIGHT,
    status: "Published",
    checklistDone: 4,
    checklistTotal: 4,
    lastUpdated: "04 Aug 09:35",
    lastUpdatedFull: "04 Aug 2026 09:35",
    checklist: baseChecklist(false),
    generated: publishedItems(MONTH, "PHYSIO", "Fortnight"),
  },
  {
    id: "pod-fortnight",
    title: "POD Fortnight Performance",
    category: "POD",
    frequency: "Fortnight",
    period: FORTNIGHT,
    status: "Failed",
    checklistDone: 2,
    checklistTotal: 4,
    lastUpdated: "04 Aug 09:12",
    lastUpdatedFull: "04 Aug 2026 09:12",
    checklist: baseChecklist(true, 2),
    generated: failedItems(MONTH, "POD", "Fortnight"),
  },
  {
    id: "psych-fortnight",
    title: "Psych Fortnight Performance",
    category: "Psych",
    frequency: "Fortnight",
    period: FORTNIGHT,
    status: "Not Started",
    checklistDone: 0,
    checklistTotal: 4,
    lastUpdated: "-",
    lastUpdatedFull: "-",
    checklist: notStartedChecklist,
    generated: [],
  },
  {
    id: "ep-monthly",
    title: "EP Monthly Performance",
    category: "EP",
    frequency: "Monthly",
    period: MONTH,
    status: "Published",
    checklistDone: 4,
    checklistTotal: 4,
    lastUpdated: "02 Aug 18:20",
    lastUpdatedFull: "02 Aug 2026 18:20",
    checklist: baseChecklist(false),
    generated: publishedItems(MONTH, "EP", "Monthly"),
  },
  {
    id: "physio-monthly",
    title: "Physio Monthly Performance",
    category: "Physio",
    frequency: "Monthly",
    period: MONTH,
    status: "Draft",
    checklistDone: 2,
    checklistTotal: 4,
    lastUpdated: "02 Aug 17:05",
    lastUpdatedFull: "02 Aug 2026 17:05",
    checklist: [
      { name: "Nookal Activity Extract", status: "Completed", summary: "20260731_Nookal_Activity.csv generated — 1,180 records" },
      { name: "PracSuite Data Upload", status: "Completed", summary: "20260731_PracSuite.xlsx uploaded" },
      { name: "OM Data Upload", status: "Pending", summary: "Waiting for YYYYMMDD_OM_Billing.xlsx" },
      { name: "eHero Data Upload", status: "Pending", summary: "Waiting for YYYYMMDD_eHero.xlsx" },
    ],
    generated: draftItems(MONTH, "PHYSIO", "Monthly"),
  },
  {
    id: "pod-monthly",
    title: "POD Monthly Performance",
    category: "POD",
    frequency: "Monthly",
    period: MONTH,
    status: "Published",
    checklistDone: 4,
    checklistTotal: 4,
    lastUpdated: "02 Aug 18:15",
    lastUpdatedFull: "02 Aug 2026 18:15",
    checklist: baseChecklist(false),
    generated: publishedItems(MONTH, "POD", "Monthly"),
  },
  {
    id: "psych-monthly",
    title: "Psych Monthly Performance",
    category: "Psych",
    frequency: "Monthly",
    period: MONTH,
    status: "Draft",
    checklistDone: 3,
    checklistTotal: 4,
    lastUpdated: "02 Aug 18:00",
    lastUpdatedFull: "02 Aug 2026 18:00",
    checklist: baseChecklist(true),
    generated: draftItems(MONTH, "PSYCH", "Monthly"),
  },
  {
    id: "pbi-monthly",
    title: "Personal Billing Incentive (PBI)",
    category: "PBI",
    frequency: "Monthly",
    period: MONTH,
    status: "Published",
    checklistDone: 4,
    checklistTotal: 4,
    lastUpdated: "02 Aug 18:20",
    lastUpdatedFull: "02 Aug 2026 18:20",
    checklist: baseChecklist(false),
    generated: publishedItems(MONTH, "PBI", "Monthly"),
  },
];

export const kpis = [
  { label: "Total Reports", value: 18, tone: "neutral" as const },
  { label: "Published", value: 8, tone: "success" as const },
  { label: "Draft", value: 6, tone: "warning" as const },
  { label: "Failed", value: 2, tone: "danger" as const },
  { label: "Not Started", value: 2, tone: "muted" as const },
];

export type JobStatus = "Healthy" | "Warning" | "Failed";

export type Job = {
  name: string;
  description: string;
  lastRun: string;
  nextRun: string;
  status: JobStatus;
  reason?: string;
};

export const jobs: Job[] = [
  {
    name: "Crawl Nookal",
    description: "Daily 02:00 • Crawl appointments from Nookal",
    lastRun: "Today 02:01",
    nextRun: "Tomorrow 02:00",
    status: "Healthy",
  },
  {
    name: "Upload PracSuite",
    description: "Daily 02:30 • Import PracSuite data",
    lastRun: "Today 02:31",
    nextRun: "Tomorrow 02:30",
    status: "Healthy",
  },
  {
    name: "Upload OM",
    description: "Daily 03:00 • Import OM source data",
    lastRun: "Today 03:00",
    nextRun: "Tomorrow 03:00",
    status: "Failed",
    reason: "Source file not found",
  },
  {
    name: "Upload eHero",
    description: "Daily 03:30 • Import eHero data",
    lastRun: "Today 03:31",
    nextRun: "Tomorrow 03:30",
    status: "Healthy",
  },
  {
    name: "Generate Draft Report",
    description: "Every 2 hours • Generate draft reports",
    lastRun: "Today 10:00",
    nextRun: "Today 12:00",
    status: "Healthy",
  },
  {
    name: "Generate Final Report",
    description: "Daily 08:00 • Generate final reports",
    lastRun: "Yesterday 08:00",
    nextRun: "Today 08:00",
    status: "Warning",
    reason: "Last run exceeded expected duration",
  },
  {
    name: "Publish Power BI",
    description: "Every 30 minutes • Publish reports to Power BI",
    lastRun: "Today 09:30",
    nextRun: "Today 10:00",
    status: "Healthy",
  },
  {
    name: "Cleanup Temp Files",
    description: "Daily 23:30 • Remove temporary files",
    lastRun: "Yesterday 23:30",
    nextRun: "Today 23:30",
    status: "Healthy",
  },
];