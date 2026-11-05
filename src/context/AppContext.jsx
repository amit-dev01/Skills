"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { SAMPLE_PERSONAS, DEFAULT_USER_PROFILE } from "@/data/samplePersonas";
import { SAMPLE_RECRUITERS } from "@/data/sampleRecruiters";
import { SAMPLE_MENTORS } from "@/data/sampleMentors";
import { SAMPLE_COMMUNITIES } from "@/data/sampleCommunities";
import { computeMatchScore, DEFAULT_WEIGHTS } from "@/lib/matchingEngine";

const AppContext = createContext(null);

const STORAGE_KEY_PROFILE = "skillbridge_user_profile_v1";
const STORAGE_KEY_CONNECTIONS = "skillbridge_saved_connections_v1";
const STORAGE_KEY_WEIGHTS = "skillbridge_matching_weights_v1";
const STORAGE_KEY_ACTIVITY = "skillbridge_recent_activity_v1";

export const DEFAULT_SAVED_CONNECTIONS = [
  {
    id: "conn-init-1",
    entityId: "rec-1",
    entityType: "recruiter",
    entityName: "Sarah Chen",
    entityCompany: "Vercel",
    entityRole: "Senior Technical Talent Partner",
    entityAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    status: "Saved",
    notes: "Vercel is looking for early-career Next.js builders. Crafting customized pitch emphasizing my deployed projects.",
    matchScore: 94,
    createdAt: "2026-11-04T12:00:00.000Z",
  },
  {
    id: "conn-init-2",
    entityId: "mentor-1",
    entityType: "mentor",
    entityName: "Arjun Nair",
    entityCompany: "Swiggy / Ex-Flipkart",
    entityRole: "Staff Frontend Architect",
    entityAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    status: "Message drafted",
    notes: "Shared my background coming from an off-campus engineering college; asked for portfolio code review.",
    matchScore: 96,
    createdAt: "2026-11-04T18:00:00.000Z",
  },
];

export function AppProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'passport', 'recruiters', 'mentors', 'communities', 'connections', 'message-studio', 'settings'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);
  const [activePersonaId, setActivePersonaId] = useState(DEFAULT_USER_PROFILE.id);

  // Matching Weights State
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  // Saved Connections State
  const [savedConnections, setSavedConnections] = useState(DEFAULT_SAVED_CONNECTIONS);

  // Message Studio Prefill State
  const [activeMessageDraft, setActiveMessageDraft] = useState({
    recipient: null,
    messageType: "recruiter_intro",
    customNote: "",
  });

  // Global Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Activity Log
  const [recentActivity, setRecentActivity] = useState([
    {
      id: "act-1",
      action: "Profile Initialized",
      detail: "Skill Passport calibrated for Full-Stack & Frontend opportunities",
      timestamp: "2026-11-05T06:00:00.000Z",
    },
    {
      id: "act-2",
      action: "Matching Engine Ran",
      detail: "Identified 8 recruiters and 6 mentors compatible with your skills",
      timestamp: "2026-11-05T03:00:00.000Z",
    },
  ]);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setUserProfile(parsed);
        setActivePersonaId(parsed.id || "custom");
      }

      const storedConnections = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
      if (storedConnections) {
        setSavedConnections(JSON.parse(storedConnections));
      } else {
        localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(DEFAULT_SAVED_CONNECTIONS));
      }

      const storedWeights = localStorage.getItem(STORAGE_KEY_WEIGHTS);
      if (storedWeights) {
        setWeights(JSON.parse(storedWeights));
      }

      const storedActivity = localStorage.getItem(STORAGE_KEY_ACTIVITY);
      if (storedActivity) {
        setRecentActivity(JSON.parse(storedActivity));
      }
    } catch (e) {
      console.warn("Could not load stored state:", e);
    }
  }, []);

  // Save changes to localStorage
  const persistProfile = useCallback((profile) => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const persistConnections = useCallback((conns) => {
    try {
      localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(conns));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const addActivity = useCallback((action, detail) => {
    setRecentActivity((prev) => {
      const updated = [
        {
          id: `act-${Date.now()}`,
          action,
          detail,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ];
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Calculate dynamic recommendations with match scores
  const scoredRecruiters = useMemo(() => {
    return SAMPLE_RECRUITERS.map((recruiter) => {
      const match = computeMatchScore(userProfile, recruiter, weights);
      return {
        ...recruiter,
        matchScore: match.score,
        matchReason: match.reason,
        matchBreakdown: match.breakdown,
        matchDisclaimer: match.disclaimer,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userProfile, weights]);

  const scoredMentors = useMemo(() => {
    return SAMPLE_MENTORS.map((mentor) => {
      const match = computeMatchScore(userProfile, mentor, weights);
      return {
        ...mentor,
        matchScore: match.score,
        matchReason: match.reason,
        matchBreakdown: match.breakdown,
        matchDisclaimer: match.disclaimer,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [userProfile, weights]);

  const communities = useMemo(() => {
    const userSkills = (userProfile.skills || []).map((s) => s.toLowerCase());
    return SAMPLE_COMMUNITIES.map((community) => {
      const hasSkillOverlap = community.tags.some((tag) =>
        userSkills.some((us) => us.includes(tag.toLowerCase()) || tag.toLowerCase().includes(us))
      );
      return {
        ...community,
        isPriorityMatch: hasSkillOverlap || community.isBeginnerFriendly,
      };
    }).sort((a, b) => (b.isPriorityMatch ? 1 : 0) - (a.isPriorityMatch ? 1 : 0));
  }, [userProfile.skills]);

  // Actions
  const saveConnection = useCallback((entity, type) => {
    const match = computeMatchScore(userProfile, entity, weights);
    setSavedConnections((prev) => {
      const existing = prev.find((c) => c.entityId === entity.id);
      if (existing) {
        // Toggle remove if already saved
        const filtered = prev.filter((c) => c.entityId !== entity.id);
        persistConnections(filtered);
        addActivity("Removed Connection", `Removed ${entity.name} from saved network`);
        return filtered;
      }

      const newConnection = {
        id: `conn-${entity.id}-${Date.now()}`,
        entityId: entity.id,
        entityType: type,
        entityName: entity.name,
        entityCompany: entity.company || entity.platform || "",
        entityRole: entity.designation || entity.role || entity.category || "",
        entityAvatar: entity.avatarUrl || "",
        status: "Saved",
        notes: "",
        matchScore: match.score,
        entityData: entity,
        createdAt: new Date().toISOString(),
      };

      const updated = [newConnection, ...prev];
      persistConnections(updated);
      addActivity("Saved Connection", `Added ${entity.name} (${entity.company || type}) to pipeline`);
      return updated;
    });
  }, [userProfile, weights, persistConnections, addActivity]);

  const updateConnectionStatus = useCallback((entityId, newStatus) => {
    setSavedConnections((prev) => {
      const updated = prev.map((conn) => {
        if (conn.entityId === entityId || conn.id === entityId) {
          return { ...conn, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return conn;
      });
      persistConnections(updated);
      addActivity("Status Updated", `Updated status to "${newStatus}" for connection`);
      return updated;
    });
  }, [persistConnections, addActivity]);

  const updateConnectionNotes = useCallback((entityId, notes) => {
    setSavedConnections((prev) => {
      const updated = prev.map((conn) => {
        if (conn.entityId === entityId || conn.id === entityId) {
          return { ...conn, notes, updatedAt: new Date().toISOString() };
        }
        return conn;
      });
      persistConnections(updated);
      return updated;
    });
  }, [persistConnections]);

  const removeConnection = useCallback((entityId) => {
    setSavedConnections((prev) => {
      const target = prev.find((c) => c.entityId === entityId || c.id === entityId);
      const filtered = prev.filter((c) => c.entityId !== entityId && c.id !== entityId);
      persistConnections(filtered);
      if (target) {
        addActivity("Connection Removed", `Removed ${target.entityName} from your tracker`);
      }
      return filtered;
    });
  }, [persistConnections, addActivity]);

  const isConnectionSaved = useCallback((entityId) => {
    return savedConnections.some((c) => c.entityId === entityId);
  }, [savedConnections]);

  const getConnection = useCallback((entityId) => {
    return savedConnections.find((c) => c.entityId === entityId || c.id === entityId);
  }, [savedConnections]);

  const updateUserProfile = useCallback((newProfileData) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...newProfileData };
      persistProfile(updated);
      addActivity("Skill Passport Updated", "Refreshed profile skills and target career goals");
      return updated;
    });
  }, [persistProfile, addActivity]);

  const switchPersona = useCallback((personaId) => {
    const target = SAMPLE_PERSONAS.find((p) => p.id === personaId);
    if (target) {
      setUserProfile(target);
      setActivePersonaId(personaId);
      persistProfile(target);
      addActivity("Switched Persona", `Demonstration profile switched to ${target.fullName}`);
    }
  }, [persistProfile, addActivity]);

  const updateMatchingWeights = useCallback((newWeights) => {
    setWeights(newWeights);
    try {
      localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(newWeights));
    } catch (e) {}
    addActivity("Matching Algorithm Re-weighted", "Customized compatibility factor preferences");
  }, [addActivity]);

  const openMessageStudioWithRecipient = useCallback((recipient, type = "recruiter_intro") => {
    setActiveMessageDraft({
      recipient,
      messageType: type,
      customNote: "",
    });
    setActiveTab("message-studio");
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        userProfile,
        activePersonaId,
        updateUserProfile,
        switchPersona,
        weights,
        updateMatchingWeights,
        savedConnections,
        saveConnection,
        updateConnectionStatus,
        updateConnectionNotes,
        removeConnection,
        isConnectionSaved,
        getConnection,
        scoredRecruiters,
        scoredMentors,
        communities,
        activeMessageDraft,
        setActiveMessageDraft,
        openMessageStudioWithRecipient,
        searchQuery,
        setSearchQuery,
        recentActivity,
        addActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
