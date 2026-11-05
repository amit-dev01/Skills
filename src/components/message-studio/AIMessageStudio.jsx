"use client";

import React, { useState, useEffect } from "react";
import {
  Wand2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Bot,
  BookmarkCheck,
  Send,
  UserCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export function AIMessageStudio() {
  const {
    userProfile,
    scoredRecruiters,
    scoredMentors,
    activeMessageDraft,
    setActiveMessageDraft,
    saveConnection,
    updateConnectionNotes,
    updateConnectionStatus,
  } = useApp();

  const { addToast } = useToast();

  const [messageType, setMessageType] = useState(
    activeMessageDraft.messageType || "recruiter_intro"
  );
  const [selectedRecipientId, setSelectedRecipientId] = useState(
    activeMessageDraft.recipient?.id || scoredRecruiters[0]?.id || ""
  );
  const [tone, setTone] = useState("warm");
  const [customNote, setCustomNote] = useState(activeMessageDraft.customNote || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedMessage, setGeneratedMessage] = useState({
    subject: "",
    body: "",
    callToAction: "",
    recommendedPlatform: "LinkedIn or Email",
    provider: "heuristic-engine",
  });

  // Combine recruiters and mentors for recipient selection
  const allRecipients = [
    ...scoredRecruiters.map((r) => ({ ...r, recipientCategory: "Recruiter" })),
    ...scoredMentors.map((m) => ({ ...m, recipientCategory: "Mentor" })),
  ];

  const currentRecipient =
    allRecipients.find((r) => r.id === selectedRecipientId) ||
    activeMessageDraft.recipient ||
    allRecipients[0];

  // Auto-sync messageType if recipient category changes
  useEffect(() => {
    if (activeMessageDraft.recipient) {
      setSelectedRecipientId(activeMessageDraft.recipient.id);
      if (activeMessageDraft.messageType) {
        setMessageType(activeMessageDraft.messageType);
      }
    }
  }, [activeMessageDraft]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageType,
          recipient: currentRecipient,
          userProfile,
          tone,
          customNote,
        }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        setGeneratedMessage({
          ...result.data,
          provider: result.provider,
          notice: result.notice,
        });
        addToast(
          result.provider === "gemini"
            ? "Generated message with Google Gemini API"
            : "Generated personalized message with SkillBridge AI Engine",
          "success"
        );
      } else {
        addToast("Error generating message", "error");
      }
    } catch (e) {
      addToast("Failed to reach message generation API", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Run on initial mount
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipientId, messageType, tone]);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      const fullText = `Subject: ${generatedMessage.subject}\n\n${generatedMessage.body}\n\n${generatedMessage.callToAction}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      addToast("Full message copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToTracker = () => {
    if (currentRecipient) {
      saveConnection(currentRecipient, currentRecipient.recipientCategory === "Mentor" ? "mentor" : "recruiter");
      const noteContent = `Drafted message on ${new Date().toLocaleDateString()}:\n\n${generatedMessage.subject}\n\n${generatedMessage.body}`;
      updateConnectionNotes(currentRecipient.id, noteContent);
      updateConnectionStatus(currentRecipient.id, "Message drafted");
      addToast(`Saved drafted message to ${currentRecipient.name}'s connection note!`, "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-400" />
                AI Message Studio
              </h2>
              <Badge variant="violet">
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by Gemini API
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Never send generic spam. Generate concise, high-converting, respectful outreach tailored to the recipient's hiring focus and your Skill Passport.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0d1527]/80 border border-slate-800/80 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
              1. Campaign Parameters
            </h3>

            {/* Outreach Type Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Outreach Intent
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "recruiter_intro", label: "Recruiter Intro" },
                  { id: "mentor_request", label: "Mentor Request" },
                  { id: "internship_inquiry", label: "Internship Inquiry" },
                  { id: "networking", label: "Peer Networking" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setMessageType(type.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                      messageType === type.id
                        ? "bg-purple-600/20 text-purple-300 border-purple-500/40 font-semibold"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Target Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Recipient
              </label>
              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-xs px-3 py-2.5 focus:outline-none focus:border-purple-500"
              >
                <optgroup label="Recommended Recruiters">
                  {scoredRecruiters.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.company} ({r.designation})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Recommended Mentors">
                  {scoredMentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.company} ({m.role})
                    </option>
                  ))}
                </optgroup>
              </select>

              {currentRecipient && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <img
                    src={currentRecipient.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-white truncate">
                      {currentRecipient.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentRecipient.designation || currentRecipient.role} at {currentRecipient.company}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tone of Voice
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "concise", label: "Concise" },
                  { id: "warm", label: "Warm" },
                  { id: "casual", label: "Enthusiastic" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                      tone === t.id
                        ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Angle / Key Focus */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Specific Hook or Project to Highlight (Optional)
              </label>
              <Textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Highlight my full-stack Next.js project and that I'm willing to complete a trial take-home."
                rows={2}
                className="text-xs"
              />
            </div>

            <Button
              variant="violet"
              size="md"
              isLoading={isGenerating}
              onClick={handleGenerate}
              className="w-full text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Regenerate Message</span>
            </Button>
          </div>
        </div>

        {/* Right Output Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1527]/90 border border-purple-500/30 backdrop-blur-md shadow-2xl relative flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">
                    Generated Personalized Outreach
                  </span>
                </div>

                <Badge variant="violet" className="text-[10px]">
                  {generatedMessage.recommendedPlatform}
                </Badge>
              </div>

              {/* Subject Line */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Subject Line
                </span>
                <input
                  type="text"
                  value={generatedMessage.subject}
                  onChange={(e) =>
                    setGeneratedMessage({ ...generatedMessage, subject: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-sm font-semibold text-blue-300 px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Message Body */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Message Body (Editable)
                </span>
                <textarea
                  value={generatedMessage.body}
                  onChange={(e) =>
                    setGeneratedMessage({ ...generatedMessage, body: e.target.value })
                  }
                  rows={8}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed p-3.5 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>

              {/* Call to action note */}
              {generatedMessage.callToAction && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300">
                  <span className="text-purple-400 font-semibold mr-1.5">Closing CTA:</span>
                  <span>{generatedMessage.callToAction}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                {generatedMessage.provider === "gemini" ? (
                  <span className="text-emerald-400 font-medium">✓ Generated via Google Gemini API</span>
                ) : (
                  <span>Dynamic Heuristic Fallback Engine active</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveToTracker}
                  className="text-xs"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save to Connection Notes</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Message</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
