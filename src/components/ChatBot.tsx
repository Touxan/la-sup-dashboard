
import { useRef, useState, useEffect } from "react"
import { Bot, Send, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { supabase } from "@/integrations/supabase/client"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const ChatBot = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. I can answer questions about your infrastructure metrics, security events, and other system information. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useIsMobile()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus the input when the chat is opened
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const callMistralAgent = async (messages: { role: string; content: string }[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('mistral-agent', {
        body: { 
          messages: messages
        }
      });

      if (error) throw error;
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('Error calling Mistral agent:', error);
      toast.error('Error connecting to AI assistant: ' + error.message);
      return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    try {
      // Format messages for Mistral API
      const formattedMessages = messages
        .concat(userMessage)
        .map(message => ({
          role: message.role,
          content: message.content
        }));
      
      // Get AI response from Mistral
      const response = await callMistralAgent(formattedMessages);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response from AI assistant");
    } finally {
      setIsLoading(false)
      // Maintenir le focus sur l'input après avoir reçu la réponse
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChatHistory = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI assistant. I can answer questions about your infrastructure metrics, security events, and other system information. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
    toast.success("Chat history cleared")
  }

  const ChatContent = () => (
    <div className="flex flex-col h-full">
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
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
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
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about metrics, security, alerts..."
            className="min-h-[2.5rem] h-[2.5rem] resize-none"
            autoFocus
          />
          <Button onClick={handleSend} size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

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
        <ChatContent />
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
        <ChatContent />
      </SheetContent>
    </Sheet>
  )
}

export default ChatBot
