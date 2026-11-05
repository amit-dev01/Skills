import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillBridge — Your Network, Your Opportunity",
  description:
    "Empowering talented students, fresh graduates, and self-taught developers to discover matching recruiters, mentors, and tech communities.",
  keywords: [
    "SkillBridge",
    "Tech Mentors",
    "Recruiter Matching",
    "Developer Network",
    "Equal Opportunity",
    "Skill Passport",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
