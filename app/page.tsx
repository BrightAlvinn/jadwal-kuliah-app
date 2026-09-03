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
  LayoutGrid
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

// Jadwal Kuliah (Praktik MSI telah di Senin)
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
  
  // State Hari & Waktu Dinamis
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
    { id: "1", type: "gym", day: "Senin", title: "Push Day (Dada, Bahu, Trisep)", target: "Bench Press 4x8, DB Shoulder Press 3x10, Dips", completed: false },
    { id: "2", type: "lari", day: "Selasa", title: "Easy Recovery Run", target: "4 KM Santai (Heart Rate Rendah)", completed: false },
    { id: "3", type: "gym", day: "Kamis", title: "Pull Day (Punggung & Bisep)", target: "Lat Pulldown 4x10, Barbell Row 3x10, Bicep Curl", completed: false },
    { id: "4", type: "lari", day: "Jumat", title: "Interval / Tempo Session", target: "5 KM (Target Pace 5:20/km)", completed: false },
    { id: "5", type: "gym", day: "Sabtu", title: "Legs & Core Strength", target: "Squats 4x8, Romanian Deadlift 3x10, Plank", completed: false },
  ]);

  // Form Olahraga
  const [wTitle, setWTitle] = useState("");
  const [wType, setWType] = useState<"gym" | "lari">("gym");
  const [wDay, setWDay] = useState("Senin");
  const [wTarget, setWTarget] = useState("");

  // Otomatis Deteksi Hari & Jam Saat Web Dibuka
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dayIndex = now.getDay(); // 0: Minggu, 1: Senin, ..., 5: Jumat, 6: Sabtu
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

    // Inisialisasi awal hari aktif saat web dibuka
    const now = new Date();
    const dayIndex = now.getDay();
    const mapDay: { [key: number]: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" } = {
      1: "Senin",
      2: "Selasa",
      3: "Rabu",
      4: "Kamis",
      5: "Jumat"
    };

    if (mapDay[dayIndex]) {
      setSelectedDay(mapDay[dayIndex]);
    } else {
      // Jika Sabtu/Minggu, default ke Senin
      setSelectedDay("Senin");
    }

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Preferences & Storage
  useEffect(() => {
    const theme = localStorage.getItem("app_theme_soft");
    if (theme) setIsDark(theme === "dark");

    const savedTasks = localStorage.getItem("app_tasks_soft");
    if (savedTasks) {
      try { setAssignments(JSON.parse(savedTasks)); } catch (e) {}
    } else {
      setAssignments([
        { id: "1", courseName: "Praktik Manajemen Sistem Informasi", day: "Senin", title: "Penyiapan Lingkungan Praktikum & Database", type: "individu", deadline: "2026-09-12", completed: false },
        { id: "2", courseName: "Aplikasi Web", day: "Kamis", title: "Laporan Modul Dashboard Next.js", type: "kelompok", deadline: "2026-09-15", completed: false }
      ]);
    }

    const savedWorkouts = localStorage.getItem("app_workouts_soft");
    if (savedWorkouts) {
      try { setWorkouts(JSON.parse(savedWorkouts)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_theme_soft", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("app_tasks_soft", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("app_workouts_soft", JSON.stringify(workouts));
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
        target: wTarget || (wType === "gym" ? "3 Set terukur" : "Pace rileks"),
        completed: false
      }
    ]);
    setWTitle("");
    setWTarget("");
  };

  const currentDaySchedules = useMemo(() => {
    return schedulesData.filter(s => s.day === selectedDay);
  }, [selectedDay]);

  // Cari status kuliah berikutnya hari ini
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

  // ---- Design tokens ----------------------------------------------------
  // A weekday gets its own hue, the way a paper planner colour-codes its
  // tabs. The same hues carry through to task/workout categories so colour
  // consistently means "which thread of the week", not decoration.
  const dayTheme: Record<string, string> = {
    Senin: "#B8862F",
    Selasa: "#2F8C82",
    Rabu: "#7C6FA0",
    Kamis: "#C15B3C",
    Jumat: "#3E5C99",
    Sabtu: "#8A6D3F",
    Minggu: "#9A4F4F",
  };
  const accentHex = "#B8862F";
  const accentHexHover = "#A3761F";

  const hexToRgba = (hex: string, alpha: number) => {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const containerBg = isDark ? "bg-[#10121A] text-[#E7E5DE]" : "bg-[#F3F4F7] text-[#20222B]";
  const surface = isDark ? "bg-[#171A24] border-[#262B3B]" : "bg-white border-[#E1E3E9]";
  const surfaceSoft = isDark ? "bg-[#1B1F2C] border-[#262B3B]" : "bg-[#ECEEF2] border-[#E1E3E9]";
  const textMuted = isDark ? "text-[#8B8FA3]" : "text-[#6B6E7C]";
  const dividerColor = isDark ? "border-[#262B3B]" : "border-[#E4E5EA]";
  const accentPrimary = "bg-[#B8862F] hover:bg-[#A3761F] text-white transition-colors duration-200";
  const cardBg = surface;
  const subtleCard = surfaceSoft;

  const tabIcons = { kuliah: BookOpen, tugas: CheckCircle2, olahraga: Dumbbell } as const;
  const heroAccent = dayTheme[todayName] || accentHex;

  return (
    <div className={`min-h-screen font-body transition-colors duration-200 ${containerBg} pb-24`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,560;9..144,650&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, serif; font-optical-sizing: auto; }
        .font-body, .font-body * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .font-clock { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 space-y-7">

        {/* Header */}
        <header className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight leading-none">
                Rencana Studi
              </h1>
              <p className={`text-[13px] mt-2 leading-relaxed max-w-sm ${textMuted}`}>
                Program Studi Teknologi Informasi, Rombel J, 21 SKS aktif semester ini.
              </p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`shrink-0 p-2.5 rounded-full border transition-colors duration-200 ${surface} ${
                isDark ? "text-amber-300 hover:bg-[#20243280]" : "text-slate-600 hover:bg-slate-100"
              }`}
              title="Ganti Tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Tab nav — underline style */}
          <div className={`flex items-center gap-5 border-b ${dividerColor}`}>
            {(["kuliah", "tugas", "olahraga"] as const).map((tab) => {
              const TabIcon = tabIcons[tab];
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-1.5 pb-3 text-[13px] font-medium capitalize transition-colors duration-200 ${
                    active ? "" : `${textMuted} hover:text-current`
                  }`}
                  style={active ? { color: accentHex } : undefined}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab}
                  {active && (
                    <span
                      className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                      style={{ backgroundColor: accentHex }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </header>

        {/* ================= TAB 1: KULIAH ================= */}
        {activeTab === "kuliah" && (
          <div className="space-y-6">

            {/* Live Clock & Auto Day Detection */}
            <div className={`p-5 sm:p-6 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${surface}`}>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" style={{ color: heroAccent }} />
                  <span className="font-display text-lg sm:text-xl font-semibold">{clock.date}</span>
                </div>
                <div className={`text-[13px] leading-relaxed ${textMuted}`}>
                  {nextClassToday?.status === "ongoing" && nextClassToday.item && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Sedang berlangsung: {nextClassToday.item.name} ({nextClassToday.item.startTime}–{nextClassToday.item.endTime})
                    </span>
                  )}
                  {nextClassToday?.status === "upcoming" && nextClassToday.item && (
                    <span>
                      Kuliah berikutnya: <strong className="font-semibold" style={{ color: heroAccent }}>{nextClassToday.item.name}</strong> ({nextClassToday.item.startTime}), {Math.floor((nextClassToday.diffMin ?? 0) / 60)}j {(nextClassToday.diffMin ?? 0) % 60}m lagi
                    </span>
                  )}
                  {nextClassToday?.status === "finished" && (
                    <span>Seluruh perkuliahan hari ini telah selesai. Selamat beristirahat.</span>
                  )}
                  {!nextClassToday && <span>Tidak ada jadwal perkuliahan pada hari ini.</span>}
                </div>
              </div>

              <div className={`sm:text-right pt-4 sm:pt-0 sm:pl-6 border-t sm:border-t-0 sm:border-l ${dividerColor}`}>
                <div className="font-clock text-2xl sm:text-[28px] font-medium tracking-tight" style={{ color: accentHex }}>
                  {clock.time}
                </div>
                <div className={`text-[11px] mt-0.5 ${textMuted}`}>WIB &middot; waktu nyata</div>
              </div>
            </div>

            {/* Tampilan toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-[12px] ${textMuted}`}>Tampilan</span>
              <div className={`flex p-0.5 rounded-lg border ${surfaceSoft}`}>
                <button
                  onClick={() => setViewMode("perHari")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors duration-200 ${
                    viewMode === "perHari" ? "bg-white dark:bg-[#262B3B] shadow-sm" : `${textMuted}`
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Per hari
                </button>
                <button
                  onClick={() => setViewMode("semua")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors duration-200 ${
                    viewMode === "semua" ? "bg-white dark:bg-[#262B3B] shadow-sm" : `${textMuted}`
                  }`}
                >
                  <CalendarRange className="w-3.5 h-3.5" /> Semua jadwal
                </button>
              </div>
            </div>

            {/* Mode 1: Per Hari */}
            {viewMode === "perHari" && (
              <div className="space-y-5">
                <div className="grid grid-cols-5 gap-1.5">
                  {daysList.map((day) => {
                    const isSelected = selectedDay === day;
                    const isToday = todayName === day;
                    const count = schedulesData.filter(s => s.day === day).length;
                    const c = dayTheme[day];
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className="py-2.5 px-1 rounded-t-lg text-center relative transition-colors duration-200 border-b-2"
                        style={{
                          backgroundColor: isSelected ? hexToRgba(c, isDark ? 0.16 : 0.1) : "transparent",
                          borderBottomColor: isSelected ? c : "transparent",
                        }}
                      >
                        {isToday && (
                          <span
                            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                        )}
                        <div className={`font-medium text-[12px] sm:text-[13px] ${isSelected ? "" : textMuted}`} style={isSelected ? { color: c } : undefined}>
                          {day}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${textMuted}`}>{count} matkul</div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {currentDaySchedules.length === 0 ? (
                    <div className={`p-8 text-center rounded-xl border border-dashed text-[13px] ${surface} ${textMuted}`}>
                      Tidak ada perkuliahan pada hari {selectedDay}.
                    </div>
                  ) : (
                    currentDaySchedules.map((item) => {
                      const c = dayTheme[item.day];
                      const typeColor = item.type === "Praktik" ? "#C15B3C" : "#3E5C99";
                      return (
                        <div
                          key={item.no}
                          className={`rounded-lg border overflow-hidden flex flex-col sm:flex-row transition-colors duration-200 ${surface}`}
                        >
                          <div className="w-full sm:w-1.5 h-1 sm:h-auto" style={{ backgroundColor: c }} />
                          <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="sm:w-24 shrink-0">
                              <div className="font-clock text-[15px] font-medium">{item.startTime}</div>
                              <div className={`font-clock text-[12px] ${textMuted}`}>{item.endTime}</div>
                              <span className={`inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded border ${dividerColor} ${textMuted}`}>
                                {item.duration}
                              </span>
                            </div>

                            <div className="flex-1 space-y-2">
                              <h4 className="font-display font-semibold text-[15px] leading-snug">
                                {item.name}
                              </h4>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                                <span className="capitalize font-medium" style={{ color: typeColor }}>{item.type}</span>
                                <span className={`font-clock ${textMuted}`}>{item.code}</span>
                                <span className={textMuted}>{item.sks} SKS</span>
                                <span className={textMuted}>{item.rombel}</span>
                              </div>

                              <div className={`text-[12.5px] space-y-1 pt-1 ${textMuted}`}>
                                <div className="flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 shrink-0" />
                                  <span>{item.lecturer}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#C15B3C" }} />
                                  <span>{item.room}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Mode 2: Semua Jadwal */}
            {viewMode === "semua" && (
              <div className="space-y-6">
                {daysList.map((day) => {
                  const dayItems = schedulesData.filter(s => s.day === day);
                  if (dayItems.length === 0) return null;
                  const c = dayTheme[day];

                  return (
                    <div key={day} className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c }} />
                        <h3 className="font-display font-semibold text-[15px]">{day}</h3>
                        <span className={`text-[11px] ${textMuted}`}>{dayItems.length} matkul</span>
                      </div>

                      <div className={`rounded-lg border divide-y ${surface} ${dividerColor}`}>
                        {dayItems.map((item) => (
                          <div
                            key={item.no}
                            className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-clock text-[12px] font-medium" style={{ color: c }}>
                                  {item.startTime}–{item.endTime}
                                </span>
                                <span className={`text-[11px] ${textMuted}`}>{item.type}, {item.sks} SKS</span>
                              </div>
                              <h4 className="font-medium text-[13.5px]">{item.name}</h4>
                              <p className={`text-[12px] ${textMuted}`}>{item.room}</p>
                            </div>

                            <div className={`text-[11.5px] sm:text-right ${textMuted}`}>
                              <div>{item.lecturer}</div>
                              <span className="font-clock text-[10.5px]">{item.code} &middot; {item.rombel}</span>
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

            <form onSubmit={handleAddAssignment} className={`p-5 sm:p-6 rounded-xl border space-y-4 ${surface}`}>
              <h3 className="font-display font-semibold text-[15px] flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: accentHex }} /> Tambah tugas &amp; catatan kuliah
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Mata kuliah terkait</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none border ${surfaceSoft}`}
                  >
                    {schedulesData.map((s) => (
                      <option key={s.no} value={s.name} className="bg-slate-900 text-white">
                        {s.name} ({s.day})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Kategori</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType("individu")}
                      className="text-[12px] py-2 rounded-lg font-medium border transition-colors duration-200"
                      style={newType === "individu"
                        ? { backgroundColor: "#3E5C99", borderColor: "#3E5C99", color: "#fff" }
                        : { borderColor: isDark ? "#262B3B" : "#E1E3E9" }}
                    >
                      Individu
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType("kelompok")}
                      className="text-[12px] py-2 rounded-lg font-medium border transition-colors duration-200"
                      style={newType === "kelompok"
                        ? { backgroundColor: "#7C6FA0", borderColor: "#7C6FA0", color: "#fff" }
                        : { borderColor: isDark ? "#262B3B" : "#E1E3E9" }}
                    >
                      Kelompok
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Rincian tugas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Modul praktikum bab 2..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none border ${surfaceSoft}`}
                  />
                </div>
                <div>
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Batas waktu</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none border ${surfaceSoft}`}
                  />
                </div>
              </div>

              <button type="submit" className={`text-[13px] font-medium px-4 py-2.5 rounded-lg ${accentPrimary}`}>
                Simpan penugasan
              </button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-semibold text-[15px]">Daftar catatan &amp; tugas ({assignments.length})</h4>
                <div className="flex gap-1">
                  {(["semua", "individu", "kelompok"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className="text-[11px] capitalize px-2.5 py-1 rounded-md font-medium border transition-colors duration-200"
                      style={filterType === t
                        ? { backgroundColor: accentHex, borderColor: accentHex, color: "#fff" }
                        : { borderColor: isDark ? "#262B3B" : "#E1E3E9" }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`rounded-lg border divide-y ${surface} ${dividerColor}`}>
                {assignments
                  .filter(a => filterType === "semua" || a.type === filterType)
                  .map((task) => {
                    const c = task.type === "kelompok" ? "#7C6FA0" : "#3E5C99";
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 flex items-center justify-between gap-3 ${task.completed ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setAssignments(assignments.map(a => a.id === task.id ? { ...a, completed: !a.completed } : a))}
                            className="shrink-0"
                            style={{ color: task.completed ? "#22c55e" : undefined }}
                          >
                            {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className={`w-5 h-5 ${textMuted}`} />}
                          </button>
                          <div>
                            <div className={`text-[13.5px] font-medium ${task.completed ? "line-through text-slate-500" : ""}`}>
                              {task.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                              <span className={textMuted}>{task.courseName}</span>
                              <span className={textMuted}>&middot; {task.day}</span>
                              <span className="capitalize font-medium" style={{ color: c }}>{task.type}</span>
                              <span className="text-rose-500 font-medium">Batas {task.deadline}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setAssignments(assignments.filter(a => a.id !== task.id))}
                          className={`p-1 shrink-0 ${textMuted} hover:text-rose-500 transition-colors duration-200`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: OLAHRAGA ================= */}
        {activeTab === "olahraga" && (
          <div className="space-y-6">

            <form onSubmit={handleAddWorkout} className={`p-5 sm:p-6 rounded-xl border space-y-4 ${surface}`}>
              <h3 className="font-display font-semibold text-[15px] flex items-center gap-2">
                <Dumbbell className="w-4 h-4" style={{ color: accentHex }} /> Kustom sesi olahraga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Jenis kegiatan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWType("gym")}
                      className="text-[12px] py-2 rounded-lg font-medium border transition-colors duration-200"
                      style={wType === "gym"
                        ? { backgroundColor: accentHex, borderColor: accentHex, color: "#fff" }
                        : { borderColor: isDark ? "#262B3B" : "#E1E3E9" }}
                    >
                      Gym
                    </button>
                    <button
                      type="button"
                      onClick={() => setWType("lari")}
                      className="text-[12px] py-2 rounded-lg font-medium border transition-colors duration-200"
                      style={wType === "lari"
                        ? { backgroundColor: "#2F8C82", borderColor: "#2F8C82", color: "#fff" }
                        : { borderColor: isDark ? "#262B3B" : "#E1E3E9" }}
                    >
                      Lari
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Hari</label>
                  <select
                    value={wDay}
                    onChange={(e) => setWDay(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-[12px] outline-none border ${surfaceSoft}`}
                  >
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Fokus sesi</label>
                  <input
                    type="text"
                    placeholder="Misal: Dada & Trisep / 5K Tempo"
                    value={wTitle}
                    onChange={(e) => setWTitle(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-[12px] outline-none border ${surfaceSoft}`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-[12px] font-medium block mb-1.5 ${textMuted}`}>Target repetisi / pace</label>
                <input
                  type="text"
                  placeholder="Contoh: Bench Press 4x8, DB Incline 3x10 atau Pace 5:20"
                  value={wTarget}
                  onChange={(e) => setWTarget(e.target.value)}
                  className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none border ${surfaceSoft}`}
                />
              </div>

              <button type="submit" className={`text-[13px] font-medium px-4 py-2.5 rounded-lg ${accentPrimary}`}>
                Tambahkan sesi latihan
              </button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-semibold text-[15px]">Rutinitas latihan ({workouts.length})</h4>
                <span className={`text-[12px] ${textMuted}`}>{workouts.filter(w => w.completed).length} selesai</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workouts.map((w) => {
                  const c = w.type === "gym" ? accentHex : "#2F8C82";
                  return (
                    <div
                      key={w.id}
                      className={`rounded-lg border overflow-hidden flex transition-all duration-200 ${surface} ${w.completed ? "opacity-60" : ""}`}
                    >
                      <div className="w-1.5" style={{ backgroundColor: c }} />
                      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-medium capitalize" style={{ color: c }}>{w.type}</span>
                              <span className={`text-[11px] ${textMuted}`}>{w.day}</span>
                            </div>
                            <button
                              onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))}
                              className={`p-1 ${textMuted} hover:text-rose-500 transition-colors duration-200`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h5 className={`font-medium text-[13.5px] leading-snug ${w.completed ? "line-through text-slate-500" : ""}`}>
                            {w.title}
                          </h5>
                          <p className={`text-[12px] ${textMuted}`}>{w.target}</p>
                        </div>

                        <button
                          onClick={() => setWorkouts(workouts.map(item => item.id === w.id ? { ...item, completed: !item.completed } : item))}
                          className={`w-full py-2 rounded-md text-[12px] font-medium transition-colors duration-200 flex items-center justify-center gap-1.5 border ${
                            w.completed ? "bg-emerald-600 text-white border-emerald-600" : `${surfaceSoft}`
                          }`}
                        >
                          {w.completed ? (<><Check className="w-3.5 h-3.5" /> Selesai</>) : "Check-in latihan"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
