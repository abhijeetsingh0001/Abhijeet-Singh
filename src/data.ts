import { Project, Skill, TimelineEvent } from './types';

export const PERSONAL_DETAILS = {
  name: "Abhijeet Singh",
  role: "Computer Science Student & Systems Engineer",
  tagline: "Building high-performance software from first principles.",
  bio: "I'm a Computer Science student passionate about distributed systems, and creating high-performance, accessible software. I thrive at the intersection of low-level systems and modern web interfaces, believing that developer tools and user applications should be both incredibly fast and visually meticulous.",
  university: "Prestige Institute Of Managemnt And Research",
  gpa: "7.44/10",
  graduation: "Expected Graduation: May 2028",
  specialization: "Focusing on Fullstack Development,Data analytic",
  email: "0585CS241002@pimrbhopal.ac.in",
  github: "https://github.com/abhijeetsingh0001",
  linkedin: "https://www.linkedin.com/in/abhijeet-singh-752119336?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  resumeUrl: "#", // Local placeholder or elegant simulated action
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "search-sphere",
    title: "Search Sphere",
    description: "A high-performance Trie-based word search and autocompletion engine engineered in C++.",
    extendedDescription: "A specialized word indexing and prefix-matching system built from first principles in C++. Uses a memory-aligned retrieval tree (Trie) for dictionary-scale searching. Includes custom POSIX socket servers to accept remote client queries and stream suggestions in microseconds.",
    category: "systems",
    tech: ["C++", "STL Containers", "POSIX Sockets", "Unit Testing"],
    difficulty: "Hard",
    timeComplexity: "O(L) Search / Insertion",
    spaceComplexity: "O(A * N * L) Trie Nodes",
    highlights: [
      "Engineered a memory-aligned Trie structure capable of indexing over 350,000 dictionary records.",
      "Reduced node structure overhead by 45% using structure-padding compression and dynamic sibling chaining.",
      "Achieved average suggestion latencies under 15 microseconds, certified via precise high-resolution bench clocks.",
      "Designed clean modular headers with zero external dependencies to fit seamlessly into low-level systems."
    ]
  },
  {
    id: "spotify-clone",
    title: "Spotify Client Clone",
    description: "An interactive frontend music player with playlist curation and dynamic track rendering.",
    extendedDescription: "A modern, highly polished web audio player engineered in HTML, CSS, and TypeScript. Implements custom stream buffers, seamless crossfading, play queue reorganizers, and interactive real-time spectrum wave animations via the browser Web Audio context.",
    category: "web",
    tech: ["HTML5", "CSS3", "TypeScript", "Web Audio API"],
    difficulty: "Medium",
    timeComplexity: "O(1) Track Navigation",
    spaceComplexity: "O(P) Playlist Storage",
    highlights: [
      "Leveraged Web Audio API to handle real-time decoding, stereo panning, and dynamic audio manipulation.",
      "Created highly responsive custom media sliders, volume controls, and track queue monitors.",
      "Integrated browser local storage databases to save and restore custom playlist arrangements securely across user sessions.",
      "Designed a gorgeous, fluid audio spectrum visualizer painting 128-band frequencies onto an HTML5 canvas."
    ]
  },
  {
    id: "facial-emotion",
    title: "Facial Emotion Detection",
    description: "A deep learning MobileNetV2 Keras classifier trained for real-time live video emotion prediction.",
    extendedDescription: "A lightweight convolutional neural network pipeline engineered for low-latency inference on edge hardware. Captures live camera streams, constructs Haar-cascade face boundaries, and feeds frames to a MobileNetV2 backbone to classify expressions into four core emotion brackets.",
    category: "ai",
    tech: ["Python", "TensorFlow", "Keras", "MobileNetV2", "OpenCV"],
    difficulty: "Hard",
    timeComplexity: "O(1) Model Inference Frame Cycle",
    spaceComplexity: "O(M) Frozen Parameter Buffers",
    highlights: [
      "Refined a pre-trained MobileNetV2 model using custom transfer learning on FER2013, achieving 84.6% classification accuracy.",
      "Engineered lightweight OpenCV pre-processing filters, dropping average inference cycle times by 32ms.",
      "Maintained a stable, smooth 30fps frame rate on resource-constrained development boards.",
      "Implemented a rolling softmax score smoothing window to prevent jittery, high-frequency prediction outputs."
    ]
  },
  {
    id: "driveguard",
    title: "DriveGuard Safety System",
    description: "An IoT ideathon concept for in-vehicle alcohol detection, complete with pitch materials.",
    extendedDescription: "An award-winning hardware-software model designed to automate roadway safety. Integrates biochemical vapor sensors with vehicle ignition interlocks, and includes a full business venture package: a curated pitch deck, a highly detailed landing page, and a scripted audio walkthrough.",
    category: "tools",
    tech: ["Embedded C", "IoT Architecture", "System Design", "Pitch Deck"],
    difficulty: "Medium",
    timeComplexity: "O(1) Sensor Interrupt Loop",
    spaceComplexity: "O(1) Microcontroller RAM",
    highlights: [
      "Formulated a robust hardware interlock prototype connecting gas sensors with simulated CAN bus systems.",
      "Drafted an extensive, investor-oriented pitch deck outlining total addressable markets (TAM) and unit economics.",
      "Developed a clean, high-conversion landing page presenting mechanical block diagrams and safety ratings.",
      "Authored a 3-minute technical script detailing safety compliance overrides and emergency vehicle bypass rules."
    ]
  }
];

export const SKILLS_DATA: Skill[] = [
  // Languages
  { name: "Python", category: "languages", level: 5, description: "ML, scripting, algorithms", iconName: "Terminal" },
  { name: "C++", category: "languages", level: 4, description: "Systems design, structures, low-level", iconName: "Layers" },

  // Frontend
  { name: "React", category: "frontend", level: 5, description: "Component state, hooks, rich UX", iconName: "Workflow" },
  { name: "Tailwind CSS", category: "frontend", level: 5, description: "Responsive layouts, utility-first UI", iconName: "Palette" },
  { name: "Motion (Framer)", category: "frontend", level: 4, description: "Orchestrating layout animations", iconName: "Sparkles" },
  { name: "D3.js / SVG", category: "frontend", level: 4, description: "Data visualizations & interactive grids", iconName: "Activity" },

  // Backend
  { name: "Node.js & Express", category: "backend", level: 5, description: "Asynchronous API pipelines", iconName: "Server" },
  { name: "PostgreSQL", category: "backend", level: 4, description: "Relational constraints, complex queries", iconName: "Database" },
  { name: "Redis", category: "backend", level: 4, description: "In-memory caching and message queues", iconName: "Zap" },
  { name: "Docker", category: "backend", level: 4, description: "Microservice containerization", iconName: "Box" },

  // CS Foundations
  { name: "Data Structures", category: "systems", level: 5, description: "Trees, Graphs, HashTables, LSMs", iconName: "GitMerge" },
  { name: "Git & Linux", category: "systems", level: 5, description: "Bash scripting, SSH, version control", iconName: "Compass" }
];

export const RESUME_TIMELINE: TimelineEvent[] = [
  
  
  {
    year: "Summer 2026",
    title: "Data Analytic With Python",
    institution: "IIT Madras",
    description: "Learned the fundamentals of Data Analytics using Python, including data preprocessing, visualization, statistical analysis, and working with real-world datasets.",
    type: "education"
  },
  {
    year:"2025",
    title:"SIH Team leader",
    institution:"Prestige Institute Of Management And Research",
    description:"Served as Team Leader in SIH 2025, managing team coordination, guiding technical discussions, and ensuring timely development of an innovative solution for a problem statement.",
    type: "experience"
  }
  
  
];
