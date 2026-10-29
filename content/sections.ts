import type { Sections } from "../lib/sections";

/* Demonstration content: a fictional building company with every optional section switched on.
   For a real business, replace each section with verified facts or set `enabled: false`.
   Never invent staff, testimonials, awards, accreditations, licences or history. */

const sections: Sections = {
  projects: { enabled: true },
  clients: { enabled: true },
  guides: { enabled: true },

  emergency: {
    enabled: true,
    label: "24/7 emergency repairs",
    phone: "0000 000 001",
    tel: "tel:+61000000001",
    text: "Storm damage, a burst pipe or an unsafe structure? Call any time, day or night.",
  },

  licences: {
    enabled: true,
    abn: "00 000 000 000",
    items: [
      { label: "Builder licence", number: "000000C" },
      { label: "Plumbing licence", number: "000000P" },
    ],
  },

  industries: {
    enabled: true,
    label: "Sectors we work in",
    title: "Sectors we work in",
    items: [
      "Residential",
      "Strata and body corporate",
      "Retail",
      "Education",
      "Healthcare",
      "Industrial",
      "Local government",
    ],
  },

  serviceAreas: {
    enabled: true,
    label: "Service areas",
    title: "Where we work",
    intro: "We work across these areas. Ask us if your site is nearby.",
    areas: [
      "Example City",
      "Northside",
      "Southbank",
      "Eastvale",
      "Westbridge",
      "Harbour District",
    ],
  },

  testimonials: {
    enabled: true,
    label: "What clients say",
    title: "Example testimonials",
    intro:
      "Replace these with real, approved quotes from the business’s clients.",
    items: [
      {
        quote:
          "Example quote: the team explained the scope clearly and kept the site tidy every day.",
        name: "Example client",
        role: "Homeowner",
      },
      {
        quote:
          "Example quote: regular updates and no surprises on the final invoice.",
        name: "Example strata manager",
        role: "Strata manager",
      },
      {
        quote:
          "Example quote: a longer testimonial to show how cards of different lengths line up next to each other in the grid.",
        name: "Example facilities lead",
        role: "Facilities manager",
      },
    ],
  },

  team: {
    enabled: true,
    label: "Our team",
    title: "The people on your job",
    intro: "Example team members. People without a photo show their initials.",
    members: [
      {
        name: "Alex Example",
        role: "Director and licensed builder",
        photo: "/demo/person-1.jpg",
        bio: "Example bio: experience, qualifications and the work this person leads.",
      },
      {
        name: "Sam Placeholder",
        role: "Site supervisor",
        photo: "/demo/person-2.jpg",
      },
      {
        name: "Jordan Sample",
        role: "Estimator",
        bio: "Example bio without a photo.",
      },
      { name: "Casey Demo", role: "Office manager" },
    ],
  },

  awards: {
    enabled: true,
    label: "Awards",
    title: "Recognition",
    items: [
      {
        year: "2025",
        title: "Example Industry Award",
        detail: "Example detail about the category and project.",
      },
      { year: "2022", title: "Example Commendation" },
    ],
  },

  history: {
    enabled: true,
    label: "Our history",
    title: "How we got here",
    intro: "An example timeline, oldest milestone first.",
    items: [
      {
        year: "2004",
        title: "Example Build Co. founded",
        text: "Example milestone text about how the business started.",
      },
      { year: "2011", title: "First commercial project" },
      {
        year: "2018",
        title: "Second office opens",
        text: "A longer example line to check how wrapping looks in the timeline.",
      },
      { year: "2025", title: "Twenty years of work" },
    ],
  },

  downloads: {
    enabled: true,
    label: "Documents",
    title: "Company documents",
    intro: "Example PDFs. Replace them with the business’s own documents.",
    items: [
      {
        title: "Capability statement",
        description: "Example capability statement.",
        file: "/demo/capability-statement.pdf",
        size: "PDF",
      },
      { title: "Safety policy", file: "/demo/safety-policy.pdf", size: "PDF" },
    ],
  },

  safety: {
    enabled: true,
    label: "Safety & quality",
    title: "Safety and quality",
    intro:
      "Example page for the business’s safety approach and accreditations.",
    paragraphs: [
      "Example paragraph: how the business plans work safely, inducts workers and keeps sites secure.",
      "Example paragraph: how quality is checked before handover.",
    ],
    principles: [
      {
        title: "Plan",
        text: "Example principle: assess risks before work starts.",
      },
      {
        title: "Check",
        text: "Example principle: inspect work at each stage.",
      },
      {
        title: "Report",
        text: "Example principle: record and act on incidents and near misses.",
      },
    ],
    accreditations: [
      {
        name: "Example quality accreditation",
        detail: "Example detail.",
        reference: "Cert EX-0001",
        logo: "/demo/accreditation.png",
      },
      {
        name: "Example safety scheme",
        detail: "Without a logo a seal is shown.",
      },
      { name: "Example industry membership" },
    ],
  },

  careers: {
    enabled: true,
    label: "Careers",
    title: "Work with us",
    intro:
      "Example careers page with one open role and an apprenticeship program.",
    paragraphs: ["Example paragraph about what it is like to work here."],
    benefits: [
      "Example benefit: company vehicle",
      "Example benefit: paid training",
      "Example benefit: rostered days off",
    ],
    applyEmail: "careers@example.com",
    roles: [
      {
        title: "Example carpenter",
        location: "Example City",
        type: "Full time",
        summary:
          "Example role summary: the work, the licence needed and who it reports to.",
      },
    ],
    apprenticeships: {
      title: "Start your trade with us",
      paragraphs: [
        "Example paragraph about the apprenticeship program.",
        "Example paragraph about support during the apprenticeship.",
      ],
      points: [
        "Example trade: carpentry",
        "Example trade: plumbing",
        "Example support: a mentor on every site",
      ],
      image: {
        src: "/demo/project-2.jpg",
        alt: "Example apprenticeship image",
      },
    },
  },

  gallery: {
    enabled: true,
    label: "Gallery",
    title: "Photos of our work",
    intro: "Example gallery. Use the business’s own photographs only.",
    images: [1, 2, 3, 4, 5, 6].map((n) => ({
      src: `/demo/project-${n}.jpg`,
      alt: `Example gallery photo ${n}`,
      caption: `Example caption ${n}`,
    })),
  },

  responsibility: {
    enabled: true,
    label: "Responsibility",
    title: "Responsibility",
    intro:
      "Example page for sustainability, community and reconciliation commitments.",
    blocks: [
      {
        id: "sustainability",
        label: "Sustainability",
        title: "Example sustainability block",
        paragraphs: ["Example paragraph.", "Second example paragraph."],
        points: ["Example commitment one", "Example commitment two"],
        image: {
          src: "/demo/project-3.jpg",
          alt: "Example sustainability image",
        },
      },
      {
        id: "community",
        label: "Community",
        title: "Example community block",
        paragraphs: ["Example paragraph without an image."],
      },
    ],
  },

  fleet: {
    enabled: true,
    label: "Equipment",
    title: "Equipment and plant",
    intro:
      "Example catalogue for businesses that hire or operate plant and equipment.",
    groups: [
      {
        title: "Example machines",
        items: [
          {
            slug: "example-excavator",
            name: "Example excavator",
            summary: "Example summary for an equipment card.",
            description: ["Example description paragraph."],
            image: {
              src: "/demo/project-4.jpg",
              alt: "Example excavator image",
            },
            models: ["Example model 5T", "Example model 8T"],
            features: ["Example attachment", "Example capacity"],
          },
          {
            slug: "example-scaffold",
            name: "Example scaffolding",
            summary: "Example equipment without a photo.",
            features: ["Example feature"],
          },
        ],
      },
    ],
  },

  news: {
    enabled: true,
    label: "News",
    title: "Company news",
    intro: "Example news articles from content/news/.",
    homeCount: 3,
  },

  // Demo links go to each platform's home page. Use the business's own profile URLs.
  socials: {
    enabled: true,
    label: 'Find us elsewhere',
    items: [
      { name: 'Facebook', href: 'https://www.facebook.com/' },
      { name: 'Instagram', href: 'https://www.instagram.com/' },
      { name: 'X', href: 'https://x.com/' },
      { name: 'Threads', href: 'https://www.threads.com/' },
      { name: 'YouTube', href: 'https://www.youtube.com/' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/' },
    ],
  },
};

export default sections;
