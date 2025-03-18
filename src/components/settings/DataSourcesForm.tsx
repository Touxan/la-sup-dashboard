
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const urlSchema = z.string().url("Please enter a valid URL").or(z.string().length(0));

const formSchema = z.object({
  grafana: urlSchema,
  loki: urlSchema,
  n8n: urlSchema,
  prometheus: urlSchema,
});

export function DataSourcesForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grafana: "",
      loki: "",
      n8n: "",
      prometheus: "",
    },
  });

  // Fetch data sources
  const { data: dataSources, isLoading } = useQuery({
    queryKey: ['dataSources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('name, url')
        .in('name', ['grafana', 'loki', 'n8n', 'prometheus']);
        
      if (error) {
        toast.error(`Error fetching data sources: ${error.message}`);
        return [];
      }
      
      return data;
    }
  });

  // Update data when fetched
  useEffect(() => {
    if (dataSources && dataSources.length > 0) {
      const values = dataSources.reduce((acc: any, src) => {
        acc[src.name] = src.url;
        return acc;
      }, {});
      
      form.reset(values);
    }
  }, [dataSources, form]);

  // Update data sources mutation
  const updateDataSources = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const updates = Object.entries(values).map(([name, url]) => ({
        name,
        url,
      }));
      
      const { error } = await supabase
        .rpc('upsert_data_sources', {
          _sources: updates
        });
      
      if (error) throw error;
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataSources'] });
      toast.success("Data source URLs updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Error updating data sources: ${error.message}`);
    }
  });

  // Create a stored procedure for upsert operation
  useEffect(() => {
    const createProcedure = async () => {
      await supabase.rpc('create_upsert_procedure', {}).catch(() => {
        // Procedure might already exist, we can ignore this error
      });
    };
    
    createProcedure();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateDataSources.mutate(values);
  }

  if (isLoading) {
    return <div>Loading data sources...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="grafana"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grafana URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://grafana.example.com" />
              </FormControl>
              <FormDescription>The URL of your Grafana instance</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loki"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loki URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://loki.example.com" />
              </FormControl>
              <FormDescription>The URL of your Loki log aggregation service</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="n8n"
          render={({ field }) => (
            <FormItem>
              <FormLabel>n8n URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://n8n.example.com" />
              </FormControl>
              <FormDescription>The URL of your n8n workflow automation instance</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prometheus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prometheus URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://prometheus.example.com" />
              </FormControl>
              <FormDescription>The URL of your Prometheus metrics instance</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Data Sources</Button>
      </form>
    </Form>
  );
}
