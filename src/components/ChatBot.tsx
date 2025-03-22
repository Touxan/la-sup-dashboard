
import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChat } from "@/hooks/use-chat";
import ChatContent from "./chat/ChatContent";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { 
    input, 
    setInput, 
    messages, 
    isLoading, 
    handleSend, 
    clearChatHistory 
  } = useChat();

  // Use Drawer for mobile and Sheet for desktop
  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          className="rounded-full fixed bottom-4 left-4 shadow-lg z-40"
          size="icon"
        >
          <Bot className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <ChatContent
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isLoading={isLoading}
          clearChatHistory={clearChatHistory}
          onClose={() => setOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          className="rounded-full fixed bottom-4 left-4 shadow-lg z-40"
          size="icon"
        >
          <Bot className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] p-0 backdrop-blur-md bg-background/90 border shadow-lg">
        <ChatContent
          messages={messages}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          isLoading={isLoading}
          clearChatHistory={clearChatHistory}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;
