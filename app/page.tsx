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

  // Style Variables (Soft Modern Palette)
  const containerBg = isDark ? "bg-[#090d16] text-slate-200" : "bg-[#f8fafc] text-slate-700";
  const cardBg = isDark ? "bg-[#111726] border-slate-800/80 shadow-sm" : "bg-white border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)]";
  const subtleCard = isDark ? "bg-[#182136] border-slate-800" : "bg-slate-50 border-slate-200/80";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const accentPrimary = "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm";

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${containerBg} pb-24`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-slate-200/60 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Portal Mahasiswa & Rutinitas</h1>
            <p className={`text-xs mt-1 ${textMuted}`}>
              Teknologi Informasi — Rombel J &bull; 21 SKS &bull; Terhubung Otomatis
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Navigasi Tab */}
            <div className={`flex p-1 rounded-xl border ${cardBg}`}>
              {(["kuliah", "tugas", "olahraga"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? accentPrimary
                      : `${textMuted} hover:text-slate-900 dark:hover:text-slate-100`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl border transition-all ${cardBg} ${
                isDark ? "text-amber-300 hover:border-slate-700" : "text-slate-600 hover:border-slate-300"
              }`}
              title="Ganti Tema"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* ================= TAB 1: KULIAH ================= */}
        {activeTab === "kuliah" && (
          <div className="space-y-6">
            
            {/* Live Clock & Auto Day Detection Banner */}
            <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardBg}`}>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Hari Ini: <span className="font-bold">{todayName || "Mendeteksi..."}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">{clock.date}</h2>
                <div className={`text-xs mt-1.5 ${textMuted}`}>
  {nextClassToday?.status === "ongoing" && nextClassToday.item && (
    <span className="text-emerald-500 font-semibold">
      Sedang berlangsung: {nextClassToday.item.name} ({nextClassToday.item.startTime} - {nextClassToday.item.endTime})
    </span>
  )}
  {nextClassToday?.status === "upcoming" && nextClassToday.item && (
    <span>
      Kuliah berikutnya: <strong className="text-indigo-500 font-semibold">{nextClassToday.item.name}</strong> ({nextClassToday.item.startTime}) &bull; {Math.floor((nextClassToday.diffMin ?? 0) / 60)}j {(nextClassToday.diffMin ?? 0) % 60}m lagi
    </span>
  )}
  {nextClassToday?.status === "finished" && (
    <span>Seluruh perkuliahan hari ini telah selesai. Selamat beristirahat!</span>
  )}
  {!nextClassToday && (
    <span>Tidak ada jadwal perkuliahan pada hari ini.</span>
  )}
</div>
              </div>

              <div className={`sm:text-right px-4 py-2.5 rounded-xl border ${subtleCard}`}>
                <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
                  {clock.time}
                </div>
                <div className={`text-[10px] font-medium ${textMuted}`}>WIB (Realtime)</div>
              </div>
            </div>

            {/* Tombol Opsi Tampilan */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tampilan:</span>
                <div className={`flex p-0.5 rounded-lg border ${cardBg}`}>
                  <button
                    onClick={() => setViewMode("perHari")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                      viewMode === "perHari" ? "bg-indigo-600 text-white" : `${textMuted} hover:text-slate-900 dark:hover:text-slate-200`
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Per Hari
                  </button>
                  <button
                    onClick={() => setViewMode("semua")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                      viewMode === "semua" ? "bg-indigo-600 text-white" : `${textMuted} hover:text-slate-900 dark:hover:text-slate-200`
                    }`}
                  >
                    <CalendarRange className="w-3.5 h-3.5" /> Semua Jadwal (Terurut)
                  </button>
                </div>
              </div>
            </div>

            {/* Mode 1: Tampilan Per Hari */}
            {viewMode === "perHari" && (
              <div className="space-y-4">
                {/* Selector Hari */}
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
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                            : `${cardBg} ${textMuted} hover:border-slate-300 dark:hover:border-slate-700`
                        }`}
                      >
                        {isToday && (
                          <span className={`absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.2 rounded-md font-extrabold uppercase ${
                            isSelected ? "bg-white/20 text-white" : "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                          }`}>
                            Hari Ini
                          </span>
                        )}
                        <div className="font-semibold text-xs sm:text-sm">{day}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? "text-indigo-100" : textMuted}`}>
                          {count} matkul
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* List Card Kuliah Hari Terpilih */}
                <div className="space-y-3 pt-1">
                  {currentDaySchedules.length === 0 ? (
                    <div className={`p-8 text-center rounded-2xl border border-dashed text-xs ${cardBg} ${textMuted}`}>
                      Tidak ada perkuliahan pada hari {selectedDay}.
                    </div>
                  ) : (
                    currentDaySchedules.map((item) => (
                      <div
                        key={item.no}
                        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center gap-4 ${cardBg} hover:border-indigo-500/40`}
                      >
                        {/* Waktu */}
                        <div className="sm:w-28 shrink-0 sm:border-r border-slate-200 dark:border-slate-800 sm:pr-4">
                          <div className="text-base font-bold tracking-tight">{item.startTime}</div>
                          <div className={`text-xs ${textMuted}`}>{item.endTime}</div>
                          <span className="inline-block text-[10px] font-medium mt-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.duration}
                          </span>
                        </div>

                        {/* Isi Matkul */}
                        <div className="flex-1 space-y-2">
                          <h4 className="font-bold text-base leading-snug">
                            {item.name}
                          </h4>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
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
                              <User className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.lecturer}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                              <span>{item.room}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Mode 2: Tampilan Semua Jadwal Terurut */}
            {viewMode === "semua" && (
              <div className="space-y-6">
                {daysList.map((day) => {
                  const dayItems = schedulesData.filter(s => s.day === day);
                  if (dayItems.length === 0) return null;

                  return (
                    <div key={day} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        <h3 className="font-bold text-sm tracking-tight uppercase">
                          {day}
                        </h3>
                        <span className={`text-xs ${textMuted}`}>({dayItems.length} matkul)</span>
                      </div>

                      <div className="space-y-2.5">
                        {dayItems.map((item) => (
                          <div
                            key={item.no}
                            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cardBg}`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                  {item.startTime} - {item.endTime}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${subtleCard}`}>
                                  {item.type} ({item.sks} SKS)
                                </span>
                              </div>
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              <p className={`text-xs ${textMuted}`}>{item.room}</p>
                            </div>

                            <div className={`text-xs sm:text-right ${textMuted}`}>
                              <div>{item.lecturer}</div>
                              <span className="text-[10px] font-mono">{item.code} &bull; {item.rombel}</span>
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
            
            {/* Form Input Tugas */}
            <form onSubmit={handleAddAssignment} className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" /> Tambah Tugas & Catatan Kuliah
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Mata Kuliah Terkait</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                  >
                    {schedulesData.map((s) => (
                      <option key={s.no} value={s.name} className="bg-slate-900 text-white">
                        {s.name} ({s.day})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Kategori</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType("individu")}
                      className={`text-xs py-2 rounded-xl font-semibold border transition ${
                        newType === "individu" 
                          ? "bg-indigo-600 text-white border-indigo-600" 
                          : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      Individu
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType("kelompok")}
                      className={`text-xs py-2 rounded-xl font-semibold border transition ${
                        newType === "kelompok" 
                          ? "bg-purple-600 text-white border-purple-600" 
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
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Rincian Tugas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Modul praktikum bab 2..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Batas Waktu</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition ${accentPrimary}`}
              >
                Simpan Penugasan
              </button>
            </form>

            {/* List Tugas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Daftar Catatan & Tugas ({assignments.length})</h4>
                <div className="flex gap-1">
                  {(["semua", "individu", "kelompok"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`text-[11px] capitalize px-2.5 py-1 rounded-lg font-semibold border transition ${
                        filterType === t 
                          ? "bg-indigo-600 text-white border-indigo-600" 
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
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition ${cardBg} ${
                      task.completed ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAssignments(assignments.map(a => a.id === task.id ? { ...a, completed: !a.completed } : a))}
                        className="text-slate-400 hover:text-indigo-500 transition"
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className={`text-sm font-semibold ${task.completed ? "line-through text-slate-500" : ""}`}>
                          {task.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                          <span className={`px-2 py-0.5 rounded font-medium ${subtleCard}`}>{task.courseName}</span>
                          <span className={textMuted}>Hari: {task.day}</span>
                          <span className={`px-2 py-0.5 rounded font-semibold uppercase text-[10px] ${
                            task.type === "kelompok" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          }`}>
                            {task.type}
                          </span>
                          <span className="text-rose-500 font-medium">Batas: {task.deadline}</span>
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
            
            {/* Form Tambah Olahraga */}
            <form onSubmit={handleAddWorkout} className={`p-6 rounded-2xl border space-y-4 ${cardBg}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-indigo-500" /> Kustom Sesi Olahraga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Jenis Kegiatan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWType("gym")}
                      className={`text-xs py-2 rounded-xl font-semibold border transition ${
                        wType === "gym" ? "bg-indigo-600 text-white border-indigo-600" : `${subtleCard} ${textMuted}`
                      }`}
                    >
                      GYM
                    </button>
                    <button
                      type="button"
                      onClick={() => setWType("lari")}
                      className={`text-xs py-2 rounded-xl font-semibold border transition ${
                        wType === "lari" ? "bg-teal-600 text-white border-teal-600" : `${subtleCard} ${textMuted}`
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
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                  >
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${textMuted}`}>Fokus Sesi</label>
                  <input
                    type="text"
                    placeholder="Misal: Dada & Trisep / 5K Tempo"
                    value={wTitle}
                    onChange={(e) => setWTitle(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
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
                  className={`w-full rounded-xl px-3 py-2 text-xs outline-none border ${subtleCard}`}
                />
              </div>

              <button
                type="submit"
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition ${accentPrimary}`}
              >
                Tambahkan Sesi Latihan
              </button>
            </form>

            {/* List Jadwal Olahraga */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">Rutinitas Latihan ({workouts.length})</h4>
                <span className={`text-xs ${textMuted}`}>
                  {workouts.filter(w => w.completed).length} selesai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${cardBg} ${
                      w.completed ? "border-emerald-500/30 opacity-70" : ""
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            w.type === "gym" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300"
                          }`}>
                            {w.type}
                          </span>
                          <span className={`text-xs font-semibold ${textMuted}`}>{w.day}</span>
                        </div>

                        <button
                          onClick={() => setWorkouts(workouts.filter(item => item.id !== w.id))}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h5 className={`font-semibold text-sm leading-snug ${w.completed ? "line-through text-slate-500" : ""}`}>
                        {w.title}
                      </h5>
                      <p className={`text-xs ${textMuted}`}>{w.target}</p>
                    </div>

                    <button
                      onClick={() => setWorkouts(workouts.map(item => item.id === w.id ? { ...item, completed: !item.completed } : item))}
                      className={`w-full py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                        w.completed 
                          ? "bg-emerald-600 text-white" 
                          : `${subtleCard} hover:border-slate-400 dark:hover:border-slate-700`
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