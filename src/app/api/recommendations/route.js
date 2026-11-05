import { NextResponse } from "next/server";
import { computeMatchScore, DEFAULT_WEIGHTS } from "@/lib/matchingEngine";
import { SAMPLE_RECRUITERS } from "@/data/sampleRecruiters";
import { SAMPLE_MENTORS } from "@/data/sampleMentors";
import { SAMPLE_COMMUNITIES } from "@/data/sampleCommunities";
import { DEFAULT_USER_PROFILE } from "@/data/samplePersonas";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const profile = body.profile || DEFAULT_USER_PROFILE;
    const weights = body.weights || DEFAULT_WEIGHTS;

    // Score and rank recruiters
    const scoredRecruiters = SAMPLE_RECRUITERS.map((recruiter) => {
      const match = computeMatchScore(profile, recruiter, weights);
      return {
        ...recruiter,
        matchScore: match.score,
        matchReason: match.reason,
        matchBreakdown: match.breakdown,
        matchDisclaimer: match.disclaimer,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Score and rank mentors
    const scoredMentors = SAMPLE_MENTORS.map((mentor) => {
      const match = computeMatchScore(profile, mentor, weights);
      return {
        ...mentor,
        matchScore: match.score,
        matchReason: match.reason,
        matchBreakdown: match.breakdown,
        matchDisclaimer: match.disclaimer,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Filter or tag communities according to candidate's skills and status
    const recommendedCommunities = SAMPLE_COMMUNITIES.map((community) => {
      const userSkills = (profile.skills || []).map((s) => s.toLowerCase());
      const hasSkillOverlap = community.tags.some((tag) =>
        userSkills.some((us) => us.includes(tag.toLowerCase()) || tag.toLowerCase().includes(us))
      );
      return {
        ...community,
        isPriorityMatch: hasSkillOverlap || community.isBeginnerFriendly,
      };
    }).sort((a, b) => (b.isPriorityMatch ? 1 : 0) - (a.isPriorityMatch ? 1 : 0));

    return NextResponse.json({
      success: true,
      data: {
        recruiters: scoredRecruiters,
        mentors: scoredMentors,
        communities: recommendedCommunities,
        profileMeta: {
          analyzedSkillsCount: profile.skills?.length || 0,
          targetRole: profile.preferredRoles?.[0] || "General Tech",
        },
      },
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations." },
      { status: 500 }
    );
  }
}
