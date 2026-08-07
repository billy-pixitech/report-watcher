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
  url: string;
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

const SHAREPOINT = "https://cahc.sharepoint.com/sites/reporting/Shared%20Documents";
const POWER_BI = "https://app.powerbi.com/groups/me/reports/cahc-performance";

const finalReport = (code: string, tone: ItemTone, result: string): GeneratedItem => ({
  icon: "📄",
  name: "Final Report",
  result,
  tone,
  lines: [`20260802_${code}_Final_Report.xlsx`],
  url: `${SHAREPOINT}/Final/20260802_${code}_Final_Report.xlsx`,
});

const masterReport = (period: string, code: string, freq: string, tone: ItemTone, result: string): GeneratedItem => ({
  icon: "📑",
  name: "Master Report",
  result,
  tone,
  lines: [`Worksheet: ${period}`, `MASTER_${code}_${freq}_Performance_Report.xlsx`],
  url: `${SHAREPOINT}/Master/MASTER_${code}_${freq}_Performance_Report.xlsx`,
});

const leadReports = (code: string, tone: ItemTone, result: string, line: string): GeneratedItem => ({
  icon: "👥",
  name: "Lead Reports",
  result,
  tone,
  lines: [line],
  url: `${SHAREPOINT}/Leads/${code}`,
});

const powerBi = (tone: ItemTone, result: string): GeneratedItem => ({
  icon: "📊",
  name: "Power BI",
  result,
  tone,
  lines: ["Performance Dashboard"],
  url: POWER_BI,
});

const isPbi = (code: string) => code === "PBI";

const draftItems = (period: string, code: string, freq: string): GeneratedItem[] =>
  isPbi(code)
    ? [finalReport(code, "draft", "Draft generated"), powerBi("draft", "Draft published")]
    : [
        masterReport(period, code, freq, "draft", "Draft generated"),
        leadReports(code, "draft", "Draft generated", "42 Lead reports generated"),
        powerBi("draft", "Draft published"),
      ];

const publishedItems = (period: string, code: string, freq: string): GeneratedItem[] =>
  isPbi(code)
    ? [finalReport(code, "final", "Final generated"), powerBi("final", "Published")]
    : [
        masterReport(period, code, freq, "final", "Final generated"),
        leadReports(code, "final", "Final generated", "42 Lead reports generated"),
        powerBi("final", "Published"),
      ];

const failedItems = (period: string, code: string, freq: string): GeneratedItem[] =>
  isPbi(code)
    ? [finalReport(code, "draft", "Draft generated"), powerBi("failed", "Publish failed")]
    : [
        masterReport(period, code, freq, "draft", "Draft generated"),
        leadReports(code, "failed", "Failed", "2 of 42 Lead reports failed"),
        powerBi("failed", "Publish failed"),
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
  { label: "Published", value: 8, total: 18, tone: "success" as const },
  { label: "Draft", value: 6, tone: "warning" as const },
  { label: "Failed", value: 2, tone: "danger" as const },
  { label: "Not Started", value: 2, tone: "muted" as const },
];


export type JobStatus = "Healthy" | "Warning" | "Failed";

export type Job = {
  name: string;
  schedule: string;
  description: string;
  lastRun: string;
  nextRun: string;
  status: JobStatus;
  reason?: string;
};

export const jobs: Job[] = [
  {
    name: "Crawl Nookal",
    schedule: "Daily 02:00",
    description: "Crawl appointments from Nookal",
    lastRun: "Today 02:01",
    nextRun: "Tomorrow 02:00",
    status: "Healthy",
  },
  {
    name: "Upload PracSuite",
    schedule: "Daily 02:30",
    description: "Import PracSuite data",
    lastRun: "Today 02:31",
    nextRun: "Tomorrow 02:30",
    status: "Healthy",
  },
  {
    name: "Upload OM",
    schedule: "Daily 03:00",
    description: "Import OM source data",
    lastRun: "Today 03:00",
    nextRun: "Tomorrow 03:00",
    status: "Failed",
    reason: "Source file not found",
  },
  {
    name: "Upload eHero",
    schedule: "Daily 03:30",
    description: "Import eHero data",
    lastRun: "Today 03:31",
    nextRun: "Tomorrow 03:30",
    status: "Healthy",
  },
  {
    name: "Generate Draft Report",
    schedule: "Every 2 hours",
    description: "Generate draft reports",
    lastRun: "Today 10:00",
    nextRun: "Today 12:00",
    status: "Healthy",
  },
  {
    name: "Generate Final Report",
    schedule: "Daily 08:00",
    description: "Generate final reports",
    lastRun: "Yesterday 08:00",
    nextRun: "Today 08:00",
    status: "Warning",
    reason: "Last run exceeded expected duration",
  },
  {
    name: "Publish Power BI",
    schedule: "Every 30 minutes",
    description: "Publish reports to Power BI",
    lastRun: "Today 09:30",
    nextRun: "Today 10:00",
    status: "Healthy",
  },
  {
    name: "Cleanup Temp Files",
    schedule: "Daily 23:30",
    description: "Remove temporary files",
    lastRun: "Yesterday 23:30",
    nextRun: "Today 23:30",
    status: "Healthy",
  },
];