import React from 'react';

export function Projects() {
  const projects = [
    // Featured Projects
    {
      title: "Personal Portfolio",
      description: "Interactive portfolio website designed to mimic the macOS desktop experience, featuring draggable windows, functional dock, and realistic desktop environment.",
      stats: "Current Project",
      tech: "TypeScript, React, Next.js, TailwindCSS",
      link: "https://github.com/aperswal/Personal-Portfolio"
    },
    {
      title: "HyppoHealth",
      description: "A platform reshaping how Americans navigate healthcare with free tools and expert-backed resources for understanding and optimizing healthcare costs. Features include insurance comparison tools, cost calculators, and comprehensive educational resources.",
      stats: "Healthcare Tech",
      tech: "Web Development, Healthcare Systems, UI/UX Design",
      link: "https://hyppohealth.com/"
    },
    {
      title: "CloudFormation To Terraform",
      description: "Popular open-source tool (42 stars, 6 forks) that converts AWS CloudFormation templates to Terraform configurations with both web and CLI interfaces. Features include multi-file support, state file generation, security analysis, and documentation generation.",
      stats: "Infrastructure as Code",
      tech: "Python, Flask, AWS, Terraform",
      link: "https://github.com/aperswal/CloudFormation_To_Terraform"
    },
    {
      title: "Quick Transcriber",
      description: "Real-time speech-to-text application that locally transcribes your voice and types it at cursor position, with no internet required. Features always-on-top monitoring window and global keyboard shortcuts.",
      stats: "Productivity Tool",
      tech: "Python, Vosk, PyQt6, SoundDevice",
      link: "https://github.com/aperswal/quick-transcriber"
    },

    // Development Tools
    {
      title: "Email Verifier API",
      description: "Serverless email verification service built on AWS Lambda that validates emails through syntax checks, disposable email detection, MX record verification, and SMTP checking via AWS SES, with response caching in DynamoDB.",
      stats: "Public API",
      tech: "JavaScript, Node.js, AWS Lambda, DynamoDB, SES",
      link: "https://github.com/aperswal/Email-Verifier-API"
    },
    {
      title: "Leads List Cleaner",
      description: "Web application that leverages the Email Verifier API to process marketing lead lists, detect invalid or disposable email addresses, and improve overall campaign deliverability and effectiveness.",
      stats: "Data Processing",
      tech: "TypeScript, React, AWS Integration",
      link: "https://github.com/aperswal/Leads-List-Cleaner"
    },
    {
      title: "Social Media Poster",
      description: "Automation tool for scheduling and posting content across multiple social media platforms with analytics tracking.",
      stats: "Content Distribution",
      tech: "TypeScript, Social APIs",
      link: "https://github.com/aperswal/social-media-poster"
    },

    // Web Applications
    {
      title: "WordFillWithFriends",
      description: "Multiplayer Wordle-style word guessing game with competitive tier progression (Bronze to Diamond), global leaderboards, friend challenges, and customizable profiles with real-time updates.",
      stats: "Game Development",
      tech: "TypeScript, React, Firebase, TailwindCSS",
      link: "https://github.com/aperswal/WordFillWithFriends"
    },
    {
      title: "Figma Clone",
      description: "Fully-functional Figma clone with real-time collaboration features including multi-cursors, cursor chat, reactions, and comments. Supports shape creation, image upload, freeform drawing, element customization, and full history with undo/redo functionality.",
      stats: "UI Development",
      tech: "TypeScript, Next.js, Fabric.js, Liveblocks, Tailwind CSS",
      link: "https://github.com/aperswal/Figma_Clone"
    },
    {
      title: "Google Drive Clone",
      description: "File storage and sharing platform built to store blog posts from content-generator for freelance clients. Features file upload, organization, and sharing functionality similar to Google Drive.",
      stats: "Full Stack App",
      tech: "JavaScript, React, Firebase, Firestore, Authentication",
      link: "https://github.com/aperswal/Google-Drive-Clone"
    },
    {
      title: "Notepad Clone",
      description: "Desktop text editor application built as a first foray into desktop software development. Features standard text editing capabilities, file operations, and a customizable interface inspired by Microsoft Notepad.",
      stats: "Desktop App",
      tech: "Java, Java Extended Library, Java IO, AWT, Spring",
      link: "https://github.com/aperswal/notepad_clone"
    },
    {
      title: "Crossy Road Clone",
      description: "Recreation of the popular Crossy Road game with similar mechanics, obstacles, and character movement.",
      stats: "Game Development",
      tech: "JavaScript, Canvas API",
      link: "https://github.com/aperswal/Crossy_Road_Clone"
    },

    // Chrome Extensions
    {
      title: "Skool Sentiment Analysis",
      description: "Chrome extension that analyzes text on Skool.com, identifying frequently used phrases and assessing overall sentiment (from Super Negative to Super Positive) to help users gauge the mood of discussions. Processes text directly in the browser for privacy.",
      stats: "Browser Extension",
      tech: "JavaScript, HTML, CSS, Chrome API",
      link: "https://github.com/aperswal/Skool_Sentiment_Analysis_Chrome_Extension"
    },
    {
      title: "Skool Active Members",
      description: "Chrome extension that creates a leaderboard of the most active participants in Skool communities, helping admins and members identify key contributors. Core functionality uses proprietary algorithms to track engagement metrics.",
      stats: "Community Tools",
      tech: "JavaScript, HTML, CSS, Chrome API",
      link: "https://github.com/aperswal/Skool_Active_Members_Chrome_Extension"
    },
    {
      title: "Skool Inactive Members",
      description: "Chrome extension that automatically scans Skool communities to identify members inactive for over 30 days. Features automated page navigation, data extraction of member profiles, and CSV export functionality for easy re-engagement outreach.",
      stats: "Community Management",
      tech: "JavaScript, HTML, Chrome API, Manifest v3",
      link: "https://github.com/aperswal/Skool_Inactive_Members_Chrome_Extension"
    },

    // AI/ML Projects
    {
      title: "Diabetes Heart Parkinsons Predictor",
      description: "Web application with multiple machine learning models to predict Diabetes, Heart Disease, and Parkinson's from patient data. Includes pre-trained models stored in the application for immediate predictions via an interactive Streamlit interface.",
      stats: "ML Application",
      tech: "Python, Jupyter Notebook, Streamlit, Machine Learning",
      link: "https://github.com/aperswal/Diabetes_Hear_Parkinsons_Predictor"
    },
    {
      title: "Content Generator",
      description: "AI SEO Blog Generator that creates optimized content using OpenAI's GPT model and sources relevant images via Pexels API. Features AIDA and PAS copywriting frameworks, keyword optimization, and customizable blog structures.",
      stats: "AI Tool",
      tech: "Python, OpenAI API, Pexels API, Flask",
      link: "https://github.com/aperswal/Content-Generator"
    },

    // Productivity Tools
    {
      title: "Productivity Manager",
      description: "Integration tool that extracts tasks from Notion databases and automatically block schedules them into Google Calendar, creating a streamlined workflow for time management and deadline tracking.",
      stats: "Task Automation",
      tech: "Python, Notion API, Google Calendar API",
      link: "https://github.com/aperswal/Productivity-Manager"
    },
    {
      title: "Options Contract Pricing Project",
      description: "Advanced financial analytics platform for options traders with four specialized modules. Features include Black-Scholes modeling, Monte Carlo simulations, SABR volatility modeling, sentiment analysis from institutional trading data and Reddit, and mispriced contract identification through a public API.",
      stats: "Financial Tool",
      tech: "Python, AWS Lambda, API Gateway, Black-Scholes Model, Monte Carlo, SABR Volatility Model, Reddit API, AlphaVantage API",
      link: "https://github.com/aperswal/Options-Toolkit"
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-6 hover:bg-gray-700/40 transition-colors">
            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-blue-400">{project.stats}</p>
              <p className="text-sm text-gray-400">Tech: {project.tech}</p>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
              >
                View Project <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 