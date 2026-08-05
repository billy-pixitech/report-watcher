# Report Watcher

Design a modern enterprise web application called **Report Monitoring**.

The application is used by the Operations team to monitor automated report generation and scheduled background jobs.

The design should be clean, minimal, modern and data-focused, similar to Linear, GitHub, Atlassian or Azure Portal.

Desktop only (1440px).

Use realistic fixed mock data.

This is an operational monitoring application, NOT an analytics dashboard.

====================================================================

NAVIGATION

====================================================================

Left sidebar

• Dashboard

• Jobs

====================================================================

DASHBOARD

====================================================================

Purpose

Provide a real-time operational view of all report generation for the current reporting period.

--------------------------------------------------

Top KPI Cards

Total Reports

18

Published

8

Draft

6

Failed

2

Not Started

2

--------------------------------------------------

Section Title

Current Reports

Description

Display all reports that belong to the current reporting period.

Toolbar

- Search

- Filter by Category

- Filter by Frequency

- Filter by Status

Table Columns

- Category

- Frequency

- Reporting Period

- Status

- Checklist

- Last Updated

Status values

- Not Started

- Draft

- Published

- Failed

Checklist displays completed items only.

Examples

4 / 4

3 / 4

2 / 4

0 / 4

Mock Data

| Category | Frequency | Reporting Period | Status | Checklist | Last Updated |

|-----------|-----------|-----------------|------------|-----------|----------------|

| EP | Fortnight | 20 Jul – 02 Aug 2026 | Draft | 3 / 4 | 04 Aug 09:42 |

| Physio | Fortnight | 20 Jul – 02 Aug 2026 | Published | 4 / 4 | 04 Aug 09:35 |

| POD | Fortnight | 20 Jul – 02 Aug 2026 | Failed | 2 / 4 | 04 Aug 09:12 |

| Psych | Fortnight | 20 Jul – 02 Aug 2026 | Not Started | 0 / 4 | - |

| EP | Monthly | Jul 2026 | Published | 4 / 4 | 02 Aug 18:20 |

| Physio | Monthly | Jul 2026 | Draft | 2 / 4 | 02 Aug 17:05 |

| POD | Monthly | Jul 2026 | Published | 4 / 4 | 02 Aug 18:15 |

| Psych | Monthly | Jul 2026 | Draft | 3 / 4 | 02 Aug 18:00 |

Clicking a row opens a right-side drawer.

====================================================================

REPORT DETAIL DRAWER

====================================================================

Header

EP Performance Report

Frequency

Fortnight

Reporting Period

20 Jul – 02 Aug 2026

Status

Draft

Last Updated

04 Aug 2026 09:42

Top Right Action

[ Regenerate ]

--------------------------------------------------

Section

Checklist

Purpose

Track whether all required data and prerequisites are ready for report generation.

Columns

- Checklist

- Status

- Summary

Status values

- Pending

- Completed

- Failed

Mock Data

| Checklist | Status | Summary |

|------------|------------|---------------------------------------------|

| Crawl Nookal | Completed | 1,245 records processed successfully |

| Upload PracSuite | Completed | Uploaded successfully |

| Upload OM | Completed | Uploaded successfully |

| Upload eHero | Pending | Waiting for source data |

--------------------------------------------------

Section

Generated Items

Purpose

Display all generated artifacts and publishing results for the report.

Display as a simple list of cards (NOT a table).

Each item contains:

- Name

- Result

Example

📄 Final Report

🟠 Draft generated

20260802_Final_Report.xlsx

--------------------------------------------------

📑 Master Report

🟠 Draft generated

Worksheet: Jul 2026

MASTER_EP_Monthly_Performance_Report.xlsx

--------------------------------------------------

👥 Lead Reports

🟠 Draft generated

42 Lead reports generated

--------------------------------------------------

📊 Power BI

🟠 Draft published

Performance Dashboard

Another example when Published

📄 Final Report

🟢 Final generated

20260802_Final_Report.xlsx

--------------------------------------------------

📑 Master Report

🟢 Final generated

Worksheet: Jul 2026

MASTER_EP_Monthly_Performance_Report.xlsx

--------------------------------------------------

👥 Lead Reports

🟢 Final generated

42 Lead reports generated

--------------------------------------------------

📊 Power BI

🟢 Published

Performance Dashboard

Another example when Failed

👥 Lead Reports

🔴 Failed

2 of 42 Lead reports failed

--------------------------------------------------

📊 Power BI

🔴 Publish failed

Performance Dashboard

No download action is required.

No Job information should be displayed in the Report Detail.

====================================================================

JOBS

====================================================================

Purpose

Monitor scheduled background jobs (cron jobs).

Each row represents one scheduled job.

This page is NOT execution history.

Toolbar

- Search

- Filter by Status

Table Columns

- Job Name

- Description

- Last Run

- Next Run

- Status

Status values

- Healthy

- Warning

- Failed

Display warning or failure reason directly inside the Status column.

Mock Data

| Job Name | Description | Last Run | Next Run | Status |

|-------------------------------|---------------------------------------------------------------|----------------|----------------|----------------------------------------------------|

| Crawl Nookal | Daily 02:00 • Crawl appointments from Nookal | Today 02:01 | Tomorrow 02:00 | 🟢 Healthy |

| Upload PracSuite | Daily 02:30 • Import PracSuite data | Today 02:31 | Tomorrow 02:30 | 🟢 Healthy |

| Upload OM | Daily 03:00 • Import OM source data | Today 03:00 | Tomorrow 03:00 | 🔴 Failed • Source file not found |

| Upload eHero | Daily 03:30 • Import eHero data | Today 03:31 | Tomorrow 03:30 | 🟢 Healthy |

| Generate Draft Report | Every 2 hours • Generate draft reports | Today 10:00 | Today 12:00 | 🟢 Healthy |

| Generate Final Report | Daily 08:00 • Generate final reports | Yesterday 08:00 | Today 08:00 | 🟡 Warning • Last run exceeded expected duration |

| Publish Power BI | Every 30 minutes • Publish reports to Power BI | Today 09:30 | Today 10:00 | 🟢 Healthy |

| Cleanup Temp Files | Daily 23:30 • Remove temporary files | Yesterday 23:30 | Today 23:30 | 🟢 Healthy |

No Job Detail page or drawer is required.

====================================================================

DESIGN REQUIREMENTS

====================================================================

- Modern SaaS enterprise UI

- Minimal interface

- Light theme

- Rounded cards (12px)

- Soft shadows

- Compact enterprise tables

- Sticky table headers

- Right-side Report Detail drawer

- Search and filters

- Status badges

- Pagination

- 8px spacing system

- Professional typography

- Consistent fixed mock data

- Focus on operational monitoring

- Avoid charts, graphs and unnecessary analytics

- Make the UI easy to scan within 10 seconds by an Operations user

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2f26ae08-b71f-4b2b-9c82-ab16e0fcc8bd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
