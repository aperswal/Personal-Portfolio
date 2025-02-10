import React from 'react';

export function WorkHistory() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Work History</h2>
      <div className="space-y-8">
        {/* McDonald's - Most Recent */}
        <div className="bg-gray-700/30 rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold">McDonald's Corporation</h3>
              <p className="text-blue-400">Software Development Engineer Intern</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Jun 2024 - Aug 2024</span>
              <p className="text-sm text-gray-400">Chicago, IL · Hybrid</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
            <li>Reduced misinformation in 5 million mobile order emails daily by 95% by creating an end-to-end test</li>
            <li>Saved $32,500 per year by developing an in-house tool to visualize unlimited emails without an inbox</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Technologies: OpenTest, Terraform, AWS, C#, Postman, New Relic, Docker, Jenkins, Blazor, SonarQube, Git, Jira, Confluence</p>
          </div>
        </div>

        {/* CME Group */}
        <div className="bg-gray-700/30 rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold">CME Group</h3>
              <p className="text-blue-400">Technology Intern</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">May 2023 - Aug 2023</span>
              <p className="text-sm text-gray-400">Chicago, IL</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
            <li>Analyzed over 240 datasets to identify cost savings, leading to realized savings of $38,000 and projected $510,000 over 6 months</li>
            <li>Built a proof-of-concept Google Cloud enterprise data and document sharing platform with organization-wide policies, DLP and VPC</li>
            <li>Developed 6 JavaScript and C++ automation scripts for data analysis and R-based dashboard visualization</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Technologies: Google Cloud Platform (GCP), JavaScript, C++, R</p>
          </div>
        </div>

        {/* Illinois Business Consulting - Senior Manager */}
        <div className="bg-gray-700/30 rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold">Illinois Business Consulting</h3>
              <p className="text-blue-400">Senior Manager</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">Dec 2022 - May 2023</span>
              <p className="text-sm text-gray-400">Champaign, IL</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
            <li>Led team in building asset replacement model managing 1000+ assets across 3 countries</li>
            <li>Implemented RNNs in Python to analyze 700k data points for 10-year expense projections</li>
            <li>Created economic and DCF models for agricultural company revenue growth projections</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Technologies: MySQL, Python, Machine Learning, Git</p>
          </div>
        </div>

        {/* Khatabook */}
        <div className="bg-gray-700/30 rounded-lg p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold">Khatabook</h3>
              <p className="text-blue-400">Software Engineer Intern</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-400">May 2022 - Aug 2022</span>
              <p className="text-sm text-gray-400">Bengaluru, India</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
            <li>Developed automated accounting system using Python, Django, PostgreSQL and Pandas</li>
            <li>Built secure payment processing systems using React, Redux, Node.js and Stripe</li>
            <li>Analyzed customer data using Tableau, Excel, Hadoop and Spark for product improvements</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Technologies: Python, Django, React, Node.js, PostgreSQL, Hadoop, Spark</p>
          </div>
        </div>

        {/* Additional Experience - Ordered by date */}
        <div className="bg-gray-700/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Experience</h3>
          <div className="space-y-6">
            <div>
              <p className="font-medium text-blue-400">Newlin Ventures - Student Associate</p>
              <p className="text-sm text-gray-400 mb-2">Aug 2022 - Dec 2022</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Performed market analysis on Latin America and South Asian AgTech markets</li>
                <li>Published 2 research papers on blockchain technologies in AgTech</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-400">Founders - Illinois Entrepreneurs - Director</p>
              <p className="text-sm text-gray-400 mb-2">May 2022 - Dec 2022</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Developed semester-long university-wide startup event program</li>
                <li>Created 12 subject-based curriculums with 8 mentors</li>
                <li>Built network of 50+ industry professionals</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-400">NOBE: UIUC Chapter - VP of External Affairs</p>
              <p className="text-sm text-gray-400 mb-2">Nov 2020 - Dec 2021</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Built network of 100+ corporate contacts for sponsorships</li>
                <li>Redesigned website increasing traffic by 125%</li>
                <li>Led organization of philanthropic events with Gies College of Business</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 