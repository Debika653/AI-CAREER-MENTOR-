import { UserProfile, CareerMatch, CareerRoadmap, ProjectRecommendation, SkillGapAnalysis } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@university.edu",
  title: "Final Year CS Undergrad & Aspiring Full Stack Engineer",
  education: "B.S. in Computer Science & Engineering (2025)",
  experienceYears: 1,
  targetRole: "Full Stack Developer",
  skills: [
    { id: '1', name: 'JavaScript / ES6+', category: 'frontend', level: 4, verifiedBy: 'github' },
    { id: '2', name: 'TypeScript', category: 'frontend', level: 3, verifiedBy: 'project' },
    { id: '3', name: 'React.js', category: 'frontend', level: 4, verifiedBy: 'project' },
    { id: '4', name: 'HTML5 / CSS3 / Tailwind CSS', category: 'frontend', level: 4, verifiedBy: 'manual' },
    { id: '5', name: 'Node.js & Express.js', category: 'backend', level: 3, verifiedBy: 'project' },
    { id: '6', name: 'RESTful API Design', category: 'backend', level: 3, verifiedBy: 'manual' },
    { id: '7', name: 'PostgreSQL & SQL', category: 'database', level: 2, verifiedBy: 'manual' },
    { id: '8', name: 'MongoDB', category: 'database', level: 3, verifiedBy: 'project' },
    { id: '9', name: 'Git & GitHub Workflow', category: 'tools', level: 4, verifiedBy: 'github' },
    { id: '10', name: 'Docker / Containerization', category: 'devops', level: 1, verifiedBy: 'manual' },
  ],
  softSkills: [
    'Problem Solving & Algorithms',
    'Agile Collaboration',
    'Technical Documentation',
    'Code Refactoring'
  ],
  projects: [
    {
      id: 'p1',
      title: 'DevSphere - Tech Community & Q&A Portal',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      description: 'A full-stack social portal with Markdown post creation, real-time upvoting, tag filtering, and JWT user authentication.',
      repoUrl: 'https://github.com/alex-morgan/devsphere',
      liveUrl: 'https://devsphere-demo.example.com'
    },
    {
      id: 'p2',
      title: 'Algorithm Visualizer',
      techStack: ['JavaScript', 'HTML5 Canvas', 'CSS Modules'],
      description: 'Interactive web app demonstrating sorting algorithms (QuickSort, MergeSort) and pathfinding (Dijkstra, A*) step-by-step.',
      repoUrl: 'https://github.com/alex-morgan/algo-vis'
    }
  ],
  certifications: [
    'Meta Front-End Developer Professional Certificate (Coursera)',
    'AWS Certified Cloud Practitioner (In Progress)'
  ],
  interests: [
    'Full Stack Web Applications',
    'Cloud Systems & Serverless Architecture',
    'Generative AI Integrations',
    'Open Source Contributing'
  ],
  githubUsername: 'alex-morgan-dev',
  bio: 'Computer Science senior passionate about building scalable web solutions, learning modern backend architecture, and mastering full-stack software development.',
  resumeText: `Alex Morgan | Full Stack Software Engineer Candidate
Education: B.S. in Computer Science, State University (GPA 3.8/4.0)
Skills: JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, Git, HTML/CSS, Tailwind CSS.
Projects:
- DevSphere: Developed MERN stack Web app with JWT Auth, REST APIs, and MongoDB indexing.
- AlgoVis: Created interactive sorting and graph visualization web application using ES6 JS.
Leadership & Activities: Tech Club Lead, Hackathon Finalist.`,
  lastUpdated: new Date().toISOString()
};

export const STANDARD_CAREER_ROLES: CareerMatch[] = [
  {
    roleId: 'full-stack-dev',
    roleTitle: 'Full Stack Developer',
    category: 'Web & Systems',
    matchPercentage: 82,
    readinessScore: 78,
    demandLevel: 'Extreme',
    salaryRange: { min: 85000, max: 145000, currency: '$' },
    keySkillsPresent: ['React.js', 'Node.js', 'JavaScript', 'TypeScript', 'REST APIs', 'MongoDB'],
    keySkillsMissing: ['Docker', 'CI/CD Pipelines', 'GraphQL / WebSockets', 'Unit Testing (Jest/Vitest)'],
    rationale: 'Strong frontend background paired with foundational Node.js experience makes you an excellent candidate. Mastering Docker, testing, and modern deployment pipelines will elevate your readiness to senior-tier standards.',
    careerGrowthOutlook: 'High sustained industry demand with massive mobility across startups, enterprise, and remote tech positions.',
    recommendedForUser: true
  },
  {
    roleId: 'frontend-dev',
    roleTitle: 'Frontend Developer',
    category: 'Web & Mobile',
    matchPercentage: 92,
    readinessScore: 88,
    demandLevel: 'Very High',
    salaryRange: { min: 78000, max: 135000, currency: '$' },
    keySkillsPresent: ['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3', 'Git'],
    keySkillsMissing: ['Next.js (App Router)', 'Web Performance Optimization', 'State Management (Zustand/Redux)', 'E2E Testing (Cypress)'],
    rationale: 'Exceptional alignment with current frontend requirements. You possess 85%+ of core competencies. Adding Next.js SSR and automated testing makes you immediately job-ready.',
    careerGrowthOutlook: 'Very high demand for product-minded UI developers who understand user experience and modern React ecosystems.',
    recommendedForUser: true
  },
  {
    roleId: 'backend-dev',
    roleTitle: 'Backend Developer',
    category: 'Systems & Engineering',
    matchPercentage: 71,
    readinessScore: 65,
    demandLevel: 'Very High',
    salaryRange: { min: 88000, max: 150000, currency: '$' },
    keySkillsPresent: ['Node.js', 'Express.js', 'RESTful API Design', 'PostgreSQL', 'MongoDB'],
    keySkillsMissing: ['System Design & Scalability', 'Redis Caching', 'Microservices Architecture', 'Docker & Kubernetes'],
    rationale: 'Good foundation in Node/Express and databases. To excel as a dedicated backend engineer, focus on relational query optimization, distributed caching, and microservices.',
    careerGrowthOutlook: 'High demand across cloud services, fintech, and data-heavy platforms.',
    recommendedForUser: false
  },
  {
    roleId: 'ai-ml-engineer',
    roleTitle: 'AI / ML Engineer',
    category: 'Data & AI',
    matchPercentage: 54,
    readinessScore: 48,
    demandLevel: 'Extreme',
    salaryRange: { min: 98000, max: 175000, currency: '$' },
    keySkillsPresent: ['JavaScript', 'Problem Solving & Algorithms', 'Node.js'],
    keySkillsMissing: ['Python (NumPy, PyTorch)', 'LangChain / GenAI SDKs', 'Vector Databases (Pinecone/pgvector)', 'Machine Learning Math'],
    rationale: 'Emerging technology field. While you have strong algorithm fundamentals, shifting to AI/ML requires Python, neural network concepts, vector embeddings, and LLM application engineering.',
    careerGrowthOutlook: 'Explosive industry expansion with premium salary bands and strategic technological importance.',
    recommendedForUser: false
  },
  {
    roleId: 'devops-engineer',
    roleTitle: 'DevOps & Cloud Engineer',
    category: 'Cloud & Infrastructure',
    matchPercentage: 46,
    readinessScore: 42,
    demandLevel: 'High',
    salaryRange: { min: 92000, max: 160000, currency: '$' },
    keySkillsPresent: ['Git & GitHub Workflow', 'Linux Basics'],
    keySkillsMissing: ['Docker & Kubernetes', 'Terraform (IaC)', 'AWS / GCP Architecture', 'CI/CD Pipelines (GitHub Actions)'],
    rationale: 'Requires deep infrastructure mindset. Recommended to start by implementing Docker and automated GitHub Actions CI/CD pipelines in your current web projects.',
    careerGrowthOutlook: 'Steady, indispensable role across mid-size and enterprise cloud organizations.',
    recommendedForUser: false
  },
  {
    roleId: 'ui-ux-designer',
    roleTitle: 'UI/UX Designer & Product Designer',
    category: 'Design & Product',
    matchPercentage: 68,
    readinessScore: 62,
    demandLevel: 'High',
    salaryRange: { min: 72000, max: 125000, currency: '$' },
    keySkillsPresent: ['Tailwind CSS', 'HTML5 / CSS3', 'React UI Components'],
    keySkillsMissing: ['Figma Design Systems', 'User Research & Journey Mapping', 'Interactive Prototyping', 'Usability Testing'],
    rationale: 'Your frontend styling and layout sensibilities give you a strong start. Learning Figma component libraries and UX research methodologies will round out this path.',
    careerGrowthOutlook: 'Essential role for design-driven SaaS products and modern consumer applications.',
    recommendedForUser: false
  }
];

export const INITIAL_SKILL_GAP: SkillGapAnalysis = {
  targetRole: "Full Stack Developer",
  currentMatchPercent: 82,
  readinessScore: 78,
  missingCoreSkills: [
    {
      name: "Docker & Containerization",
      importance: "Critical",
      reason: "Standard industry expectation for deploying isolated web services, microservices, and reliable CI/CD environments.",
      category: "devops",
      estimatedHoursToMaster: 20
    },
    {
      name: "Automated Testing (Jest / Vitest / React Testing Library)",
      importance: "Critical",
      reason: "Essential for maintaining production code quality, preventing regression bugs, and passing technical coding rounds.",
      category: "tools",
      estimatedHoursToMaster: 18
    },
    {
      name: "GraphQL & Real-time WebSockets",
      importance: "Important",
      reason: "Key for building high-performance APIs and collaborative features in modern full-stack web applications.",
      category: "backend",
      estimatedHoursToMaster: 15
    },
    {
      name: "Redis In-Memory Caching",
      importance: "Important",
      reason: "Optimizes backend database query performance, session handling, and API rate limiting.",
      category: "database",
      estimatedHoursToMaster: 12
    },
    {
      name: "CI/CD Deployment Pipelines (GitHub Actions)",
      importance: "Important",
      reason: "Automates testing, building, and seamless zero-downtime deployments to Cloud platforms.",
      category: "devops",
      estimatedHoursToMaster: 10
    }
  ],
  missingSoftSkills: [
    "System Architecture Diagramming",
    "Technical Interview Behavioral Storytelling (STAR Method)",
    "Cross-functional Team Code Reviews"
  ],
  strengthsToLeverage: [
    "Proficient with React.js & component hierarchy design",
    "Solid Node.js & REST API setup capabilities",
    "Hands-on experience with both SQL (PostgreSQL) and NoSQL (MongoDB)",
    "Version control fluency with Git & GitHub workflow"
  ],
  topActionableAdvice: [
    "Build a production-grade capstone project integrating Docker containerization and automated GitHub Actions deployment.",
    "Add unit tests using Vitest/Jest to your existing DevSphere repository to showcase code quality on your resume.",
    "Practice system design fundamentals (load balancing, caching, database indexing) for technical interviews."
  ]
};

export const INITIAL_ROADMAP: CareerRoadmap = {
  targetRole: "Full Stack Developer",
  totalWeeks: 12,
  overallProgressPercentage: 45,
  lastAiUpdate: new Date().toISOString(),
  milestones: [
    {
      id: "m1",
      phaseNumber: 1,
      phaseName: "Phase 1: Advanced Frontend & Modern State",
      title: "Master TypeScript & Next.js App Architecture",
      description: "Solidify strict TypeScript typing across frontend state, custom hooks, and server actions using Next.js / React server features.",
      estimatedWeeks: 3,
      status: "completed",
      skillsToGain: ["TypeScript Advanced Types", "Next.js App Router", "Zustand State Management"],
      courses: [
        { title: "React & TypeScript Professional Guide", platform: "FreeCodeCamp", free: true, type: "Interactive" },
        { title: "Next.js 14 Complete Mastery", platform: "YouTube / Vercel Docs", free: true, type: "Documentation" }
      ],
      handsonProject: {
        title: "Type-Safe SaaS Task Board",
        description: "Build a drag-and-drop Kanban board with strict TypeScript interfaces, optimistic UI updates, and server actions.",
        keyDeliverables: ["Drag-and-drop board UI", "Zustand state store", "TypeScript API routes"]
      },
      codingChallenges: ["Implement custom typed generic hook `useFetch<T>`", "Build custom debounce & throttle utilities in TS"]
    },
    {
      id: "m2",
      phaseNumber: 2,
      phaseName: "Phase 2: Production Backend & System Design",
      title: "Containerization with Docker & Redis Caching",
      description: "Wrap Express API and database in multi-container Docker Compose. Implement Redis layer for query response caching.",
      estimatedWeeks: 3,
      status: "in_progress",
      skillsToGain: ["Docker", "Docker Compose", "Redis Caching", "API Rate Limiting"],
      courses: [
        { title: "Docker for Web Developers in 3 Hours", platform: "YouTube", free: true, type: "Video" },
        { title: "Redis University: Fast Data Storage", platform: "Redis University", free: true, type: "Course" }
      ],
      handsonProject: {
        title: "Dockerized API Gateway with Redis Caching",
        description: "Create a containerized Express microservice that caches database queries using Redis and rate-limits requests.",
        keyDeliverables: ["docker-compose.yml file", "Redis cache middleware", "Load testing benchmark script"]
      },
      codingChallenges: ["Write a custom Express rate-limiter middleware using Redis TTL counters"]
    },
    {
      id: "m3",
      phaseNumber: 3,
      phaseName: "Phase 3: Code Quality & Automated Pipelines",
      title: "Testing Mastery & GitHub Actions CI/CD",
      description: "Write comprehensive unit tests with Vitest, integration tests for REST endpoints, and configure GitHub Actions pipelines.",
      estimatedWeeks: 3,
      status: "not_started",
      skillsToGain: ["Vitest / Jest", "React Testing Library", "GitHub Actions CI/CD", "Supertest"],
      courses: [
        { title: "Testing JavaScript Applications", platform: "TestingJavaScript.com", free: false, type: "Course" },
        { title: "GitHub Actions for Developers", platform: "GitHub Skills", free: true, type: "Interactive" }
      ],
      handsonProject: {
        title: "Automated CI/CD Pipeline for Full Stack App",
        description: "Set up a GitHub repository workflow that runs linters, unit tests, and builds docker images automatically on git push.",
        keyDeliverables: [".github/workflows/main.yml script", "80%+ test coverage suite", "Automated deployment step"]
      },
      codingChallenges: ["Write unit tests for authentication JWT validation logic", "Mock database response in Vitest"]
    },
    {
      id: "m4",
      phaseNumber: 4,
      phaseName: "Phase 4: Capstone Portfolio & Job Readiness",
      title: "AI-Powered Full Stack Capstone & Interview Prep",
      description: "Build an impressive AI-driven full stack portfolio project, polish resume bullet points, and complete mock interview rounds.",
      estimatedWeeks: 3,
      status: "not_started",
      skillsToGain: ["Gemini API Integration", "System Architecture", "STAR Interviewing", "Resume Optimization"],
      courses: [
        { title: "Full Stack System Design Interview Course", platform: "Educative / SystemDesign.primer", free: true, type: "Documentation" },
        { title: "Gemini API Full Stack Cookbook", platform: "Google Cloud AI", free: true, type: "Interactive" }
      ],
      handsonProject: {
        title: "Enterprise AI Workflow & Analytics Platform",
        description: "Build a production web application with Gemini AI server-side processing, automated testing, docker deployment, and live monitoring.",
        keyDeliverables: ["Live cloud deployed application", "Architecture diagram in README", "High-impact portfolio demo video"]
      },
      codingChallenges: ["System design mock: Design a URL Shortener or Real-time Messaging System"]
    }
  ]
};

export const INITIAL_PROJECT_RECOMMENDATIONS: ProjectRecommendation[] = [
  {
    id: "rec1",
    title: "Real-Time Collaborative Code & Workspace Studio",
    targetRole: "Full Stack Developer",
    difficulty: "Advanced",
    description: "Multi-user web workspace enabling simultaneous live code editing, instant syntax preview, and AI code optimization suggestions using WebSockets and Express server processing.",
    techStack: ["React", "TypeScript", "Node.js", "WebSockets / Socket.io", "Docker", "Tailwind CSS"],
    keyFeatures: [
      "Real-time bidirectional cursor & text sync across multiple connected browser clients.",
      "Dockerized backend sandbox for executing user code safely.",
      "Integrated AI Assistant powered by Gemini for instant code refactoring.",
      "JWT authentication with saved cloud workspaces."
    ],
    portfolioImpactReason: "Directly solves your core skill gaps in Docker, WebSockets, and production system architecture—making your resume stand out to senior technical screeners.",
    resumeBulletSuggestions: [
      "Architected a real-time collaborative workspace utilizing WebSockets and Node.js, supporting multi-client code syncing with sub-50ms latency.",
      "Containerized code execution environments using Docker Compose, guaranteeing safe isolated execution for untrusted scripts."
    ]
  },
  {
    id: "rec2",
    title: "Microservices E-Commerce API with Redis Caching & CI/CD",
    targetRole: "Full Stack Developer",
    difficulty: "Intermediate",
    description: "High-throughput RESTful & GraphQL API suite with product search caching, automated inventory reservation, and full automated testing workflow.",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "Vitest", "GitHub Actions"],
    keyFeatures: [
      "Redis caching layer reducing database read latency by up to 70% for hot product listings.",
      "Automated CI/CD workflow in GitHub Actions running unit/integration tests on every Pull Request.",
      "Database schema migration & seeding scripts using Drizzle/Prisma."
    ],
    portfolioImpactReason: "Demonstrates backend enterprise maturity, database query optimization, and reliable software engineering practices.",
    resumeBulletSuggestions: [
      "Engineered an Express and PostgreSQL backend API integrated with Redis caching, boosting peak request throughput by 3x.",
      "Configured a GitHub Actions CI/CD pipeline enforcing 85%+ automated test coverage before production deployment."
    ]
  },
  {
    id: "rec3",
    title: "AI Resume & Portfolio Intelligence Platform",
    targetRole: "Full Stack Developer",
    difficulty: "Intermediate",
    description: "Intelligent career assistant analyzing developer portfolios, parsing resumes, and suggesting targeted skill upgrades using modern AI processing.",
    techStack: ["React", "TypeScript", "Express", "Gemini AI API", "Tailwind CSS"],
    keyFeatures: [
      "Server-side Gemini AI integration analyzing custom developer text & project repos.",
      "Interactive SVG radar chart and custom job readiness gauge.",
      "PDF/Text parser converting resume documents into structured career analytics."
    ],
    portfolioImpactReason: "Highlights full-stack product thinking, modern LLM integration skills, and sleek responsive UI design.",
    resumeBulletSuggestions: [
      "Designed and deployed a full-stack AI career platform powered by server-side Gemini AI, processing user profiles and delivering real-time skill gap analysis.",
      "Implemented responsive custom visual analytics (Radar charts & Gauges) using React and Tailwind CSS."
    ]
  }
];
