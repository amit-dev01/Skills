/**
 * Smart Matching Engine for SkillBridge
 * Configurable weights:
 * - Skill compatibility: 50%
 * - Career-role relevance: 25%
 * - Location or remote compatibility: 15%
 * - Experience relevance: 10%
 *
 * Provides transparent compatibility scores and detailed reasoning.
 */

export const DEFAULT_WEIGHTS = {
  skills: 0.50,
  role: 0.25,
  location: 0.15,
  experience: 0.10,
};

// Normalize text for comparison
function normalize(str) {
  return (str || "").toLowerCase().trim();
}

/**
 * Calculates skill compatibility score (0 - 100)
 */
export function calculateSkillCompatibility(userSkills = [], targetSkills = []) {
  if (!targetSkills || targetSkills.length === 0) return { score: 75, matched: [], missing: [] };
  if (!userSkills || userSkills.length === 0) return { score: 20, matched: [], missing: targetSkills };

  const normalizedUserSkills = new Set(userSkills.map(normalize));
  const matched = [];
  const missing = [];

  for (const skill of targetSkills) {
    const norm = normalize(skill);
    // Check direct match or substring match (e.g., "React.js" matches "React")
    const isDirect = normalizedUserSkills.has(norm);
    const isFuzzy = Array.from(normalizedUserSkills).some(
      (us) => us.includes(norm) || norm.includes(us)
    );

    if (isDirect || isFuzzy) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // Calculate overlap ratio with a baseline minimum
  const overlapRatio = matched.length / targetSkills.length;
  // Scale between 30 (minimum basis for showing interest) and 98
  const score = Math.round(30 + overlapRatio * 68);

  return {
    score: Math.min(99, Math.max(25, score)),
    matched,
    missing,
  };
}

/**
 * Calculates career role relevance (0 - 100)
 */
export function calculateRoleRelevance(userRoles = [], hiringDomain = "", targetRole = "") {
  if (!userRoles || userRoles.length === 0) return { score: 65, matchedRole: "General Tech" };

  const targetText = `${normalize(hiringDomain)} ${normalize(targetRole)}`;
  let bestMatch = false;
  let matchedRoleName = "";

  for (const role of userRoles) {
    const normRole = normalize(role);
    const keywords = normRole.split(/[\s/-]+/);

    const matchCount = keywords.filter((kw) => kw.length > 2 && targetText.includes(kw)).length;
    if (matchCount > 0) {
      bestMatch = true;
      matchedRoleName = role;
      break;
    }
  }

  if (bestMatch) {
    return { score: 95, matchedRole: matchedRoleName };
  }

  // Partial compatibility for related tech roles
  if (
    targetText.includes("engineer") ||
    targetText.includes("developer") ||
    targetText.includes("software")
  ) {
    return { score: 75, matchedRole: "Software Engineering" };
  }

  return { score: 50, matchedRole: "Adjacent Domain" };
}

/**
 * Calculates location / remote compatibility (0 - 100)
 */
export function calculateLocationCompatibility(userLocation = "", remotePreference = "open", targetLocation = "", isRemoteAllowed = true) {
  const normUserLoc = normalize(userLocation);
  const normTargetLoc = normalize(targetLocation);

  // If recruiter/mentor supports Remote and user is open to remote
  if (isRemoteAllowed && (remotePreference.includes("remote") || remotePreference.includes("open"))) {
    return { score: 98, reason: "Worldwide / Remote Friendly" };
  }

  // Direct city or country match
  if (normUserLoc && normTargetLoc && (normTargetLoc.includes(normUserLoc) || normUserLoc.includes(normTargetLoc))) {
    return { score: 95, reason: "Direct Location Match" };
  }

  if (isRemoteAllowed) {
    return { score: 85, reason: "Remote Options Available" };
  }

  return { score: 45, reason: "Location Specific" };
}

/**
 * Calculates experience tier relevance (0 - 100)
 */
export function calculateExperienceRelevance(userExp = "Fresh Graduate", targetExp = "All Levels") {
  const normUser = normalize(userExp);
  const normTarget = normalize(targetExp);

  // If recruiter specifically hires early career/graduates/self-taught
  if (
    normTarget.includes("early") ||
    normTarget.includes("junior") ||
    normTarget.includes("graduate") ||
    normTarget.includes("all levels") ||
    normTarget.includes("student")
  ) {
    if (normUser.includes("student") || normUser.includes("graduate") || normUser.includes("junior") || normUser.includes("self-taught")) {
      return { score: 96, reason: "Actively seeking early-career / non-traditional candidates" };
    }
  }

  if (normTarget.includes("senior") || normTarget.includes("staff")) {
    if (normUser.includes("junior") || normUser.includes("graduate")) {
      return { score: 60, reason: "Primarily targets mid-to-senior levels, but offers open network" };
    }
  }

  return { score: 80, reason: "Flexible experience range" };
}

/**
 * Computes overall smart match score and breakdown
 */
export function computeMatchScore(candidateProfile, opportunity, customWeights = DEFAULT_WEIGHTS) {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  const skillAnalysis = calculateSkillCompatibility(
    candidateProfile.skills || [],
    opportunity.skills || opportunity.expertise || []
  );

  const roleAnalysis = calculateRoleRelevance(
    candidateProfile.preferredRoles || [],
    opportunity.hiringDomain || opportunity.role || "",
    opportunity.title || opportunity.designation || ""
  );

  const locationAnalysis = calculateLocationCompatibility(
    candidateProfile.location || "",
    candidateProfile.remotePreference || "open",
    opportunity.location || "",
    opportunity.isRemote !== false
  );

  const expAnalysis = calculateExperienceRelevance(
    candidateProfile.experienceLevel || "Fresh Graduate",
    opportunity.experienceLevel || opportunity.targetExperience || "All Levels"
  );

  const skillWeighted = skillAnalysis.score * weights.skills;
  const roleWeighted = roleAnalysis.score * weights.role;
  const locWeighted = locationAnalysis.score * weights.location;
  const expWeighted = expAnalysis.score * weights.experience;

  const totalScore = Math.min(99, Math.round(skillWeighted + roleWeighted + locWeighted + expWeighted));

  // Generate dynamic contextual reason
  let reason = "";
  if (skillAnalysis.matched.length > 0) {
    const matchedList = skillAnalysis.matched.slice(0, 3).join(", ");
    reason = `Matches your core skills in ${matchedList}. `;
  } else {
    reason = `Aligns with your career path in ${candidateProfile.preferredRoles?.[0] || "tech"}. `;
  }

  if (locationAnalysis.score > 90) {
    reason += "Offers remote-friendly collaboration. ";
  }
  if (expAnalysis.score > 90) {
    reason += "Welcomes emerging and self-taught talent.";
  }

  return {
    score: totalScore,
    reason: reason.trim(),
    breakdown: {
      skills: {
        score: skillAnalysis.score,
        weight: weights.skills,
        contribution: Math.round(skillWeighted),
        matched: skillAnalysis.matched,
        missing: skillAnalysis.missing,
      },
      role: {
        score: roleAnalysis.score,
        weight: weights.role,
        contribution: Math.round(roleWeighted),
        matchedRole: roleAnalysis.matchedRole,
      },
      location: {
        score: locationAnalysis.score,
        weight: weights.location,
        contribution: Math.round(locWeighted),
        reason: locationAnalysis.reason,
      },
      experience: {
        score: expAnalysis.score,
        weight: weights.experience,
        contribution: Math.round(expWeighted),
        reason: expAnalysis.reason,
      },
    },
    disclaimer:
      "Prototype compatibility estimate based on skill overlap, preferred roles, and location preferences — not a guarantee of hiring or mentor availability.",
  };
}
