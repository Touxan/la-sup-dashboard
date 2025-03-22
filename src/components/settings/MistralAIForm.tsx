
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

interface MistralConfig {
  agent_id: string;
  api_key: string;
}

const formSchema = z.object({
  agent_id: z.string().min(1, "Agent ID is required"),
  api_key: z.string().min(1, "API Key is required"),
});

export function MistralAIForm() {
  const queryClient = useQueryClient();
  const [showApiKey, setShowApiKey] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_id: "",
      api_key: "",
    },
  });

  // Fetch Mistral AI configuration
  const { data: mistralConfig, isLoading } = useQuery({
    queryKey: ['mistralConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('config')
        .eq('name', 'mistral')
        .single();
        
      if (error) {
        toast.error(`Error fetching Mistral AI configuration: ${error.message}`);
        return null;
      }
      
      return data?.config as MistralConfig | null;
    }
  });

  // Update form when data is fetched
  useEffect(() => {
    if (mistralConfig) {
      form.reset({
        agent_id: mistralConfig.agent_id || "",
        api_key: mistralConfig.api_key || "",
      });
    }
  }, [mistralConfig, form]);

  // Update Mistral AI configuration
  const updateConfig = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { error } = await supabase
        .from('data_sources')
        .update({
          config: values,
          updated_at: new Date().toISOString()
        })
        .eq('name', 'mistral');
          
      if (error) throw error;
      
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mistralConfig'] });
      toast.success("Mistral AI configuration updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Error updating Mistral AI configuration: ${error.message}`);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateConfig.mutate(values);
  }

  if (isLoading) {
    return <div>Loading Mistral AI configuration...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="agent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ag:xxxxxxxx:yyyymmdd:name:zzzzzzzz" />
              </FormControl>
              <FormDescription>The ID of your Mistral AI agent</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    type={showApiKey ? "text" : "password"} 
                    placeholder="Your Mistral API key" 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Your Mistral API key for authentication</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Mistral AI Configuration</Button>
      </form>
    </Form>
  );
}
