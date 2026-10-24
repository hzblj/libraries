import {CVSections} from '../types'

export const workExperience: CVSections = [
  {
    links: [],
    location: 'Prague, CZ / Remote',
    paragraphs: [
      'Joined Footshop to lead the development of a brand-new mobile app for iOS and Android, drawing on my experience building performant, cross-platform apps.',
      'I designed and built the mobile architecture using React Native with Expo, implementing a Turbo Monorepo setup to enable efficient code sharing across multiple projects. I led the full development lifecycle of the Footshop mobile app, guiding it from initial prototyping through to production release and deployment on app stores. In parallel, I developed the Queens mobile app, Footshop’s sister brand, leveraging the same shared architecture to accelerate delivery and maintain consistency. To ensure quality and reliability, I established end-to-end testing workflows using Maestro, achieving high test coverage across key user flows. Throughout the project, I worked closely with product managers, designers, and backend developers to deliver seamless, branded shopping experiences. A strong emphasis was placed on scalability, performance, and developer experience, supported by a clean and maintainable architecture.',
    ],
    positions: [{company: 'Footshop', title: 'Lead Mobile Developer', url: 'https://footshop.com'}],
    projects: [],
    technologies: ['React Native', 'Expo', 'Turbo Monorepo', 'TypeScript', 'Maestro'],
    year: '2022 - Now',
  },
  {
    links: [],
    location: 'Prague, CZ',
    paragraphs: [
      'Qest Technologies is a leading Czech software agency specializing in the design and development of cutting-edge digital products for startups and enterprises. During my almost six years at Qest, I advanced through multiple roles, gaining hands-on experience across the full software development lifecycle, from quality assurance to full-stack and frontend development, ultimately leading mobile teams on high-impact projects.',
    ],
    positions: [
      {company: 'Qest', title: 'Lead Mobile Developer', url: 'https://qest.cz'},
      {title: 'Senior Front-End Developer'},
      {title: 'Mid Front-End Developer'},
      {title: 'Junior Full-Stack Developer'},
      {title: 'Junior Quality Assurance Engineer'},
    ],
    projects: [
      {
        name: 'DPD - My Pickup App',
        paragraphs: [
          'Led the development of the Android My Pickup app used across all DPD pickup points in the Czech Republic. Built specifically for Zebra handheld devices with integrated barcode scanners, the app was designed to streamline parcel pickup and delivery operations.',
          'I designed and implemented a mobile architecture specifically optimized for rugged Android devices, ensuring durability and performance in demanding environments. As part of the solution, I integrated scanner functionality to enable real-time parcel check-ins and check-outs, streamlining logistics operations. I also collaborated with Global Payments to integrate a POS terminal solution, allowing customers to pay for packages directly via card at pickup points. To support seamless operations, I implemented real-time synchronization across multiple devices, ensuring data consistency across all touchpoints. Additionally, I developed multiple user flows to accommodate various operational scenarios, including parcel drop-off, pickup, returns, and payments.',
        ],
        position: 'Lead Mobile Developer',
        technologies: ['React Native', 'Expo', 'TypeScript', 'Detox'],
        url: 'https://qest.cz/en/reference',
      },
      {
        name: 'Happenne – Live Events Platform',
        paragraphs: [
          'Contributed to the development of a real-time virtual event platform, enabling live video streaming, interactive chat, and dynamic user engagement features for conferences, webinars, and hybrid events.',
          'I built and maintained performant React components within a scalable frontend architecture, ensuring a robust foundation for continued product growth. As part of the effort to accelerate development, I designed and implemented key elements of a shared design system, enabling rapid and consistent feature delivery across teams. Collaborating closely with UX/UI teams, I focused on delivering pixel-perfect and accessible user experiences. Additionally, I contributed to the development of a 3D virtual lobby system that allowed event attendees to interact with virtual spaces and explore branded conference environments, an innovative solution that bridged the gap between in-person and digital event experiences.',
        ],
        position: 'Senior Front-End Developer',
        technologies: ['Next.js', 'Node.js', 'NX', 'TypeScript'],
        url: 'https://en.happenee.com',
      },
      {
        name: 'Sportlito – Fan Engagement App',
        paragraphs: [
          'Led the development of a sports-focused mobile app designed to engage football fans.',
          'I implemented Instagram-style story features with advanced gesture handling and smooth animations, creating an engaging and intuitive user experience. Working directly with the founders, I helped prioritize features and delivered fast, iterative product updates to meet evolving business goals. Throughout the development process, I maintained a strong focus on scalability, maintainability, and driving high user engagement through thoughtful design and robust engineering practices.',
        ],
        position: 'Mid Front-End Developer',
        technologies: ['React Native', 'Expo', 'TypeScript'],
        url: 'https://www.linkedin.com/company/sportlito',
      },
      {
        name: 'Volvo Czech Republic – Volvista Technician App',
        paragraphs: [
          'Redesigned and rebuilt Volvo’s mobile app to support iPad and improve overall performance.',
          'I created a custom design system tailored to adapt seamlessly across various screen sizes, ensuring a consistent and responsive user experience. To enhance the app’s functionality, I integrated AWS services, including text recognition capabilities and Amplify for secure user authentication. I also optimized performance and user experience specifically for both iPhone and iPad, delivering a smooth and reliable interface across devices.',
        ],
        position: 'Mid Front-End Developer',
        technologies: ['React Native', 'Expo', 'TypeScript'],
        url: 'https://qest.cz/en/reference',
      },
      {
        name: 'Abaku – Educational Game Platform',
        paragraphs: [
          'First major project as a developer, contributing across backend and frontend.',
          'I developed backend CRUD APIs for admin interfaces using Node.js, enabling efficient data management and administrative control. In parallel, I contributed to the main math game by helping build the core scoring logic and essential UI components that supported gameplay functionality. Throughout the project, I worked in a collaborative environment alongside senior engineers, gaining hands-on experience and learning best practices in both backend and frontend development.',
        ],
        position: 'Junior Full-Stack Developer',
        technologies: ['React', 'Node.js', 'TypeScript'],
        url: 'https://abaku.cz',
      },
      {
        name: 'Shipvio, Amazing Places, Insurance system',
        paragraphs: [
          'As a Junior QA, I contributed to ensuring product quality across multiple web and mobile applications by conducting manual/automated testing, reporting bugs, and working closely with developers and project managers to maintain high-quality standards.',
          'The projects I worked on included Shipvio, a logistics platform connecting shippers and carriers; Amazing Places, a travel platform highlighting premium accommodations; and an insurance system, an enterprise solution designed to manage insurance policies and claims for a client.',
        ],
        position: 'Junior Quality Assurance Engineer',
        technologies: ['React', 'Node.js', 'TypeScript'],
        url: 'https://www.shipvio.com',
      },
    ],
    technologies: [],
    year: '2017 - 2022',
  },
  {
    links: [],
    location: 'Prague, CZ',
    paragraphs: [
      'I started my career in software development by joining the QA team at Generali, a leading global insurance company. In this role, I focused on manual testing of internal enterprise systems to ensure their functionality and reliability.',
      'During my time there, I gained foundational experience working in Agile/Scrum teams, where I learned the importance of collaboration, sprint planning, and backlog grooming. I also developed a solid understanding of the software development lifecycle, quality assurance processes, and defect reporting tools.',
    ],
    positions: [{company: 'Generali', title: 'Junior Quality Assurance Engineer', url: 'https://www.generaliceska.cz'}],
    projects: [],
    technologies: [],
    year: '2016 - 2017',
  },
]
