import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not defined. Falling back to local AI heuristics.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Helper for clean JSON parsing from Gemini text
function cleanAndParseJSON(text: string) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse JSON from Gemini:', text);
    throw new Error('Invalid JSON format returned from AI model');
  }
}

// 1. Profile Analysis & Career Matching
app.post('/api/analyze-profile', async (req, res) => {
  try {
    const { userProfile, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'Using benchmark matching mode.'
      });
    }

    const currentTarget = targetRole || userProfile.targetRole || 'Full Stack Developer';
    const prompt = `You are an expert AI Career Coach and Tech Talent Evaluator.
Analyze the following developer profile and calculate realistic career matches and a detailed skill gap analysis for the target role: "${currentTarget}".

User Profile:
${JSON.stringify(userProfile, null, 2)}

Return a JSON object with EXACTLY this structure:
{
  "matches": [
    {
      "roleId": "string-id",
      "roleTitle": "Role Title (e.g. Full Stack Developer, Frontend Developer, Backend Developer, AI/ML Engineer, DevOps Engineer, UI/UX Designer, Data Analyst, Cloud Engineer, Mobile Developer)",
      "category": "Category name",
      "matchPercentage": number (0-100),
      "readinessScore": number (0-100),
      "demandLevel": "High" | "Very High" | "Extreme" | "Moderate",
      "salaryRange": { "min": number, "max": number, "currency": "$" },
      "keySkillsPresent": ["skill1", "skill2"],
      "keySkillsMissing": ["skill1", "skill2"],
      "rationale": "Clear 2-sentence explanation of why this user fits or where they need work.",
      "careerGrowthOutlook": "Short outlook phrase",
      "recommendedForUser": boolean
    }
  ],
  "skillGap": {
    "targetRole": "${currentTarget}",
    "currentMatchPercent": number (0-100),
    "readinessScore": number (0-100),
    "missingCoreSkills": [
      {
        "name": "Skill / Tech Name",
        "importance": "Critical" | "Important" | "Optional",
        "reason": "Why this technology or framework is essential for this role.",
        "category": "frontend" | "backend" | "database" | "cloud" | "ai" | "devops" | "mobile" | "soft" | "tools",
        "estimatedHoursToMaster": number
      }
    ],
    "missingSoftSkills": ["Soft skill 1", "Soft skill 2"],
    "strengthsToLeverage": ["Strength 1", "Strength 2"],
    "topActionableAdvice": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"]
  }
}

Provide realistic, encouraging, and data-backed evaluations. Ensure top 6 roles are evaluated. Response must be strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsedData = cleanAndParseJSON(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/analyze-profile:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze profile' });
  }
});

// 2. Generate Custom Roadmap
app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { userProfile, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const role = targetRole || userProfile.targetRole || 'Full Stack Developer';
    const prompt = `You are an elite Senior Engineering Mentor.
Generate a structured 4-phase, 12-week personalized learning roadmap for a developer targeting the role: "${role}".

User's Existing Skills:
${JSON.stringify(userProfile.skills.map((s: any) => `${s.name} (Level ${s.level}/5)`))}

User's Experience Level: ${userProfile.title} / ${userProfile.experienceYears} year(s)

Generate a JSON object matching this structure:
{
  "targetRole": "${role}",
  "totalWeeks": 12,
  "overallProgressPercentage": 25,
  "lastAiUpdate": "${new Date().toISOString()}",
  "milestones": [
    {
      "id": "m1",
      "phaseNumber": 1,
      "phaseName": "Phase 1: Foundations & Quick-Wins",
      "title": "Short descriptive milestone title",
      "description": "What the user will master in this phase and why.",
      "estimatedWeeks": 3,
      "status": "not_started",
      "skillsToGain": ["Skill 1", "Skill 2"],
      "courses": [
        { "title": "Resource Name", "platform": "Platform Name (e.g. FreeCodeCamp, YouTube, Docs)", "link": "https://example.com", "free": true, "type": "Interactive" }
      ],
      "handsonProject": {
        "title": "Hands-on Project Name",
        "description": "Short project description.",
        "keyDeliverables": ["Deliverable 1", "Deliverable 2"]
      },
      "codingChallenges": ["Challenge prompt 1", "Challenge prompt 2"],
      "certRecommendations": ["Optional Cert Title"]
    },
    ... (generate exactly 4 structured phases for milestones m1, m2, m3, m4)
  ]
}

Make sure resources are high quality (prefer free, real platforms like FreeCodeCamp, MDN, YouTube, Official Docs). Output strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsedData = cleanAndParseJSON(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/generate-roadmap:', error);
    res.status(500).json({ error: error.message || 'Failed to generate roadmap' });
  }
});

// 3. Portfolio Project Recommendations
app.post('/api/project-recommendations', async (req, res) => {
  try {
    const { userProfile, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const role = targetRole || userProfile.targetRole || 'Full Stack Developer';
    const prompt = `Recommend 3 distinct, industry-grade portfolio projects for a developer aiming to become a "${role}".
User's existing skills: ${JSON.stringify(userProfile.skills.map((s: any) => s.name))}

Return a JSON array of 3 projects:
[
  {
    "id": "proj-1",
    "title": "Project Name",
    "targetRole": "${role}",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "description": "Detailed 2-3 sentence overview of what the app does.",
    "techStack": ["Tech1", "Tech2", "Tech3"],
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"],
    "portfolioImpactReason": "Why hiring managers will be impressed by this project.",
    "resumeBulletSuggestions": [
      "Action verb + engineered/built + technologies + quantitative impact/outcome.",
      "Action verb + integrated/architected + technical feature + outcome."
    ]
  }
]

Make the project ideas practical, modern, and high impact. Output strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const parsed = cleanAndParseJSON(response.text || '[]');
    return res.json({ projects: parsed });
  } catch (error: any) {
    console.error('Error in /api/project-recommendations:', error);
    res.status(500).json({ error: error.message || 'Failed to generate project recommendations' });
  }
});

// 4. Resume & Profile Intelligence Analyzer
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const ai = getGeminiClient();

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid resume content or text.' });
    }

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const role = targetRole || 'Full Stack Developer';
    const prompt = `You are a Technical Recruiter and ATS Expert.
Analyze the following resume text specifically for the target job position: "${role}".

Resume Text:
"""
${resumeText}
"""

Return a JSON object with EXACTLY this structure:
{
  "overallScore": number (0-100, general formatting, clarity, impact),
  "matchScoreForTargetRole": number (0-100, skill coverage for ${role}),
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weakPoints": ["Weak point 1", "Weak point 2"],
  "extractedSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "bulletPointEnhancements": [
    {
      "original": "Weak or generic bullet point from resume or standard description",
      "improved": "High impact STAR method bullet point with metric placeholders and active verbs",
      "rationale": "Why this change improves technical impact."
    }
  ],
  "actionPlan": ["Step 1 to improve resume", "Step 2 to improve resume", "Step 3 to improve resume"]
}

Output strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-resume:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

// 5. Interactive Mentor Chat
app.post('/api/mentor-chat', async (req, res) => {
  try {
    const { userProfile, messages, prompt } = req.body;
    const ai = getGeminiClient();

    const targetRole = userProfile?.targetRole || 'Full Stack Developer';
    const userName = userProfile?.name || 'Learner';

    if (!ai) {
      return res.json({
        text: `As your AI Career Mentor, I recommend focusing on mastering the top missing skills for ${targetRole}. Try adding hands-on projects with Docker and Redis to your portfolio! What specific career question can I assist you with?`,
        suggestedQuestions: [
          `How can I prepare for a ${targetRole} technical interview?`,
          `What are the best portfolio projects for ${targetRole}?`,
          `How do I highlight my skills on my resume?`
        ]
      });
    }

    const conversationHistory = (messages || []).map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');

    const systemInstruction = `You are "CareerAI", a warm, inspiring, expert AI Career Mentor and Senior Engineering Manager.
You are chatting with ${userName}, who is aiming to become a "${targetRole}".

User Context:
- Target Role: ${targetRole}
- Academic/Title: ${userProfile?.title || 'Student'}
- Current Skills: ${(userProfile?.skills || []).map((s: any) => `${s.name} (${s.level}/5)`).join(', ')}
- Certifications: ${(userProfile?.certifications || []).join(', ')}

Guidelines:
1. Be directly helpful, highly encouraging, and practical.
2. Give actionable steps, code snippet hints, salary/interview tips, or roadmap guidance whenever relevant.
3. Keep answers well-formatted using Markdown (bolding, bullet points, concise paragraphs).
4. End your message with 2-3 short, context-relevant follow-up questions the user can ask next.`;

    const fullPrompt = `Previous Conversation:\n${conversationHistory}\n\nUSER: ${prompt}\n\nPlease respond as the AI Career Mentor. At the very end of your response, output a section marked exactly with "---SUGGESTED_QUESTIONS---" followed by 2-3 bullet lines of suggested follow-up questions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const rawText = response.text || '';
    let mainText = rawText;
    let suggestedQuestions: string[] = [
      `What portfolio projects should I build for ${targetRole}?`,
      `How can I explain my projects in a behavioral interview?`,
      `What certifications are worth getting for ${targetRole}?`
    ];

    if (rawText.includes('---SUGGESTED_QUESTIONS---')) {
      const parts = rawText.split('---SUGGESTED_QUESTIONS---');
      mainText = parts[0].trim();
      const questionsBlock = parts[1].trim();
      const extracted = questionsBlock
        .split('\n')
        .map((q) => q.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter((q) => q.length > 5);
      if (extracted.length > 0) {
        suggestedQuestions = extracted.slice(0, 3);
      }
    }

    return res.json({
      text: mainText,
      suggestedQuestions,
    });
  } catch (error: any) {
    console.error('Error in /api/mentor-chat:', error);
    res.status(500).json({ error: error.message || 'Failed to process mentor chat' });
  }
});

// Vite Middleware for development / Static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Career Mentor Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
