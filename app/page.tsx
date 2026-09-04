"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Dumbbell,
  Flame,
  LayoutGrid,
  MapPin,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Trash2,
  User,
} from "lucide-react";

interface ScheduleItem {
  no: number;
  code: string;
  name: string;
  sks: number;
  rombel: string;
  lecturer: string;
  type: "Teori" | "Praktik";
  room: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  startTime: string;
  endTime: string;
  duration: string;
}

interface Assignment {
  id: string;
  courseName: string;
  day: string;
  title: string;
  type: "individu" | "kelompok";
  deadline: string;
  completed: boolean;
}

interface Workout {
  id: string;
  type: "gym" | "lari";
  day: string;
  title: string;
  target: string;
  completed: boolean;
}

const schedulesData: ScheduleItem[] = [
  { no: 5, code: "INF60250", name: "Praktik Manajemen Sistem Informasi", sks: 2, rombel: "Rombel J2", lecturer: "Dr. Agus Qomaruddin Munir S.T., M.Cs.", type: "Praktik", room: "Lab. Elektronika Industri, GEDUNG ELEKTRO", day: "Senin", startTime: "07:30", endTime: "10:50", duration: "3j 20m" },
  { no: 10, code: "MWK60207", name: "Pendidikan Kewarganegaraan", sks: 2, rombel: "Rombel J", lecturer: "Dr. Johan Dwi Saputro M.Pd.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Senin", startTime: "10:52", endTime: "12:32", duration: "1j 40m" },
  { no: 3, code: "INF60246", name: "Praktik Pengembangan Aplikasi Mobile", sks: 2, rombel: "Rombel J", lecturer: "Dzul Fadli Rahman S.Kom., M.Sc.", type: "Praktik", room: "Lab. Instrumentasi, GEDUNG IDB ELEKTRO", day: "Selasa", startTime: "07:30", endTime: "10:50", duration: "3j 20m" },
  { no: 6, code: "INF60264", name: "Praktik Scripting Languages", sks: 2, rombel: "Rombel J", lecturer: "Ir. Muhammad Izzuddin Mahali M.Cs.", type: "Praktik", room: "R. AVA A/Lab. Micro, GEDUNG MEDIA", day: "Selasa", startTime: "12:31", endTime: "14:11", duration: "1j 40m" },
  { no: 1, code: "INF60145", name: "Pengembangan Aplikasi Mobile", sks: 1, rombel: "Rombel J", lecturer: "Dzul Fadli Rahman S.Kom., M.Sc.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Selasa", startTime: "15:55", endTime: "16:45", duration: "50m" },
  { no: 7, code: "INF60273", name: "Scripting Languages", sks: 2, rombel: "Rombel J", lecturer: "Ir. Muhammad Izzuddin Mahali M.Cs.", type: "Teori", room: "R. AVA B Media, GEDUNG MEDIA", day: "Kamis", startTime: "07:30", endTime: "09:10", duration: "1j 40m" },
  { no: 4, code: "INF60249", name: "Manajemen Sistem Informasi", sks: 2, rombel: "Rombel J", lecturer: "Handaru Jati Ph.D.", type: "Teori", room: "R. Kuliah ( RF 4 ), GEDUNG RF", day: "Kamis", startTime: "10:51", endTime: "12:31", duration: "1j 40m" },
  { no: 8, code: "INF60285", name: "Aplikasi Web", sks: 2, rombel: "Rombel J", lecturer: "Zaenal Mustofa M.Kom.", type: "Teori", room: "R. Kuliah ( RF 8 ), GEDUNG RF", day: "Kamis", startTime: "15:50", endTime: "17:30", duration: "1j 40m" },
  { no: 11, code: "MWU60203", name: "Pendidikan & Pembangunan Berkelanjutan", sks: 2, rombel: "Rombel J", lecturer: "Dr. Dra. Umi Rochayati M.T.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Jumat", startTime: "09:11", endTime: "10:51", duration: "1j 40m" },
  { no: 2, code: "INF60242", name: "Interaksi Manusia Komputer", sks: 2, rombel: "Rombel J", lecturer: "Dr. Ratna Wardani M.T.", type: "Teori", room: "R. Kuliah ( RF 5 ), GEDUNG RF", day: "Jumat", startTime: "12:30", endTime: "14:10", duration: "1j 40m" },
  { no: 9, code: "INF60295", name: "Praktik Aplikasi Web", sks: 2, rombel: "Rombel J2", lecturer: "Zaenal Mustofa M.Kom.", type: "Praktik", room: "R. Kuliah ( RE 4 ), GEDUNG ELEKTRO", day: "Jumat", startTime: "14:11", endTime: "17:30", duration: "3j 19m" },
];

const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

const defaultAssignments: Assignment[] = [
  { id: "1", courseName: "Praktik Manajemen Sistem Informasi", day: "Senin", title: "Setup Database & Model Modul Praktikum", type: "individu", deadline: "2026-09-12", completed: false },
  { id: "2", courseName: "Aplikasi Web", day: "Kamis", title: "Deployment Dashboard ke Platform Vercel", type: "kelompok", deadline: "2026-09-15", completed: false },
];

const defaultWorkouts: Workout[] = [
  { id: "1", type: "gym", day: "Senin", title: "Push Day", target: "Chest, Shoulders, Triceps", completed: false },
  { id: "2", type: "lari", day: "Selasa", title: "Easy Recovery Run", target: "4 KM santai", completed: false },
  { id: "3", type: "gym", day: "Kamis", title: "Pull Day", target: "Back & Biceps Focus", completed: false },
  { id: "4", type: "lari", day: "Jumat", title: "Interval / Speed Run", target: "5 KM", completed: false },
  { id: "5", type: "gym", day: "Sabtu", title: "Legs & Core", target: "Squats, RDL, Plank", completed: false },
];

function minutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function deadlineLabel(deadline: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${deadline}T00:00:00`);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return { label: "Terlewat", tone: "danger" };
  if (diff === 0) return { label: "Hari ini", tone: "danger" };
  if (diff === 1) return { label: "Besok", tone: "warning" };
  if (diff <= 3) return { label: `${diff} hari lagi`, tone: "warning" };
  return { label: formatDate(deadline), tone: "neutral" };
}

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<"kuliah" | "tugas" | "olahraga">("kuliah");
  const [viewMode, setViewMode] = useState<"perHari" | "semua">("perHari");
  const [todayName, setTodayName] = useState("");
  const [selectedDay, setSelectedDay] = useState<(typeof daysList)[number]>("Senin");
  const [clock, setClock] = useState({ time: "00:00", date: "Memuat..." });

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(schedulesData[0].name);
  const [newType, setNewType] = useState<"individu" | "kelompok">("individu");
  const [newDeadline, setNewDeadline] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "individu" | "kelompok">("semua");

  const [workouts, setWorkouts] = useState<Workout[]>(defaultWorkouts);
  const [wTitle, setWTitle] = useState("");
  const [wType, setWType] = useState<"gym" | "lari">("gym");
  const [wDay, setWDay] = useState("Senin");
  const [wTarget, setWTarget] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const currentDay = dayNames[now.getDay()];

      setTodayName(currentDay);
      setClock({
        time: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        date: now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      });

      if (daysList.includes(currentDay as (typeof daysList)[number])) {
        setSelectedDay(currentDay as (typeof daysList)[number]);
      }
    };

    updateDateTime();
    const interval = window.setInterval(updateDateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("app_theme_v4");
    if (theme) setIsDark(theme === "dark");

    const savedTasks = localStorage.getItem("app_tasks_v4");
    setAssignments(savedTasks ? JSON.parse(savedTasks) : defaultAssignments);

    const savedWorkouts = localStorage.getItem("app_workouts_v4");
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
  }, []);

  useEffect(() => localStorage.setItem("app_theme_v4", isDark ? "dark" : "light"), [isDark]);
  useEffect(() => localStorage.setItem("app_tasks_v4", JSON.stringify(assignments)), [assignments]);
  useEffect(() => localStorage.setItem("app_workouts_v4", JSON.stringify(workouts)), [workouts]);

  const uniqueCourses = useMemo(
    () => Array.from(new Set(schedulesData.map((item) => item.name))),
    []
  );

  const currentDaySchedules = useMemo(
    () => schedulesData
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => minutes(a.startTime) - minutes(b.startTime)),
    [selectedDay]
  );

  const todaySchedules = useMemo(
    () => schedulesData
      .filter((s) => s.day === todayName)
      .sort((a, b) => minutes(a.startTime) - minutes(b.startTime)),
    [todayName]
  );

  const nextClassToday = useMemo(() => {
    if (!daysList.includes(todayName as (typeof daysList)[number])) return null;

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    for (const item of todaySchedules) {
      const start = minutes(item.startTime);
      const end = minutes(item.endTime);

      if (current >= start && current <= end) return { status: "ongoing" as const, item };
      if (current < start) return { status: "upcoming" as const, item, diffMin: start - current };
    }

    return { status: "finished" as const };
  }, [todayName, todaySchedules, clock.time]);

  const totalSks = schedulesData.reduce((sum, item) => sum + item.sks, 0);
  const activeTasks = assignments.filter((a) => !a.completed).length;
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const todaySks = todaySchedules.reduce((sum, item) => sum + item.sks, 0);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline) return;

    const match = schedulesData.find((s) => s.name === selectedCourse);

    setAssignments((prev) => [
      {
        id: Date.now().toString(),
        courseName: selectedCourse,
        day: match?.day ?? "Senin",
        title: newTitle.trim(),
        type: newType,
        deadline: newDeadline,
        completed: false,
      },
      ...prev,
    ]);

    setNewTitle("");
    setNewDeadline("");
  };

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wTitle.trim()) return;

    setWorkouts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: wType,
        day: wDay,
        title: wTitle.trim(),
        target: wTarget.trim() || (wType === "gym" ? "3 set latihan" : "Pace rileks"),
        completed: false,
      },
    ]);

    setWTitle("");
    setWTarget("");
  };

  const bg = isDark ? "bg-[#080b12] text-slate-100" : "bg-[#f6f7fb] text-slate-900";
  const panel = isDark
    ? "bg-[#111622]/90 border-white/[0.07]"
    : "bg-white border-slate-200/80";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const soft = isDark ? "bg-white/[0.045]" : "bg-slate-50";
  const border = isDark ? "border-white/[0.07]" : "border-slate-200/80";

  return (
    <main className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-3xl" />
        <div className="absolute top-[40%] -right-40 h-96 w-96 rounded-full bg-violet-500/[0.035] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl">
        {/* Desktop sidebar */}
        <aside className={`sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r px-5 py-7 lg:flex ${border}`}>
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500 font-black text-white shadow-lg shadow-amber-500/20">
              TI
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">Akademik</div>
              <div className={`text-[11px] ${muted}`}>Rombel J · 21 SKS</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "kuliah", label: "Overview", icon: LayoutGrid },
              { id: "tugas", label: "Tugas", icon: CheckCircle2 },
              { id: "olahraga", label: "Olahraga", icon: Dumbbell },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/15"
                      : `${muted} hover:bg-white/[0.04] hover:text-current`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className={`mt-auto rounded-2xl border p-4 ${panel}`}>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-500">
              <Sparkles className="h-3.5 w-3.5" />
              Semester ini
            </div>
            <div className="text-2xl font-black">{totalSks} SKS</div>
            <p className={`mt-1 text-[11px] leading-relaxed ${muted}`}>
              Fokus pada jadwal, deadline, dan rutinitas dalam satu tempat.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:py-8">
          {/* Header */}
          <header className="mb-7 flex items-center justify-between">
            <div>
              <div className={`mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${muted}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Personal dashboard
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Akademik & Rutinitas
              </h1>
            </div>

            <button
              onClick={() => setIsDark((v) => !v)}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition hover:scale-105 ${panel}`}
              aria-label="Ganti tema"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
          </header>

          {/* Hero */}
          <section className="mb-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl bg-amber-500 p-6 text-white shadow-xl shadow-amber-500/10 sm:p-7">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="mb-7 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                      {clock.date}
                    </div>
                    <div className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                      {clock.time}
                    </div>
                  </div>
                  <div className="hidden rounded-2xl bg-black/10 px-4 py-3 text-right sm:block">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">Hari ini</div>
                    <div className="mt-1 text-sm font-black">{todayName || "—"}</div>
                  </div>
                </div>

                {nextClassToday?.status === "ongoing" && (
                  <div className="rounded-2xl bg-black/10 p-4 backdrop-blur-sm">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/70">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                      Sedang berlangsung
                    </div>
                    <div className="text-lg font-black">{nextClassToday.item.name}</div>
                    <div className="mt-1 text-xs text-white/75">
                      {nextClassToday.item.startTime}–{nextClassToday.item.endTime} · {nextClassToday.item.room}
                    </div>
                  </div>
                )}

                {nextClassToday?.status === "upcoming" && (
                  <div className="rounded-2xl bg-black/10 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/70">
                      Kelas berikutnya
                    </div>
                    <div className="text-lg font-black">{nextClassToday.item.name}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/75">
                      <span>{nextClassToday.item.startTime}–{nextClassToday.item.endTime}</span>
                      <span>•</span>
                      <span>{Math.floor((nextClassToday.diffMin ?? 0) / 60)}j {(nextClassToday.diffMin ?? 0) % 60}m lagi</span>
                    </div>
                  </div>
                )}

                {nextClassToday?.status === "finished" && (
                  <div className="rounded-2xl bg-black/10 p-4 text-sm font-bold">
                    Semua kelas hari ini sudah selesai. Saatnya review atau istirahat.
                  </div>
                )}

                {!nextClassToday && (
                  <div className="rounded-2xl bg-black/10 p-4 text-sm font-bold">
                    Tidak ada jadwal kuliah hari ini.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Kelas hari ini", value: todaySchedules.length, suffix: "kelas", icon: CalendarDays },
                { label: "SKS hari ini", value: todaySks, suffix: "SKS", icon: BookOpen },
                { label: "Tugas aktif", value: activeTasks, suffix: "tugas", icon: AlertCircle },
                { label: "Latihan selesai", value: completedWorkouts, suffix: "sesi", icon: Flame },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className={`rounded-2xl border p-4 sm:p-5 ${panel}`}>
                    <div className={`mb-5 grid h-8 w-8 place-items-center rounded-lg ${soft}`}>
                      <Icon className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className={`mt-0.5 text-[11px] font-medium ${muted}`}>{stat.label}</div>
                    <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${muted}`}>{stat.suffix}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Main tabs */}
          {activeTab === "kuliah" && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight">Jadwal kuliah</h2>
                  <p className={`mt-0.5 text-xs ${muted}`}>Atur ritme minggu kamu dari sini.</p>
                </div>

                <div className={`flex rounded-xl border p-1 ${panel}`}>
                  <button
                    onClick={() => setViewMode("perHari")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                      viewMode === "perHari" ? "bg-amber-500 text-white" : muted
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Harian
                  </button>
                  <button
                    onClick={() => setViewMode("semua")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                      viewMode === "semua" ? "bg-amber-500 text-white" : muted
                    }`}
                  >
                    <CalendarRange className="h-3.5 w-3.5" />
                    Mingguan
                  </button>
                </div>
              </div>

              {viewMode === "perHari" && (
                <>
                  <div className="grid grid-cols-5 gap-2">
                    {daysList.map((day) => {
                      const selected = selectedDay === day;
                      const today = todayName === day;
                      const count = schedulesData.filter((s) => s.day === day).length;

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`group relative rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 ${
                            selected
                              ? "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/15"
                              : `${panel} hover:border-amber-500/30`
                          }`}
                        >
                          {today && !selected && (
                            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                          )}
                          <div className="text-xs font-black sm:text-sm">{day.slice(0, 3)}</div>
                          <div className={`mt-1 text-[10px] font-medium ${selected ? "text-amber-100" : muted}`}>
                            {count} kelas
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    {currentDaySchedules.length === 0 ? (
                      <div className={`rounded-2xl border border-dashed p-12 text-center ${panel}`}>
                        <CalendarDays className={`mx-auto mb-3 h-8 w-8 ${muted}`} />
                        <div className="text-sm font-bold">Hari kosong</div>
                        <p className={`mt-1 text-xs ${muted}`}>Tidak ada kuliah pada hari {selectedDay}.</p>
                      </div>
                    ) : (
                      currentDaySchedules.map((item, index) => (
                        <ScheduleCard key={item.no} item={item} panel={panel} muted={muted} soft={soft} isFirst={index === 0 && todayName === selectedDay} />
                      ))
                    )}
                  </div>
                </>
              )}

              {viewMode === "semua" && (
                <div className="space-y-7">
                  {daysList.map((day) => {
                    const items = schedulesData
                      .filter((s) => s.day === day)
                      .sort((a, b) => minutes(a.startTime) - minutes(b.startTime));

                    if (!items.length) {
                      return (
                        <div key={day} className="flex items-center gap-3">
                          <div className={`h-px flex-1 ${isDark ? "bg-white/[0.06]" : "bg-slate-200"}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>{day} · kosong</span>
                          <div className={`h-px flex-1 ${isDark ? "bg-white/[0.06]" : "bg-slate-200"}`} />
                        </div>
                      );
                    }

                    return (
                      <div key={day}>
                        <div className="mb-3 flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <h3 className="text-sm font-black uppercase tracking-wider">{day}</h3>
                          <span className={`text-[11px] ${muted}`}>{items.length} kelas</span>
                        </div>
                        <div className={`overflow-hidden rounded-2xl border ${panel}`}>
                          {items.map((item, index) => (
                            <div key={item.no} className={`flex gap-4 p-4 ${index !== 0 ? `border-t ${border}` : ""}`}>
                              <div className="w-24 shrink-0">
                                <div className="text-xs font-black text-amber-500">{item.startTime}</div>
                                <div className={`mt-0.5 text-[10px] ${muted}`}>{item.endTime}</div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold">{item.name}</div>
                                <div className={`mt-1 text-[11px] ${muted}`}>{item.room}</div>
                              </div>
                              <div className="hidden text-right sm:block">
                                <div className={`text-[11px] font-medium ${muted}`}>{item.lecturer}</div>
                                <div className={`mt-1 text-[10px] font-mono ${muted}`}>{item.code} · {item.sks} SKS</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "tugas" && (
            <TaskSection
              panel={panel}
              muted={muted}
              soft={soft}
              border={border}
              assignments={assignments}
              setAssignments={setAssignments}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              uniqueCourses={uniqueCourses}
              newType={newType}
              setNewType={setNewType}
              newDeadline={newDeadline}
              setNewDeadline={setNewDeadline}
              filterType={filterType}
              setFilterType={setFilterType}
              onSubmit={handleAddAssignment}
            />
          )}

          {activeTab === "olahraga" && (
            <WorkoutSection
              panel={panel}
              muted={muted}
              soft={soft}
              border={border}
              workouts={workouts}
              setWorkouts={setWorkouts}
              wTitle={wTitle}
              setWTitle={setWTitle}
              wType={wType}
              setWType={setWType}
              wDay={wDay}
              setWDay={setWDay}
              wTarget={wTarget}
              setWTarget={setWTarget}
              onSubmit={handleAddWorkout}
            />
          )}
        </section>
      </div>

      {/* Mobile navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t px-4 py-2 backdrop-blur-xl lg:hidden ${
        isDark ? "border-white/[0.07] bg-[#0b0f17]/90" : "border-slate-200 bg-white/90"
      }`}>
        <div className="mx-auto flex max-w-md items-center justify-around">
          {[
            { id: "kuliah", label: "Overview", icon: LayoutGrid },
            { id: "tugas", label: "Tugas", icon: CheckCircle2 },
            { id: "olahraga", label: "Olahraga", icon: Dumbbell },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-4 py-2 text-[10px] font-bold ${
                  active ? "text-amber-500" : muted
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "scale-110" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function ScheduleCard({
  item,
  panel,
  muted,
  soft,
  isFirst,
}: {
  item: ScheduleItem;
  panel: string;
  muted: string;
  soft: string;
  isFirst: boolean;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-amber-500/30 sm:p-5 ${panel}`}>
      {isFirst && (
        <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-4 sm:w-32 sm:border-r sm:border-inherit sm:pr-4">
          <div>
            <div className="text-lg font-black tracking-tight">{item.startTime}</div>
            <div className={`text-[11px] font-semibold ${muted}`}>{item.endTime}</div>
          </div>
          <div className={`rounded-lg px-2 py-1 text-[9px] font-bold ${soft} ${muted}`}>
            {item.duration}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase ${
              item.type === "Praktik"
                ? "border-violet-500/20 bg-violet-500/10 text-violet-400"
                : "border-blue-500/20 bg-blue-500/10 text-blue-400"
            }`}>
              {item.type}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-[9px] font-mono ${soft} ${muted}`}>{item.code}</span>
            <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${soft} ${muted}`}>{item.sks} SKS</span>
          </div>

          <h3 className="text-sm font-black leading-snug sm:text-base">{item.name}</h3>

          <div className={`mt-2 flex flex-col gap-1 text-[11px] ${muted} sm:flex-row sm:flex-wrap sm:gap-x-4`}>
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 shrink-0" />
              {item.lecturer}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400" />
              {item.room}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function TaskSection(props: any) {
  const {
    panel, muted, soft, border, assignments, setAssignments,
    newTitle, setNewTitle, selectedCourse, setSelectedCourse, uniqueCourses,
    newType, setNewType, newDeadline, setNewDeadline,
    filterType, setFilterType, onSubmit,
  } = props;

  const filtered = assignments.filter((a: Assignment) => filterType === "semua" || a.type === filterType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black tracking-tight">Tugas & deadline</h2>
        <p className={`mt-0.5 text-xs ${muted}`}>Jangan biarkan deadline datang tanpa persiapan.</p>
      </div>

      <form onSubmit={onSubmit} className={`rounded-3xl border p-5 sm:p-6 ${panel}`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black">Tambah penugasan</h3>
            <p className={`text-[11px] ${muted}`}>Simpan tugas baru agar muncul di daftar.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Mata kuliah">
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className={`w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500/60 ${soft} ${border}`}>
              {uniqueCourses.map((course: string) => <option key={course} value={course}>{course}</option>)}
            </select>
          </Field>

          <Field label="Kategori">
            <div className="grid grid-cols-2 gap-2">
              {(["individu", "kelompok"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setNewType(type)}
                  className={`rounded-xl border py-2.5 text-xs font-bold capitalize transition ${
                    newType === type
                      ? type === "kelompok" ? "border-violet-500 bg-violet-500 text-white" : "border-amber-500 bg-amber-500 text-white"
                      : `${soft} ${border} ${muted}`
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Detail tugas">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Contoh: Laporan praktikum modul 2..." className={`w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500/60 ${soft} ${border}`} />
          </Field>

          <Field label="Deadline">
            <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className={`w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500/60 ${soft} ${border}`} />
          </Field>
        </div>

        <button type="submit" className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white transition hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/15">
          Simpan penugasan
        </button>
      </form>

      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-black">Daftar tugas <span className={muted}>({assignments.length})</span></h3>
            <p className={`text-[11px] ${muted}`}>{assignments.filter((a: Assignment) => !a.completed).length} masih perlu dikerjakan</p>
          </div>
          <div className="flex gap-1">
            {(["semua", "individu", "kelompok"] as const).map((type) => (
              <button key={type} onClick={() => setFilterType(type)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold capitalize ${filterType === type ? "bg-amber-500 text-white" : `${soft} ${muted}`}`}>
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filtered.length === 0 && <div className={`rounded-2xl border border-dashed p-10 text-center text-xs ${panel} ${muted}`}>Tidak ada tugas di filter ini.</div>}
          {filtered.map((task: Assignment) => {
            const dl = deadlineLabel(task.deadline);
            return (
              <div key={task.id} className={`flex items-start gap-3 rounded-2xl border p-4 transition hover:border-amber-500/25 ${panel} ${task.completed ? "opacity-55" : ""}`}>
                <button
                  onClick={() => setAssignments((prev: Assignment[]) => prev.map((a) => a.id === task.id ? { ...a, completed: !a.completed } : a))}
                  className="mt-0.5 shrink-0"
                  aria-label="Tandai selesai"
                >
                  {task.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className={`h-5 w-5 ${muted}`} />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-bold ${task.completed ? "line-through" : ""}`}>{task.title}</div>
                  <div className={`mt-2 flex flex-wrap items-center gap-1.5 text-[10px] ${muted}`}>
                    <span className={`rounded-md px-2 py-1 ${soft}`}>{task.courseName}</span>
                    <span>{task.day}</span>
                    <span className={`rounded-md border px-2 py-1 font-bold ${
                      task.type === "kelompok" ? "border-violet-500/20 bg-violet-500/10 text-violet-400" : "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    }`}>{task.type}</span>
                    <span className={`font-bold ${dl.tone === "danger" ? "text-rose-400" : dl.tone === "warning" ? "text-amber-400" : muted}`}>
                      {dl.label}
                    </span>
                  </div>
                </div>

                <button onClick={() => setAssignments((prev: Assignment[]) => prev.filter((a) => a.id !== task.id))} className={`shrink-0 p-1 ${muted} hover:text-rose-400`} aria-label="Hapus tugas">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkoutSection(props: any) {
  const {
    panel, muted, soft, border, workouts, setWorkouts,
    wTitle, setWTitle, wType, setWType, wDay, setWDay, wTarget, setWTarget, onSubmit,
  } = props;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black tracking-tight">Olahraga & rutinitas</h2>
        <p className={`mt-0.5 text-xs ${muted}`}>Jaga konsistensi di luar jadwal akademik.</p>
      </div>

      <form onSubmit={onSubmit} className={`rounded-3xl border p-5 sm:p-6 ${panel}`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Dumbbell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black">Kustom sesi latihan</h3>
            <p className={`text-[11px] ${muted}`}>Buat rutinitas sesuai jadwalmu.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Jenis kegiatan">
            <div className="grid grid-cols-2 gap-2">
              {(["gym", "lari"] as const).map((type) => (
                <button key={type} type="button" onClick={() => setWType(type)} className={`rounded-xl border py-2.5 text-xs font-black uppercase ${wType === type ? (type === "gym" ? "border-amber-500 bg-amber-500 text-white" : "border-teal-500 bg-teal-500 text-white") : `${soft} ${border} ${muted}`}`}>
                  {type}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Hari">
            <select value={wDay} onChange={(e) => setWDay(e.target.value)} className={`w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500/60 ${soft} ${border}`}>
              {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="Fokus sesi">
            <input value={wTitle} onChange={(e) => setWTitle(e.target.value)} placeholder="Chest & Triceps / 5K Tempo" className={`w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500/60 ${soft} ${border}`} />
          </Field>
        </div>

        <Field label="Target / catatan">
          <input value={wTarget} onChange={(e) => setWTarget(e.target.value)} placeholder="Contoh: Bench Press 4x8 atau Pace 5:20" className={`w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500/60 ${soft} ${border}`} />
        </Field>

        <button type="submit" className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white transition hover:bg-amber-600">
          Tambahkan sesi
        </button>
      </form>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black">Rutinitas latihan</h3>
            <p className={`text-[11px] ${muted}`}>{workouts.filter((w: Workout) => w.completed).length} dari {workouts.length} sesi selesai</p>
          </div>
          <Flame className="h-4 w-4 text-amber-500" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {workouts.map((w: Workout) => (
            <div key={w.id} className={`rounded-2xl border p-4 ${panel} ${w.completed ? "opacity-60" : ""}`}>
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-1 text-[9px] font-black uppercase ${
                    w.type === "gym" ? "bg-amber-500/10 text-amber-500" : "bg-teal-500/10 text-teal-400"
                  }`}>{w.type}</span>
                  <span className={`text-[10px] font-bold ${muted}`}>{w.day}</span>
                </div>
                <button onClick={() => setWorkouts((prev: Workout[]) => prev.filter((x) => x.id !== w.id))} className={`${muted} hover:text-rose-400`}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <h4 className={`text-sm font-black ${w.completed ? "line-through" : ""}`}>{w.title}</h4>
              <p className={`mt-1 text-xs ${muted}`}>{w.target}</p>

              <button
                onClick={() => setWorkouts((prev: Workout[]) => prev.map((x) => x.id === w.id ? { ...x, completed: !x.completed } : x))}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition ${
                  w.completed ? "bg-emerald-500 text-white" : `${soft} ${muted} hover:border hover:border-amber-500/30`
                }`}
              >
                {w.completed ? <><Check className="h-3.5 w-3.5" /> Selesai</> : "Check-in latihan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}
