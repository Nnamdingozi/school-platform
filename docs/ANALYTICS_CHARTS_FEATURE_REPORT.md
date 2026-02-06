# Analytics Charts — Feature Report

**Component:** `analitcs-charts.tsx`  
**Location:** `src/components/admin-dasboard/`  
**Last Updated:** February 5, 2025

---

## Executive Summary

The Analytics Charts module provides a visual analytics suite for the school platform admin dashboard. It delivers four chart types that surface student distribution, status, academic performance, and enrollment trends at a glance.

---

## Feature Overview

| Chart | Purpose | Chart Type |
|-------|---------|------------|
| Grade Distribution | Shows student count per grade level | Donut (Pie) |
| Status Distribution | Breaks down enrollment status (Active/Inactive/Probation) | Donut (Pie) |
| Assessment Performance | Compares average vs highest scores by subject | Bar |
| Enrollment Trend | Tracks student enrollment month over month | Line |

---

## Detailed Feature Breakdown

### 1. Grade Distribution Chart (`GradeDistributionChart`)

**Purpose:** Visualize how students are distributed across all grade levels (JSS 1–3, SSS 1–3).

**Data Structure:**
- `name` — Grade label (e.g., "JSS 1", "SSS 2")
- `value` — Number of students
- `fill` — Chart color (theme-based)

**Features:**
- Donut-style pie chart (inner radius 60px, outer 100px)
- Custom tooltip on hover showing grade name and student count
- Bottom legend with grade labels
- Uses theme variables for consistent styling

---

### 2. Status Distribution Chart (`StatusDistributionChart`)

**Purpose:** Show current enrollment status breakdown (Active, Inactive, Probation).

**Data Structure:**
- `name` — Status label
- `value` — Student count
- `fill` — Chart color

**Features:**
- Donut chart with compact layout
- Percentage labels below the chart (calculated from total)
- Color-coded legend: Active, Inactive, Probation
- Pie tooltip with status name and student count

---

### 3. Assessment Performance Chart (`AssessmentScoresChart`)

**Purpose:** Compare average and highest scores by subject to identify strengths and gaps.

**Data Structure:**
- `subject` — Subject name (Math, English, Science, etc.)
- `average` — Class average score
- `highest` — Highest score achieved

**Features:**
- Grouped bar chart with two bars per subject
- Y-axis fixed to 0–100 scale
- Cartesian grid (horizontal lines only)
- Custom tooltip for subject, average, and highest
- Top legend for Average Score and Highest Score
- Rounded bar corners (4px radius)

---

### 4. Enrollment Trend Chart (`EnrollmentTrendChart`)

**Purpose:** Track student enrollment changes across the academic year.

**Data Structure:**
- `month` — Month label (Sep–Feb)
- `students` — Total enrolled students

**Features:**
- Line chart with connected data points
- Y-axis auto-scaled with ±20 padding for readability
- Dot markers at each data point
- Larger active dot on hover
- Custom tooltip showing month and student count
- Cartesian grid for easier reading

---

## Shared Features

### Tooltips
- **CustomTooltip** — Used for bar and line charts; shows label + key-value pairs
- **PieTooltip** — Used for pie charts; shows category name and student count  
- Both styled with card background, border, and shadow

### Responsive Design
- All charts wrapped in `ResponsiveContainer` for 100% width
- Fixed heights per chart (200px or 280px) for consistent layout

### Theming
- Uses CSS variables (`--chart-1` through `--chart-5`, `--muted-foreground`, `--border`)
- Supports light/dark mode via theme variables

### UI Components
- All charts rendered inside `Card` components with `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent`
- Consistent typography and spacing

---

## Data Summary (Current Sample Data)

| Metric | Value |
|--------|-------|
| Total students (grade distribution) | ~1,247 |
| Active students | 1,142 |
| Inactive students | 68 |
| Probation students | 37 |
| Enrollment range | 1,180 (Sep) → 1,247 (Feb) |
| Subjects tracked | 5 (Math, English, Science, Social St., French) |

---

## Technical Stack

- **Charting:** Recharts (PieChart, BarChart, LineChart)
- **UI:** shadcn/ui Card components
- **Framework:** React (Next.js client component)
- **Styling:** Tailwind CSS + CSS variables

---

## Export Summary

The module exports four components for use in the admin dashboard:

- `GradeDistributionChart`
- `StatusDistributionChart`
- `AssessmentScoresChart`
- `EnrollmentTrendChart`

---

## Recommendations for Future Enhancement

1. **Data source** — Replace static data with API/database queries for live metrics.
2. **Date range filters** — Add controls for academic term or custom date range.
3. **Export** — Add CSV/PDF export for reports.
4. **Drill-down** — Click chart elements to filter or open detailed views.
5. **Loading & error states** — Add skeletons and error handling for async data.
