import React, { useState, useEffect } from 'react';
import './index.css'; // Assuming you have an index.css for basic styling

export default function App() {
  const [projects, setProjects] = useState([]); // State to store fetched projects
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null);   // State to store any fetch errors

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

    fetchProjects(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load projects: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">My Portfolio</h1>
        <p className="text-lg text-gray-600 mt-2">Showcasing my latest projects</p>
      </header>

      <main className="container mx-auto mt-8">
        {projects.length === 0 ? (
          <div className="text-center text-gray-600 text-lg p-8 bg-white rounded-lg shadow-md">
            <p>No projects found. Please add some projects via the Django admin!</p>
            <p className="mt-2">Visit <a href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">http://localhost:8000/admin/</a> to add projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
                {project.image && (
                  // Corrected: Use project.image directly as the src
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/000000?text=Image+Not+Found'; }}
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
                  <p className="text-gray-700 text-base mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.split(',').map((tech, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-700 hover:bg-gray-800 transition duration-150 ease-in-out"
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
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out"
                      >
                        <svg className="!w-4 !h-4 mr-2 align-middle" width="16" height="16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
