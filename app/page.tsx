"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  BookOpen, 
  Dumbbell, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Sun, 
  Moon,
  Sparkles,
  Layers,
  Check,
  TrendingUp
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
  { no: 10, code: "MWK60207", name: "Pendidikan Kewarganegaraan", sks: 2, rombel: "Rombel J", lecturer: "Dr. Johan Dwi Saputro M.Pd.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Senin", startTime: "10:52", endTime: "12:32", duration: "1j 40m" },
  { no: 3, code: "INF60246", name: "Praktik Pengembangan Aplikasi Mobile", sks: 2, rombel: "Rombel J", lecturer: "Dzul Fadli Rahman S.Kom., M.Sc.", type: "Praktik", room: "Lab. Instrumentasi, GEDUNG IDB ELEKTRO", day: "Selasa", startTime: "07:30", endTime: "10:50", duration: "3j 20m" },
  { no: 6, code: "INF60264", name: "Praktik Scripting Languages", sks: 2, rombel: "Rombel J", lecturer: "Ir. Muhammad Izzuddin Mahali M.Cs.", type: "Praktik", room: "R. AVA A/Lab. Micro, GEDUNG MEDIA", day: "Selasa", startTime: "12:31", endTime: "14:11", duration: "1j 40m" },
  { no: 1, code: "INF60145", name: "Pengembangan Aplikasi Mobile", sks: 1, rombel: "Rombel J", lecturer: "Dzul Fadli Rahman S.Kom., M.Sc.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Selasa", startTime: "15:55", endTime: "16:45", duration: "50m" },
  { no: 5, code: "INF60250", name: "Praktik Manajemen Sistem Informasi", sks: 2, rombel: "Rombel J2", lecturer: "Dr. Agus Qomaruddin Munir S.T., M.Cs.", type: "Praktik", room: "Lab. Elektronika Industri, GEDUNG ELEKTRO", day: "Rabu", startTime: "10:52", endTime: "14:10", duration: "3j 18m" },
  { no: 7, code: "INF60273", name: "Scripting Languages", sks: 2, rombel: "Rombel J", lecturer: "Ir. Muhammad Izzuddin Mahali M.Cs.", type: "Teori", room: "R. AVA B Media, GEDUNG MEDIA", day: "Kamis", startTime: "07:30", endTime: "09:10", duration: "1j 40m" },
  { no: 4, code: "INF60249", name: "Manajemen Sistem Informasi", sks: 2, rombel: "Rombel J", lecturer: "Handaru Jati Ph.D.", type: "Teori", room: "R. Kuliah ( RF 4 ), GEDUNG RF", day: "Kamis", startTime: "10:51", endTime: "12:31", duration: "1j 40m" },
  { no: 8, code: "INF60285", name: "Aplikasi Web", sks: 2, rombel: "Rombel J", lecturer: "Zaenal Mustofa M.Kom.", type: "Teori", room: "R. Kuliah ( RF 8 ), GEDUNG RF", day: "Kamis", startTime: "15:50", endTime: "17:30", duration: "1j 40m" },
  { no: 11, code: "MWU60203", name: "Pendidikan & Pembangunan Berkelanjutan", sks: 2, rombel: "Rombel J", lecturer: "Dr. Dra. Umi Rochayati M.T.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Jumat", startTime: "09:11", endTime: "10:51", duration: "1j 40m" },
  { no: 2, code: "INF60242", name: "Interaksi Manusia Komputer", sks: 2, rombel: "Rombel J", lecturer: "Dr. Ratna Wardani M.T.", type: "Teori", room: "R. Kuliah ( RF 5 ), GEDUNG RF", day: "Jumat", startTime: "12:30", endTime: "14:10", duration: "1j 40m" },
  { no: 9, code: "INF60295", name: "Praktik Aplikasi Web", sks: 2, rombel: "Rombel J2", lecturer: "Zaenal Mustofa M.Kom.", type: "Praktik", room: "R. Kuliah ( RE 4 ), GEDUNG ELEKTRO", day: "Jumat", startTime: "14:11", endTime: "17:30", duration: "3j 19m" },
];

const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<"kuliah" | "tugas" | "olahraga">("kuliah");
  const [selectedDay, setSelectedDay] = useState<"Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat">("Kamis");
  const [clock, setClock] = useState({ time: "00:00", date: "Memuat..." });

  // State Tugas
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(schedulesData[0].name);
  const [newType, setNewType] = useState<"individu" | "kelompok">("individu");
  const [newDeadline, setNewDeadline] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "individu" | "kelompok">("semua");

  // State Olahraga
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: "1", type: "gym", day: "Senin", title: "Push Workout (Chest & Triceps)", target: "Bench Press 4x8, Incline DB 3x10, Dips", completed: false },
    { id: "2", type: "lari", day: "Selasa", title: "Easy Pace Recovery", target: "4.5 KM Pace 6:00 (Zona Kardio Nyaman)", completed: false },
    { id: "3", type: "gym", day: "Kamis", title: "Pull Day (Back & Biceps)", target: "Lat Pulldown 4x10, Barbell Row 3x10, Curls", completed: false },
    { id: "4", type: "lari", day: "Jumat", title: "Interval / Tempo Run", target: "5 KM (Target Pace 5:15/km)", completed: false },
    { id: "5", type: "gym", day: "Sabtu", title: "Legs & Core Strength", target: "Squats 4x8, Romanian Deadlift 3x10, Plank", completed: false },
  ]);

  // Form Kustom Olahraga
  const [wTitle, setWTitle] = useState("");
  const [wType, setWType] = useState<"gym" | "lari">("gym");
  const [wDay, setWDay] = useState("Senin");
  const [wTarget, setWTarget] = useState("");

  // Sync Preferences & Storage
  useEffect(() => {
    const theme = localStorage.getItem("app_theme");
    if (theme) {
      setIsDark(theme === "dark");
    }

    const savedTasks = localStorage.getItem("academic_tasks");
    if (savedTasks) {
      try { setAssignments(JSON.parse(savedTasks)); } catch (e) {}
    } else {
      setAssignments([
        { id: "1", courseName: "Aplikasi Web", day: "Kamis", title: "Setup Project Next.js & Deploy ke Vercel", type: "individu", deadline: "2026-09-10", completed: false },
        { id: "2", courseName: "Manajemen Sistem Informasi", day: "Kamis", title: "Tugas Kelompok Review Metodologi SDLC", type: "kelompok", deadline: "2026-09-15", completed: false }
      ]);
    }

    const savedWorkouts = localStorage.getItem("fitness_workouts");
    if (savedWorkouts) {
      try { setWorkouts(JSON.parse(savedWorkouts)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("academic_tasks", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("fitness_workouts", JSON.stringify(workouts));
  }, [workouts]);

  // Timer Realtime
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      
      setClock({
        time: `${hh}:${mm}`,
        date: `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline) return;
    const match = schedulesData.find(s => s.name === selectedCourse);

    setAssignments([
      {
        id: Date.now().toString(),
        courseName: selectedCourse,
        day: match ? match.day : "Senin",
        title: newTitle,
        type: newType,
        deadline: newDeadline,
        completed: false
      },
      ...assignments
    ]);
    setNewTitle("");
    setNewDeadline("");
  };

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wTitle.trim()) return;

    setWorkouts([
      ...workouts,
      {
        id: Date.now().toString(),
        type: wType,
        day: wDay,
        title: wTitle,
        target: wTarget || (wType === "gym" ? "3 Set latihan" : "Pace santai"),
        completed: false
      }
    ]);
    setWTitle("");
    setWTarget("");
  };

  const currentDaySchedules = useMemo(() => {
    return schedulesData.filter(s => s.day === selectedDay);
  }, [selectedDay]);

  const totalSksCurrentDay = currentDaySchedules.reduce((acc, curr) => acc + curr.sks, 0);

  // Theme Classes
  const bgMain = isDark ? "bg-[#0b0f19] text-zinc-100" : "bg-slate-50 text-slate-800";
  const cardBg = isDark ? "bg-[#121829]/90 border-zinc-800/80" : "bg-white border-slate-200/90 shadow-sm";
  const subtleCard = isDark ? "bg-[#0f1422] border-zinc-800/60" : "bg-slate-100 border-slate-200/60";
  const textMuted = isDark ? "text-zinc-400" : "text-slate-500";

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${bgMain} selection:bg-orange-500/20 pb-24`}>
      
      {/* Glow Effects (Subtle & Clean) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-[140px] rounded-full transition-opacity duration-500 ${
          isDark ? "bg-blue-600/10 opacity-100" : "bg-blue-300/20 opacity-60"
        }`} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Top Navigation Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-zinc-800/20 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Hub Perkuliahan & Olahraga</h1>
            </div>
            <p className={`text-xs mt-1 ${textMuted}`}>
              Teknologi Informasi — Rombel J &bull; 21 SKS &bull; Pelacak Harian
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Tab Navigators */}
            <div className={`flex p-1 rounded-2xl border backdrop-blur-md ${cardBg}`}>
              {(["kuliah", "tugas", "olahraga"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                      : `${textMuted} hover:text-zinc-900 dark:hover:text-white`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-2xl border transition-all ${cardBg} ${
                isDark ? "text-amber-400 hover:border-zinc-700" : "text-slate-600 hover:border-slate-300"
              }`}
              title="Ganti Tema Tampilan"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ================= TAB 1: KULIAH ================= */}
        {activeTab === "kuliah" && (
          <div className="space-y-6">
            
            {/* Banner Live Jam & Matkul Berikutnya */}
            <div className={`p-5 sm:p-6 rounded-3xl border relative overflow-hidden ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-orange-500 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Hari Ini
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">{clock.date}</h2>
                  <p className={`text-xs mt-1 ${textMuted}`}>
                    Mata kuliah berikutnya: <span className="font-semibold text-orange-500">Aplikasi Web (15:50 WIB)</span> di Gedung RF
                  </p>
                </div>

                <div className={`sm:text-right px-4 py-2.5 rounded-2xl border ${subtleCard}`}>
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-orange-500">
                    {clock.time}
                  </div>
                  <div className={`text-[10px] uppercase font-semibold ${textMuted}`}>WIB (Waktu Lokal)</div>
                </div>
              </div>
            </div>

            {/* Selector Hari */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {daysList.map((day) => {
                const isSelected = selectedDay === day;
                const count = schedulesData.filter(s => s.day === day).length;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-3 px-2 rounded-2xl border transition-all text-center relative ${
                      isSelected
                        ? "bg-gradient-to-b from-orange-500 to-amber-600 border-orange-400 text-white shadow-lg shadow-orange-500/25 scale-[1.02]"
                        : `${cardBg} ${textMuted} hover:border-zinc-700`
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm">{day}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? "text-orange-100" : textMuted}`}>
                      {count} matkul
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Header Informasi Hari */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">{selectedDay}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 font-bold border border-orange-500/20">
                  {currentDaySchedules.length} Kuliah
                </span>
                <span className={`text-xs font-medium ${textMuted}`}>&bull; {totalSksCurrentDay} SKS Total</span>
              </div>
            </div>

            {/* Daftar Card Kuliah */}
            <div className="space-y-3">
              {currentDaySchedules.map((item) => (
                <div
                  key={item.no}
                  className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4 ${cardBg} hover:border-orange-500/40`}
                >
                  {/* Indicator Line Kiri */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-amber-500" />

                  {/* Waktu */}
                  <div className="sm:w-28 shrink-0 pl-1 sm:pl-0 sm:border-r border-zinc-700/30 sm:pr-4">
                    <div className="text-base font-black tracking-tight">{item.startTime}</div>
                    <div className={`text-xs ${textMuted}`}>{item.endTime}</div>
                    <span className="inline-block text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500">
                      {item.duration}
                    </span>
                  </div>

                  {/* Isi Matkul */}
                  <div className="flex-1 space-y-2">
                    <h4 className="font-bold text-base sm:text-lg leading-snug">
                      {item.name}
                    </h4>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {item.type}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${subtleCard}`}>
                        {item.code}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${subtleCard}`}>
                        {item.sks} SKS
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${subtleCard}`}>
                        {item.rombel}
                      </span>
                    </div>

                    {/* Dosen & Ruangan */}
                    <div className={`text-xs space-y-1 pt-1 ${textMuted}`}>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>{item.lecturer}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                        <span>{item.room}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 2: TUGAS & CATATAN ================= */}
        {activeTab === "tugas" && (
          <div className="space-y-6">
            
            {/* Input Form Tugas */}
            <form onSubmit={handleAddAssignment} className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-500" /> Tambah Tugas & Catatan Kuliah
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Mata Kuliah</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className={`w-full rounded-2xl px-3 py-2.5 text-xs outline-none border transition ${subtleCard}`}
                  >
                    {schedulesData.map((s) => (
                      <option key={s.no} value={s.name} className="bg-slate-900 text-white">
                        {s.name} ({s.day})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Tipe Penugasan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType("individu")}
                      className={`text-xs py-2.5 rounded-2xl font-bold border transition ${
                        newType === "individu" 
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20" 
                          : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      Individu
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType("kelompok")}
                      className={`text-xs py-2.5 rounded-2xl font-bold border transition ${
                        newType === "kelompok" 
                          ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20" 
                          : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      Kelompok
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Deskripsi Tugas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Implementasi modul 3 praktikum..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full rounded-2xl px-3 py-2.5 text-xs outline-none border ${subtleCard}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Batas Waktu</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className={`w-full rounded-2xl px-3 py-2.5 text-xs outline-none border ${subtleCard}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:brightness-110 transition"
              >
                Simpan Penugasan
              </button>
            </form>

            {/* List Tugas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Daftar Catatan Tugas ({assignments.length})</h4>
                <div className="flex gap-1">
                  {(["semua", "individu", "kelompok"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`text-[11px] capitalize px-2.5 py-1 rounded-xl font-bold border transition ${
                        filterType === t 
                          ? "bg-orange-500 text-white border-orange-500" 
                          : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {assignments
                .filter(a => filterType === "semua" || a.type === filterType)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-3xl border flex items-center justify-between gap-3 transition ${cardBg} ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAssignments(assignments.map(a => a.id === task.id ? { ...a, completed: !a.completed } : a))}
                        className="text-slate-400 hover:text-orange-500 transition"
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className={`text-sm font-bold ${task.completed ? "line-through text-slate-500" : ""}`}>
                          {task.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                          <span className={`px-2 py-0.5 rounded-md font-semibold ${subtleCard}`}>{task.courseName}</span>
                          <span className={textMuted}>Hari: {task.day}</span>
                          <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                            task.type === "kelompok" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                          }`}>
                            {task.type}
                          </span>
                          <span className="text-rose-500 font-semibold">Batas: {task.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setAssignments(assignments.filter(a => a.id !== task.id))}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>

          </div>
        )}

        {/* ================= TAB 3: OLAHRAGA (CUSTOM) ================= */}
        {activeTab === "olahraga" && (
          <div className="space-y-6">
            
            {/* Form Tambah Olahraga */}
            <form onSubmit={handleAddWorkout} className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-orange-500" /> Kustom Sesi Olahraga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Jenis Kegiatan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWType("gym")}
                      className={`text-xs py-2 rounded-2xl font-bold border transition ${
                        wType === "gym" ? "bg-amber-500 text-white border-amber-500" : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      GYM
                    </button>
                    <button
                      type="button"
                      onClick={() => setWType("lari")}
                      className={`text-xs py-2 rounded-2xl font-bold border transition ${
                        wType === "lari" ? "bg-cyan-600 text-white border-cyan-600" : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      LARI
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Hari</label>
                  <select
                    value={wDay}
                    onChange={(e) => setWDay(e.target.value)}
                    className={`w-full rounded-2xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                  >
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Nama Sesi / Bagian</label>
                  <input
                    type="text"
                    placeholder="Misal: Dada & Trisep / 5K Tempo"
                    value={wTitle}
                    onChange={(e) => setWTitle(e.target.value)}
                    className={`w-full rounded-2xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Target Repetisi / Pace</label>
                <input
                  type="text"
                  placeholder="Contoh: Bench Press 4x8, DB Incline 3x10 atau Pace 5:20"
                  value={wTarget}
                  onChange={(e) => setWTarget(e.target.value)}
                  className={`w-full rounded-2xl px-3 py-2.5 text-xs outline-none border ${subtleCard}`}
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-orange-500/20 hover:brightness-110 transition"
              >
                Tambahkan ke Rutinitas
              </button>
            </form>

            {/* List Jadwal Olahraga */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Jadwal Sesi Latihan</h4>
                <span className={`text-xs ${textMuted}`}>
                  {workouts.filter(w => w.completed).length} dari {workouts.length} selesai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    className={`p-5 rounded-3xl border flex flex-col justify-between gap-3 transition-all ${cardBg} ${
                      w.completed ? "border-emerald-500/30" : ""
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                            w.type === "gym" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                          }`}>
                            {w.type}
                          </span>
                          <span className={`text-xs font-bold ${textMuted}`}>{w.day}</span>
                        </div>

                        <button
                          onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h5 className={`font-bold text-base leading-snug ${w.completed ? "line-through text-slate-500" : ""}`}>
                        {w.title}
                      </h5>
                      <p className={`text-xs leading-relaxed ${textMuted}`}>{w.target}</p>
                    </div>

                    <button
                      onClick={() => setWorkouts(workouts.map(item => item.id === w.id ? { ...item, completed: !item.completed } : item))}
                      className={`w-full py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                        w.completed 
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                          : `${subtleCard} hover:border-zinc-700`
                      }`}
                    >
                      {w.completed ? (
                        <>
                          <Check className="w-4 h-4" /> Selesai
                        </>
                      ) : (
                        "Check-in Latihan"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}