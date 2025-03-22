
import { Message } from "./types";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          message.role === "assistant" 
            ? "bg-secondary text-secondary-foreground" 
            : "bg-primary text-primary-foreground"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
