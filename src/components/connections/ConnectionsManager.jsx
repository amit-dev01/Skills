"use client";

import React, { useState, useMemo } from "react";
import {
  BookmarkCheck,
  Search,
  Filter,
  FileText,
  Trash2,
  Send,
  Download,
  Plus,
  Briefcase,
  GraduationCap,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConnectionNoteModal } from "./ConnectionNoteModal";
import { formatRelativeTime } from "@/lib/utils";

const STATUS_OPTIONS = ["Saved", "Message drafted", "Contacted", "Responded"];

export function ConnectionsManager() {
  const {
    savedConnections,
    updateConnectionStatus,
    updateConnectionNotes,
    removeConnection,
    openMessageStudioWithRecipient,
    setActiveTab,
  } = useApp();

  const { addToast } = useToast();

  const [selectedType, setSelectedType] = useState("all"); // 'all' | 'recruiter' | 'mentor' | 'community'
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [activeNoteModalConn, setActiveNoteModalConn] = useState(null);

  // Pipeline stage counts
  const stageCounts = useMemo(() => {
    return {
      Saved: savedConnections.filter((c) => c.status === "Saved").length,
      "Message drafted": savedConnections.filter((c) => c.status === "Message drafted").length,
      Contacted: savedConnections.filter((c) => c.status === "Contacted").length,
      Responded: savedConnections.filter((c) => c.status === "Responded").length,
    };
  }, [savedConnections]);

  const filteredConnections = useMemo(() => {
    return savedConnections.filter((conn) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = conn.entityName?.toLowerCase().includes(q);
        const matchesCompany = conn.entityCompany?.toLowerCase().includes(q);
        const matchesNotes = conn.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesNotes) return false;
      }

      if (selectedType !== "all" && conn.entityType !== selectedType) {
        return false;
      }

      if (selectedStatus !== "all" && conn.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [savedConnections, search, selectedType, selectedStatus]);

  const handleExportCSV = () => {
    if (savedConnections.length === 0) {
      addToast("No connections to export", "error");
      return;
    }

    const headers = ["Name", "Type", "Company", "Role", "Status", "Match Score", "Notes", "Date"];
    const rows = savedConnections.map((c) => [
      `"${c.entityName}"`,
      `"${c.entityType}"`,
      `"${c.entityCompany || ""}"`,
      `"${c.entityRole || ""}"`,
      `"${c.status}"`,
      c.matchScore || "",
      `"${(c.notes || "").replace(/"/g, '""')}"`,
      `"${c.createdAt || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillbridge_connections_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Exported connections to CSV successfully!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            My Connections Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personal outreach CRM. Track conversations, store private notes, and manage stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("recruiters")}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Discover More</span>
          </Button>
        </div>
      </div>

      {/* Pipeline Stage Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATUS_OPTIONS.map((status) => {
          const isSelected = selectedStatus === status;
          const count = stageCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(isSelected ? "all" : status)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{status}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    status === "Responded"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : status === "Contacted"
                      ? "bg-blue-500/20 text-blue-300"
                      : status === "Message drafted"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className="text-xl font-bold text-white mt-1.5">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Type selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: "All Types" },
            { id: "recruiter", label: "Recruiters", icon: Briefcase },
            { id: "mentor", label: "Mentors", icon: GraduationCap },
            { id: "community", label: "Communities", icon: Users },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedType === type.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Local Search */}
        <div className="w-full sm:w-56">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved contacts..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Connections List */}
      {filteredConnections.length > 0 ? (
        <div className="space-y-3">
          {filteredConnections.map((conn) => (
            <div
              key={conn.id || conn.entityId}
              className="p-4 sm:p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 hover:border-slate-700 backdrop-blur-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Entity Info */}
              <div className="flex items-start gap-4">
                {conn.entityAvatar ? (
                  <img
                    src={conn.entityAvatar}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">{conn.entityName}</h3>
                    <Badge
                      variant={
                        conn.entityType === "recruiter"
                          ? "primary"
                          : conn.entityType === "mentor"
                          ? "violet"
                          : "cyan"
                      }
                      className="text-[10px]"
                    >
                      {conn.entityType}
                    </Badge>

                    {conn.matchScore && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {conn.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {conn.entityRole} • <strong className="text-slate-300">{conn.entityCompany}</strong>
                  </p>

                  {/* Notes Snippet */}
                  {conn.notes ? (
                    <div className="mt-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 max-w-xl">
                      <span className="text-slate-500 font-semibold block text-[10px]">Notes:</span>
                      <p className="line-clamp-2 italic">{conn.notes}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1 italic">No personal notes yet.</p>
                  )}
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center shrink-0">
                {/* Status Dropdown */}
                <select
                  value={conn.status}
                  onChange={(e) =>
                    updateConnectionStatus(conn.entityId || conn.id, e.target.value)
                  }
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                    conn.status === "Responded"
                      ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                      : conn.status === "Contacted"
                      ? "bg-blue-950/70 text-blue-300 border-blue-500/40"
                      : conn.status === "Message drafted"
                      ? "bg-purple-950/70 text-purple-300 border-purple-500/40"
                      : "bg-amber-950/70 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status} className="bg-slate-900 text-slate-200">
                      {status}
                    </option>
                  ))}
                </select>

                {/* Edit Notes */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveNoteModalConn(conn)}
                  className="text-xs"
                  title="Add or edit notes"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes</span>
                </Button>

                {/* Open in Message Studio if recruiter or mentor */}
                {conn.entityType !== "community" && (
                  <Button
                    variant="violet"
                    size="sm"
                    onClick={() =>
                      openMessageStudioWithRecipient(
                        conn.entityData || {
                          id: conn.entityId,
                          name: conn.entityName,
                          company: conn.entityCompany,
                          designation: conn.entityRole,
                          role: conn.entityRole,
                          avatarUrl: conn.entityAvatar,
                        },
                        conn.entityType === "mentor" ? "mentor_request" : "recruiter_intro"
                      )
                    }
                    className="text-xs"
                    title="Generate Outreach Message"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Outreach</span>
                  </Button>
                )}

                {/* Remove */}
                <button
                  onClick={() => removeConnection(conn.entityId || conn.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Remove from pipeline"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#0d1527]/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No saved connections found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Save recruiters, mentors, and communities to manage your networking pipeline and store notes.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("recruiters")}
              className="text-xs"
            >
              Browse Recruiters
            </Button>
            <Button
              variant="violet"
              size="sm"
              onClick={() => setActiveTab("mentors")}
              className="text-xs"
            >
              Browse Mentors
            </Button>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      <ConnectionNoteModal
        isOpen={Boolean(activeNoteModalConn)}
        onClose={() => setActiveNoteModalConn(null)}
        connection={activeNoteModalConn}
        onSaveNote={updateConnectionNotes}
      />
    </div>
  );
}
