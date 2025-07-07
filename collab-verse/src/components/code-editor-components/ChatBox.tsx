import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Send, 
  X, 
  Bot, 
  User, 
  Trash2, 
  CheckIcon, 
  Clipboard, 
  Loader2,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ParamValue } from "next/dist/server/request/params";
import { useUser } from "@clerk/nextjs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
  _id?: string;
  roomId: string;
  userId: string | null;
  text: {
    type: string;
    content: string;
  }[];
  isAI: boolean;
  replyToId?: string;
  createdAt: number;
  editedAt?: number;
}

interface Props {
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: ParamValue;
  editorContent: string;
}

function ChatBox({ setChatOpen, roomId , editorContent}: Props) {
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteMessage = useMutation(api.messages.deleteMessages);
  const messages = useQuery(api.messages.getMessages, {
    roomId: roomId as string,
  });
  const { user } = useUser();
  
  const [newMessage, setNewMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [aiFetching, setAiFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || aiFetching) return;
    
    setError(null);
    let needAiResponse = false;
    let needAiResponseCodeRef = false;
    let messageContent = newMessage;
    
    if (newMessage.startsWith('/ai')) {
      messageContent = newMessage.slice(3).trim();
      needAiResponse = true;
    }

    if(newMessage.startsWith('/code')) {
      messageContent = newMessage.slice(5).trim();
      needAiResponseCodeRef=true;
    }
    
    if (!messageContent.trim()) {
      setError("Please enter a message after /ai");
      return;
    }

    const parsedMessage = processText(messageContent);

    const message: Message = {
      roomId: roomId as string,
      userId: user?.id as string,
      text: parsedMessage,
      isAI: false,
      createdAt: Date.now(),
    };

    try {
      await sendMessage(message);
      setNewMessage("");
      
      if (needAiResponse) {
        await getAiResponse(messageContent);
      }
      if(needAiResponseCodeRef){
        await getAiResponseCodeRef(messageContent, editorContent);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessages = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteMessage({
        roomId: roomId as string,
        userId: user?.id as string,
      });
    } catch (error) {
      console.error("Delete messages error:", error);
      setError("Failed to delete messages. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getUserName = (userId: string | null, isAI: boolean) => {
    if (isAI) return "AI Assistant";
    if (userId === user?.id) return "You";
    return `User ${userId?.slice(-4)}`;
  };

  const getAiResponse = async (aiReq: string) => {
    try {
      setAiFetching(true);
      setError(null);
      
      const response = await fetch(`/api/ai-v1/chat-response?message=${aiReq}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();

      const processedResponse = processText(data.aiResponse);

      const aiMessage: Message = {
        roomId: roomId as string,
        userId: null,
        text: processedResponse,
        isAI: true,
        createdAt: Date.now(),
      };

      await sendMessage(aiMessage);
    } catch (error) {
      console.error("AI Response error:", error);
      setError("AI is temporarily unavailable. Please try again later.");
    } finally {
      setAiFetching(false);
    }
  };

  const getAiResponseCodeRef = async (aiReq: string, codeContent: string) => {
    try {
      setAiFetching(true);
      setError(null);
      
      const response = await fetch(`/api/ai-v1/fix-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeContent: codeContent,
          message: aiReq,
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();

      const processedResponse = processText(data.aiResponse);

      const aiMessage: Message = {
        roomId: roomId as string,
        userId: null,
        text: processedResponse,
        isAI: true,
        createdAt: Date.now(),
      };

      await sendMessage(aiMessage);
    } catch (error) {
      console.error("AI Response error:", error);
      setError("AI is temporarily unavailable. Please try again later.");
    } finally {
      setAiFetching(false);
    }
  };

  const copyToClipboard = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const processText = (responseString: string): { type: string; content: string }[] => {
    const codeBlockDelimiter = "```";
    const parts = [];
    let currentIndex = 0;

    while (currentIndex < responseString.length) {
      const codeBlockStart = responseString.indexOf(codeBlockDelimiter, currentIndex);

      if (codeBlockStart === -1) {
        if (currentIndex < responseString.length) {
          const textContent = responseString.substring(currentIndex).trim();
          if (textContent) {
            parts.push({ type: 'text', content: textContent });
          }
        }
        break;
      }

      if (codeBlockStart > currentIndex) {
        const textContent = responseString.substring(currentIndex, codeBlockStart).trim();
        if (textContent) {
          parts.push({ type: 'text', content: textContent });
        }
      }

      const codeBlockEnd = responseString.indexOf(codeBlockDelimiter, codeBlockStart + codeBlockDelimiter.length);

      if (codeBlockEnd === -1) {
        const textContent = responseString.substring(currentIndex).trim();
        if (textContent) {
          parts.push({ type: 'text', content: textContent });
        }
        break;
      }

      const rawCodeBlockContent = responseString.substring(codeBlockStart + codeBlockDelimiter.length, codeBlockEnd).trim();
      const lines = rawCodeBlockContent.split('\n');
      let actualCodeContent = rawCodeBlockContent;

      if (lines.length > 0) {
        const firstLine = lines[0].trim();
        if (firstLine && !firstLine.includes(' ') && lines.length > 1 && firstLine.length < 20) {
          actualCodeContent = lines.slice(1).join('\n').trim();
        }
      }

      if (actualCodeContent) {
        parts.push({ type: 'code', content: actualCodeContent });
      }

      currentIndex = codeBlockEnd + codeBlockDelimiter.length;
    }

    return parts;
  };

  const messageCount = Array.isArray(messages) ? messages.length : 0;
  const hasMessages = messageCount > 0;
  const isError = messages && !Array.isArray(messages) && 'error' in messages;

  return (
    <div className="h-[650px] backdrop-blur-2xl bg-black/30 border border-purple-500/60 rounded-3xl shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-purple-500/40 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold text-lg">Room Chat</h3>
          </div>
          <span className="text-xs text-gray-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30 font-medium">
            {messageCount} {messageCount === 1 ? 'message' : 'messages'}
          </span>
          <button
            onClick={handleDeleteMessages}
            disabled={isDeleting || !hasMessages}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors hover:bg-red-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Delete all messages"
            title="Delete all messages"
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        <button
          onClick={() => setChatOpen(false)}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-purple-500/30 rounded-full group"
          aria-label="Close chat"
        >
          <X size={22} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-500/20 border-b border-red-500/40 text-red-200 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-300 hover:text-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
        {isError ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-red-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>Error loading messages</p>
            </div>
          </div>
        ) : hasMessages && Array.isArray(messages) ? (
          messages.map((message: Message, index: number) => {
            const isCurrentUser = message.userId === user?.id;
            const isAI = message.isAI;

            return (
              <div
                key={message._id || index}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`max-w-[85%] ${isCurrentUser ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl p-4 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                      isAI
                        ? "bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
                        : isCurrentUser
                          ? "bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/40 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                          : "bg-gradient-to-br from-gray-600/30 to-gray-700/30 border border-gray-500/40 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`p-1 rounded-full ${isAI ? 'bg-purple-500/30' : 'bg-blue-500/30'}`}>
                        {isAI ? (
                          <Bot size={16} className="text-purple-400" />
                        ) : (
                          <User size={16} className="text-blue-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-200 font-medium">
                        {getUserName(message.userId, isAI)}
                      </span>
                      <span className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-full">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.editedAt && (
                        <span className="text-xs text-gray-500 italic bg-black/20 px-2 py-1 rounded-full">
                          edited
                        </span>
                      )}
                    </div>
                    
                    <div className="text-white text-sm leading-relaxed">
                      {message.text.map((part, partIndex) => {
                        if (part.type === 'text') {
                          return (
                            <div key={partIndex} className="whitespace-pre-wrap mb-2 last:mb-0">
                              {part.content}
                            </div>
                          );
                        }
                        
                        if (part.type === 'code') {
                          return (
                            <div key={partIndex} className="relative my-3 group/code">
                              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                <button
                                  onClick={() => copyToClipboard(part.content, partIndex)}
                                  className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm transition-all hover:scale-110"
                                  aria-label="Copy code"
                                >
                                  {copiedCode === partIndex ? (
                                    <CheckIcon className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <Clipboard className="h-4 w-4 text-gray-300" />
                                  )}
                                </button>
                              </div>
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                customStyle={{
                                  background: 'rgba(0, 0, 0, 0.6)',
                                  borderRadius: '0.75rem',
                                  padding: '1rem',
                                  margin: '0',
                                  border: '1px solid rgba(99, 102, 241, 0.2)',
                                }}
                                codeTagProps={{ 
                                  style: { 
                                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                                    fontSize: '0.875rem'
                                  } 
                                }}
                              >
                                {part.content}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }
                        
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-in fade-in-50 duration-500">
              <div className="relative mb-4">
                <Bot size={64} className="text-purple-400/50 mx-auto" />
                <div className="absolute inset-0 Bot size={64} text-purple-400/20 mx-auto animate-pulse"></div>
              </div>
              <p className="text-gray-400 text-lg mb-2">No messages yet</p>
              <p className="text-gray-300 text-sm">
                Start a conversation or type{' '}
                <span className="font-bold font-mono bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                  /ai
                </span>{' '}
                to chat with our AI assistant
              </p>
              <p className="text-gray-300 text-sm p-4">
                start with{' '}
                <span className="font-bold font-mono bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                  /code
                </span>{' '}
                to include the your current selected code file
              </p>
            </div>
          </div>
        )}
        
        {/* AI Typing Indicator */}
        {aiFetching && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="text-purple-400" />
                <span className="text-sm text-gray-200">AI is typing</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-purple-500/40 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`/ai & /code to chat with our AI`}
              className="w-full bg-black/40 border border-purple-500/60 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/80 transition-all backdrop-blur-sm hover:bg-black/50"
              rows={1}
              style={{ 
                minHeight: "44px", 
                maxHeight: "120px",
                fontSize: "14px",
                lineHeight: "1.5"
              }}

              disabled={aiFetching}
            />
            {newMessage.startsWith('/ai') && (
              <div className="absolute right-3 top-3 bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full">
                AI
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || aiFetching}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed flex items-center justify-center min-w-[52px] hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            {aiFetching ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;