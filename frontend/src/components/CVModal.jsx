import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// Single source of truth: the same .md Osmar prints and sends. Edit the .md, the site follows.
import cvMarkdown from '../assets/CV_Osmar_Betancourt.md?raw';

const CVModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
          aria-label="Close CV Modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-4 p-8 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="text-gray-900 prose prose-sm sm:prose max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-a:no-underline prose-img:inline prose-img:my-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {cvMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModal;
