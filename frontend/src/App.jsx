import React, { useState, useEffect, useRef } from 'react';
import './index.css'; // Assuming you have an index.css for basic styling
import ChatbotPopup from './components/ChatbotPopup'; // Import the ChatbotPopup component
import CustomAIModelPage from './components/CustomAIModelPage'; // <--- NEW: Import CustomAIModelPage

export default function App() {
  const [projects, setProjects] = useState([]); // State to store fetched projects
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null);   // State to store any fetch errors
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // State for chatbot popup visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu visibility

  // Hardcoded certifications data for display
  const certifications = [
    {
      id: 1,
      title: "Datacamp Associate AI Engineer for Developers",
      issuer: "Datacamp",
      image: "https://placehold.co/600x400/007bff/ffffff?text=Datacamp+AI", // Generic placeholder
      credential_url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/35cc78ab9b3b9491fd301dbea306346575e25122", // Updated link
      description: "Certifies foundational skills in AI engineering relevant for developers.",
    },
    {
      id: 2,
      title: "Datacamp Data Engineer in Python",
      issuer: "Datacamp",
      image: "https://placehold.co/600x400/28a745/ffffff?text=Datacamp+DE", // Generic placeholder
      credential_url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/656f65c649647a935728b7d6c449af77bf77c283", // Updated link
      description: "Demonstrates expertise in building and managing data pipelines using Python.",
    },
    {
      id: 3,
      title: "Datacamp Professional Data Engineer in Python",
      issuer: "Datacamp",
      image: "https://placehold.co/600x400/ffc107/000000?text=Datacamp+Pro+DE", // Generic placeholder
      credential_url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/98fff659c6d42e3bd086bb484080a777ffc81205", // Updated link
      description: "Advanced certification in data engineering, focusing on production-ready systems and complex data challenges.",
    },
    {
      id: 4,
      title: "Datacamp Developing Large Language Models",
      issuer: "Datacamp",
      image: "https://placehold.co/600x400/6f42c1/ffffff?text=Datacamp+LLM", // Generic placeholder
      credential_url: "https://www.datacamp.com/completed/statement-of-accomplishment/track/8860025de09c0e1fb74ea5211f2d1f7ed5a6d299", // Replace with actual link
      description: "Covers the principles and practices of developing and deploying Large Language Models.",
    },
  ];

  // Hardcoded experience data for display
  const experiences = [
    {
      id: 1,
      title: "IT Technical Leader and Senior Jira Analyst",
      company: "Solutions for Everyone S4E",
      dates: "March 2024 - Ongoing",
      location: "Remote", // Assuming remote based on previous context, adjust if needed
      description: [
        "Maintaining high software solution quality and validating the software deployments.",
        "Working as project leader and the company Technical Leader.",
        "Mentoring and training junior, associates and trainees team members.",
        "Identify customer pain points to design software solutions based on Jira or custom software.",
        "Implementing AI Solutions such as Jira ChatBots and Customer Chatbots."
      ],
    },
    {
      id: 2,
      title: "Jira Analyst and AWS Cloud Practitioner",
      company: "Solutions for Everyone S4E",
      dates: "June 2021 - March 2024",
      location: "Remote", // Assuming remote based on previous context, adjust if needed
      description: [
        "Finding software solutions to customer’s problems based on their needs.",
        "Working and coordinating developments in Jira, AWS, Python APIs with multiple members of a team.",
        "Customer support and design of software applicable to their description."
      ],
    },
    // Removed the previous generic experience entries
  ];


  useEffect(() => {
    // Function to fetch projects from the Django API
    const fetchProjects = async () => {
      try {
        // Use the proxied API endpoint
        const response = await fetch('/api/projects/');
        if (!response.ok) {
          // If response is not OK (e.g., 404, 500), throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data); // Set the fetched projects to state
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error); // Set error state
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    // Only fetch projects if we are on the main page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      fetchProjects(); // Call the fetch function when the component mounts
    } else {
      setLoading(false); // Don't show loading for projects on other pages
    }

  }, []); // Empty dependency array means this effect runs once after the initial render

  // Function to close mobile menu after clicking a link
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Simple routing logic based on window.location.pathname
  const renderContent = () => {
    switch (window.location.pathname) {
      case '/custom-ai':
        return <CustomAIModelPage />;
      case '/':
      case '/index.html': // Handle default index.html path for some servers
      default:
        // Main portfolio page content
        return (
          <>
            <header className="text-center py-8 p-4 sm:p-8">
              <h1 className="text-4xl font-bold text-gray-800">My Portfolio</h1>
              <p className="text-lg text-gray-600 mt-2">Showcasing my latest projects</p>
            </header>

            {/* Hero Section */}
            <section className="bg-white rounded-lg shadow-lg p-8 md:p-12 mt-8 mb-12 text-center max-w-4xl mx-auto flex flex-col items-center">
              <img
                // Corrected LinkedIn profile picture URL
                src="https://media.licdn.com/dms/image/v2/C5603AQGgbjWnJFvsYw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1614112552998?e=1756944000&v=beta&t=XgMuj9qVpedybusnkHmKUbzgRY12QKYQOJZwEG7Usio"
                alt="Osmar Betancourt"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-md mb-6"
              />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Hi, I'm <span className="text-purple-600">Osmar Betancourt</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
                A passionate Python Developer and self-learner
                in many other programming languages such as SQL, Matlab, JavaScript and other technologies
                with 4+ years of Experience programming and working in IT and Cloud Solutions with
                IaaS, Paas and SaaS, heavily focusing on Python and now focused on working with
                PyTorch, LLMs and ML.
              </p>
              <a
                href="#projects" // Scroll to projects section
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                View My Projects
              </a>
            </section>

            {/* New Banner-like Separator for Projects section */}
            <div className="w-full bg-gradient-to-r from-blue-700 to-purple-800 text-white text-center py-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-2">My Projects</h2>
              <p className="text-lg">Explore my work and passion for data and development.</p>
                <div id="projects" className="container mx-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <p className="col-span-full text-center text-gray-700">Loading projects...</p>
                  ) : error ? (
                    <div className="col-span-full text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline"> Failed to load projects: {error.message}</span>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col min-h-[450px]">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/000000?text=Image+Not+Found'; }}
                          />
                        )}
                        <div className="p-6 flex flex-col flex-grow">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
                            <p className="text-gray-700 text-base mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.split(',').map((tech, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 mt-auto">
                            {project.github_link && (
                              <a
                                href={project.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 transition duration-150 ease-in-out"
                              >
                                <svg className="!w-4 !h-4 mr-2 flex-shrink-0 align-middle" width="16" height="16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.417 2.865 8.167 6.839 9.504.5.092.682-.217.682-.483 0-.237-.007-.867-.011-1.702-2.782.603-3.37-1.34-3.37-1.34-.454-1.154-1.11-1.463-1.11-1.463-.907-.618.069-.606.069-.606 1.004.07 1.532 1.03 1.532 1.03.89 1.529 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.339-2.22-.253-4.555-1.115-4.555-4.949 0-1.091.39-1.984 1.03-2.682-.104-.253-.447-1.272.098-2.65 0 0 .84-.269 2.75 1.025.798-.222 1.647-.333 2.496-.337.849.004 1.698.115 2.496.337 1.908-1.294 2.747-1.025 2.747-1.025.546 1.378.202 2.397.098 2.65.64.698 1.029 1.591 1.029 2.682 0 3.841-2.339 4.692-4.566 4.943.359.309.678.92.678 1.855 0 1.339-.012 2.419-.012 2.747 0 .268.18.579.688.482C17.146 18.179 20 14.43 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" /></svg>
                                GitHub
                              </a>
                            )}
                            {project.live_link && (
                              <a
                                href={project.live_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out"
                              >
                                <svg className="!w-4 !h-4 mr-2 align-middle" width="16" height="16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
            </div>

            {/* Experience Section */}
            <section id="experience" className="w-full bg-gray-100 py-12">
              <div className="container mx-auto px-4 sm:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Experience</h2>
                <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
                  A summary of my professional journey, highlighting key roles and contributions.
                </p>
                <div className="flex flex-col space-y-8">
                  {experiences.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-xl p-6 md:p-8 text-left transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-xl text-purple-600 mb-2">{job.company}</p>
                      <p className="text-gray-600 text-base mb-2">{job.dates} | {job.location}</p>
                      <ul className="list-disc list-inside text-gray-70-0 space-y-1 mt-4">
                        {job.description.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Certifications Section */}
            <section id="certifications" className="w-full bg-blue-50 py-12">
              <div className="container mx-auto px-4 sm:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Certifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col min-h-[350px]">
                      {cert.image && (
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/000000?text=Certificate+Image'; }}
                        />
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{cert.title}</h3>
                          <p className="text-gray-600 text-base mb-2">Issued by: {cert.issuer}</p>
                          <p className="text-gray-700 text-sm mb-4">{cert.description}</p>
                        </div>
                        <div className="mt-auto">
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out"
                            >
                              View Credential
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Link to full certifications list */}
                <div className="mt-12">
                  <a
                    href="https://drive.google.com/drive/folders/12w64dkLCyLBuMNqnc-AATJDZjSwhn34n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    For a full list of my certifications and learning, click here!
                  </a>
                </div>
              </div>
            </section>

            {/* Contact Me Section */}
            <section id="contact-me" className="w-full bg-gray-900 text-white py-12 px-4 sm:px-8">
              <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">Contact Me</h2>
                <p className="text-lg mb-4">I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
                <div className="flex flex-col items-center space-y-4">
                  <a href="mailto:oaba.dev@gmail.com" className="flex items-center text-xl hover:text-blue-400 transition-colors duration-200">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    oaba.dev@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/BetancourtOsmar" target="_blank" rel="noopener noreferrer" className="flex items-center text-xl hover:text-blue-400 transition-colors duration-200">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.957-.067-2.187-1.335-2.187-1.336 0-1.542 1.04-1.542 2.125v4.24H7.99V7.125h2.583v1.125h.035c.358-.674 1.225-1.385 2.55-1.385 2.73 0 3.23 1.79 3.23 4.125v5.375zM4.004 5.338a1.666 1.666 0 110-3.332 1.666 1.666 0 010 3.332zM5.338 7.125H2.67V16.338H5.338V7.125z" clipRule="evenodd"></path></svg>
                    LinkedIn: BetancourtOsmar
                  </a>
                  <a href="tel:+584121817101" className="flex items-center text-xl hover:text-blue-400 transition-colors duration-200">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.103 6.103l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                    Phone: +584121817101
                  </a>
                </div>
              </div>
            </section>

            {/* Floating Chatbot Button */}
            <button
              onClick={() => setIsChatbotOpen(!isChatbotOpen)}
              className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-5 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 z-50"
              aria-label={isChatbotOpen ? "Close Chat" : "Open Chat"}
            >
              {isChatbotOpen ? (
                // Close icon (X) when chatbot is open
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                // Chat icon when chatbot is closed
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.517 12.118 2 10.511 2 9c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100-2 1 1 0 000 2zm7-2a1 1 0 100 2 1 1 0 000-2zm-4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>

            {/* Render ChatbotPopup component based on isChatbotOpen state */}
            <ChatbotPopup isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Top Banner Section - Now includes responsive navigation */}
      <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-between px-4 sm:px-8 text-white shadow-md relative z-10">
        {/* Placeholder for potential logo or site title on the left */}
        <div className="text-xl font-semibold">
          {/* Made "Osmar's Portfolio" a link to the main page */}
          <a href="/" className="hover:text-blue-200 transition-colors duration-200">
            Osmar's Portfolio
          </a>
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md p-2"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-4 sm:space-x-6">
          <a href="#experience" className="text-lg hover:text-blue-200 transition-colors duration-200">
            Experience
          </a>
          <a href="#certifications" className="text-lg hover:text-blue-200 transition-colors duration-200">
            Certifications
          </a>
          <a href="#contact-me" className="text-lg hover:text-blue-200 transition-colors duration-200">
            Contact Me
          </a>
          {/* Changed "Try my AI Model" to "Try other AI models" */}
          <a href="/custom-ai" className="text-lg hover:text-blue-200 transition-colors duration-200">
            Try other AI models
          </a>
        </nav>
      </div>

      {/* Mobile Navigation Menu (visible when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white shadow-lg py-4 absolute w-full z-0">
          <nav className="flex flex-col items-center space-y-4">
            <a href="#experience" className="text-lg hover:text-blue-200 transition-colors duration-200 w-full text-center py-2" onClick={handleNavLinkClick}>
              Experience
            </a>
            <a href="#certifications" className="text-lg hover:text-blue-200 transition-colors duration-200 w-full text-center py-2" onClick={handleNavLinkClick}>
              Certifications
            </a>
            <a href="#contact-me" className="text-lg hover:text-blue-200 transition-colors duration-200 w-full text-center py-2" onClick={handleNavLinkClick}>
              Contact Me
            </a>
            {/* Changed "Try my AI Model" to "Try other AI models" */}
            <a href="/custom-ai" className="text-lg hover:text-blue-200 transition-colors duration-200 w-full text-center py-2" onClick={handleNavLinkClick}>
              Try other AI models
            </a>
          </nav>
        </div>
      )}

      {renderContent()} {/* Render content based on route */}

      {/* Floating Chatbot Button (only on main page) */}
      {(window.location.pathname === '/' || window.location.pathname === '/index.html') && (
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-5 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 z-50"
          aria-label={isChatbotOpen ? "Close Chat" : "Open Chat"}
        >
          {isChatbotOpen ? (
            // Close icon (X) when chatbot is open
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            // Chat icon when chatbot is closed
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.517 12.118 2 10.511 2 9c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100-2 1 1 0 000 2zm7-2a1 1 0 100 2 1 1 0 000-2zm-4 0a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
            </svg>
          )}
        </button>
      )}

      {/* Render ChatbotPopup component based on isChatbotOpen state */}
      <ChatbotPopup isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}
