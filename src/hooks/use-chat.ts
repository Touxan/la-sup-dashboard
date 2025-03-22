
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/components/chat/types";

export const useChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. I can answer questions about your infrastructure metrics, security events, and other system information. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
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
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
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
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get response from AI assistant");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI assistant. I can answer questions about your infrastructure metrics, security events, and other system information. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    toast.success("Chat history cleared");
  };

  return {
    input,
    setInput,
    messages,
    isLoading,
    handleSend,
    clearChatHistory
  };
};
