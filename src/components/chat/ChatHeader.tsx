
import { Bot, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  clearChatHistory: () => void;
  onClose: () => void;
}

const ChatHeader = ({ clearChatHistory, onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-medium">AI Assistant</h3>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearChatHistory}
          title="Clear chat history"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
