import React from 'react';

export function Skills() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        "TypeScript/JavaScript",
        "Python",
        "C++",
        "C#",
        "Java",
        "R",
        "SQL",
        "SystemVerilog",
        "x86 Assembly",
        "C"
      ]
    },
    {
      title: "Frontend Development",
      skills: [
        "React.js",
        "Next.js",
        "Tailwind CSS",
        "React Native",
        "HTML/CSS",
        "Blazor",
        "Fabric.js",
        "Liveblocks",
        "Java Swing/AWT"
      ]
    },
    {
      title: "Backend & Databases",
      skills: [
        "Node.js",
        "Express.js",
        "MySQL",
        "MongoDB",
        "PostgreSQL",
        "Firebase",
        "REST APIs",
        "Java IO"
      ]
    },
    {
      title: "Cloud & DevOps",
      skills: [
        "AWS (Certified Cloud Practitioner)",
        "GCP",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Jenkins",
        "CI/CD",
        "AWS Lambda",
        "AWS API Gateway"
      ]
    },
    {
      title: "Data & ML",
      skills: [
        "Apache Spark",
        "Apache Kafka",
        "Scikit-Learn",
        "Machine Learning",
        "Data Analysis",
        "Tableau",
        "Alteryx",
        "Sentiment Analysis"
      ]
    },
    {
      title: "Development Tools",
      skills: [
        "Git",
        "Jira",
        "Confluence",
        "Postman",
        "New Relic",
        "SonarQube",
        "OpenTest"
      ]
    },
    {
      title: "APIs & Integration",
      skills: [
        "OpenAI API",
        "Notion API",
        "Google Calendar API",
        "Reddit API",
        "Twitter API",
        "API Management"
      ]
    },
    {
      title: "Business & Finance",
      skills: [
        "Financial Analysis",
        "Options Pricing",
        "Market Analysis",
        "Technical Analysis",
        "Financial Modeling",
        "Bloomberg Market Concepts"
      ]
    },
    {
      title: "Soft Skills",
      skills: [
        "Leadership",
        "Communication",
        "Public Speaking",
        "Presentation Skills",
        "Team Management",
        "Business Development",
        "Organization Skills",
        "Negotiation"
      ]
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Skills & Technologies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{category.title}</h3>
            <ul className="space-y-2">
              {category.skills.map((skill, skillIndex) => (
                <li 
                  key={skillIndex}
                  className="flex items-center gap-2 text-gray-200"
                >
                  <span className="text-blue-400/60 text-sm">▹</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 