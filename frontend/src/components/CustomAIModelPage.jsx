import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown for AI responses
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // A dark theme for code

export default function CustomAIModelPage() {
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [inputMessage, setInputMessage] = useState(''); // State for the current input message
  const [isSending, setIsSending] = useState(false); // State to indicate if a message is being sent
  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to the bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendToAI = async () => {
    if (inputMessage.trim() === '' || isSending) return;

    const newUserMessage = { sender: 'user', text: inputMessage.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(''); // Clear input immediately
    setIsSending(true); // Set sending state to true

    try {
      const apiUrl = '/api/custom-ai-model/'; // Your Django backend endpoint
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: newUserMessage.text }), // Send user's message as 'input'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get response from AI model.');
      }

      const data = await res.json();
      const aiResponseText = data.response || 'No response received.';
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiResponseText }]);
    } catch (err) {
      console.error("Error calling custom AI model API:", err);
      setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: `Error: ${err.message}. Please try again.` }]);
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Prevent new line on Shift+Enter
      e.preventDefault(); // Prevent default behavior (e.g., new line in textarea)
      handleSendToAI();
    }
  };

  // Custom renderer for ReactMarkdown to handle code blocks
  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula} // Apply the dark theme
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4"> {/* Very dark background */}
      <div className="w-full max-w-3xl bg-zinc-900 rounded-xl shadow-lg flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden border border-zinc-800"> {/* Darker chat container */}
        {/* Chat Header */}
        <div className="p-4 bg-zinc-800 text-gray-100 text-center rounded-t-xl shadow-md flex justify-between items-center border-b border-zinc-700"> {/* Darker header */}
          <h1 className="text-2xl font-bold font-inter">Your Custom AI Model</h1>
          <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl font-bold leading-none" aria-label="Back to Portfolio">
            &times; {/* HTML entity for multiplication sign, commonly used for close buttons */}
          </a>
        </div>

        {/* Messages Display Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-900 text-gray-100"> {/* Darker message area */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-700 text-white rounded-br-none' // Deeper blue for user
                    : 'bg-zinc-800 text-gray-200 rounded-bl-none' // Darker gray for AI
                }`}
              >
                {msg.sender === 'ai' ? (
                  <ReactMarkdown
                    className="text-sm sm:text-base font-inter prose prose-invert prose-sm max-w-none" // prose-invert for dark mode
                    components={renderers} // Use custom renderers for code blocks
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm sm:text-base font-inter">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-xl shadow-md bg-zinc-800 text-gray-200 rounded-bl-none">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
        </div>

        {/* Message Input and Send Button */}
        <div className="p-4 border-t border-zinc-700 flex items-center bg-zinc-900 rounded-b-xl"> {/* Darker input area */}
          <textarea
            className="flex-1 p-3 border border-zinc-700 bg-zinc-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter resize-none h-12 overflow-hidden placeholder-gray-400" // Darker input field
            placeholder={isSending ? "Sending..." : "Type your message..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1} // Start with one row
            maxLength={1000} // Limit input to 1000 characters
            disabled={isSending} // Disable input while sending
          />
          <button
            onClick={handleSendToAI}
            className="ml-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out font-bold font-inter flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" // Solid blue for send button
            disabled={isSending} // Disable button while sending
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
