"use client";

import React, { Suspense } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { ToastProvider } from "@/context/ToastContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { SkillPassportView } from "@/components/passport/SkillPassportView";
import { RecruiterFinder } from "@/components/recruiters/RecruiterFinder";
import { MentorFinder } from "@/components/mentors/MentorFinder";
import { CommunityDiscovery } from "@/components/communities/CommunityDiscovery";
import { ConnectionsManager } from "@/components/connections/ConnectionsManager";
import { AIMessageStudio } from "@/components/message-studio/AIMessageStudio";
import { SettingsView } from "@/components/settings/SettingsView";
import { EditorialLanding } from "@/components/landing/EditorialLanding";

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
      {activeTab === "overview" && <DashboardOverview />}
      {activeTab === "passport" && <SkillPassportView />}
      {activeTab === "recruiters" && <RecruiterFinder />}
      {activeTab === "mentors" && <MentorFinder />}
      {activeTab === "communities" && <CommunityDiscovery />}
      {activeTab === "connections" && <ConnectionsManager />}
      {activeTab === "message-studio" && <AIMessageStudio />}
      {activeTab === "settings" && <SettingsView />}
    </main>
  );
}

function AppShell() {
  const { viewMode, setViewMode, setActiveTab } = useApp();

  if (viewMode === "landing") {
    return (
      <EditorialLanding
        onEnterApp={() => setViewMode("app")}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setViewMode("app");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070b14] bg-gradient-navy text-slate-100">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Right Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <MainContent />
      </div>

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <AppProvider>
        <Suspense fallback={<div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400 text-sm font-body">Loading SkillBridge...</div>}>
          <AppShell />
        </Suspense>
      </AppProvider>
    </ToastProvider>
  );
}
