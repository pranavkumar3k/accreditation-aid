import { useRef, useState, type ChangeEvent } from "react";
import {
  BarChart3,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileSpreadsheet,
  FolderOpen,
  GraduationCap,
  Info,
  LayoutDashboard,
  Menu,
  Play,
  Star,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileKind = "student" | "faculty";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Student Data", icon: Users },
  { label: "Faculty Data", icon: UserRound },
  { label: "SFR Calculation", icon: Calculator },
  { label: "Reports", icon: BarChart3 },
  { label: "About", icon: Info },
];

const YEARLY_DATA = [
  { year: "CAY", ug2: 60, ug3: 55, ug4: 50, pg1: 20, pg2: 15, students: 200, faculty: 4, sfr: 50 },
  { year: "CAYm1", ug2: 58, ug3: 52, ug4: 48, pg1: 18, pg2: 14, students: 190, faculty: 4, sfr: 47.5 },
  { year: "CAYm2", ug2: 55, ug3: 50, ug4: 45, pg1: 16, pg2: 12, students: 178, faculty: 3, sfr: 59.33 },
];

const MARKS = [
  { range: "≤ 15", marks: 15 },
  { range: "> 15 – 17", marks: 14 },
  { range: "> 17 – 19", marks: 13 },
  { range: "> 19 – 21", marks: 12 },
  { range: "> 21 – 23", marks: 11 },
  { range: "> 23 – 25", marks: 10 },
  { range: "> 25", marks: 0 },
];

const CHART_POINTS = [
  { x: 84, y: 108, label: "50.00", year: "CAY" },
  { x: 205, y: 116, label: "47.50", year: "CAYm1" },
  { x: 326, y: 84, label: "59.33", year: "CAYm2" },
];

function SmartSfrLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-md bg-sidebar-accent text-sidebar-primary">
        <GraduationCap className="size-7" strokeWidth={2.2} aria-hidden="true" />
      </div>
      <div>
        <div className="text-xl font-bold text-sidebar-foreground">SmartSFR</div>
        <div className="text-[10px] text-sidebar-muted">NBA Compliance Made Easier</div>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-overlay md:hidden"
          onClick={onClose}
          type="button"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:w-[214px] md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-24 items-center justify-between px-5">
          <SmartSfrLogo />
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>

        <nav aria-label="Main navigation" className="mt-1 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              aria-current={index === 0 ? "page" : undefined}
              className={cn(
                "flex h-12 w-full items-center gap-4 border-l-[3px] px-5 text-left text-sm transition-colors",
                index === 0
                  ? "border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-foreground"
                  : "border-transparent text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
              onClick={onClose}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2 px-5 py-4 text-[10px] text-sidebar-muted">
          <span>SmartSFR v1.0</span>
          <span aria-hidden="true">|</span>
          <span>AIML Project</span>
        </div>
      </aside>
    </>
  );
}

function PanelTitle({ icon: Icon, children }: { icon: typeof BarChart3; children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-[15px] font-bold text-foreground">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      {children}
    </h2>
  );
}

function FilePicker({
  kind,
  name,
  records,
  onFileChange,
}: {
  kind: FileKind;
  name: string;
  records: number;
  onFileChange: (kind: FileKind, event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = kind === "student" ? "Student Data (CSV)" : "Faculty Data (CSV)";

  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-xs font-bold text-foreground">{label}</label>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => onFileChange(kind, event)}
      />
      <div className="flex gap-2">
        <div className="flex h-10 min-w-0 flex-1 items-center rounded-md border border-input bg-input-surface px-3 text-xs text-foreground shadow-inner">
          <span className="truncate">{name}</span>
          <CheckCircle2 className="ml-auto size-4 shrink-0 text-success" aria-label="File ready" />
        </div>
        <Button variant="secondary" className="h-10 px-4" onClick={() => inputRef.current?.click()}>
          Browse
        </Button>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{records} records loaded</p>
    </div>
  );
}

function StatCard({
  title,
  subtitle,
  value,
  note,
  icon: Icon,
  tone,
}: {
  title: string;
  subtitle: string;
  value: string;
  note?: string;
  icon: typeof Users;
  tone: "blue" | "green" | "gold" | "violet";
}) {
  return (
    <article className={cn("stat-card", `stat-card-${tone}`)}>
      <Icon className="size-10 shrink-0 text-stat-icon" strokeWidth={2.2} aria-hidden="true" />
      <div className="min-w-0">
        <h3 className="text-[13px] font-bold leading-4 text-foreground">
          {title}
          <span className="block">{subtitle}</span>
        </h3>
        <p className="mt-1 text-2xl font-bold leading-none text-foreground">{value}</p>
        {note ? <p className="mt-1 text-[10px] text-muted-foreground">{note}</p> : null}
      </div>
    </article>
  );
}

function SfrChart() {
  return (
    <div className="mt-2 min-h-[180px] w-full" aria-label="SFR comparison line chart">
      <svg viewBox="0 0 400 190" className="h-full w-full overflow-visible" role="img">
        <title>SFR comparison for CAY, CAYm1 and CAYm2</title>
        {[36, 64, 92, 120, 148].map((y) => (
          <line key={y} x1="48" x2="366" y1={y} y2={y} className="stroke-chart-grid" strokeWidth="1" />
        ))}
        <line x1="48" x2="48" y1="20" y2="148" className="stroke-chart-axis" />
        <line x1="48" x2="366" y1="148" y2="148" className="stroke-chart-axis" />
        <polyline
          points={CHART_POINTS.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          className="stroke-primary"
          strokeWidth="2.5"
        />
        {CHART_POINTS.map((point) => (
          <g key={point.year}>
            <circle cx={point.x} cy={point.y} r="4.5" className="fill-primary" />
            <text x={point.x} y={point.y - 13} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              {point.label}
            </text>
            <text x={point.x} y="169" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {point.year}
            </text>
          </g>
        ))}
        <text x="20" y="89" textAnchor="middle" transform="rotate(-90 20 89)" className="fill-muted-foreground text-[10px] font-semibold">
          SFR
        </text>
      </svg>
      <div className="-mt-1 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
        <span className="h-0.5 w-5 bg-primary" />
        <span>SFR</span>
      </div>
    </div>
  );
}

function YearlyTable() {
  return (
    <div className="mt-3 overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[620px] border-collapse text-center text-[11px]">
        <thead className="bg-table-header text-foreground">
          <tr>
            <th className="table-cell text-left">Academic Year</th>
            <th className="table-cell">UG2</th>
            <th className="table-cell">UG3</th>
            <th className="table-cell">UG4</th>
            <th className="table-cell">PG1</th>
            <th className="table-cell">PG2</th>
            <th className="table-cell">Total Students<br />(S)</th>
            <th className="table-cell">Eligible Faculty<br />(F)</th>
            <th className="table-cell">SFR<br />(S/F)</th>
          </tr>
        </thead>
        <tbody>
          {YEARLY_DATA.map((row) => (
            <tr key={row.year} className="border-t border-border bg-card">
              <td className="table-cell text-left font-semibold">{row.year}</td>
              <td className="table-cell">{row.ug2}</td>
              <td className="table-cell">{row.ug3}</td>
              <td className="table-cell">{row.ug4}</td>
              <td className="table-cell">{row.pg1}</td>
              <td className="table-cell">{row.pg2}</td>
              <td className="table-cell">{row.students}</td>
              <td className="table-cell">{row.faculty}</td>
              <td className="table-cell font-semibold">{row.sfr.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarksTable() {
  return (
    <div className="mt-2 overflow-x-auto rounded-md border border-danger-border">
      <table className="w-full min-w-[500px] border-collapse text-center text-[10px]">
        <tbody>
          <tr className="bg-danger-soft">
            <th className="table-cell text-left">Average SFR range</th>
            {MARKS.map((item) => <td className="table-cell font-medium" key={item.range}>{item.range}</td>)}
          </tr>
          <tr className="border-t border-danger-border bg-card">
            <th className="table-cell text-left">Marks</th>
            {MARKS.map((item) => <td className="table-cell font-semibold" key={item.range}>{item.marks}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SmartSfrDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState({
    student: { name: "dummy_student_data.csv", records: 15 },
    faculty: { name: "dummy_faculty_data.csv", records: 12 },
  });
  const [analysisState, setAnalysisState] = useState<"idle" | "complete">("idle");

  const onFileChange = (kind: FileKind, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFiles((current) => ({ ...current, [kind]: { ...current[kind], name: file.name } }));
    setAnalysisState("idle");
  };

  return (
    <div className="flex min-h-screen bg-workspace font-sans text-foreground">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-topbar px-4 md:px-7">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
          <div className="ml-auto text-right">
            <p className="text-xs font-bold text-foreground sm:text-sm">Student-Faculty Ratio Analysis</p>
            <p className="hidden text-[11px] text-muted-foreground sm:block">Based on NBA Accreditation Template (Section 4.1)</p>
          </div>
        </header>

        <div className="mx-auto max-w-[1240px] space-y-3 p-3 md:p-5">
          <section className="panel px-4 py-4 md:px-5">
            <h1 className="text-2xl font-bold text-foreground md:text-[30px]">Welcome to SmartSFR</h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Calculate, validate and analyse your Student-Faculty Ratio as per NBA guidelines.
            </p>
            <div className="mt-3 flex items-start gap-3 rounded-md border border-info-border bg-info-soft px-4 py-2.5 text-xs font-medium text-info-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <p>Currently using dummy data. Replace the files in the ‘raw’ folder to use your actual college data.</p>
            </div>
          </section>

          <section className="panel p-4">
            <PanelTitle icon={FolderOpen}>Data Files</PanelTitle>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end">
              <FilePicker kind="student" name={files.student.name} records={files.student.records} onFileChange={onFileChange} />
              <FilePicker kind="faculty" name={files.faculty.name} records={files.faculty.records} onFileChange={onFileChange} />
              <div className="lg:border-l lg:border-border lg:pl-5">
                <Button
                  className="h-12 w-full px-6 text-sm lg:w-auto"
                  onClick={() => setAnalysisState("complete")}
                >
                  {analysisState === "complete" ? <Check /> : <Play className="fill-current" />}
                  {analysisState === "complete" ? "Analysis Complete" : "Run Analysis"}
                </Button>
              </div>
            </div>
          </section>

          <section aria-label="Summary statistics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Students" subtitle="(3 Years)" value="568" note="(CAY + CAYm1 + CAYm2)" icon={Users} tone="blue" />
            <StatCard title="Eligible Faculty" subtitle="(3 Years)" value="10" note="(Average per year)" icon={UserRound} tone="green" />
            <StatCard title="Average SFR" subtitle="(3 Years)" value="19.59" icon={Calculator} tone="gold" />
            <StatCard title="NBA Marks" subtitle="(Section 4.1)" value="12 / 15" icon={Star} tone="violet" />
          </section>

          <section className="grid gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
            <article className="panel min-w-0 p-4">
              <PanelTitle icon={BarChart3}>Year-wise SFR Calculation</PanelTitle>
              <YearlyTable />
            </article>
            <article className="panel min-w-0 p-4">
              <PanelTitle icon={BarChart3}>SFR Comparison</PanelTitle>
              <SfrChart />
            </article>
          </section>

          <section className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]">
            <article className="rounded-md border border-danger-border bg-danger-soft p-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-danger-foreground">
                <CircleAlert className="size-4 fill-danger text-danger-icon" aria-hidden="true" />
                NBA Marks Criteria (Section 4.1)
              </h2>
              <MarksTable />
            </article>
            <article className="rounded-md border border-success-border bg-success-soft p-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-success-foreground">
                <span className="grid size-6 place-items-center rounded-full bg-success text-success-contrast">
                  <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                </span>
                Result
              </h2>
              <p className="mt-2 pl-8 text-xs leading-5 text-foreground">
                Based on the current data, the program would get <strong>12 out of 15 marks</strong> for Section 4.1 (Student-Faculty Ratio).
              </p>
            </article>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1 text-[10px] text-muted-foreground md:hidden">
            <span>SmartSFR v1.0</span>
            <span>Built for NBA Accreditation Support</span>
          </footer>
        </div>
      </main>
    </div>
  );
}