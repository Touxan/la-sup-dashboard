
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const urlSchema = z.string().url("Please enter a valid URL").or(z.string().length(0));

const formSchema = z.object({
  grafana: urlSchema,
  loki: urlSchema,
  n8n: urlSchema,
  prometheus: urlSchema,
});

export function DataSourcesForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grafana: "",
      loki: "",
      n8n: "",
      prometheus: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Data source URLs updated successfully");
    console.log(values);
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
