"use client";

import React, { useMemo, useRef } from "react";
import { activitiesById } from "../lib/activities";
import { addMonths, getMonthId, getTodayDateString } from "../lib/date";
import { exportStateToFile, importStateFromFile } from "../lib/exportImport";
import { AppState } from "../lib/storage";

type MonthlySummaryProps = {
  state: AppState;
  month: string; // YYYY-MM
  onMonthChange: (next: string) => void;
  onImport: (next: AppState) => void;
};

const truncate = (value?: string, max = 60) => {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}…` : value;
};

const MonthlySummary = ({ state, month, onMonthChange, onImport }: MonthlySummaryProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const today = getTodayDateString();
  const currentMonth = getMonthId(new Date());
  const isCurrentMonth = currentMonth === month;

  const entries = useMemo(() => {
    return Object.values(state.entriesByDate)
      .filter((entry) => entry.date.startsWith(month))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [state.entriesByDate, month]);

  const doneCount = entries.filter((e) => e.done).length;
  const entryCount = entries.length;
  const totalMinutes = entries.reduce((sum, e) => sum + (e.minutes ?? 0), 0);
  const totalKm = entries.reduce((sum, e) => sum + (e.km ?? 0), 0);

  const activityStats = useMemo(() => {
    const acc: Record<string, { count: number; minutes: number; km: number }> = {};
    entries.forEach((entry) => {
      acc[entry.activityId] = acc[entry.activityId] || { count: 0, minutes: 0, km: 0 };
      acc[entry.activityId].count += 1;
      acc[entry.activityId].minutes += entry.minutes ?? 0;
      acc[entry.activityId].km += entry.km ?? 0;
    });
    return acc;
  }, [entries]);

  const [year, monthNumber] = month.split("-").map((v) => parseInt(v, 10));
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  const handleExport = () => exportStateToFile(state);

  const handleImport = async (file: File) => {
    try {
      const imported = await importStateFromFile(file);
      const ok = window.confirm("Biztosan felülírod az összes adatot az importált fájllal?");
      if (ok) onImport(imported);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ismeretlen hiba";
      window.alert(message);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleImport(file);
  };

  const goToToday = () => {
    const el = document.getElementById(`entry-${today}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="eyebrow">Havi összesítő</div>
          <h2>Havi összesítő ({month})</h2>
        </div>
        <div className="buttons">
          <button className="btn ghost" onClick={() => onMonthChange(addMonths(month, -1))}>
            ◀ Előző hónap
          </button>
          <button className="btn ghost" onClick={() => onMonthChange(addMonths(month, 1))}>
            Következő hónap ▶
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="metric">
          <div className="label">Elkészült napok</div>
          <div className="value">
            {doneCount} / {daysInMonth}
          </div>
          <div className="muted">Rekordos napok száma: {entryCount}</div>
        </div>
        <div className="metric">
          <div className="label">Összes perc</div>
          <div className="value">{totalMinutes}</div>
        </div>
        <div className="metric">
          <div className="label">Összes km</div>
          <div className="value">{totalKm}</div>
        </div>
      </div>

      <div className="subsection">
        <h3>Aktivitás bontás</h3>
        {Object.keys(activityStats).length === 0 ? (
          <p className="muted">Még nincs adat ehhez a hónaphoz.</p>
        ) : (
          <ul className="list">
            {Object.entries(activityStats).map(([activityId, info]) => (
              <li key={activityId} className="list-row">
                <div>
                  <div className="label">{activitiesById[activityId]?.name ?? "Ismeretlen"}</div>
                  <div className="muted">{info.count} alkalom</div>
                </div>
                <div className="muted">
                  {info.minutes} perc · {info.km} km
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="subsection">
        <div className="row space-between">
          <h3>Havi napló</h3>
          {isCurrentMonth && (
            <button className="btn ghost" onClick={goToToday}>
              Ugrás a mai napra
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <div className="empty">Még nincs bejegyzés ebben a hónapban.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Dátum</th>
                  <th>Dobás</th>
                  <th>Aktivitás</th>
                  <th>Kész?</th>
                  <th>Perc</th>
                  <th>Km</th>
                  <th>Megjegyzés</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const activity = activitiesById[entry.activityId];
                  return (
                    <tr key={entry.date} id={`entry-${entry.date}`}>
                      <td>{entry.date}</td>
                      <td>{entry.source === "manual" ? "—" : entry.roll}</td>
                      <td>{activity?.name ?? "Ismeretlen"}</td>
                      <td>{entry.done ? "igen" : "nem"}</td>
                      <td>{entry.minutes ?? ""}</td>
                      <td>{entry.km ?? ""}</td>
                      <td>{truncate(entry.note)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </section>
  );
};

export default MonthlySummary;
