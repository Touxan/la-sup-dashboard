
import { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Message } from "./types";

interface ChatContentProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
  clearChatHistory: () => void;
  onClose: () => void;
}

const ChatContent = ({
  messages,
  input,
  setInput,
  handleSend,
  isLoading,
  clearChatHistory,
  onClose
}: ChatContentProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader clearChatHistory={clearChatHistory} onClose={onClose} />
      <MessageList messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        inputRef={inputRef}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatContent;
