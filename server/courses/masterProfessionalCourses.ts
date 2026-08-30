import { ShortCourse } from '../../src/types';

export const masterProfessionalCourses: ShortCourse[] = [
  // COURSE 1 — PROFESSIONAL GRAPHICS DESIGN
  {
    id: "sc-graphics-design",
    code: "AITI-STC-GD01",
    title: "Professional Graphics Design",
    slug: "professional-graphics-design",
    categoryId: "scc-4",
    categoryName: "Graphics & Creative Design",
    category: "Graphics & Creative Design",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 120,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 120,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner/Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Train students to create professional visual content for businesses, brands, organizations and digital platforms using modern graphic design principles and industry-standard tools.",
    toolsCovered: ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Canva", "Modern AI Design Tools"],
    whoCanEnroll: [
      "Students & Undergraduates",
      "Graduates & NYSC Corp Members",
      "SIWES & SWEP Industrial Trainees",
      "Working Professionals & Career Changers",
      "Entrepreneurs & Business Owners",
      "Beginners & Creative Tech Enthusiasts"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Introduction to Graphics Design",
        topics: [
          "Principles of design (Balance, Hierarchy, Alignment, Contrast)",
          "Elements of design (Lines, Shapes, Texture, Space, Form)",
          "Colour theory & harmonious palettes (RGB vs CMYK)",
          "Typography fundamentals, font pairing & font anatomy",
          "Visual composition & layout grids",
          "Branding fundamentals & visual storytelling"
        ]
      },
      {
        moduleNumber: 2,
        title: "Design Software Mastery",
        topics: [
          "Adobe Photoshop: Layer management, selection tools, masking, retouching",
          "Adobe Illustrator: Vector pen tool, pathfinders, shapes, digital illustration",
          "CorelDRAW: Workspace setup, vector curves, print-ready page preparation",
          "Canva: Rapid brand asset prototyping, social templates, motion graphics",
          "Modern AI design copilots & asset generators"
        ],
        tools: ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Canva"]
      },
      {
        moduleNumber: 3,
        title: "Digital Design & Marketing Creatives",
        topics: [
          "High-converting social media graphics (Instagram, Facebook, LinkedIn)",
          "Promotional flyers, e-posters & roll-up banners",
          "Corporate business cards, letterheads & invitations",
          "Digital advertisements, website hero banners & display banners",
          "Print preparation, bleeds, DPI resolutions & color profiles"
        ]
      },
      {
        moduleNumber: 4,
        title: "Brand Identity & Corporate Branding",
        topics: [
          "Logo design methodology & conceptual sketching",
          "Full brand identity systems (Color guides, Type systems, Iconography)",
          "Corporate stationery design (ID cards, Envelopes, Invoice templates)",
          "Brand guidelines documentation (Brand Style Guide manual)",
          "Client pitch presentation & mockups creation"
        ]
      },
      {
        moduleNumber: 5,
        title: "Advanced Practical Projects & Portfolio",
        topics: [
          "Client brief analysis and creative direction",
          "End-to-end commercial design project execution",
          "Portfolio curation on Behance and Dribbble",
          "Freelancing setup, client pricing & contract delivery"
        ]
      }
    ],
    finalProject: "Create a complete brand identity for a fictional or approved business (Logo, Color System, Typography, Social Kit, Stationery & Brand Style Guide).",
    learningOutcomes: [
      "Create high-impact visual content for digital and print media",
      "Master Adobe Photoshop, Illustrator, CorelDRAW, and Canva",
      "Develop comprehensive corporate brand identity kits and brand style guides",
      "Prepare commercial print-ready artwork and interactive digital assets",
      "Build a professional graphic design portfolio and freelance service package"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Online Virtual Studio",
    venue: "Creative Design & Multimedia Suite, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // COURSE 2 — FRONT-END DEVELOPMENT
  {
    id: "sc-frontend-dev",
    code: "AITI-STC-FED02",
    title: "Front-End Development",
    slug: "front-end-development",
    categoryId: "scc-5",
    categoryName: "Web & Software Development",
    category: "Web & Software Development",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 150,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 150,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner",
    status: "published",
    featured: true,
    active: true,
    description: "Teach students how to build responsive, modern and interactive websites from scratch.",
    toolsCovered: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Tailwind CSS", "Git/GitHub", "VS Code"],
    whoCanEnroll: [
      "Students & Undergraduates",
      "Graduates & NYSC Corp Members",
      "SIWES & SWEP Students",
      "Aspiring Web Developers",
      "Career Changers & Tech Enthusiasts",
      "Complete Beginners"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Web Fundamentals",
        topics: [
          "Internet fundamentals & client-server communication",
          "Websites vs web applications architecture",
          "How browsers render web pages (DOM, CSSOM, Render Tree)",
          "Chrome Developer Tools: Inspect, Console, Network & Storage"
        ]
      },
      {
        moduleNumber: 2,
        title: "HTML5 Semantic Structure",
        topics: [
          "HTML document structure & semantic tags (<header>, <main>, <section>, <article>)",
          "Semantic forms, validation attributes, input types & accessibility",
          "HTML tables, data organization & clean markup",
          "Multimedia integration: Images, Audio, Video & SVG graphics",
          "Web accessibility (ARIA, screen reader optimization, clean alt text)"
        ]
      },
      {
        moduleNumber: 3,
        title: "CSS3 Styling & Responsive Layouts",
        topics: [
          "CSS selectors, specificity, cascade, and box model",
          "Modern layout systems: Flexbox deep-dive (Main vs Cross axis)",
          "CSS Grid 2D layout matrix & responsive templates",
          "Media queries, mobile-first design philosophy & fluid sizing",
          "CSS keyframe animations, transitions & interactive hover states"
        ]
      },
      {
        moduleNumber: 4,
        title: "JavaScript Programming & DOM Manipulation",
        topics: [
          "Variables (let, const), data types, operators & expressions",
          "Functions, arrow functions, scope & closures",
          "Arrays, objects, loops, and array helper methods (map, filter, reduce)",
          "Events, event listeners, bubbling & form submission handling",
          "DOM manipulation: Selecting, modifying, and creating elements dynamically",
          "Basic REST APIs, Fetch API, async/await & JSON handling"
        ]
      },
      {
        moduleNumber: 5,
        title: "Modern Front-End Engineering",
        topics: [
          "Git & GitHub version control, commits, branches & collaborative PRs",
          "Introduction to React: Components, JSX, props & reactive state (useState)",
          "Component-based development & reusable UI patterns",
          "Modern UI styling with Tailwind CSS utility classes",
          "Production build, hosting & deployment to Vercel/Netlify"
        ],
        tools: ["Git", "GitHub", "React", "Tailwind CSS", "Vercel"]
      }
    ],
    finalProject: "Students build and deploy a fully responsive professional website with interactive JavaScript/React features.",
    learningOutcomes: [
      "Build modern, semantic and accessible websites from scratch",
      "Craft fully responsive layouts using Flexbox, CSS Grid, and Tailwind CSS",
      "Write clean, modular JavaScript and manipulate browser DOM seamlessly",
      "Fetch and display live dynamic data from RESTful APIs",
      "Deploy live production websites using Git and cloud hosting platforms"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Global Online Classroom",
    venue: "Software Engineering Lab, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // COURSE 3 — BACK-END DEVELOPMENT
  {
    id: "sc-backend-dev",
    code: "AITI-STC-BED03",
    title: "Back-End Development",
    slug: "back-end-development",
    categoryId: "scc-5",
    categoryName: "Web & Software Development",
    category: "Web & Software Development",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 160,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 160,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Learn server-side programming, relational databases, REST API design, authentication, and secure cloud backend deployments.",
    toolsCovered: ["Node.js", "Express.js", "PostgreSQL", "SQL", "Postman", "JWT", "Git/GitHub", "Render/Cloud Run"],
    whoCanEnroll: [
      "Students & Computer Science Undergraduates",
      "Graduates & Tech Professionals",
      "Front-End Developers moving to Full-Stack",
      "Engineers seeking database & API skills",
      "Entrepreneurs building SaaS backends"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Backend Fundamentals",
        topics: [
          "Client-server architecture, HTTP protocol, request/response cycle",
          "HTTP status codes (2xx, 3xx, 4xx, 5xx) and HTTP methods (GET, POST, PUT, DELETE)",
          "REST architectural constraints & API conventions",
          "JSON payload serialization, headers, and query parameters"
        ]
      },
      {
        moduleNumber: 2,
        title: "Server-Side Programming",
        topics: [
          "Node.js runtime environment, event loop, and modular architecture",
          "Variables, functions, asynchronous execution, and promises",
          "Conditions, loops, collections, and structured data handling",
          "Error handling, try/catch paradigms, custom middleware, and logging"
        ],
        tools: ["Node.js", "Express.js"]
      },
      {
        moduleNumber: 3,
        title: "Relational Databases & SQL",
        topics: [
          "Database fundamentals, RDBMS vs NoSQL paradigms",
          "SQL DDL & DML: CREATE, SELECT, INSERT, UPDATE, DELETE",
          "Tables, primary keys, foreign keys, constraints & indexing",
          "Relational modeling (One-to-One, One-to-Many, Many-to-Many)",
          "CRUD operations with PostgreSQL & query optimization"
        ],
        tools: ["PostgreSQL", "pgAdmin / DBeaver"]
      },
      {
        moduleNumber: 4,
        title: "REST APIs, Authentication & Security",
        topics: [
          "Building robust RESTful API endpoints with Express",
          "Input validation, sanitization & data parsing",
          "User authentication: Password hashing (bcrypt) & JSON Web Tokens (JWT)",
          "Role-based access control (RBAC) middleware",
          "API security best practices (CORS, Rate Limiting, Helmet, SQL Injection prevention)"
        ],
        tools: ["JWT", "bcrypt", "Postman"]
      },
      {
        moduleNumber: 5,
        title: "Deployment & Production Practices",
        topics: [
          "Managing environment variables (.env) securely",
          "Git version control and automated GitHub repository workflows",
          "Cloud database provisioning & connection pooling",
          "Deploying backend web services to Cloud Run / Render",
          "Production logging, uptime monitoring, and API documentation with Swagger"
        ]
      }
    ],
    finalProject: "Students create and deploy a functional backend REST API connected to a PostgreSQL database with authentication, CRUD operations, and full API documentation.",
    learningOutcomes: [
      "Architect scalable server-side systems and RESTful APIs",
      "Design normalized relational database schemas with PostgreSQL",
      "Implement secure JWT authentication and role-based permissions",
      "Safeguard APIs against common vulnerabilities and OWASP threats",
      "Deploy live backend microservices and databases to the cloud"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Live Virtual Lab",
    venue: "Server & Cloud Computing Lab, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // COURSE 4 — MOBILE APP DEVELOPMENT
  {
    id: "sc-mobile-app-dev",
    code: "AITI-STC-MAD04",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    categoryId: "scc-5",
    categoryName: "Web & Software Development",
    category: "Web & Software Development",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 160,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 160,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Introduce students to the development of modern mobile applications for Android and iOS using industry-standard cross-platform frameworks.",
    toolsCovered: ["React Native / Flutter", "Expo", "TypeScript / Dart", "AsyncStorage", "REST APIs", "Mobile Simulators"],
    whoCanEnroll: [
      "Students & Computer Science Undergraduates",
      "Software Developers transitioning to Mobile",
      "Graduates & NYSC Members",
      "Entrepreneurs building mobile apps",
      "Tech Enthusiasts with basic programming knowledge"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Mobile Development Fundamentals",
        topics: [
          "Mobile ecosystem: iOS vs Android paradigms",
          "Mobile application architecture & lifecycle events",
          "Mobile UI design principles and touch ergonomics",
          "User experience patterns: Gestures, haptics, transitions, and screen density"
        ]
      },
      {
        moduleNumber: 2,
        title: "Development Environment & Tooling",
        topics: [
          "Setting up mobile SDKs, Node/Dart environments, and Expo / Flutter CLI",
          "Configuring emulators, physical device debugging & hot reload",
          "Project directory structure and mobile asset bundling",
          "State management fundamentals in mobile apps"
        ],
        tools: ["Expo", "React Native / Flutter", "VS Code"]
      },
      {
        moduleNumber: 3,
        title: "Mobile UI, Navigation & Component Layouts",
        topics: [
          "Native screens, layouts, SafeAreaViews & responsive flexbox",
          "Mobile navigation: Stack, Tab, and Drawer navigators",
          "Interactive inputs: Forms, custom buttons, modal dialogs, and datepickers",
          "High-performance scrollable lists (FlatList, SectionList) & pull-to-refresh",
          "Responsive styling for varying screen aspect ratios"
        ]
      },
      {
        moduleNumber: 4,
        title: "Data, APIs & Device Features",
        topics: [
          "Connecting mobile apps to remote REST APIs",
          "JSON payload serialization and asynchronous data fetching",
          "User authentication on mobile (Tokens, Secure storage, Biometrics basics)",
          "Offline caching and persistent local storage (AsyncStorage / SQLite)",
          "Utilizing device sensors: Camera, Geolocation, and Image Picker"
        ]
      },
      {
        moduleNumber: 5,
        title: "Practical Application & App Release Preparation",
        topics: [
          "Building a complete, production-ready small mobile application",
          "Handling offline states, error toasts, and loading skeletons",
          "App icons, splash screens, and application permissions configuration",
          "Generating APK / iOS release binaries and app store readiness checklist"
        ]
      }
    ],
    finalProject: "Students build and test a functional mobile application featuring navigation, live API data, offline storage, and responsive UI.",
    learningOutcomes: [
      "Build native cross-platform mobile apps for Android and iOS",
      "Implement multi-screen navigation flows and fluid transitions",
      "Integrate remote backend APIs and handle offline data persistence",
      "Access native smartphone capabilities including camera and geolocation",
      "Package and prepare mobile apps for app store distribution"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Interactive Online Lab",
    venue: "Mobile Application Dev Suite, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // COURSE 5 — COMPUTER HARDWARE ENGINEERING
  {
    id: "sc-hardware-eng",
    code: "AITI-STC-CHE05",
    title: "Computer Hardware Engineering",
    slug: "computer-hardware-engineering",
    categoryId: "scc-8",
    categoryName: "Computer Hardware & Networking",
    category: "Computer Hardware & Networking",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 110,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 110,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner/Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Provide practical knowledge of computer hardware, troubleshooting, maintenance, repairs and system installation.",
    toolsCovered: ["Multimeters", "ESD Protection Tools", "Toolkit & Soldering Sets", "Diagnostic Software", "BIOS/UEFI Utilities", "Thermal Paste Kits"],
    whoCanEnroll: [
      "Students & Technical Trainees",
      "Graduates & Aspiring Hardware Engineers",
      "IT Support Technicians & Helpdesk Staff",
      "Computer Business Owners & Repair Technicians",
      "Anyone interested in computer internals and diagnostics"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Computer Hardware Fundamentals",
        topics: [
          "Internal architecture: Motherboards (Form factors, Chipsets, Sockets)",
          "CPUs & Microprocessors (Architecture, Clockspeeds, Thermal management)",
          "RAM technologies (DDR4, DDR5, Dual-channel configuration)",
          "Storage drives: HDDs, SATA SSDs, NVMe M.2 drives & partitions",
          "Power supply units (PSU): Wattage calculation, 80+ ratings & voltage rails",
          "Ports, buses (PCIe), peripheral interfaces, and cooling fans"
        ]
      },
      {
        moduleNumber: 2,
        title: "Computer Assembly & System Configuration",
        topics: [
          "Safety protocols, Electrostatic Discharge (ESD) prevention & workspace prep",
          "Step-by-step custom PC assembly from bare components",
          "CPU seating, thermal paste application & heatsink installation",
          "Cable management, front panel connectors & power routing",
          "BIOS/UEFI configuration: Boot order, XMP profiles, hardware telemetry"
        ]
      },
      {
        moduleNumber: 3,
        title: "Hardware Diagnosis & Troubleshooting",
        topics: [
          "Systematic hardware fault diagnosis methodology",
          "POST error codes, Beep codes & Debug LEDs analysis",
          "No-Power & Power cycling issues: Testing PSUs with multimeters",
          "RAM instability diagnostics (MemTest86, BSOD analysis)",
          "Storage drive failure detection (S.M.A.R.T. health attributes)",
          "Overheating, thermal throttling & cooling system repairs"
        ]
      },
      {
        moduleNumber: 4,
        title: "Software, Drivers & System Maintenance",
        topics: [
          "Clean OS installation (Windows 11 & Linux distributions)",
          "Hardware device driver installation, chipset updates & firmware flashing",
          "System optimization, startup configuration & performance tuning",
          "Malware eradication and system registry maintenance",
          "Data backup strategies, drive cloning, and disaster recovery images"
        ]
      },
      {
        moduleNumber: 5,
        title: "Practical Repairs & Component Servicing",
        topics: [
          "Hands-on teardown, maintenance, and reassembly of laptops and desktops",
          "Laptop screen replacements, keyboard swaps, and battery maintenance",
          "Cleaning internal dust, replacing thermal pads and fans",
          "Refurbishing legacy hardware and cost-effective upgrades"
        ]
      }
    ],
    finalProject: "Diagnose and repair a simulated faulty computer system (Power failure, RAM defect, corrupted OS, thermal issue) and generate a professional technical repair report.",
    learningOutcomes: [
      "Identify, assemble, and configure all core PC and laptop hardware components",
      "Systematically troubleshoot no-boot, freezing, and power failure defects",
      "Perform precision BIOS/UEFI setups and clean operating system deployments",
      "Execute laptop servicing including screen, battery, and cooling fan replacements",
      "Launch a professional hardware maintenance and repair service desk"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Practical Demonstration Streams",
    venue: "Hardware Engineering & Electronics Lab, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // COURSE 6 — AI AUTOMATION
  {
    id: "sc-ai-automation",
    code: "AITI-STC-AIA06",
    title: "AI Automation",
    slug: "ai-automation",
    categoryId: "scc-3",
    categoryName: "Artificial Intelligence",
    category: "Artificial Intelligence",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 140,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 140,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner/Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Teach students how to use artificial intelligence and automation tools to improve productivity and automate real-world business processes.",
    toolsCovered: ["ChatGPT / Claude / Gemini", "n8n", "Make.com", "Zapier", "OpenAI APIs", "Google Workspace Automation", "WhatsApp Business Automation"],
    whoCanEnroll: [
      "Business Owners & Entrepreneurs",
      "Working Professionals & Administrative Managers",
      "Students & Graduates",
      "Digital Marketers & Operations Officers",
      "Freelancers looking to 10x their output with AI"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Artificial Intelligence Fundamentals",
        topics: [
          "What is AI? History, machine learning, deep learning overview",
          "Generative AI mechanics: Tokens, transformers, context windows",
          "Large Language Models (LLMs) landscape: GPT-4, Claude, Gemini",
          "AI assistants, copilots, and autonomous agent frameworks",
          "Responsible AI: Data privacy, hallucination mitigation, ethical usage"
        ]
      },
      {
        moduleNumber: 2,
        title: "Prompt Engineering Mastery",
        topics: [
          "Effective prompting architectures: Instructions, context, input, output format",
          "Structured prompts: Markdown framing, JSON schemas, system instructions",
          "Role prompting & persona calibration for specialized tasks",
          "Few-shot prompting, chain-of-thought, and step-by-step reasoning",
          "Building automated reusable prompt libraries for organizations"
        ]
      },
      {
        moduleNumber: 3,
        title: "AI Workplace Productivity",
        topics: [
          "AI content creation: Long-form articles, copy, email campaigns",
          "AI for deep research, document summarization & PDF Q&A",
          "AI presentations, executive pitch deck generation, and visual aids",
          "AI image generation and digital creative workflows (Midjourney / DALL-E)",
          "AI data analysis: Excel spreadsheet formulas, CSV analysis, trend extraction",
          "Automating routine administrative business tasks"
        ]
      },
      {
        moduleNumber: 4,
        title: "Workflow Automation Foundations",
        topics: [
          "Introduction to no-code automation platforms: n8n, Make.com, Zapier",
          "Core automation paradigm: Trigger → Process / Filter → Action",
          "Connecting apps via Webhooks, REST APIs, and authentication tokens",
          "Data transformation, JSON mapping, conditional branching, and error routing",
          "Scheduled cron automation tasks and event-driven pipelines"
        ],
        tools: ["n8n", "Make.com", "Zapier", "Webhooks"]
      },
      {
        moduleNumber: 5,
        title: "Practical Business Automation Workflows",
        topics: [
          "End-to-End Workflow 1: Website Form → Database (Google Sheets/Airtable) → WhatsApp Notification",
          "End-to-End Workflow 2: Payment Receipt → PDF Invoice Generation → Automated Email Confirmation & SMS Alert",
          "End-to-End Workflow 3: Customer Inquiry → AI Lead Categorization → CRM Assignment → Auto-responder",
          "Testing, debugging, API rate limits, and continuous automation monitoring"
        ]
      }
    ],
    finalProject: "Students build a working AI-powered multi-step automation workflow (e.g. Lead Form → AI Classification → Database Store → WhatsApp & Email Dispatch).",
    learningOutcomes: [
      "Master prompt engineering techniques across major LLMs (Gemini, Claude, GPT)",
      "Automate repetitive workplace workflows using n8n, Make, and Zapier",
      "Deploy intelligent AI agents for customer support, research, and data synthesis",
      "Integrate forms, databases, WhatsApp, and email into seamless automated pipelines",
      "Consult for businesses to streamline operations and reduce operational expenses"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Global Live Interactive Studio",
    venue: "AI & Automation Innovation Lab, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // COURSE 7 — CYBERSECURITY
  {
    id: "sc-cybersecurity",
    code: "AITI-STC-CS07",
    title: "Cybersecurity",
    slug: "cybersecurity",
    categoryId: "scc-10",
    categoryName: "Cybersecurity",
    category: "Cybersecurity",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 150,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 150,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner/Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Introduce students to cybersecurity principles, digital safety, threat awareness, system security and ethical security practices.",
    toolsCovered: ["Wireshark", "Nmap", "Burp Suite (Community)", "Kali Linux Sandbox", "KeePass", "Security Audit Lab"],
    whoCanEnroll: [
      "Students & Computer Science Trainees",
      "Graduates & Career Changers entering Cybersecurity",
      "IT Support Officers & System Administrators",
      "Business Owners wanting to safeguard digital assets",
      "Anyone seeking essential digital self-defense and threat literacy"
    ],
    modules: [
      {
        moduleNumber: 1,
        title: "Cybersecurity Fundamentals",
        topics: [
          "Core cybersecurity triad: Confidentiality, Integrity, and Availability (CIA)",
          "Cyber threat landscape: Threat actors, vectors, vulnerabilities, and zero-day exploits",
          "Risk management concepts, impact analysis & security controls",
          "Defense-in-depth principles & security governance standards (ISO 27001 / NIST)"
        ]
      },
      {
        moduleNumber: 2,
        title: "Network Security",
        topics: [
          "Networking fundamentals: OSI model, TCP/IP handshake, DNS, DHCP",
          "Common network threats: Man-in-the-Middle (MITM), ARP spoofing, DDoS",
          "Firewalls (Stateful vs Packet Filtering), IDS/IPS, and VPN technologies",
          "Wireless security protocols (WPA2, WPA3) & rogue AP detection",
          "Network traffic inspection with Wireshark in simulated labs"
        ],
        tools: ["Wireshark", "Packet Analyzers"]
      },
      {
        moduleNumber: 3,
        title: "System Security & Identity Protection",
        topics: [
          "Password entropy, password managers, and multi-factor authentication (MFA/2FA)",
          "Identity and Access Management (IAM), principle of least privilege",
          "Malware analysis awareness: Viruses, Worms, Ransomware, Keyloggers, Trojans",
          "Operating system hardening (Windows & Linux security benchmarks)",
          "Patch management, system backups, and endpoint protection"
        ]
      },
      {
        moduleNumber: 4,
        title: "Web & Digital Security",
        topics: [
          "Common web vulnerabilities (OWASP Top 10: XSS, SQLi, CSRF, Insecure Deserialization)",
          "Social engineering tactics: Phishing, spear-phishing, baiting, vishing",
          "Account security hygiene, session hijack prevention, browser isolation",
          "Data privacy laws, NDPR / GDPR awareness & sensitive data encryption"
        ]
      },
      {
        moduleNumber: 5,
        title: "Ethical Security Practices & Lab Assessments",
        topics: [
          "Security testing concepts: Vulnerability scanning vs penetration testing",
          "Vulnerability assessment tools in authorized isolated sandbox labs",
          "Ethical & legal boundaries: Laws governing unauthorized access & ethics",
          "Incident response phases: Preparation, Detection, Containment, Eradication, Recovery",
          "Writing a structured cybersecurity assessment report"
        ],
        tools: ["Nmap", "Burp Suite", "Kali Linux Educational Lab"]
      }
    ],
    finalProject: "Students perform a controlled security assessment of an approved lab environment and produce an actionable security audit report.",
    learningOutcomes: [
      "Understand core cybersecurity defense mechanisms and the CIA triad",
      "Detect network anomalies, inspect packets, and configure firewall rules",
      "Defend organizations against ransomware, social engineering, and phishing",
      "Conduct safe vulnerability assessments in strictly authorized sandbox labs",
      "Formulate incident response plans and corporate digital security policies"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Sandboxed Virtual Cyber Lab",
    venue: "Cyber Defense & Information Security Lab, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // EXPANSION COURSE 8 — DATA ANALYSIS & BUSINESS INTELLIGENCE
  {
    id: "sc-data-analysis",
    code: "AITI-STC-DA08",
    title: "Data Analysis & Business Intelligence",
    slug: "data-analysis-business-intelligence",
    categoryId: "scc-2",
    categoryName: "Data & Analytics",
    category: "Data & Analytics",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 130,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 130,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner/Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Master practical data cleaning, relational SQL queries, statistical business analytics, and executive Power BI dashboard design.",
    toolsCovered: ["Microsoft Excel (Advanced)", "SQL / PostgreSQL", "Microsoft Power BI", "DAX", "Data Storytelling"],
    whoCanEnroll: [
      "Graduates & Job Seekers",
      "Accountants, Marketers & Business Analysts",
      "Students & SIWES Trainees",
      "Anyone wanting to make data-driven decisions"
    ],
    finalProject: "Build an executive interactive Power BI dashboard connected to a multi-table SQL database.",
    learningOutcomes: [
      "Transform messy real-world datasets into clean analytical structures",
      "Write multi-table SQL queries, joins, and aggregates",
      "Design interactive executive Power BI reporting dashboards"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Online Classroom",
    venue: "Data Science & BI Lab, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  },

  // EXPANSION COURSE 9 — UI/UX DESIGN & PRODUCT PROTOTYPING
  {
    id: "sc-uiux-design",
    code: "AITI-STC-UIX09",
    title: "UI/UX Design & Product Prototyping",
    slug: "ui-ux-design-product-prototyping",
    categoryId: "scc-4",
    categoryName: "Graphics & Creative Design",
    category: "Graphics & Creative Design",
    duration: "2 Months",
    durationWeeks: 8,
    durationHours: 48,
    classesPerWeek: "3 Days Per Week",
    classDuration: "2 Hours Per Class",
    schedule: "3 Days Per Week (2 Hours Per Class)",
    fee: 70000,
    feeNGN: 70000,
    localPhysicalFee: 70000,
    localOnlineFee: 70000,
    internationalOnlineFee: 120,
    localPhysicalPrice: 70000,
    localOnlinePrice: 70000,
    internationalOnlinePrice: 120,
    deliveryMode: "hybrid",
    deliveryModes: ["Physical", "Online", "Hybrid"],
    trainingFormats: ["Physical", "Online", "Hybrid"],
    onlineTrainingAvailable: true,
    onlineDeliveryType: "HYBRID ONLINE",
    certificate: "Certificate of Completion",
    certificateType: "Certificate of Completion",
    level: "Beginner/Intermediate",
    status: "published",
    featured: true,
    active: true,
    description: "Learn user research, wireframing, design systems, interactive prototypes, and usability testing in Figma.",
    toolsCovered: ["Figma", "FigJam", "Miro", "Design Systems", "Prototyping"],
    whoCanEnroll: [
      "Creative Thinkers & Designers",
      "Software Developers wanting design skills",
      "Product Managers & Founders",
      "Beginners with zero coding background"
    ],
    finalProject: "Design a complete end-to-end mobile and web application interface with an interactive Figma prototype and design system.",
    learningOutcomes: [
      "Conduct user interviews, persona mapping, and journey maps",
      "Construct scalable UI design systems with auto-layout and components",
      "Build realistic clickable prototypes and perform usability tests"
    ],
    location: "AITI Tanke Main Campus, Ilorin & Online Classroom",
    venue: "Design Innovation Suite, AITI Campus",
    upcomingBatches: ["Sep 7, 2026", "Oct 5, 2026", "Nov 2, 2026"],
    completionRules: {
      minAttendancePercent: 80,
      requiredAssignmentsCount: 4,
      minAssessmentScorePercent: 65,
      finalProjectRequired: true
    },
    accessDuration: "Until Course Completion"
  }
];
