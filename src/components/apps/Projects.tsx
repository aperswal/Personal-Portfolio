import React from 'react';

export function Projects() {
  const projects = [
    // Featured Projects
    {
      title: "CloudFormation To Terraform",
      description: "Tool to convert AWS CloudFormation templates to Terraform configurations. Most popular open-source project.",
      stats: "41 stars · 6 forks",
      tech: "Python, AWS, Terraform",
      link: "https://github.com/aperswal/CloudFormation_To_Terraform"
    },
    {
      title: "HyppoHealth",
      description: "Healthcare provider search and comparison platform. Used by private practices for patient acquisition.",
      stats: "20+ Private Practices",
      tech: "TypeScript, Next.js, PostgreSQL",
      link: "https://github.com/aperswal/HyppoHealth_Deployment"
    },
    {
      title: "PuruSocial",
      description: "Social media management and automation platform.",
      stats: "Recent Project",
      tech: "TypeScript, Social APIs",
      link: "https://github.com/aperswal/purusocial"
    },

    // Development Tools
    {
      title: "Email Verifier API",
      description: "Production-ready API service for verifying email addresses with high accuracy.",
      stats: "Public API",
      tech: "JavaScript, Node.js, REST API",
      link: "https://github.com/aperswal/Email-Verifier-API"
    },
    {
      title: "Leads List Cleaner",
      description: "Tool for cleaning and validating marketing lead lists.",
      stats: "Data Processing",
      tech: "TypeScript, Data Validation",
      link: "https://github.com/aperswal/Leads-List-Cleaner"
    },
    {
      title: "Meme Generator",
      description: "AI-powered meme generation and social media automation tool.",
      stats: "Content Creation",
      tech: "TypeScript, OpenAI API, Social APIs",
      link: "https://github.com/aperswal/social-media-poster"
    },

    // Technical Projects
    {
      title: "Unix-6-Operating-System",
      description: "Implementation of Unix V6 OS features including virtual memory and process management.",
      stats: "Systems Programming",
      tech: "C, RISC-V, Operating Systems",
      link: "https://github.com/aperswal/Unix-6-Operating-System"
    },
    {
      title: "Options Toolkit",
      description: "Options contract pricing and analysis tool with ChatGPT integration.",
      stats: "2 stars · Financial Tool",
      tech: "Python, OpenAI API, Financial Models",
      link: "https://github.com/aperswal/Options-Toolkit"
    },
    {
      title: "Property Investment Tracker",
      description: "Analytics platform for real estate investment tracking and analysis.",
      stats: "Data Analytics",
      tech: "Python, Data Analysis",
      link: "https://github.com/aperswal/property-investment-tracker"
    },

    // Web Applications
    {
      title: "WordFillWithFriends",
      description: "Multiplayer word game built with modern web technologies.",
      stats: "Game Development",
      tech: "TypeScript, WebSockets",
      link: "https://github.com/aperswal/WordFillWithFriends"
    },
    {
      title: "Figma Clone",
      description: "Simplified clone of Figma's design interface.",
      stats: "UI Development",
      tech: "TypeScript, Canvas API",
      link: "https://github.com/aperswal/Figma_Clone"
    },
    {
      title: "Google Drive Clone",
      description: "File storage and sharing platform with Google Drive features.",
      stats: "Full Stack App",
      tech: "JavaScript, Cloud Storage",
      link: "https://github.com/aperswal/Google-Drive-Clone"
    },

    // Chrome Extensions
    {
      title: "Skool Chrome Extensions",
      description: "Suite of Chrome extensions for Skool platform: Sentiment Analysis, Active Members, Inactive Members.",
      stats: "Browser Extension",
      tech: "JavaScript, Chrome API",
      link: "https://github.com/aperswal/Skool_Sentiment_Analysis_Chrome_Extension"
    },

    // AI/ML Projects
    {
      title: "Diabetes Heart Parkinsons Predictor",
      description: "Machine learning models for predicting multiple health conditions.",
      stats: "ML Application",
      tech: "Python, Jupyter, ML Models",
      link: "https://github.com/aperswal/Diabetes_Hear_Parkinsons_Predictor"
    },

    // Automation Tools
    {
      title: "Productivity Manager",
      description: "Integration between Notion and Google Calendar for automated task scheduling.",
      stats: "Task Automation",
      tech: "Python, Notion API, Google Calendar API",
      link: "https://github.com/aperswal/Productivity-Manager"
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