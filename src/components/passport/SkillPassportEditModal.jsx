"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import { Plus, X, Sparkles, Check } from "lucide-react";

export function SkillPassportEditModal({ isOpen, onClose }) {
  const { userProfile, updateUserProfile } = useApp();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || "",
    headline: userProfile.headline || "",
    avatarUrl: userProfile.avatarUrl || "",
    location: userProfile.location || "",
    remotePreference: userProfile.remotePreference || "Open to Remote & Hybrid",
    education: userProfile.education || "",
    experienceLevel: userProfile.experienceLevel || "Fresh Graduate",
    portfolioUrl: userProfile.portfolioUrl || "",
    githubUrl: userProfile.githubUrl || "",
    linkedinUrl: userProfile.linkedinUrl || "",
    bio: userProfile.bio || "",
    skills: [...(userProfile.skills || [])],
    preferredRoles: [...(userProfile.preferredRoles || [])],
    careerInterests: [...(userProfile.careerInterests || [])],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.trim() && !formData.preferredRoles.includes(newRole.trim())) {
      setFormData((prev) => ({
        ...prev,
        preferredRoles: [...prev.preferredRoles, newRole.trim()],
      }));
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    setFormData((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles.filter((r) => r !== roleToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculate new completion score
    let score = 50;
    if (formData.fullName && formData.bio) score += 15;
    if (formData.skills.length >= 4) score += 15;
    if (formData.portfolioUrl || formData.githubUrl) score += 10;
    if (formData.education && formData.location) score += 10;

    updateUserProfile({
      ...formData,
      completionPercentage: Math.min(100, score),
    });

    addToast("Skill Passport updated successfully!", "success");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Skill Passport"
      description="Update your credentials, portfolio links, and technical competencies."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Full Name *
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Priya Sharma"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Headline
            </label>
            <Input
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="e.g. Aspiring Full-Stack & Frontend Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Location *
            </label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Indore, India"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Remote Preference
            </label>
            <select
              value={formData.remotePreference}
              onChange={(e) => setFormData({ ...formData, remotePreference: e.target.value })}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
            >
              <option value="Open to Remote & Hybrid">Open to Remote & Hybrid</option>
              <option value="Remote Only">Remote Only</option>
              <option value="On-site / Hybrid">On-site / Hybrid</option>
              <option value="Willing to Relocate">Willing to Relocate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Education / Institution
            </label>
            <Input
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              placeholder="e.g. B.Tech Computer Science, RGPV (2025)"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 text-sm px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
            >
              <option value="Student">Student (Undergraduate / High School)</option>
              <option value="Fresh Graduate">Fresh Graduate (Class of 2024-2025)</option>
              <option value="Self-Taught / Career Switcher">Self-Taught / Career Switcher</option>
              <option value="Junior Engineer (0-2 yrs)">Junior Engineer (0-2 yrs)</option>
              <option value="Mid-Level Engineer (2-4 yrs)">Mid-Level Engineer (2-4 yrs)</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Short Professional Bio / Story
          </label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Introduce your background, why you love building, and what unique perspective you bring..."
            rows={3}
          />
        </div>

        {/* Skills Management */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Technical Skills (Active: {formData.skills.length})
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Type a skill (e.g. Next.js, Docker) and press Add"
              className="text-xs"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddSkill}
              className="shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800 max-h-24 overflow-y-auto">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-950/70 text-blue-300 border border-blue-500/30"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Roles */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Preferred Job Roles
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Junior Frontend Engineer"
              className="text-xs"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddRole}
              className="shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
            {formData.preferredRoles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-purple-950/70 text-purple-300 border border-purple-500/30"
              >
                <span>{role}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Portfolio URL
            </label>
            <Input
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              GitHub URL
            </label>
            <Input
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              LinkedIn URL
            </label>
            <Input
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            <Check className="w-4 h-4" />
            <span>Save Skill Passport</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
