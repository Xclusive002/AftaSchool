/**
 * High-Quality Tech School & ICT Education Photography Assets for AITI
 * Realistic, diverse, hands-on technology education imagery with male and female instructors and students.
 */

export interface SchoolImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  category: 'hero' | 'about' | 'lab' | 'mentorship' | 'projects' | 'faculty' | 'programs' | 'student_life' | 'admissions';
  instructorGender?: 'female' | 'male' | 'both';
  tags: string[];
}

export const TECH_SCHOOL_IMAGES = {
  // 1. Hero Section Photography
  hero: {
    mainBanner: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=85",
    alt: "Technology instructor guiding students through practical software coding in a modern lab",
    caption: "Practical hands-on technical guidance with dedicated workstation mentoring at AITI"
  },

  // 2. About & Who We Are Section
  about: {
    femaleInstructorMentoring: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
    alt: "Female software engineering lecturer mentoring students on laptops in a bright classroom",
    caption: "Personal attention and high-caliber practical mentorship across all tech disciplines"
  },

  // 3. Learning Experience & Individual Mentorship
  learningExperience: [
    {
      id: "lx-1",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85",
      title: "Collaborative Code Review",
      description: "Students collaborating around dual screens solving algorithm challenges together",
      tag: "Software Lab"
    },
    {
      id: "lx-2",
      url: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1000&q=85",
      title: "One-on-One Instructor Guidance",
      description: "Senior instructor providing personalized debugging support at student workstation",
      tag: "Direct Mentorship"
    },
    {
      id: "lx-3",
      url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=85",
      title: "UI/UX & Product Design Critiques",
      description: "Interactive design feedback session reviewing wireframes and design systems",
      tag: "Design Studio"
    },
    {
      id: "lx-4",
      url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=85",
      title: "Hardware & Diagnostic Workbench",
      description: "Hands-on motherboards, diagnostic multimeters, and micro-component repairs",
      tag: "Hardware Lab"
    }
  ],

  // 4. Modern Computer Laboratory Showcase
  computerLab: {
    mainLabWide: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=85",
    alt: "Wide shot of modern technology laboratory equipped with desktop workstations and students actively learning",
    caption: "Lab Alpha & Innovation Hub — Dedicated high-speed technical workstations at Tanke Campus, Ilorin"
  },

  // 5. Specialized Program Track Imagery
  programTracks: {
    softwareDev: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85",
    dataScienceAI: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85",
    cybersecurity: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=85",
    graphicsUIUX: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=85",
    hardwareNetworking: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=85",
    cloudInfrastructure: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85",
    digitalMarketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85",
    cadEngineering: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=85"
  },

  // 6. Student Projects & Innovation Showcase
  studentProjects: [
    {
      title: "Fintech Web App & Payment Engine",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85",
      students: "Diploma Cohort Project",
      track: "Full-Stack Software Engineering"
    },
    {
      title: "Healthcare Analytics Dashboard",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=85",
      students: "Certificate Capstone",
      track: "Data Science & PowerBI"
    },
    {
      title: "Smart E-Commerce Brand Identity",
      image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=85",
      students: "Creative Team Project",
      track: "UI/UX & Graphics Design"
    },
    {
      title: "Network Intrusion & Defense Simulator",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=85",
      students: "Advanced Cyber Group",
      track: "Cybersecurity & Defense"
    }
  ],

  // 7. Faculty & Instructors
  faculty: [
    {
      name: "Engr. Timothy A. Adeleke",
      role: "Lead Software & Cloud Architect",
      expertise: "Full-Stack TypeScript, Node.js, Python & Cloud DevOps",
      yearsExperience: "12+ Years Industry Experience",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
      qualifications: "B.Eng Electrical & Computer Engineering, AWS Certified"
    },
    {
      name: "Mrs. Fatima B. Sanni",
      role: "Head of Data Science & AI Systems",
      expertise: "Machine Learning, SQL, PowerBI & Business Intelligence",
      yearsExperience: "9+ Years Experience",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
      qualifications: "M.Sc Information Systems, Microsoft Certified Data Analyst"
    },
    {
      name: "Mr. Emmanuel O. Balogun",
      role: "Senior Cybersecurity & Networks Specialist",
      expertise: "Ethical Hacking, Network Security, Cisco Routing & Linux Administration",
      yearsExperience: "10+ Years Experience",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85",
      qualifications: "B.Sc Computer Science, CompTIA Security+, CEH"
    },
    {
      name: "Ms. Zainab A. Ibrahim",
      role: "Creative Director & UI/UX Mentor",
      expertise: "Product Design Systems, Figma, Visual Branding & Motion Graphics",
      yearsExperience: "8+ Years Experience",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
      qualifications: "B.A Graphic Communication, Certified UX Designer"
    }
  ],

  // 8. Student Life & Workshops
  studentLife: [
    {
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=85",
      title: "Weekend Hackathons & Coding Sprints"
    },
    {
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=85",
      title: "Tech Seminars & Guest Masterclasses"
    },
    {
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=85",
      title: "Peer Group Study & Project Standups"
    },
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=85",
      title: "Campus Networking & Demo Day Presentations"
    }
  ],

  // 9. Admissions Desk & Online Onboarding
  admissions: {
    desk: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
    alt: "Friendly admissions counselor speaking with prospective student about tech programs",
    caption: "Our academic advisors are ready to guide your tech career pathway"
  }
};
