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
  Sun, 
  Moon,
  Check,
  CalendarRange,
  LayoutGrid,
  ChevronRight,
  Flame,
  AlertCircle
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

// Data Jadwal Kuliah Tetap
const schedulesData: ScheduleItem[] = [
  // SENIN
  { no: 5, code: "INF60250", name: "Praktik Manajemen Sistem Informasi", sks: 2, rombel: "Rombel J2", lecturer: "Dr. Agus Qomaruddin Munir S.T., M.Cs.", type: "Praktik", room: "Lab. Elektronika Industri, GEDUNG ELEKTRO", day: "Senin", startTime: "07:30", endTime: "10:50", duration: "3j 20m" },
  { no: 10, code: "MWK60207", name: "Pendidikan Kewarganegaraan", sks: 2, rombel: "Rombel J", lecturer: "Dr. Johan Dwi Saputro M.Pd.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Senin", startTime: "10:52", endTime: "12:32", duration: "1j 40m" },
  
  // SELASA
  { no: 3, code: "INF60246", name: "Praktik Pengembangan Aplikasi Mobile", sks: 2, rombel: "Rombel J", lecturer: "Dzul Fadli Rahman S.Kom., M.Sc.", type: "Praktik", room: "Lab. Instrumentasi, GEDUNG IDB ELEKTRO", day: "Selasa", startTime: "07:30", endTime: "10:50", duration: "3j 20m" },
  { no: 6, code: "INF60264", name: "Praktik Scripting Languages", sks: 2, rombel: "Rombel J", lecturer: "Ir. Muhammad Izzuddin Mahali M.Cs.", type: "Praktik", room: "R. AVA A/Lab. Micro, GEDUNG MEDIA", day: "Selasa", startTime: "12:31", endTime: "14:11", duration: "1j 40m" },
  { no: 1, code: "INF60145", name: "Pengembangan Aplikasi Mobile", sks: 1, rombel: "Rombel J", lecturer: "Dzul Fadli Rahman S.Kom., M.Sc.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Selasa", startTime: "15:55", endTime: "16:45", duration: "50m" },

  // RABU (Kosong)
  
  // KAMIS
  { no: 7, code: "INF60273", name: "Scripting Languages", sks: 2, rombel: "Rombel J", lecturer: "Ir. Muhammad Izzuddin Mahali M.Cs.", type: "Teori", room: "R. AVA B Media, GEDUNG MEDIA", day: "Kamis", startTime: "07:30", endTime: "09:10", duration: "1j 40m" },
  { no: 4, code: "INF60249", name: "Manajemen Sistem Informasi", sks: 2, rombel: "Rombel J", lecturer: "Handaru Jati Ph.D.", type: "Teori", room: "R. Kuliah ( RF 4 ), GEDUNG RF", day: "Kamis", startTime: "10:51", endTime: "12:31", duration: "1j 40m" },
  { no: 8, code: "INF60285", name: "Aplikasi Web", sks: 2, rombel: "Rombel J", lecturer: "Zaenal Mustofa M.Kom.", type: "Teori", room: "R. Kuliah ( RF 8 ), GEDUNG RF", day: "Kamis", startTime: "15:50", endTime: "17:30", duration: "1j 40m" },

  // JUMAT
  { no: 11, code: "MWU60203", name: "Pendidikan & Pembangunan Berkelanjutan", sks: 2, rombel: "Rombel J", lecturer: "Dr. Dra. Umi Rochayati M.T.", type: "Teori", room: "R. Kuliah ( RF 6 ), GEDUNG RF", day: "Jumat", startTime: "09:11", endTime: "10:51", duration: "1j 40m" },
  { no: 2, code: "INF60242", name: "Interaksi Manusia Komputer", sks: 2, rombel: "Rombel J", lecturer: "Dr. Ratna Wardani M.T.", type: "Teori", room: "R. Kuliah ( RF 5 ), GEDUNG RF", day: "Jumat", startTime: "12:30", endTime: "14:10", duration: "1j 40m" },
  { no: 9, code: "INF60295", name: "Praktik Aplikasi Web", sks: 2, rombel: "Rombel J2", lecturer: "Zaenal Mustofa M.Kom.", type: "Praktik", room: "R. Kuliah ( RE 4 ), GEDUNG ELEKTRO", day: "Jumat", startTime: "14:11", endTime: "17:30", duration: "3j 19m" },
];

const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<"kuliah" | "tugas" | "olahraga">("kuliah");
  const [viewMode, setViewMode] = useState<"perHari" | "semua">("perHari");
  
  const [todayName, setTodayName] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<"Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat">("Senin");
  const [clock, setClock] = useState({ time: "00:00:00", date: "Memuat tanggal..." });

  // State Tugas
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(schedulesData[0].name);
  const [newType, setNewType] = useState<"individu" | "kelompok">("individu");
  const [newDeadline, setNewDeadline] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "individu" | "kelompok">("semua");

  // State Olahraga
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: "1", type: "gym", day: "Senin", title: "Push Day (Chest, Shoulders, Triceps)", target: "Bench Press 4x8, DB Incline 3x10, Dips", completed: false },
    { id: "2", type: "lari", day: "Selasa", title: "Easy Recovery Run", target: "4 KM Santai (Zona Kardio 2)", completed: false },
    { id: "3", type: "gym", day: "Kamis", title: "Pull Day (Back & Biceps Focus)", target: "Lat Pulldown 4x10, Barbell Row 3x10, Curls", completed: false },
    { id: "4", type: "lari", day: "Jumat", title: "Interval / Speed Run", target: "5 KM (Target Pace 5:20/km)", completed: false },
    { id: "5", type: "gym", day: "Sabtu", title: "Legs & Core Conditioning", target: "Squats 4x8, Romanian Deadlift 3x10, Plank", completed: false },
  ]);

  const [wTitle, setWTitle] = useState("");
  const [wType, setWType] = useState<"gym" | "lari">("gym");
  const [wDay, setWDay] = useState("Senin");
  const [wTarget, setWTarget] = useState("");

  // Deteksi Hari & Jam Realtime
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dayIndex = now.getDay();
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const currentDay = dayNames[dayIndex];
      setTodayName(currentDay);

      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      setClock({
        time: `${hh}:${mm}:${ss}`,
        date: `${currentDay}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`
      });
    };

    const now = new Date();
    const dayIndex = now.getDay();
    const mapDay: { [key: number]: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" } = {
      1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat"
    };

    setSelectedDay(mapDay[dayIndex] || "Senin");
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Preferences & Storage
  useEffect(() => {
    const theme = localStorage.getItem("app_theme_v3");
    if (theme) setIsDark(theme === "dark");

    const savedTasks = localStorage.getItem("app_tasks_v3");
    if (savedTasks) {
      try { setAssignments(JSON.parse(savedTasks)); } catch (e) {}
    } else {
      setAssignments([
        { id: "1", courseName: "Praktik Manajemen Sistem Informasi", day: "Senin", title: "Setup Database & Model Modul Praktikum", type: "individu", deadline: "2026-09-12", completed: false },
        { id: "2", courseName: "Aplikasi Web", day: "Kamis", title: "Deployment Dashboard ke Platform Vercel", type: "kelompok", deadline: "2026-09-15", completed: false }
      ]);
    }

    const savedWorkouts = localStorage.getItem("app_workouts_v3");
    if (savedWorkouts) {
      try { setWorkouts(JSON.parse(savedWorkouts)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_theme_v3", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("app_tasks_v3", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("app_workouts_v3", JSON.stringify(workouts));
  }, [workouts]);

  // Handlers Tugas & Olahraga
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
        target: wTarget || (wType === "gym" ? "3 Set latihan" : "Pace rileks"),
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

  // Status Kuliah Realtime
  const nextClassToday = useMemo(() => {
    if (!daysList.includes(todayName as any)) return null;
    const todayList = schedulesData.filter(s => s.day === todayName);
    if (todayList.length === 0) return null;

    const [curHour, curMin] = clock.time.split(":").map(Number);
    const curTotalMin = curHour * 60 + curMin;

    for (const item of todayList) {
      const [startH, startM] = item.startTime.split(":").map(Number);
      const [endH, endM] = item.endTime.split(":").map(Number);
      const startTotalMin = startH * 60 + startM;
      const endTotalMin = endH * 60 + endM;

      if (curTotalMin >= startTotalMin && curTotalMin <= endTotalMin) {
        return { status: "ongoing", item };
      }
      if (curTotalMin < startTotalMin) {
        return { status: "upcoming", item, diffMin: startTotalMin - curTotalMin };
      }
    }

    return { status: "finished" };
  }, [todayName, clock.time]);

  // Design Tokens (Soft Slate-Zinc & Soft Accent)
  const bgMain = isDark ? "bg-[#0c0f17] text-slate-100" : "bg-[#f8fafc] text-slate-900";
  const cardSurface = isDark ? "bg-[#141824] border-slate-800/80" : "bg-white border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]";
  const innerSurface = isDark ? "bg-[#1b2030]/80 border-slate-800" : "bg-slate-50 border-slate-200/80";
  const textSubtle = isDark ? "text-slate-400" : "text-slate-500";
  const badgeMuted = isDark ? "bg-slate-800/80 text-slate-300" : "bg-slate-100 text-slate-700";

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${bgMain} pb-24 selection:bg-amber-500/20`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-9 space-y-6">
        
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 font-bold text-sm">
                TI
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Akademik & Rutinitas</h1>
            </div>
            <p className={`text-xs mt-1 font-medium ${textSubtle}`}>
              Teknologi Informasi &bull; Rombel J &bull; 21 SKS Semester Ini
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div className={`flex p-1 rounded-xl border ${cardSurface}`}>
              {(["kuliah", "tugas", "olahraga"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-amber-500 text-white shadow-xs"
                      : `${textSubtle} hover:text-slate-900 dark:hover:text-slate-100`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl border transition-all ${cardSurface} ${
                isDark ? "text-amber-400 hover:border-slate-700" : "text-slate-600 hover:border-slate-300"
              }`}
              title="Ganti Tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ================= TAB 1: KULIAH ================= */}
        {activeTab === "kuliah" && (
          <div className="space-y-5">
            
            {/* Realtime Live Class Widget */}
            <div className={`p-5 sm:p-6 rounded-2xl border relative overflow-hidden ${cardSurface}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    Hari Ini: {todayName}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">{clock.date}</h2>
                  <div className={`text-xs pt-0.5 ${textSubtle}`}>
                    {nextClassToday?.status === "ongoing" && nextClassToday.item && (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Sedang berlangsung: {nextClassToday.item.name} ({nextClassToday.item.startTime} - {nextClassToday.item.endTime})
                      </span>
                    )}
                    {nextClassToday?.status === "upcoming" && nextClassToday.item && (
                      <span>
                        Kuliah berikutnya: <strong className="text-amber-500 font-bold">{nextClassToday.item.name}</strong> ({nextClassToday.item.startTime}) &bull; {Math.floor((nextClassToday.diffMin ?? 0) / 60)}j {(nextClassToday.diffMin ?? 0) % 60}m lagi
                      </span>
                    )}
                    {nextClassToday?.status === "finished" && (
                      <span>Seluruh perkuliahan hari ini telah selesai. Waktu istirahat & review tugas.</span>
                    )}
                    {!nextClassToday && (
                      <span>Tidak ada kegiatan perkuliahan pada hari ini.</span>
                    )}
                  </div>
                </div>

                <div className={`sm:text-right px-4 py-2.5 rounded-xl border ${innerSurface}`}>
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-500">
                    {clock.time}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${textSubtle}`}>WIB Realtime</div>
                </div>
              </div>
            </div>

            {/* View Mode Bar */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${textSubtle}`}>Mode:</span>
                <div className={`flex p-0.5 rounded-lg border ${cardSurface}`}>
                  <button
                    onClick={() => setViewMode("perHari")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      viewMode === "perHari" ? "bg-amber-500 text-white" : `${textSubtle}`
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Harian
                  </button>
                  <button
                    onClick={() => setViewMode("semua")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      viewMode === "semua" ? "bg-amber-500 text-white" : `${textSubtle}`
                    }`}
                  >
                    <CalendarRange className="w-3.5 h-3.5" /> Rangkaian Penuh
                  </button>
                </div>
              </div>
            </div>

            {/* Mode 1: Tampilan Per Hari */}
            {viewMode === "perHari" && (
              <div className="space-y-4">
                {/* Selector Hari Bersih */}
                <div className="grid grid-cols-5 gap-2">
                  {daysList.map((day) => {
                    const isSelected = selectedDay === day;
                    const isToday = todayName === day;
                    const count = schedulesData.filter(s => s.day === day).length;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`py-3 px-2 rounded-xl border transition-all text-center relative ${
                          isSelected
                            ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                            : `${cardSurface} ${textSubtle} hover:border-slate-400 dark:hover:border-slate-700`
                        }`}
                      >
                        {isToday && (
                          <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-amber-500"}`} />
                        )}
                        <div className="font-bold text-xs sm:text-sm">{day}</div>
                        <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? "text-amber-100" : textSubtle}`}>
                          {count} matkul
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* List Kartu Matkul */}
                <div className="space-y-3 pt-1">
                  {currentDaySchedules.length === 0 ? (
                    <div className={`p-10 text-center rounded-2xl border border-dashed text-xs ${cardSurface} ${textSubtle}`}>
                      Tidak ada jadwal perkuliahan pada hari {selectedDay}.
                    </div>
                  ) : (
                    currentDaySchedules.map((item) => (
                      <div
                        key={item.no}
                        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center gap-5 ${cardSurface} hover:border-amber-500/40`}
                      >
                        {/* Waktu Sisi Kiri */}
                        <div className="sm:w-28 shrink-0 sm:border-r border-slate-200 dark:border-slate-800 sm:pr-4">
                          <div className="text-base font-black tracking-tight">{item.startTime}</div>
                          <div className={`text-xs font-semibold ${textSubtle}`}>{item.endTime}</div>
                          <span className="inline-block text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {item.duration}
                          </span>
                        </div>

                        {/* Rincian Kuliah Sisi Kanan */}
                        <div className="flex-1 space-y-2">
                          <h4 className="font-bold text-base leading-snug tracking-tight">
                            {item.name}
                          </h4>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                              item.type === "Praktik" 
                                ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" 
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}>
                              {item.type}
                            </span>
                            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${badgeMuted}`}>
                              {item.code}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${badgeMuted}`}>
                              {item.sks} SKS
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${badgeMuted}`}>
                              {item.rombel}
                            </span>
                          </div>

                          <div className={`text-xs space-y-1 pt-1 ${textSubtle}`}>
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="font-medium">{item.lecturer}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                              <span className="font-medium leading-relaxed">{item.room}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Mode 2: Tampilan Rangkaian Semua Jadwal */}
            {viewMode === "semua" && (
              <div className="space-y-6">
                {daysList.map((day) => {
                  const dayItems = schedulesData.filter(s => s.day === day);
                  if (dayItems.length === 0) return null;
                  return (
                    <div key={day} className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <h3 className="font-black text-sm uppercase tracking-wide">
                          {day}
                        </h3>
                        <span className={`text-xs font-semibold ${textSubtle}`}>&bull; {dayItems.length} Mata Kuliah</span>
                      </div>

                      <div className="space-y-2">
                        {dayItems.map((item) => (
                          <div
                            key={item.no}
                            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardSurface}`}
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black text-amber-500 font-mono">
                                  {item.startTime} - {item.endTime}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeMuted}`}>
                                  {item.type} ({item.sks} SKS)
                                </span>
                              </div>
                              <h4 className="font-bold text-sm">{item.name}</h4>
                              <p className={`text-xs mt-0.5 ${textSubtle}`}>{item.room}</p>
                            </div>

                            <div className={`text-xs sm:text-right ${textSubtle}`}>
                              <div className="font-medium">{item.lecturer}</div>
                              <span className="text-[11px] font-mono">{item.code} &bull; {item.rombel}</span>
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

        {/* ================= TAB 2: TUGAS & CATATAN ================= */}
        {activeTab === "tugas" && (
          <div className="space-y-6">
            <form onSubmit={handleAddAssignment} className={`p-6 rounded-2xl border space-y-4 ${cardSurface}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" /> Input Penugasan Kuliah
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Mata Kuliah Terkait</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border font-medium ${innerSurface}`}
                  >
                    {schedulesData.map((s) => (
                      <option key={s.no} value={s.name} className="bg-slate-900 text-white">
                        {s.name} ({s.day})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Kategori</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType("individu")}
                      className={`text-xs py-2 rounded-xl font-bold border transition ${
                        newType === "individu" 
                          ? "bg-amber-500 text-white border-amber-500" 
                          : `${innerSurface} ${textSubtle}`
                      }`}
                    >
                      Individu
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType("kelompok")}
                      className={`text-xs py-2 rounded-xl font-bold border transition ${
                        newType === "kelompok" 
                          ? "bg-purple-600 text-white border-purple-600" 
                          : `${innerSurface} ${textSubtle}`
                      }`}
                    >
                      Kelompok
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Detail Tugas / Modul</label>
                  <input
                    type="text"
                    placeholder="Contoh: Laporan praktikum modul 2..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border font-medium ${innerSurface}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Batas Pengumpulan</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border font-medium ${innerSurface}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="text-xs font-bold px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs"
              >
                Simpan Penugasan
              </button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Daftar Tugas ({assignments.length})</h4>
                <div className="flex gap-1">
                  {(["semua", "individu", "kelompok"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`text-[11px] capitalize px-2.5 py-1 rounded-lg font-bold border transition ${
                        filterType === t 
                          ? "bg-amber-500 text-white border-amber-500" 
                          : `${innerSurface} ${textSubtle}`
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
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition ${cardSurface} ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAssignments(assignments.map(a => a.id === task.id ? { ...a, completed: !a.completed } : a))}
                        className="text-slate-400 hover:text-amber-500 transition"
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className={`text-sm font-bold ${task.completed ? "line-through text-slate-500" : ""}`}>
                          {task.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                          <span className={`px-2 py-0.5 rounded font-semibold ${badgeMuted}`}>{task.courseName}</span>
                          <span className={textSubtle}>Hari: {task.day}</span>
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                            task.type === "kelompok" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {task.type}
                          </span>
                          <span className="text-rose-500 font-bold">Deadline: {task.deadline}</span>
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

        {/* ================= TAB 3: OLAHRAGA ================= */}
        {activeTab === "olahraga" && (
          <div className="space-y-6">
            <form onSubmit={handleAddWorkout} className={`p-6 rounded-2xl border space-y-4 ${cardSurface}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-amber-500" /> Kustom Sesi Workout
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Jenis Kegiatan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWType("gym")}
                      className={`text-xs py-2 rounded-xl font-bold border transition ${
                        wType === "gym" ? "bg-amber-500 text-white border-amber-500" : `${innerSurface} ${textSubtle}`
                      }`}
                    >
                      GYM
                    </button>
                    <button
                      type="button"
                      onClick={() => setWType("lari")}
                      className={`text-xs py-2 rounded-xl font-bold border transition ${
                        wType === "lari" ? "bg-teal-600 text-white border-teal-600" : `${innerSurface} ${textSubtle}`
                      }`}
                    >
                      LARI
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Hari</label>
                  <select
                    value={wDay}
                    onChange={(e) => setWDay(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border font-medium ${innerSurface}`}
                  >
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Fokus Sesi</label>
                  <input
                    type="text"
                    placeholder="Misal: Chest & Triceps / 5K Tempo"
                    value={wTitle}
                    onChange={(e) => setWTitle(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border font-medium ${innerSurface}`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1.5 ${textSubtle}`}>Target Beban / Pace Lari</label>
                <input
                  type="text"
                  placeholder="Contoh: Bench Press 4x8, DB Incline 3x10 atau Pace 5:20"
                  value={wTarget}
                  onChange={(e) => setWTarget(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs outline-none border font-medium ${innerSurface}`}
                />
              </div>

              <button
                type="submit"
                className="text-xs font-bold px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs"
              >
                Tambahkan Sesi Latihan
              </button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Rutinitas Latihan ({workouts.length})</h4>
                <span className={`text-xs font-semibold ${textSubtle}`}>
                  {workouts.filter(w => w.completed).length} dari {workouts.length} selesai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${cardSurface} ${
                      w.completed ? "border-emerald-500/30 opacity-70" : ""
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            w.type === "gym" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          }`}>
                            {w.type}
                          </span>
                          <span className={`text-xs font-bold ${textSubtle}`}>{w.day}</span>
                        </div>

                        <button
                          onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h5 className={`font-bold text-sm leading-snug ${w.completed ? "line-through text-slate-500" : ""}`}>
                        {w.title}
                      </h5>
                      <p className={`text-xs font-medium ${textSubtle}`}>{w.target}</p>
                    </div>

                    <button
                      onClick={() => setWorkouts(workouts.map(item => item.id === w.id ? { ...item, completed: !item.completed } : item))}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        w.completed 
                          ? "bg-emerald-600 text-white" 
                          : `${innerSurface} hover:border-slate-400 dark:hover:border-slate-700`
                      }`}
                    >
                      {w.completed ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Selesai
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