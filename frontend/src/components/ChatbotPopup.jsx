import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // <--- NEW: Import ReactMarkdown

// ChatbotPopup component for the interactive chat interface
export default function ChatbotPopup({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [inputMessage, setInputMessage] = useState(''); // State for the current input message
  const [isSending, setIsSending] = useState(false); // State to indicate if a message is being sent
  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (isOpen) { // Only scroll if the popup is open
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Function to scroll to the bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to call the Django backend API for chat
  const callBackendChatApi = async (userMessage) => {
    const apiUrl = '/api/chat/'; // Your new Django API endpoint for chat

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }) // Send the user's message in the body
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend API error response:", errorData);
        throw new Error(`Backend API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      // Expecting the Django backend to return a JSON with a 'response' key
      if (result.response) {
        return result.response;
      } else {
        console.warn("Backend API response structure unexpected:", result);
        return "Sorry, I couldn't get a clear response from the AI via the backend.";
      }
    } catch (error) {
      console.error("Error calling backend chat API:", error);
      return `Error: ${error.message}. Please try again.`;
    }
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isSending) return; // Don't send empty messages or if already sending

    const newUserMessage = { sender: 'user', text: inputMessage.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(''); // Clear the input field
    setIsSending(true); // Set sending state to true

    try {
      const aiResponseText = await callBackendChatApi(newUserMessage.text);
      const aiResponse = { sender: 'ai', text: aiResponseText };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      // Error handling is done inside callBackendChatApi, just add a generic error message if needed
      const errorMessage = { sender: 'ai', text: "Oops! Something went wrong with the AI. Please try again later." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false); // Reset sending state
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Prevent new line on Shift+Enter
      e.preventDefault(); // Prevent default behavior (e.g., new line in textarea)
      handleSendMessage();
    }
  };

  // If the popup is not open, don't render anything
  if (!isOpen) return null;

  return (
    // MODIFIED: Adjusted positioning and sizing for better responsiveness on all screens
    <div className="fixed inset-x-4 bottom-4 z-50 w-auto max-w-full
                    sm:left-auto sm:right-4 sm:max-w-sm
                    md:right-8 md:max-w-md
                    bg-white rounded-xl shadow-2xl flex flex-col h-[70vh] max-h-[calc(100vh-2rem)] overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center rounded-t-xl shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold font-inter">AI Chat Assistant</h1>
        <button
          onClick={onClose}
          className="text-white hover:text-blue-200 transition-colors duration-200 text-2xl font-bold leading-none"
          aria-label="Close Chat"
        >
          &times; {/* HTML entity for multiplication sign, commonly used for close buttons */}
        </button>
      </div>

      {/* Messages Display Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {/* <p> tag replaced with ReactMarkdown for AI messages */}
              {msg.sender === 'ai' ? (
                <ReactMarkdown className="text-sm sm:text-base font-inter prose prose-sm max-w-none">
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
            <div className="max-w-[70%] p-3 rounded-xl shadow-sm bg-gray-200 text-gray-800 rounded-bl-none">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                <span>Typing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Empty div for scrolling */}
      </div>

      {/* Message Input and Send Button */}
      <div className="p-4 border-t border-gray-200 flex items-center bg-white rounded-b-xl">
        <textarea
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter text-gray-800 resize-none h-12 overflow-hidden"
          placeholder={isSending ? "Sending..." : "Type your message...\""}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1} // Start with one row
          maxLength={1000} // Limit input to 1000 characters
          disabled={isSending} // Disable input while sending
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out font-bold font-inter flex-shrink-0"
          disabled={isSending} // Disable button while sending
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
