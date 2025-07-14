import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// Utility to check if a JWT is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    // exp is in seconds, Date.now() in ms
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
}


export default function CustomAIModelPage() {
  const [activeModel, setActiveModel] = useState('mistral');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeResult, setCodeResult] = useState("");
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageResult, setImageResult] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [googleToken, setGoogleToken] = useState(() => {
    const token = localStorage.getItem('google_id_token');
    if (token && !isTokenExpired(token)) {
      return token;
    } else {
      localStorage.removeItem('google_id_token');
      return null;
    }
  });
  const messagesEndRef = useRef(null);
  const codeMessagesEndRef = useRef(null);

  // --- Conversation List State ---
  const [conversations, setConversations] = useState([]); // [{id, created_at, ...}]
  const [isConvLoading, setIsConvLoading] = useState(false);
  const [convError, setConvError] = useState(null);
  const [showConvList, setShowConvList] = useState(false);

  // --- Conversational Codegen State ---
  const [codeMessages, setCodeMessages] = useState([]);
  const [conversationId, setConversationId] = useState(() => {
    const stored = localStorage.getItem('codegen_conversation_id');
    return stored ? parseInt(stored, 10) : null;
  });
  const conversationIdRef = useRef(conversationId);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Fetch all conversations for the user (codegen only)
  useEffect(() => {
    if (activeModel !== 'code' || !googleToken) return;
    const fetchConvs = async () => {
      setIsConvLoading(true);
      setConvError(null);
      try {
        const res = await fetch('/api/conversation/list/', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${googleToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch conversations.');
        const data = await res.json();
        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
      } catch (err) {
        setConvError(err.message);
        setConversations([]);
      } finally {
        setIsConvLoading(false);
      }
    };
    fetchConvs();
  }, [activeModel, googleToken, conversationId]);

  // Auto-load last codegen conversation history on mount or when conversationId changes
  useEffect(() => {
    conversationIdRef.current = conversationId;
    const fetchHistory = async () => {
      if (!conversationId || !googleToken) return;
      setIsHistoryLoading(true);
      try {
        const res = await fetch(`/api/conversation/${conversationId}/history/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${googleToken}`,
          },
        });
        if (res.status === 404) {
          setCodeError('This conversation no longer exists.');
          setConversationId(null);
          localStorage.removeItem('codegen_conversation_id');
          setCodeMessages([]);
          setIsHistoryLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch conversation history.');
        const data = await res.json();
        if (data && Array.isArray(data.history)) {
          const mapped = data.history.map(msg => ({
            sender: msg.role === 'assistant' ? 'ai' : 'user',
            text: msg.content,
          }));
          setCodeMessages(mapped);
        }
      } catch (err) {
        setCodeError('Failed to load conversation history.');
        setConversationId(null);
        localStorage.removeItem('codegen_conversation_id');
        setCodeMessages([]);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    if (activeModel === 'code') {
      fetchHistory();
    }
  }, [activeModel, conversationId, googleToken]);

  // Utility to get a valid Google token or clear it if expired
  const getValidGoogleToken = () => {
    if (!googleToken || isTokenExpired(googleToken)) {
      setGoogleToken(null);
      localStorage.removeItem('google_id_token');
      return null;
    }
    return googleToken;
  };

  // Function to scroll to the bottom of the chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom of codegen chat
  useEffect(() => {
    codeMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [codeMessages]);

  // Load reCAPTCHA script dynamically and render the widget
  useEffect(() => {
    const scriptId = 'recaptcha-script';
    // Ensure the script is only added once
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      // The 'onload' parameter points to a global function that reCAPTCHA will call when it's ready
      script.src = `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`;
      script.async = true;
      script.defer = true;

      // Define the global callback function for reCAPTCHA
      window.onloadCallback = function() {
        // Render the reCAPTCHA widget into the div with id 'recaptcha-widget'
        if (document.getElementById('recaptcha-widget')) {
          grecaptcha.render('recaptcha-widget', {
            sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY, // Use the site key from environment variables
            callback: function(token) {
              // This function is called when the user successfully completes the reCAPTCHA
              setRecaptchaToken(token);
              setRecaptchaError(null); // Clear any previous errors
            },
            'expired-callback': function() {
              // This function is called when the reCAPTCHA token expires
              setRecaptchaToken(null);
              setRecaptchaError('reCAPTCHA token expired. Please re-verify.');
              // You might want to re-render the widget or prompt the user to re-verify
            },
            'error-callback': function() {
              // This function is called if there's an error with reCAPTCHA
              setRecaptchaToken(null);
              setRecaptchaError('reCAPTCHA encountered an error. Please try again.');
            }
          });
        }
      };
      document.body.appendChild(script);
    }
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleSendToAI = async () => {
    if (inputMessage.trim() === '' || isSending) return;

    // Check if reCAPTCHA token is available
    if (!recaptchaToken) {
      setRecaptchaError('Please complete the reCAPTCHA challenge.');
      return;
    }

    const newUserMessage = { sender: 'user', text: inputMessage.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage(''); // Clear input immediately
    setIsSending(true); // Set sending state to true
    setRecaptchaError(null); // Clear reCAPTCHA error on new send attempt

    try {
      const apiUrl = '/api/custom-ai-model/'; // Your Django backend endpoint
      const token = getValidGoogleToken();
      if (!token) {
        setRecaptchaError('Google login expired. Please sign in again.');
        return;
      }
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          input: newUserMessage.text,
          recaptcha_token: recaptchaToken, // Include the reCAPTCHA token in the request
        }),
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
      // Reset the reCAPTCHA widget after submission to allow for a new challenge
      if (typeof grecaptcha !== 'undefined' && grecaptcha.reset) {
        grecaptcha.reset();
        setRecaptchaToken(null); // Clear the token in state
      }
    }
  };

  // --- Conversational Codegen Handlers ---
  const handleSendCodePrompt = async () => {
    if (codeInput.trim() === '' || isCodeLoading) return;
    const userMsg = { sender: 'user', text: codeInput.trim() };
    setCodeMessages((prev) => [...prev, userMsg]);
    setCodeInput('');
    setIsCodeLoading(true);
    setCodeError(null);
    setCodeResult("");
    try {
      const token = getValidGoogleToken();
      if (!token) {
        setCodeError('Google login expired. Please sign in again.');
        return;
      }
      // Always send conversation_id if present, using ref for latest value
      const body = { input: userMsg.text };
      const isNewConversation = !conversationIdRef.current;
      if (conversationIdRef.current) body.conversation_id = conversationIdRef.current;
      const res = await fetch("/api/codegen/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to get code generation result.");
      }
      const data = await res.json();
      const aiMsg = { sender: 'ai', text: data.response || "No code generated." };
      setCodeMessages((prev) => [...prev, aiMsg]);
      setCodeResult(data.response || "No code generated.");
      // Only update conversationId if this was a new conversation
      if (isNewConversation && data.conversation_id) {
        setConversationId(data.conversation_id);
        localStorage.setItem('codegen_conversation_id', data.conversation_id);
      }
    } catch (err) {
      setCodeError(err.message);
      setCodeMessages((prev) => [...prev, { sender: 'ai', text: `Error: ${err.message}` }]);
    } finally {
      setIsCodeLoading(false);
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Prevent new line on Shift+Enter
      e.preventDefault(); // Prevent default behavior (e.g., new line in textarea)
      handleSendToAI();
    }
  };

  // Handle Enter key press in code input
  const handleCodeInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCodePrompt();
    }
  };

  // Create a new conversation on the backend and reset chat state
  const handleNewConversation = async () => {
    if (isCodeLoading) return;
    setIsCodeLoading(true);
    setCodeError(null);
    try {
      const token = getValidGoogleToken();
      if (!token) {
        setCodeError('Google login expired. Please sign in again.');
        setIsCodeLoading(false);
        return;
      }
      const res = await fetch('/api/conversation/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create new conversation.');
      }
      const data = await res.json();
      setCodeMessages([]);
      setCodeInput("");
      setCodeResult("");
      setCodeError(null);
      setConversationId(data.id);
      localStorage.setItem('codegen_conversation_id', data.id);
      // Optionally refresh conversation list
      setConversations(convs => [{ id: data.id, title: data.title, updated_at: data.updated_at }, ...convs]);
    } catch (err) {
      setCodeError(err.message);
    } finally {
      setIsCodeLoading(false);
    }
  };

  // Old clear chat handler (still used for 'Clear' button)
  const handleClearCodeChat = () => {
    setCodeMessages([]);
    setCodeInput("");
    setCodeResult("");
    setCodeError(null);
    setConversationId(null);
    localStorage.removeItem('codegen_conversation_id');
  };

  // --- Conversation List Handlers ---
  const handleSelectConversation = async (convId) => {
    setIsHistoryLoading(true);
    setConversationId(convId);
    localStorage.setItem('codegen_conversation_id', convId);
    setShowConvList(false);
    // The effect will handle loading history and set isHistoryLoading to false
  };

  const handleDeleteConversation = async (convId) => {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/conversation/${convId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${googleToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete conversation.');
      // If deleted current conversation, clear it
      if (convId === conversationId) {
        handleClearCodeChat();
      }
      // Refresh conversation list
      setConversations(conversations => conversations.filter(c => c.id !== convId));
    } catch (err) {
      alert('Error deleting conversation: ' + err.message);
    }
  };

  // --- Image Generation Handlers ---
  const handleSendImagePrompt = async () => {
    if (imagePrompt.trim() === '' || isImageLoading) return;
    setIsImageLoading(true);
    setImageResult(null);
    setImageError(null);
    try {
      const token = getValidGoogleToken();
      if (!token) {
        setImageError('Google login expired. Please sign in again.');
        return;
      }
      const res = await fetch("/api/flux-image/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: imagePrompt.trim() })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate image.");
      }
      const data = await res.json();
      setImageResult(data);
    } catch (err) {
      setImageError(err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Handle Enter key press in image prompt input
  const handleImageInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendImagePrompt();
    }
  };

  const handleClearImage = () => {
    setImagePrompt("");
    setImageResult(null);
    setImageError(null);
  };

  // Dummy UI for code and image generation (replace with real logic later)
  const renderModelUI = () => {
    switch (activeModel) {
      case 'mistral':
        return (
          <div className="w-full max-w-3xl bg-zinc-900 rounded-xl shadow-lg flex flex-col h-[85vh] sm:h-[80vh] overflow-hidden border border-zinc-800">
            {/* Chat Header */}
            <div className="p-4 bg-zinc-800 text-gray-100 text-center rounded-t-xl shadow-md flex justify-between items-center border-b border-zinc-700">
              <h1 className="text-2xl font-bold font-inter">Mistral-7B-Instruct-v0.3 Chat</h1>
              <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-2xl font-bold leading-none flex items-center" aria-label="Back to Portfolio">
                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                &times; {/* HTML entity for multiplication sign, commonly used for close buttons */}
              </a>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-900 text-gray-100">
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

            {/* reCAPTCHA Error Display */}
            {recaptchaError && (
              <div className="p-2 text-center text-red-400 bg-zinc-800 border-t border-zinc-700">
                {recaptchaError}
              </div>
            )}

            {/* Message Input and Send Button */}
            <div className="p-4 border-t border-zinc-700 flex items-center bg-zinc-900 rounded-b-xl">
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
                disabled={isSending || !recaptchaToken} // Disable button if sending or no reCAPTCHA token
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>

            {/* reCAPTCHA widget container */}
            <div className="p-4 flex justify-center bg-zinc-900 rounded-b-xl">
              <div id="recaptcha-widget"></div>
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="w-full max-w-3xl bg-zinc-900 rounded-xl shadow-lg flex flex-col h-[70vh] overflow-hidden border border-zinc-800 mt-8">
            {/* Single Chat Header with Conversations button, centered title, and Clear button */}
            <div className="p-4 bg-zinc-800 text-gray-100 rounded-t-xl shadow-md border-b border-zinc-700 flex items-center justify-between gap-2">
              {/* Left: Conversations button */}
              <button
                className="px-3 py-1 bg-zinc-800 text-gray-300 border border-zinc-700 rounded hover:bg-zinc-700 text-sm font-bold"
                onClick={() => setShowConvList(v => !v)}
                title="Show all conversations"
              >
                {showConvList ? 'Hide' : 'Conversations'}
              </button>
              {/* Center: Title */}
              <h1 className="flex-1 text-2xl font-bold font-inter text-center">Code Generation (Conversational)</h1>
              {/* Right: Clear button */}
              <button
                className="text-sm text-gray-400 hover:text-red-400 border border-zinc-700 rounded px-3 py-1 ml-2"
                onClick={handleClearCodeChat}
                disabled={isCodeLoading || codeMessages.length === 0}
                title="Clear conversation"
              >
                Clear
              </button>
            </div>
            {/* Conversation List Sidebar/Modal */}
            {showConvList && (
              <div className="absolute left-0 top-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 shadow-xl z-30 flex flex-col">
                <div className="flex flex-col gap-2 p-4 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-white">Conversations</span>
                    <button className="text-gray-400 hover:text-red-400" onClick={() => setShowConvList(false)} title="Close">&times;</button>
                  </div>
                  <button
                    className="mt-2 px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded text-sm font-bold border border-purple-900 transition-colors duration-150"
                    onClick={handleNewConversation}
                    disabled={isCodeLoading}
                    title="Start a new conversation"
                  >
                    + New Conversation
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isConvLoading ? (
                    <div className="p-4 text-gray-400">Loading...</div>
                  ) : convError ? (
                    <div className="p-4 text-red-400">{convError}</div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-gray-400">No conversations found.</div>
                  ) : (
                    <ul className="divide-y divide-zinc-800">
                      {conversations.map(conv => (
                        <li key={conv.id} className={`flex items-center justify-between px-4 py-3 hover:bg-zinc-900 ${conv.id === conversationId ? 'bg-zinc-800' : ''}`}>
                          <button
                            className="flex-1 text-left text-gray-200 hover:text-purple-400 font-inter truncate"
                            onClick={() => handleSelectConversation(conv.id)}
                            title={`Started: ${conv.created_at}`}
                          >
                            Conversation #{conv.id}
                          </button>
                          <button
                            className="ml-2 px-2 py-1 text-xs rounded bg-zinc-700 text-gray-300 hover:bg-red-600 hover:text-white border border-zinc-600"
                            onClick={() => handleDeleteConversation(conv.id)}
                            title="Delete conversation"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {/* Codegen Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-900 text-gray-100">
              {codeMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-xl shadow-md ${msg.sender === 'user' ? 'bg-purple-700 text-white rounded-br-none' : 'bg-zinc-800 text-gray-200 rounded-bl-none'} relative`}>
                    {msg.sender === 'ai' ? (
                      // Render AI message with code block extraction
                      parseCodeAndTextBlocks(msg.text).map((block, i) =>
                        block.type === 'code' ? (
                          <div key={i} className="relative group">
                            <CopyButton code={block.content} />
                            <SyntaxHighlighter language={block.language} style={dracula} wrapLongLines>
                              {block.content}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <ReactMarkdown key={i} className="prose prose-invert prose-sm max-w-none">
                            {block.content.trim()}
                          </ReactMarkdown>
                        )
                      )
                    ) : (
                      <p className="text-sm sm:text-base font-inter whitespace-pre-line">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {isCodeLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-3 rounded-xl shadow-md bg-zinc-800 text-gray-200 rounded-bl-none">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                      <span>Generating code...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={codeMessagesEndRef} />
            </div>
            {/* Input Area */}
            <div className="p-4 border-t border-zinc-700 flex items-center bg-zinc-900 rounded-b-xl">
              <textarea
                className="flex-1 p-3 border border-zinc-700 bg-zinc-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-inter resize-none h-12 overflow-hidden placeholder-gray-400"
                placeholder={isHistoryLoading ? "Loading conversation..." : isCodeLoading ? "Generating..." : "Enter your code prompt here..."}
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                onKeyPress={handleCodeInputKeyPress}
                rows={1}
                maxLength={1000}
                disabled={isCodeLoading || isHistoryLoading}
              />
              <button
                onClick={handleSendCodePrompt}
                className="ml-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md font-bold font-inter flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isCodeLoading || isHistoryLoading || codeInput.trim() === ""}
              >
                {isCodeLoading ? "Generating..." : isHistoryLoading ? "Loading..." : "Send"}
              </button>
            </div>
            {codeError && <div className="p-2 text-center text-red-400 bg-zinc-800 border-t border-zinc-700">{codeError}</div>}
          </div>
        );
      case 'image':
        return (
          <div className="w-full max-w-3xl bg-zinc-900 rounded-xl shadow-lg flex flex-col h-[60vh] overflow-hidden border border-zinc-800 mt-8">
            <div className="p-4 bg-zinc-800 text-gray-100 text-center rounded-t-xl shadow-md border-b border-zinc-700 flex justify-between items-center">
              <h1 className="text-2xl font-bold font-inter">Image Generation</h1>
              <button
                className="text-sm text-gray-400 hover:text-red-400 border border-zinc-700 rounded px-3 py-1 ml-2"
                onClick={handleClearImage}
                disabled={isImageLoading && !imageError && !imageResult}
                title="Clear image"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-100 p-4">
              <textarea
                className="w-full max-w-xl p-3 border border-zinc-700 bg-zinc-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-inter resize-none h-16 overflow-hidden placeholder-gray-400 mb-4"
                placeholder={isImageLoading ? "Generating..." : "Enter your image prompt here..."}
                value={imagePrompt}
                onChange={e => setImagePrompt(e.target.value)}
                onKeyPress={handleImageInputKeyPress}
                rows={2}
                maxLength={500}
                disabled={isImageLoading}
              />
              <button
                onClick={handleSendImagePrompt}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md font-bold font-inter flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                disabled={isImageLoading || imagePrompt.trim() === ""}
              >
                {isImageLoading ? "Generating..." : "Generate Image"}
              </button>
              {imageError && <div className="text-red-400 mt-2">{imageError}</div>}
              {imageResult && (
                <div className="mt-4 flex flex-col items-center">
                  {imageResult.image_url && (
                    <img src={imageResult.image_url} alt="Generated" className="rounded-lg max-h-72 max-w-full border border-zinc-700" />
                  )}
                  {imageResult.image_base64 && (
                    <img src={`data:image/png;base64,${imageResult.image_base64}`} alt="Generated" className="rounded-lg max-h-72 max-w-full border border-zinc-700" />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
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

  // --- Helper: Split AI response into code blocks and text ---
  function parseCodeAndTextBlocks(text) {
    // Matches ```lang\n...code...``` or just ```...code...```
    const regex = /```([\w\-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    const blocks = [];
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        // Add text before code block
        blocks.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      blocks.push({ type: 'code', language: match[1] || 'python', content: match[2] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      blocks.push({ type: 'text', content: text.slice(lastIndex) });
    }
    return blocks;
  }

  // --- Helper: Copy code to clipboard ---
  function CopyButton({ code }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch (e) {
        setCopied(false);
      }
    };
    return (
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 px-2 py-1 text-xs rounded bg-zinc-700 text-gray-200 hover:bg-purple-600 transition-colors duration-150 border border-zinc-600 ${copied ? 'bg-green-600 text-white' : ''}`}
        title="Copy code to clipboard"
        style={{ zIndex: 10 }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    );
  }

  // Show login modal if not logged in
  if (!googleToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
        <div className="bg-zinc-900 p-8 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Sign in with Google to use AI models</h2>
          <GoogleLogin
            onSuccess={credentialResponse => {
              setGoogleToken(credentialResponse.credential);
              localStorage.setItem('google_id_token', credentialResponse.credential);
            }}
            onError={() => {
              alert('Google Login Failed');
            }}
            useOneTap
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-white">Try Custom AI Models</h1>
        <div className="flex justify-center gap-6 mb-4">
          <button
            className={`px-6 py-3 rounded-lg font-bold shadow transition-all duration-200 ${activeModel === 'mistral' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-blue-400 border border-blue-600 hover:bg-blue-900'}`}
            onClick={() => setActiveModel('mistral')}
          >
            MistralAI (Text)
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-bold shadow transition-all duration-200 ${activeModel === 'code' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-purple-400 border border-purple-600 hover:bg-purple-900'}`}
            onClick={() => setActiveModel('code')}
          >
            Code Generation
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-bold shadow transition-all duration-200 ${activeModel === 'image' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-green-400 border border-green-600 hover:bg-green-900'}`}
            onClick={() => setActiveModel('image')}
          >
            Image Generation
          </button>
        </div>
      </div>
      {renderModelUI()}
    </div>
  );
}
