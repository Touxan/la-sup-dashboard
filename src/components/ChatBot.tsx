
import { useState } from "react"
import { Bot, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useMobile } from "@/hooks/use-mobile"

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
  const isMobile = useMobile()

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
    
    // Simulate AI response
    setTimeout(() => {
      // Get AI response based on user's question
      let response: string
      
      const lowercaseInput = input.toLowerCase()
      
      if (lowercaseInput.includes("server") || lowercaseInput.includes("infrastructure")) {
        response = "We currently have 45 active servers with 99.9% uptime. All servers are performing within expected parameters. Would you like more detailed information about specific server clusters?"
      } else if (lowercaseInput.includes("security") || lowercaseInput.includes("certificate")) {
        response = "Your security posture is currently at 98%. There are 3 SSL certificates expiring in the next 30 days, and 5 active security alerts that require attention. Would you like me to provide more details on any of these issues?"
      } else if (lowercaseInput.includes("alert") || lowercaseInput.includes("warning")) {
        response = "You currently have 5 active alerts: 2 related to unusual traffic patterns, 2 concerning certificate expiration, and 1 regarding storage capacity. All are low to medium priority. Would you like me to explain any alert in detail?"
      } else if (lowercaseInput.includes("performance") || lowercaseInput.includes("metric")) {
        response = "Overall platform performance is at 97.8%, which is a 0.3% improvement over last month. API response times average 124ms, and database queries are completing in under 200ms on average."
      } else {
        response = "I can provide information about your infrastructure, security posture, active alerts, and performance metrics. Please ask a specific question about any of these areas, and I'll be happy to help."
      }
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const ChatContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
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
      </div>
      
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about metrics, security, alerts..."
            className="min-h-[2.5rem] h-[2.5rem] resize-none"
          />
          <Button onClick={handleSend} size="icon">
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
