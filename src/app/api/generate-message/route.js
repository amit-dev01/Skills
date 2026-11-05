import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      messageType = "recruiter_intro", // 'recruiter_intro' | 'mentor_request' | 'networking' | 'internship_inquiry'
      recipient = {},
      userProfile = {},
      tone = "warm", // 'concise' | 'warm' | 'casual'
      customNote = "",
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if Gemini API Key is available and valid
    if (apiKey && apiKey !== "your-gemini-api-key") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an expert career strategist and executive communications coach specializing in helping talented non-traditional developers, self-taught engineers, and students from smaller cities break into tech.

Task: Generate a short, natural, highly personalized, respectful outreach message.

Target Recipient Information:
- Name: ${recipient.name || "Hiring Manager"}
- Role / Designation: ${recipient.designation || recipient.role || "Technical Leader"}
- Company: ${recipient.company || "Your Company"}
- Hiring Domain / Focus: ${recipient.hiringDomain || recipient.expertise?.join(", ") || "Engineering"}
- Location: ${recipient.location || "Remote"}

Sender (User) Information:
- Name: ${userProfile.fullName || "Candidate"}
- Background / Education: ${userProfile.education || "Computer Science / Self-Taught"}
- Experience Level: ${userProfile.experienceLevel || "Fresh Graduate"}
- Top Skills: ${(userProfile.skills || []).slice(0, 5).join(", ")}
- Target Role: ${userProfile.preferredRoles?.[0] || "Software Engineer"}
- Portfolio: ${userProfile.portfolioUrl || "Available upon request"}
- GitHub: ${userProfile.githubUrl || "Available upon request"}
- Personal Bio: ${userProfile.bio || ""}

Message Details:
- Type: ${messageType.replace("_", " ").toUpperCase()}
- Tone: ${tone}
- Extra Specific Instruction from User: ${customNote || "Focus on my hands-on project work and eagerness to learn."}

Rules:
1. Keep the message under 130 words. Brevity and clarity are essential.
2. Tone must feel authentic, polite, and respectful — NEVER generic, sycophantic, or robotic.
3. Explicitly connect one of the sender's skills/projects to the recipient's domain.
4. If it's a mentor request, ask for something low-friction (e.g. 15 minutes of advice, async feedback on a project architecture, or one piece of advice on breaking in).
5. Provide both a compelling Subject Line and the Message Body.

Respond strictly with valid JSON with this format:
{
  "subject": "Concise compelling subject line",
  "body": "The text of the message",
  "callToAction": "Clear low-friction closing line",
  "recommendedPlatform": "LinkedIn or Email"
}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            success: true,
            provider: "gemini",
            data: parsed,
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to smart heuristic template generator:", geminiError.message);
        // Fallback to our intelligent template engine below
      }
    }

    // High quality offline fallback generator
    const generated = generateHeuristicMessage({
      messageType,
      recipient,
      userProfile,
      tone,
      customNote,
    });

    return NextResponse.json({
      success: true,
      provider: "heuristic-engine",
      notice: apiKey ? "Gemini rate limited/unavailable. Used intelligent template." : "Demo Mode: Add GEMINI_API_KEY in .env.local to enable live generative AI.",
      data: generated,
    });
  } catch (error) {
    console.error("Generate message error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate message." },
      { status: 500 }
    );
  }
}

function generateHeuristicMessage({ messageType, recipient, userProfile, tone, customNote }) {
  const senderName = userProfile.fullName || "Candidate";
  const recipientName = recipient.name ? recipient.name.split(" ")[0] : "Hiring Partner";
  const company = recipient.company || "your team";
  const role = recipient.designation || recipient.role || "Technical Lead";
  const topSkill = (userProfile.skills && userProfile.skills[0]) || "React";
  const secondSkill = (userProfile.skills && userProfile.skills[1]) || "Next.js";
  const targetRole = (userProfile.preferredRoles && userProfile.preferredRoles[0]) || "Software Engineer";
  const portfolio = userProfile.portfolioUrl || "my portfolio";

  let subject = "";
  let body = "";
  let callToAction = "";
  let recommendedPlatform = "LinkedIn or Email";

  if (messageType === "recruiter_intro") {
    subject = `${targetRole} Opportunity — ${senderName} (${topSkill} / ${secondSkill})`;
    if (tone === "concise") {
      body = `Hi ${recipientName},\n\nI noticed you lead talent for ${company}'s engineering teams. I'm a ${userProfile.experienceLevel?.toLowerCase() || "fresh graduate"} specializing in ${topSkill} and ${secondSkill}. I recently built production-ready applications with clean component architecture and REST APIs.\n\n${customNote ? `Note: ${customNote}\n\n` : ""}I'd love to know if ${company} is currently considering early-career or junior engineers for your upcoming pipeline.`;
      callToAction = `Would you have 5 minutes or a preferred link where I can submit my profile?`;
    } else {
      body = `Hi ${recipientName},\n\nHope your week is off to a great start! I've been following ${company}'s work and saw you partner with their engineering groups.\n\nI am an aspiring ${targetRole} with hands-on experience building in ${topSkill}, ${secondSkill}, and modern web tools. Coming from a non-traditional background, I focus deeply on proof-of-work: I've deployed full-stack projects showcasing clean code, accessibility, and performance.\n\n${customNote ? `${customNote}\n\n` : ""}I would welcome the opportunity to connect and stay on your radar for junior or associate engineering roles.`;
      callToAction = `I would be grateful to share a brief portfolio link or resume if you have an open pipeline!`;
    }
  } else if (messageType === "mentor_request") {
    subject = `Quick question on ${recipient.company || "engineering"} from an aspiring developer`;
    body = `Hi ${recipientName},\n\nI came across your profile and was really inspired by your journey as ${role} at ${company}. As someone working hard to break into the tech industry from an off-campus background, your trajectory is a great model for what's possible.\n\nI am currently focusing on ${topSkill} and ${secondSkill}, and I'm polishing my full-stack projects for entry-level roles.\n\n${customNote ? `${customNote}\n\n` : ""}I know your time is extremely valuable, but if you ever have 10-15 minutes for a virtual coffee chat, or even quick async feedback on how to stand out to engineering teams, it would mean the world to me.`;
    callToAction = `Either way, thank you for being a visible mentor in the developer community!`;
    recommendedPlatform = "LinkedIn InMail or Twitter/X";
  } else if (messageType === "internship_inquiry") {
    subject = `Early Career / Internship Inquiry — ${senderName} (${targetRole})`;
    body = `Hi ${recipientName},\n\nI'm reaching out because I greatly admire the engineering culture at ${company}. As a ${userProfile.education || "developer"} graduating with a strong foundation in ${topSkill} and ${secondSkill}, I am actively seeking an internship or associate role.\n\nI've spent the past year building real-world projects, focusing on responsive UI, database design, and clean Git collaboration.\n\n${customNote ? `${customNote}\n\n` : ""}Could you let me know if ${company} will be opening university or early-career cohorts this season?`;
    callToAction = `I have my GitHub and live project demos ready whenever convenient. Thank you!`;
  } else {
    // Networking
    subject = `Connecting from the ${topSkill} developer community`;
    body = `Hi ${recipientName},\n\nI came across your work in ${company} and wanted to reach out. I'm an engineer specializing in ${topSkill} and modern frontend systems. It's always exciting to connect with fellow builders who care about great software craft.\n\n${customNote ? `${customNote}\n\n` : ""}Looking forward to following your work and sharing insights on the tech landscape!`;
    callToAction = `Hope to stay connected here!`;
  }

  return {
    subject,
    body,
    callToAction,
    recommendedPlatform,
  };
}
