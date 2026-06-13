export interface Role {
  title: string;
  period: string;
  location?: string;
  bullets: string[];
  technologies?: string[];
}

export interface Experience {
  company: string;
  type?: string;
  location?: string;
  roles: Role[];
}

export const workExperience: Experience[] = [
  {
    company: "Amazon",
    type: "Full-time",
    location: "Seattle, Washington, United States",
    roles: [
      {
        title: "Software Engineer",
        period: "Jun 2025 - Present",
        bullets: [
          "Cut $28M in Amazon Multi-Channel Fulfillment (MCF) cost, a 3% reduction, by curbing understocking with an ARIMA-based regional forecasting system that operated on limited demand features.",
          "Saved $14M, a 1.5% cost reduction across MCF, by building a k-means clustering placement system that cut average shipping distance and boxes per shipment.",
          "Recovered $1M/month ($12M/year) after a legacy placement system blocked custom networks; traced the fault across services, aligned operations and business teams, and refactored the affected systems.",
          "Freed 112 engineer-hours per week (14 each, 8 engineers) by building an agentic harness that runs concurrent Gurobi optimization over Athena and Redshift data and auto-generates analysis notebooks.",
          "Eliminated 16 hours per week of on-call work, a full one-engineer rotation, by building always-on agents that automate on-call report writing, ticket triage, and weekly generative-AI reporting.",
          "Launched Claude Opus 4.8, 4.7, and 4.6 (1M-token context) to all 85,000 users of Pippin, Amazon's internal document-writing replacement for Word and Quip, retiring the deprecated 4.5 models.",
          "Scaled service throughput 14x, from 250 to 3,500 TPS with zero degradation, by load testing and reconfiguring Kinesis, DynamoDB, Lambda, and SQS across multiple EDI publishing services.",
          "Built a statistical discrete-event simulation system that gave 50+ teams forward ROI prediction where none existed, tying upstream changes such as wQL to in-region shipments and ship cost per unit.",
          "Drove AI-tool adoption from 77% to 100% across two departments by building knowledge bases with hybrid search, prompt directories, harness-engineering practices, and per-work-type tool shortlists.",
          "Trained 30+ engineers in prompt engineering, context engineering, harness engineering, and model training through hands-on sessions and office hours.",
        ],
        technologies: ["Kotlin", "TypeScript", "AWS", "Java"],
      },
    ],
  },
  {
    company: "McDonald's",
    type: "Internship",
    location: "Chicago, Illinois, United States",
    roles: [
      {
        title: "Software Engineer Intern",
        period: "Jun 2024 - Aug 2024",
        bullets: [
          "Reduced misinformation in 5 million mobile order emails daily by 95% by creating an end-to-end testing and detection system, resulting in $182,000 yearly savings.",
          "Saved $32,500 per year by developing an in-house tool to visualize unlimited emails without an inbox.",
        ],
        technologies: [
          "OpenTest",
          "Terraform",
          "AWS",
          "C#",
          "Postman",
          "New Relic",
          "Docker",
          "Jenkins",
          "Blazor",
          "SonarQube",
          "Git",
          "Jira",
          "Confluence",
        ],
      },
    ],
  },
  {
    company: "CME Group",
    type: "Full-time",
    roles: [
      {
        title: "Technology Intern",
        period: "May 2023 - Aug 2023",
        bullets: [
          "Analyzed over 240 company-wide datasets to identify cost savings in external-party software usage and areas for security improvement, leading to realized savings of $38,000 over the summer and a projected $510,000 over the next 6 months.",
          "Built a proof-of-concept Google Cloud enterprise data and document sharing platform with organization-wide and lifetime management policies, DLP, VPC, and admin operations, with expected savings of $2.1 million per year.",
          "Built 6 JavaScript and C++ automation scripts enabling all future stakeholders to analyze datasets automatically for key risk indicators and display results on an R-based dashboard.",
        ],
        technologies: ["Google Cloud Platform (GCP)", "JavaScript", "C++", "R"],
      },
    ],
  },
  {
    company: "Illinois Business Consulting",
    type: "Part-time",
    location: "Champaign, Illinois, United States",
    roles: [
      {
        title: "Senior Manager",
        period: "Dec 2022 - May 2023",
        bullets: [
          "Led a team in building an asset replacement model managing 1,000+ assets across 3 countries to increase utilization and decrease expenses in the range of $75M for a Fortune 50 company.",
          "Implemented recurrent neural networks in Python to process time-series data of 700,000 data points and project operating expenses 10 years into the future for a binary decision tree.",
          "Created economic models within the corn processing industry and a DCF model for a leading midwestern agricultural company to identify future revenue streams growing at 15% with revenue opportunities of $2.5M+ per year.",
        ],
        technologies: [
          "MySQL",
          "Python",
          "Machine Learning",
          "Microsoft PowerPoint",
          "Git",
        ],
      },
      {
        title: "Project Manager",
        period: "Aug 2022 - Dec 2022",
        bullets: [
          "Delivered presentation on analogous industries for industrial conglomerates through primary and secondary research based on academic papers, market analysis, and expert interviews.",
          "Developed workstreams and project roadmaps for 8 consultants, scoping projects to reach and exceed client goals, leading to returning engagements for IBC.",
          "Built asset useful-life prediction model and transitioned statistical model from Python to Excel for a more intuitive interface.",
          "Wrote 18-page training and troubleshooting guidebook.",
          "Conducted regression analysis and began implementation of time-series and polynomial regression models.",
          "Led workshops in Excel, PowerPoint, and client relations.",
        ],
      },
      {
        title: "Experienced Consultant",
        period: "Sep 2021 - Aug 2022",
        bullets: [
          "Led development of one month's worth of workstreams and team meetings.",
          "Conducted primary and secondary research based on government reports, personal interviews, and academic papers to understand markets and pain points.",
          "Built and presented over 15 slide decks with professional formatting and clear delivery.",
          "Led product management and demonstration of following through with creating ideas from start to finish.",
          "Led financial analysis and demonstration of information for multiple public companies.",
          "Contributed to building over 10 slide decks and developed workstreams for consultants.",
        ],
      },
    ],
  },
  {
    company: "Founders - Illinois Entrepreneurs",
    type: "Full-time",
    location: "Urbana-Champaign Area",
    roles: [
      {
        title: "Director",
        period: "May 2022 - Dec 2022",
        bullets: [
          "Developed semester-long university-wide event to lead startups from idea to MVP creation.",
          "Created 12 subject-based curriculums and slide decks with 8 mentors to incorporate activities.",
          "Incorporated network amongst 50 industry professionals to assist students in work-based literacy.",
        ],
      },
      {
        title: "Exploration Team Member",
        period: "Sep 2021 - May 2022",
        bullets: [],
      },
    ],
  },
  {
    company: "National Organization for Business and Engineering: UIUC Chapter",
    type: "Full-time",
    location: "Urbana, Illinois, United States",
    roles: [
      {
        title: "Vice President of External Affairs",
        period: "Nov 2020 - Dec 2021",
        bullets: [
          "Built a network of 100+ corporate contacts for sponsorships and funding.",
          "Redesigned website for increased online traffic and engagement of 125%.",
          "Led the organizing and planning of philanthropic events to engage the local community through charity livestream while collaborating with Gies College of Business.",
        ],
      },
      {
        title: "Business and Technology Consultant",
        period: "Sep 2020 - Nov 2020",
        bullets: [
          "Researched energy industry within hydro, P2G, and wind to find the best entry.",
          "Created multiple pitch decks and financial models for support of decisions.",
          "Led development of qualitative and quantitative analysis with an immersive presentation.",
        ],
      },
    ],
  },
  {
    company: "Self Employed",
    type: "Freelance",
    roles: [
      {
        title: "Website Developer Partner",
        period: "Feb 2019 - Aug 2020",
        bullets: [
          "Developed skills within sales and time management to ensure quality and efficiency of the final product.",
          "Networked on multiple online discussion boards reaching over 4,000 people along with visiting local businesses, offering a total of 65 small businesses a revitalized website and sales procedure.",
          "Project: Laser Trees — Increased interactions from 200 monthly impressions to over 1,000. Utilized 389 keywords to improve website ranking from 4,405,535 to 3,299,389.",
          "Project: ByeByeBugs Wenatchee — Designed and developed interactive website along with back-end analytics interface. Assisted owners with creating a 10-step business plan and networking for new clients. Created 2-month social media marketing plan and executed ad sets bringing over 5 major sales within the first month.",
        ],
      },
    ],
  },
];
