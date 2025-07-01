import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Trash2Icon } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ParamValue } from 'next/dist/server/request/params';
import { useUser } from '@clerk/nextjs';


interface Message {
  _id?: string | undefined;
  roomId: string;
  userId: string | null;
  text: string;
  isAI: boolean;
  replyToId?: string;
  createdAt: number;
  editedAt?: number;
}

interface Props {
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: ParamValue;
}

function ChatBox({ setChatOpen, roomId }: Props) {
  const sendMessage = useMutation(api.messages.sendMessage);
  const deleteMessage = useMutation(api.messages.deleteMessages);
  const messages = useQuery(api.messages.getMessages, {roomId: roomId as string});
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      roomId: roomId as string,
      userId: user?.id as string,
      text: newMessage,
      isAI: false,
      createdAt: Date.now(),
    };

    try {
      await sendMessage(message);
      setNewMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUserName = (userId: string | null, isAI: boolean) => {
    if (isAI) return "AI Assistant";
    if (userId === user?.id) return "You";
    return `User ${userId?.slice(-2)}`;
  };

  return (
    <div className="h-[650px] backdrop-blur-2xl bg-black/30 border border-purple-500/60 rounded-3xl shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-purple-500/40 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          <h3 className="text-white font-semibold text-lg">Room Chat</h3>
          <span className="text-xs text-gray-400 bg-purple-500/20 px-2 py-1 rounded-full">
            {Array.isArray(messages) ? messages.length : 0} messages
          </span>
          <button onClick={()=>
            deleteMessage({roomId: roomId as string, userId: user?.id as string})
          }>
            <Trash2Icon className='text-white'/>
          </button>
        </div>
        
        <button
          onClick={() => setChatOpen(false)}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-purple-500/30 rounded-full"
        >
          <X size={22} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar ">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message: Message, index: number) => {

            const isCurrentUser = message.userId === user?.id;
            
            return (
              <div
                key={index}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`max-w-[85%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl p-4 backdrop-blur-sm ${
                      message.isAI
                        ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                        : isCurrentUser
                        ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                        : 'bg-gradient-to-br from-gray-600/30 to-gray-700/30 border border-gray-500/40 shadow-lg shadow-gray-500/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {message.isAI ? (
                        <Bot size={18} className="text-purple-400" />
                      ) : (
                        <User size={18} className="text-blue-400" />
                      )}
                      <span className="text-sm text-gray-200 font-medium">
                        {getUserName(message.userId, message.isAI)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(message.createdAt)}
                      </span>
                      {message.editedAt && (
                        <span className="text-xs text-gray-500 italic">(edited)</span>
                      )}
                    </div>
                    <p className="text-white text-sm leading-relaxed break-words">
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bot size={48} className="text-purple-400/50 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No messages yet</p>
              <p className="text-gray-500 text-xs">Start the conversation!</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-purple-500/40 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
        <div className="flex space-x-3">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-black/40 border border-purple-500/60 rounded-2xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/80 transition-all backdrop-blur-sm"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed flex items-center justify-center min-w-[52px]"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;