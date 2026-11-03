export type ProjectProps = {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  github: string | null;
  apk: string | null;
  ios: string | null;
  demo: string | null;
  image: string | null;
  category?: string;
  role?: string;
  demoLabel?: string;
  webApp?: string;
  available: boolean;
};

export const devProjects: ProjectProps[] = [
  {
    id: 0,
    name: "PICH",
    role: "Full stack developer",
    category: "Marketplace",
    description:
      "Virtual fruit marketplace connecting users and vendors, promoting healthy eating and fostering a supportive community.",
    technologies: ["Flutter", "Laravel", "Firebase"],
    github: "https://github.com/yamas-developers/pich_app.git",
    apk: null,
    ios: null,
    demo: "https://pich.dodson-development.com/admin",
    demoLabel: "Admin portal",
    image: require(".//../../public/projects/pich.png"),
    available: true,
  },
  {
    id: 1,
    name: "Butler",
    role: "Full stack developer",
    category: "On-demand services",
    description:
      "Convenient online cleaning services solution. Users request specific services, receive proposals from cleaners, chat, book recurring sessions, and provide feedback.",
    technologies: ["Flutter", "Laravel", "Firebase"],
    github: null,
    apk: "https://drive.google.com/file/d/1SN3QA4WuknhbdnNdoTww3WBCBKI9vxFQ/view",
    ios: null,
    demo: "https://butlerapp.co",
    image: require(".//../../public/projects/butler.png"),
    available: true,
  },
  {
    id: 2,
    name: "Salamly",
    role: "Full stack developer",
    category: "Community & social",
    description:
      "Islamic social media app for seamless socialization. Users share posts, stories, statuses, chat, video/audio call, react, follow like-minded individuals, and discover nearby interesting people.",
    technologies: ["Flutter", "Laravel", "Wordpress"],
    github: null,
    apk: "https://play.google.com/store/apps/details?id=com.salamgram.salamgram&pcampaignid=web_share",
    ios: "https://apps.apple.com/pk/app/salamly-ramadan-2024/id1612064624",
    demo: "http://salamgram.com",
    image: require(".//../../public/projects/salamly.png"),
    available: true,
  },
  {
    id: 3,
    name: "Absher",
    role: "Full stack developer",
    category: "Everyday services",
    description:
      "Versatile online platform for food, grocery, medicine delivery, home/auto services. Users can chat, track orders, and connect with vendors.",
    technologies: ["Flutter", "Laravel", "Firebase"],
    github: null,
    apk: "https://drive.google.com/file/d/1XqjGMyK88yjJ4qXVoaszJGmuz-AW2mYC/view?usp=sharing",
    ios: null,
    demo: "https://drive.google.com/file/d/1o0HlRL54MSbWohTB16xXq-G0mJ7hmWsG/view?usp=sharing",
    demoLabel: "Project demo",
    image: require(".//../../public/projects/absher.png"),
    available: true,
  },
];

// Project descriptions and links supplied in the portfolio PDF. Role and
// Jem.social, Black Book, Daily Empowerment, and World on Plate stacks confirmed
// by Khizr. Love One Fish's Node.js runtime is inferred from its PM2 commands.
// Other new stacks start with Flutter / Laravel at his request, pending correction.
export const additionalProjects: ProjectProps[] = [
  {
    id: 8,
    name: "Jem.social",
    role: "Full stack developer",
    category: "Creator collaboration",
    description:
      "Connect with creators, discover creative gigs, and track campaign return on investment in real time.",
    technologies: ["Flutter", "Firebase"],
    github: null,
    image: null,
    available: true,
    demo: "https://www.jem.social/",
    webApp: "https://app.jem.social/gigBoard",
    apk: null,
    ios: "https://apps.apple.com/pk/app/jem-creative-gigs-network/id6443547790",
  },
  {
    id: 13,
    name: "She & HER",
    role: "Full stack developer",
    category: "Community & connection",
    description:
      "A community and connection platform for women who love women, with a welcoming onboarding experience, profile discovery, and connections across mobile and web.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Node.js",
      "Firebase",
      "Flutter",
    ],
    github: null,
    image: null,
    available: true,
    demo: "https://www.sheandher.io/",
    apk: null,
    ios: null,
  },
  {
    id: 4,
    name: "Watch and Check",
    role: "Full stack developer",
    category: "Watch collecting",
    description:
      "Discover and track watches, explore detailed watch information, and keep up with releases and trends in horology.",
    technologies: ["Flutter", "Laravel"],
    github: null,
    image: null,
    available: true,
    demo: "https://www.watchandcheck.com/",
    apk: "https://play.google.com/store/apps/details?id=com.watch.project.watch_project",
    ios: "https://apps.apple.com/pk/app/watch-and-check/id6463630430",
  },
  {
    id: 6,
    name: "Abut",
    role: "Full stack developer",
    category: "Shopping & delivery",
    description:
      "Shop for essentials and food, arrange parcel deliveries, and connect with local and global shopping options through an AI-powered shopping experience.",
    technologies: ["Flutter", "Laravel"],
    github: null,
    image: null,
    available: true,
    demo: "https://abut.io/",
    apk: "https://play.google.com/store/apps/details?id=com.app.Abut",
    ios: "https://apps.apple.com/pk/app/abut/id1626079919",
  },
  {
    id: 5,
    name: "Black Book",
    role: "Full stack developer",
    category: "Appointments",
    description:
      "Discover and book Black service professionals across the US, including estheticians, barbers, photographers, and tattoo artists.",
    technologies: ["Flutter", "Firebase"],
    github: null,
    image: null,
    available: true,
    demo: null,
    apk: "https://play.google.com/store/apps/details?id=co.codecross.blackbook",
    ios: "https://apps.apple.com/pk/app/black-book-beauty-appointments/id6473272773",
  },
  {
    id: 7,
    name: "FeedmeZW",
    role: "Full stack developer",
    category: "Food delivery",
    description:
      "A food delivery app connecting customers with local restaurants in Zimbabwe, with a choice of cuisines, real-time tracking, and secure payments.",
    technologies: ["Flutter", "Laravel"],
    github: null,
    image: null,
    available: true,
    demo: "https://feedmezim.net/",
    apk: "https://play.google.com/store/apps/details?id=com.app.feedmezw",
    ios: "https://apps.apple.com/pk/app/feedmezw/id1447049931",
  },
  {
    id: 9,
    name: "Love One Fish",
    role: "Full stack developer",
    category: "Dating & connection",
    description:
      "A dating app for discovering matches and messaging, with preference-based matchmaking, daily swipes, and Super Likes.",
    technologies: ["Flutter", "Node.js"],
    github: null,
    image: null,
    available: true,
    demo: "https://loveonefish.com/",
    apk: "https://play.google.com/store/apps/details?id=com.app.LoveOneFish",
    ios: "https://apps.apple.com/pk/app/love-one-fish-dating/id1673718870",
  },
  {
    id: 11,
    name: "Daily Empowerment Devotional",
    role: "Full stack developer",
    category: "Faith & wellbeing",
    description:
      "Daily Bible-based devotionals, affirmations, and motivational insights to encourage reflection and help users stay grounded in their faith.",
    technologies: ["Flutter", "WordPress"],
    github: null,
    image: null,
    available: true,
    demo: "https://drive.google.com/file/d/1Tj5Hkxhvn0pXnJjJGwRqxbSvLpeejaT2/view?usp=sharing",
    demoLabel: "Watch demo (Drive)",
    apk: "https://play.google.com/store/apps/details?id=com.daily.empowerment",
    ios: "https://apps.apple.com/us/app/daily-empowerment-devotional/id6447535884",
  },
  {
    id: 12,
    name: "World on Plate",
    role: "Full stack developer",
    category: "Recipes & global cuisines",
    description:
      "Explore recipes from around the world, with step-by-step instructions, recipe ratings, regional cuisines, and cooking stories.",
    technologies: ["Next.js"],
    github: null,
    image: null,
    available: true,
    demo: "https://worldonplate.com/",
    apk: null,
    ios: null,
  },
];

// Approved homepage order:
// Jem.social → She & HER → Watch and Check → Abut → PICH → Butler,
// followed by all remaining projects.
export const projectOrderIds = [8, 13, 4, 6, 0, 1, 5, 9, 11, 12, 7, 2, 3];

const projectPool = [...additionalProjects, ...devProjects];

export const orderedProjects: ProjectProps[] = projectOrderIds
  .map((id) => projectPool.find((project) => project.id === id))
  .filter((project): project is ProjectProps => Boolean(project));

export function getProjectLinks(project: ProjectProps) {
  return [
    project.demo
      ? {
          label:
            project.demoLabel ??
            (project.id === 0
              ? "Admin portal"
              : project.id === 3
              ? "Project demo"
              : "Product website"),
          href: project.demo,
        }
      : null,
    project.webApp ? { label: "Web app", href: project.webApp } : null,
    project.ios ? { label: "App Store", href: project.ios } : null,
    project.apk
      ? {
          label: project.apk.includes("play.google.com")
            ? "Google Play"
            : "Android preview",
          href: project.apk,
        }
      : null,
    project.github ? { label: "Source code", href: project.github } : null,
  ].filter((link): link is { label: string; href: string } => Boolean(link));
}
