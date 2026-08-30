import { Course, OnlineCourseModule, OnlineLiveClass, OnlineQuiz, OnlineAssignment, Coupon } from '../types';

export interface DetailedOnlineCourse extends Course {
  slug: string;
  onlineTrainingAvailable: boolean;
  deliveryModes: ('Physical' | 'Online' | 'Hybrid')[];
  localPhysicalPrice: number; // NGN
  localOnlinePrice: number;    // NGN
  internationalOnlinePrice: number; // USD
  promotionalPriceNGN?: number;
  promotionalPriceUSD?: number;
  isFree?: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  technologyArea: string;
  durationText: string;
  prerequisites: string;
  targetAudience: string;
  certification: string;
  overview: string;
  instructorAvatar?: string;
  instructorBio?: string;
  modules: OnlineCourseModule[];
  liveClasses?: OnlineLiveClass[];
  quizzes?: OnlineQuiz[];
  assignments?: OnlineAssignment[];
  faqs?: { question: string; answer: string }[];
}

export const INITIAL_ONLINE_COURSES: DetailedOnlineCourse[] = [
  {
    id: "c-online-dev",
    code: "AITI-DEV-201",
    title: "Front-End & Modern React Web Engineering",
    category: "Software & Web Development",
    technologyArea: "Software Development",
    programType: "both",
    durationWeeks: 8,
    durationText: "8 Weeks (Live & Self-Paced)",
    slug: "frontend-react-web-engineering",
    description: "Build high-performance, reactive web applications with HTML5, CSS3, modern TypeScript, React, Tailwind CSS, and REST API integration.",
    overview: "This hands-on engineering course takes you from frontend fundamentals to advanced component state machines, interactive single-page applications, and cloud container deployments. You will construct 4 commercial-grade portfolio projects.",
    learningOutcomes: [
      "Master modern JavaScript (ES6+), TypeScript, and component hierarchies",
      "Build production-grade responsive user interfaces with React and Tailwind CSS",
      "Consume and handle asynchronous RESTful APIs with robust error boundaries",
      "Deploy optimized web applications to global CDNs and cloud infrastructure",
      "Earn the AITI Digital Verified Certificate of Professional Competence"
    ],
    prerequisites: "Basic computer familiarity. No prior coding experience required for module 1.",
    targetAudience: "Aspiring software developers, undergraduate students, graduates, and professionals upgrading to modern web stacks.",
    certification: "AITI Certificate of Professional Proficiency in Frontend Engineering (QR-Secured)",
    instructorId: "inst-1",
    instructorName: "Engr. Timothy A. Adeleke",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    instructorBio: "Senior Full-Stack Cloud Engineer with 12+ years experience building fintech and enterprise web platforms across Nigeria and internationally.",
    level: "Beginner",
    active: true,
    onlineTrainingAvailable: true,
    deliveryModes: ["Online", "Physical", "Hybrid"],
    localPhysicalPrice: 65000,
    localOnlinePrice: 45000,
    internationalOnlinePrice: 100,
    promotionalPriceNGN: 40000,
    promotionalPriceUSD: 85,
    isFree: false,
    practicalHours: 60,
    modules: [
      {
        id: "mod-dev-1",
        courseId: "c-online-dev",
        title: "Module 1: Web Fundamentals & Semantic Architecture",
        order: 1,
        description: "Master HTML5 semantics, modern CSS3 layout systems (Flexbox & CSS Grid), and responsive design principles.",
        lessons: [
          {
            id: "les-dev-101",
            moduleId: "mod-dev-1",
            title: "Lesson 1: Introduction to Web Architecture & DevTools",
            order: 1,
            durationMinutes: 45,
            summary: "Understanding client-server HTTP lifecycle, DOM trees, and browser inspector workflows.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            videoDuration: "28:15",
            contentMarkdown: "### Welcome to Modern Web Engineering\nIn this lesson, we explore how browsers parse HTML documents, construct the CSS Object Model (CSSOM), and render interactive layouts. We will set up VS Code, essential extensions, and Git source control.",
            resources: [
              { id: "res-1", title: "HTML5 Semantic Cheat Sheet (PDF)", type: "pdf", fileUrl: "#", fileSize: "1.2 MB" },
              { id: "res-2", title: "Starter Dev Environment Setup Guide", type: "document", fileUrl: "#" }
            ],
            isPreviewFree: true,
            hasQuiz: true,
            quizId: "quiz-dev-1"
          },
          {
            id: "les-dev-102",
            moduleId: "mod-dev-1",
            title: "Lesson 2: Modern CSS3 Flexbox & Grid Mastery",
            order: 2,
            durationMinutes: 60,
            summary: "Deep dive into 2D layout systems, media queries, CSS variables, and fluid typography.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            videoDuration: "42:10",
            contentMarkdown: "Flexbox manages 1-dimensional layouts along the main and cross axis, while CSS Grid enables powerful 2-dimensional matrix structuring.",
            isPreviewFree: false
          }
        ]
      },
      {
        id: "mod-dev-2",
        courseId: "c-online-dev",
        title: "Module 2: JavaScript ES6+ & TypeScript Essentials",
        order: 2,
        description: "Logic building, closures, asynchronous promises, fetch API, and TypeScript interfaces.",
        lessons: [
          {
            id: "les-dev-201",
            moduleId: "mod-dev-2",
            title: "Lesson 3: Variables, Scopes, Closures & Array Transformations",
            order: 1,
            durationMinutes: 50,
            summary: "Deep understanding of map, filter, reduce, destructuring, and functional pipelines.",
            videoDuration: "35:00",
            isPreviewFree: false
          },
          {
            id: "les-dev-202",
            moduleId: "mod-dev-2",
            title: "Lesson 4: Asynchronous JavaScript, Promises & Fetch API",
            order: 2,
            durationMinutes: 65,
            summary: "Handling asynchronous network requests, async/await paradigms, and error trapping.",
            videoDuration: "48:20",
            isPreviewFree: false
          }
        ]
      },
      {
        id: "mod-dev-3",
        courseId: "c-online-dev",
        title: "Module 3: Reactive UI Development with React & Tailwind",
        order: 3,
        description: "Components, JSX, hooks (useState, useEffect, useMemo), state lifting, and styling.",
        lessons: [
          {
            id: "les-dev-301",
            moduleId: "mod-dev-3",
            title: "Lesson 5: React Component Lifecycles & State Management",
            order: 1,
            durationMinutes: 70,
            summary: "Component composition, reactive state, and immutable data flows in React 18+.",
            videoDuration: "52:40",
            isPreviewFree: false
          }
        ]
      }
    ],
    liveClasses: [
      {
        id: "live-dev-1",
        courseId: "c-online-dev",
        courseTitle: "Front-End & Modern React Web Engineering",
        title: "Live Interactive Workshop: Building an E-Commerce Cart with React & Tailwind",
        description: "Live coding session with Engr. Timothy. Interactive Q&A, debugging live student code, and code review.",
        instructorName: "Engr. Timothy A. Adeleke",
        scheduledDateTimeUTC: "2026-09-12T14:00:00Z", // 2:00 PM Nigeria WAT
        durationMinutes: 90,
        meetingPlatform: "Google Meet",
        meetingLink: "https://meet.google.com/aiti-dev-lab",
        classNotes: "Please clone the GitHub repository provided in Lesson 4 before joining."
      }
    ],
    quizzes: [
      {
        id: "quiz-dev-1",
        courseId: "c-online-dev",
        title: "Module 1 Assessment: HTML5, CSS & Web Protocols",
        description: "Test your understanding of semantic markup, layout flows, and browser rendering.",
        passingScorePercent: 70,
        timeLimitMinutes: 15,
        maxAttempts: 3,
        questions: [
          {
            id: "q1",
            questionText: "Which HTML5 element represents the primary navigation links of a website?",
            type: "multiple_choice",
            options: ["<header>", "<nav>", "<section>", "<aside>"],
            correctAnswerIndex: 1,
            explanation: "The <nav> tag is the semantic container specifically intended for navigation links."
          },
          {
            id: "q2",
            questionText: "In CSS Flexbox, which property controls alignment along the cross-axis?",
            type: "multiple_choice",
            options: ["justify-content", "align-items", "flex-direction", "flex-wrap"],
            correctAnswerIndex: 1,
            explanation: "align-items aligns flex items along the cross axis (vertically by default in a row direction)."
          },
          {
            id: "q3",
            questionText: "True or False: CSS Grid is specifically designed for 2-dimensional (rows and columns) layouts.",
            type: "true_false",
            options: ["True", "False"],
            correctAnswerIndex: 0,
            explanation: "CSS Grid is a 2-dimensional system, whereas Flexbox is primarily 1-dimensional."
          }
        ]
      }
    ],
    assignments: [
      {
        id: "asg-dev-1",
        courseId: "c-online-dev",
        title: "Project Milestone 1: Responsive Portfolio Website",
        description: "Develop a complete 3-page responsive personal portfolio using semantic HTML5, modern Tailwind CSS, and custom interactive JavaScript components. Host on GitHub Pages or Vercel and submit the live URL.",
        maxScore: 100,
        dueDate: "2026-09-30",
        createdAt: "2026-09-01"
      }
    ],
    faqs: [
      { question: "Can I take this course if I live outside Nigeria?", answer: "Yes! AITI offers international online enrollment in USD. You will have full access to live classes, recorded video lessons, assignments, and digital QR verification certificates." },
      { question: "What are the live class timings?", answer: "Live interactive mentoring sessions occur weekly on Saturdays at 2:00 PM West Africa Time (WAT). Our interactive classroom automatically converts scheduled times to your local timezone (e.g. 9:00 AM New York, 2:00 PM London, 5:00 PM Dubai)." }
    ]
  },

  {
    id: "c-online-data",
    code: "AITI-DAT-301",
    title: "Data Analysis & Business Intelligence (Excel, SQL, PowerBI)",
    category: "Data & AI",
    technologyArea: "Data & AI",
    programType: "both",
    durationWeeks: 8,
    durationText: "8 Weeks (Live Online + Practical Datasets)",
    slug: "data-analysis-business-intelligence",
    description: "Transform raw datasets into high-impact executive dashboards and actionable business insights using Advanced Excel formulas, Relational SQL, and Microsoft PowerBI.",
    overview: "Master the complete business intelligence pipeline: from data extraction and cleansing to complex SQL relational queries, DAX formulas, interactive KPI visualizers, and predictive dashboards.",
    learningOutcomes: [
      "Master Advanced Excel (XLOOKUP, INDEX/MATCH, Dynamic Arrays, Pivot Tables)",
      "Write advanced SQL queries (JOINs, Window Functions, Aggregate CTEs) to query relational databases",
      "Design interactive corporate PowerBI dashboards and automated ETL pipelines with Power Query",
      "Formulate data-driven business recommendations and executive slide decks"
    ],
    prerequisites: "Basic computer familiarity and foundational mathematics.",
    targetAudience: "Aspiring data analysts, finance professionals, business managers, graduates, and remote work seekers.",
    certification: "AITI Certificate of Professional Competency in Data Analytics & BI",
    instructorId: "inst-2",
    instructorName: "Mrs. Fatima B. Sanni",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    instructorBio: "Lead Data Scientist and BI Consultant with 9+ years delivering enterprise data solutions for financial and telecommunications institutions.",
    level: "All Levels",
    active: true,
    onlineTrainingAvailable: true,
    deliveryModes: ["Online", "Physical", "Hybrid"],
    localPhysicalPrice: 60000,
    localOnlinePrice: 40000,
    internationalOnlinePrice: 95,
    promotionalPriceNGN: 35000,
    promotionalPriceUSD: 80,
    isFree: false,
    practicalHours: 55,
    modules: [
      {
        id: "mod-dat-1",
        courseId: "c-online-data",
        title: "Module 1: Advanced Microsoft Excel for Business Analytics",
        order: 1,
        description: "Formulas, lookup functions, data cleansing, logical algorithms, and dynamic pivot reporting.",
        lessons: [
          {
            id: "les-dat-101",
            moduleId: "mod-dat-1",
            title: "Lesson 1: Excel Fundamentals & Modern Dynamic Formulas",
            order: 1,
            durationMinutes: 50,
            summary: "Mastering XLOOKUP, FILTER, UNIQUE, SORT, and nested logical statements.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            videoDuration: "36:10",
            isPreviewFree: true,
            hasQuiz: true,
            quizId: "quiz-dat-1"
          }
        ]
      },
      {
        id: "mod-dat-2",
        courseId: "c-online-data",
        title: "Module 2: Relational Databases & SQL Querying",
        order: 2,
        description: "PostgreSQL querying, relational modeling, multi-table joins, subqueries, and window functions.",
        lessons: [
          {
            id: "les-dat-201",
            moduleId: "mod-dat-2",
            title: "Lesson 2: SQL SELECT, Aggregations, GROUP BY & HAVING",
            order: 1,
            durationMinutes: 60,
            summary: "Writing structured queries to extract meaningful aggregates from enterprise databases.",
            videoDuration: "45:00",
            isPreviewFree: false
          }
        ]
      },
      {
        id: "mod-dat-3",
        courseId: "c-online-data",
        title: "Module 3: PowerBI Data Modeling & Interactive Dashboards",
        order: 3,
        description: "Power Query ETL, star schema relationships, DAX measures, and publish to cloud service.",
        lessons: [
          {
            id: "les-dat-301",
            moduleId: "mod-dat-3",
            title: "Lesson 3: Star Schema Data Modeling & DAX Measures",
            order: 1,
            durationMinutes: 65,
            summary: "Creating calculated columns, time-intelligence DAX measures (YTD, MTD, YoY growth).",
            videoDuration: "50:15",
            isPreviewFree: false
          }
        ]
      }
    ],
    liveClasses: [
      {
        id: "live-dat-1",
        courseId: "c-online-data",
        courseTitle: "Data Analysis & Business Intelligence",
        title: "Live Masterclass: End-to-End Telecom Churn Analysis in PowerBI",
        description: "Practical walk-through converting raw CSV records into a multi-page interactive executive report.",
        instructorName: "Mrs. Fatima B. Sanni",
        scheduledDateTimeUTC: "2026-09-13T15:00:00Z", // 3:00 PM Nigeria WAT
        durationMinutes: 90,
        meetingPlatform: "Zoom",
        meetingLink: "https://zoom.us/j/aiti-data-bi",
        classNotes: "Download the churn_dataset_2026.csv file from Module 2 before attending."
      }
    ],
    quizzes: [
      {
        id: "quiz-dat-1",
        courseId: "c-online-data",
        title: "Excel Dynamic Functions & Data Types Quiz",
        description: "Evaluate your practical understanding of XLOOKUP and dynamic array formulas.",
        passingScorePercent: 75,
        timeLimitMinutes: 10,
        maxAttempts: 3,
        questions: [
          {
            id: "qd1",
            questionText: "What is the primary advantage of XLOOKUP over traditional VLOOKUP?",
            type: "multiple_choice",
            options: [
              "XLOOKUP can search to the left and defaults to exact match without column indexing errors",
              "XLOOKUP only works on numbers",
              "XLOOKUP requires data to be sorted in ascending order",
              "XLOOKUP is slower than VLOOKUP"
            ],
            correctAnswerIndex: 0,
            explanation: "XLOOKUP searches in any direction, doesn't require column indices, and defaults to exact match."
          }
        ]
      }
    ],
    assignments: [
      {
        id: "asg-dat-1",
        courseId: "c-online-data",
        title: "Capstone Project: Retail Sales Performance Dashboard",
        description: "Clean the supplied 50,000-row retail dataset in Power Query, establish 1-to-many dimensional relationships, and create a 3-page PowerBI dashboard displaying Sales, Profit Margin, Regional Performance, and Cohort Retention.",
        maxScore: 100,
        dueDate: "2026-10-15",
        createdAt: "2026-09-01"
      }
    ],
    faqs: [
      { question: "Do I need a paid PowerBI license?", answer: "No, Microsoft Power BI Desktop is completely free for Windows, and AITI provides student practice datasets." }
    ]
  },

  {
    id: "c-online-cyber",
    code: "AITI-CYB-601",
    title: "Cybersecurity Defense, Ethical Hacking & Network Security",
    category: "Cybersecurity & Cloud",
    technologyArea: "Cybersecurity",
    programType: "both",
    durationWeeks: 8,
    durationText: "8 Weeks (Live Lab Simulator)",
    slug: "cybersecurity-defense-ethical-hacking",
    description: "Learn practical network defense, vulnerability assessment, ethical penetration testing, Linux command-line security, and digital forensics.",
    overview: "Understand how modern attackers breach networks and how security analysts defend enterprise digital assets. You will configure firewalls, analyze network traffic in Wireshark, run vulnerability scans, and prepare for industry security certifications.",
    learningOutcomes: [
      "Master network protocols (TCP/IP, DNS, SSL/TLS, VPNs) and packet analysis with Wireshark",
      "Perform ethical reconnaissance, vulnerability scanning, and risk assessment",
      "Harden Linux and Windows servers against common cyber attacks (OWASP Top 10)",
      "Understand incident response and digital forensics methodology"
    ],
    prerequisites: "Basic understanding of operating systems and networking fundamentals.",
    targetAudience: "IT officers, system administrators, network technicians, and aspiring cybersecurity analysts.",
    certification: "AITI Certificate in Cybersecurity Defense & Ethical Penetration Testing",
    instructorId: "inst-3",
    instructorName: "Mr. Emmanuel O. Balogun",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    instructorBio: "Certified Ethical Hacker (CEH) & CompTIA Security+ Specialist with 10+ years managing critical network infrastructure.",
    level: "Intermediate",
    active: true,
    onlineTrainingAvailable: true,
    deliveryModes: ["Online", "Physical", "Hybrid"],
    localPhysicalPrice: 75000,
    localOnlinePrice: 50000,
    internationalOnlinePrice: 120,
    promotionalPriceNGN: 45000,
    promotionalPriceUSD: 100,
    isFree: false,
    practicalHours: 60,
    modules: [
      {
        id: "mod-cyb-1",
        courseId: "c-online-cyber",
        title: "Module 1: Cyber Threats, Architecture & Linux Command Line",
        order: 1,
        description: "Understanding threat landscapes, CIA triad, Linux permissions, and CLI security tools.",
        lessons: [
          {
            id: "les-cyb-101",
            moduleId: "mod-cyb-1",
            title: "Lesson 1: Introduction to Cyber Defense & Kali Linux Environment",
            order: 1,
            durationMinutes: 55,
            summary: "Setting up virtual sandbox environments, understanding security terminology and attack vectors.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            videoDuration: "40:00",
            isPreviewFree: true
          }
        ]
      }
    ],
    liveClasses: [
      {
        id: "live-cyb-1",
        courseId: "c-online-cyber",
        courseTitle: "Cybersecurity Defense, Ethical Hacking",
        title: "Live Lab: Packet Sniffing & MITM Attack Defense in Wireshark",
        description: "Hands-on packet dissection and SSL inspection in our virtual cloud sandbox.",
        instructorName: "Mr. Emmanuel O. Balogun",
        scheduledDateTimeUTC: "2026-09-14T17:00:00Z",
        durationMinutes: 90,
        meetingPlatform: "Microsoft Teams",
        meetingLink: "https://teams.microsoft.com/aiti-cyber-lab"
      }
    ],
    quizzes: [],
    assignments: []
  },

  {
    id: "c-online-uiux",
    code: "AITI-DES-402",
    title: "UI/UX Design, Figma Product Prototyping & Design Systems",
    category: "Graphics & Creative Technology",
    technologyArea: "Design & Creative Tech",
    programType: "both",
    durationWeeks: 6,
    durationText: "6 Weeks (Portfolio Driven)",
    slug: "ui-ux-design-figma-prototyping",
    description: "Design modern, user-centric mobile and web interfaces with Figma, master auto-layout, build reusable design systems, and execute user research.",
    overview: "Learn the full product design lifecycle from user research, wireframing, and interactive UI micro-animations to client handoff and developer specs in Figma.",
    learningOutcomes: [
      "Master Figma advanced auto-layout, component variants, and design tokens",
      "Conduct user research, personas, empathy maps, and information architecture",
      "Build complete design systems with responsive mobile and desktop viewports",
      "Deliver 2 complete mobile app case studies for global freelance or full-time roles"
    ],
    prerequisites: "Creativity and passion for digital aesthetics. No coding required.",
    targetAudience: "Creative designers, career transitioners, entrepreneurs, and product managers.",
    certification: "AITI Certificate of Professional Competency in UI/UX Product Design",
    instructorId: "inst-4",
    instructorName: "Ms. Zainab A. Ibrahim",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    instructorBio: "Senior Product Designer with 8+ years designing fintech and mobile apps for leading African tech startups.",
    level: "Beginner",
    active: true,
    onlineTrainingAvailable: true,
    deliveryModes: ["Online", "Physical", "Hybrid"],
    localPhysicalPrice: 55000,
    localOnlinePrice: 38000,
    internationalOnlinePrice: 90,
    promotionalPriceNGN: 32000,
    promotionalPriceUSD: 75,
    isFree: false,
    practicalHours: 45,
    modules: [
      {
        id: "mod-ui-1",
        courseId: "c-online-uiux",
        title: "Module 1: Design Thinking, Wireframing & Figma Auto-Layout",
        order: 1,
        description: "Fundamentals of user experience, atomic design principles, and responsive components.",
        lessons: [
          {
            id: "les-ui-101",
            moduleId: "mod-ui-1",
            title: "Lesson 1: Introduction to UI/UX & Figma Workspace",
            order: 1,
            durationMinutes: 45,
            summary: "Understanding vector tools, frames, nested autolayout, and visual hierarchy.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            videoDuration: "32:00",
            isPreviewFree: true
          }
        ]
      }
    ],
    liveClasses: [],
    quizzes: [],
    assignments: []
  },

  {
    id: "c-online-ict",
    code: "AITI-ICT-101",
    title: "ICT Fundamentals, Executive Office Productivity & AI Tools",
    category: "ICT & Digital Skills",
    technologyArea: "Office Productivity & AI",
    programType: "both",
    durationWeeks: 4,
    durationText: "4 Weeks (Crash Course)",
    slug: "ict-fundamentals-office-productivity-ai",
    description: "Rapid computer literacy, executive Word & Excel formatting, PowerPoint presentations, cloud Google Workspace, and generative AI productivity.",
    overview: "A comprehensive digital skills booster for workplace professionals, students, and beginners needing confident computer mastery and AI workflow scaling.",
    learningOutcomes: [
      "Master desktop computer navigation, file management, and digital safety",
      "Create executive business documents and spreadsheets in Microsoft Office Suite",
      "Leverage modern generative AI tools (ChatGPT, Gemini) for rapid drafting and research",
      "Collaborate seamlessly using Google Drive, Docs, Sheets, and online meetings"
    ],
    prerequisites: "None. Perfect for absolute beginners.",
    targetAudience: "School leavers, administrative staff, business owners, and beginners.",
    certification: "AITI Certificate in ICT Office Productivity & Digital Skills",
    instructorId: "inst-1",
    instructorName: "Engr. Timothy A. Adeleke",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    level: "Beginner",
    active: true,
    onlineTrainingAvailable: true,
    deliveryModes: ["Online", "Physical", "Hybrid"],
    localPhysicalPrice: 35000,
    localOnlinePrice: 25000,
    internationalOnlinePrice: 60,
    promotionalPriceNGN: 20000,
    promotionalPriceUSD: 50,
    isFree: false,
    practicalHours: 30,
    modules: [],
    liveClasses: [],
    quizzes: [],
    assignments: []
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "AITI2026",
    discountPercent: 15,
    validUntil: "2026-12-31",
    maxUses: 100,
    usedCount: 14,
    active: true
  },
  {
    id: "coup-2",
    code: "GLOBALTECH",
    discountAmount: 20,
    currency: "USD",
    validUntil: "2026-12-31",
    maxUses: 50,
    usedCount: 6,
    active: true
  },
  {
    id: "coup-3",
    code: "ILORINPROMO",
    discountAmount: 5000,
    currency: "NGN",
    validUntil: "2026-12-31",
    maxUses: 200,
    usedCount: 38,
    active: true
  }
];
