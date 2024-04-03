export type ProjectProps = {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  github: string | null;
  apk: string | null;
  ios: string | null;
  demo: string | null;
  image: string;
  available: boolean;
};

export const devProjects = [
  {
    id: 0,
    name: "PICH",
    description:
    "Virtual fruit marketplace connecting users and vendors, promoting healthy eating and fostering a supportive community.",
    technologies: ["Flutter", "Laravel", "Firebase"],
    github: "https://github.com/yamas-developers/pich_app.git",
    apk: null,
    ios: null,
    demo: "https://pich.dodson-development.com/admin",
    image: require(".//../../public/projects/pich.png"),
    available: true,
  },
  {
    id: 1,
    name: "Butler",
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
    description:
      "Versatile online platform for food, grocery, medicine delivery, home/auto services. Users can chat, track orders, and connect with vendors.",
    technologies: ["Flutter", "Laravel", "Firebase"],
    github: null,
    apk: "https://drive.google.com/file/d/1XqjGMyK88yjJ4qXVoaszJGmuz-AW2mYC/view?usp=sharing",
    ios: null,
    demo: "https://drive.google.com/file/d/1o0HlRL54MSbWohTB16xXq-G0mJ7hmWsG/view?usp=sharing",
    image: require(".//../../public/projects/absher.png"),
    available: true,
  },
];

export const designProjects = [
  {
    id: 1,
    name: "Hebron Statup Lab Website",
    description:
      "SkyWatch is a convenient and user-friendly tool that allows you to quickly and easily check the current.",
    technologies: ["UX Research", "UI Design", "Prototyping"],
    github: "",
    demo: "",
    image: "/_next/image?url=%2F..%2Fpublic%2Fprojects%2Fhsl.webp&w=1920&q=75",
    available: false,
  },
  {
    id: 2,
    name: "RAGS Scrubs Website",
    description:
      "An image generator website that allows users to generate, combine, and download images.",
    technologies: ["UX Research", "UI Design", "Prototyping"],
    github: "",
    demo: "",
    image: "/_next/image?url=%2F..%2Fpublic%2Fprojects%2Frags.webp&w=1920&q=75",
    available: false,
  },
  {
    id: 3,
    name: "Crown Branding Agency Website",
    description:
      "A website that reduces the length of your URL using Bit.ly's API",
    technologies: ["UX Research", "UI Design", "Prototyping"],
    github: "",
    demo: "",
    image:
      "/_next/image?url=%2F..%2Fpublic%2Fprojects%2Fcrown.webp&w=1920&q=75",
    available: false,
  },
  {
    id: 4,
    name: "Titi Mobile App",
    description:
      "TMTM helps you find people who are headed to the same location as you, so you can share a ride and split the cost with them.",
    technologies: ["UX Research", "UI Design", "Prototyping"],
    github: "",
    demo: "",
    image: "/_next/image?url=%2F..%2Fpublic%2Fprojects%2Ftiti.webp&w=1920&q=75",
    available: false,
  },
];
