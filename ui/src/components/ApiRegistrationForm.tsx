import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { algorithmService, type Algorithm } from "@/services/algorithmService";
import type { CreateApiRequest, ApiRegistration } from "@/services/apiService";
import { Loader2 } from "lucide-react";

const apiSchema = z.object({
  name: z.string().min(1, "API name is required"),
  apiUrl: z.string().url("Please enter a valid URL"),
  algorithmId: z.string().min(1, "Please select an algorithm"),
  windowSeconds: z
    .number()
    .min(1, "Window time must be at least 1 second")
    .optional(),
  requests: z.number().min(1, "Requests must be at least 1").optional(),
});

type ApiFormData = z.infer<typeof apiSchema>;

interface ApiRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateApiRequest) => Promise<void>;
  isLoading?: boolean;
  editingApi?: ApiRegistration;
}

export default function ApiRegistrationForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  editingApi,
}: ApiRegistrationFormProps) {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>();
  const [isLoadingAlgorithms, setIsLoadingAlgorithms] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    Algorithm | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch algorithms when dialog opens
  useEffect(() => {
    if (open) {
      fetchAlgorithms();
    }
  }, [open]);

  const fetchAlgorithms = async () => {
    try {
      setIsLoadingAlgorithms(true);
      const data = await algorithmService.getAlgorithms();
      setAlgorithms(data.algorithms);
    } catch (error) {
      console.error("Failed to fetch algorithms:", error);
    } finally {
      setIsLoadingAlgorithms(false);
    }
  };

  const form = useForm<ApiFormData>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      name: "",
      apiUrl: "",
      algorithmId: "",
      windowSeconds: 60,
      requests: 100,
    },
  });

  // Reset form when dialog opens/closes or when editingApi changes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedAlgorithm(undefined);
    } else if (editingApi) {
      // Populate form with editing data
      form.reset({
        name: editingApi.name,
        apiUrl: editingApi.endpointUrl,
        algorithmId: editingApi.rateLimitAlgorithm._id,
        windowSeconds: editingApi.config?.windowSeconds || 60,
        requests: editingApi.config?.requests || 100,
      });
      // Set selected algorithm
      setSelectedAlgorithm({
        _id: editingApi.rateLimitAlgorithm._id,
        name: editingApi.rateLimitAlgorithm.name,
        description: editingApi.rateLimitAlgorithm.description || "",
      });
    }
  }, [open, form, editingApi]);

  // Update form when algorithm changes
  useEffect(() => {
    if (selectedAlgorithm) {
      form.clearErrors();
    }
  }, [selectedAlgorithm, form]);

  const handleAlgorithmChange = (algorithmId: string) => {
    const algorithm = algorithms?.find((alg) => alg._id === algorithmId);
    setSelectedAlgorithm(algorithm);
    form.setValue("algorithmId", algorithmId);
  };

  const handleSubmit = async (data: ApiFormData) => {
    setIsSubmitting(true);
    try {
      // Build config based on algorithm type
      const config: Record<string, any> = {};
      if (data.windowSeconds) config.windowSeconds = data.windowSeconds;
      if (data.requests) config.requests = data.requests;

      await onSubmit({
        name: data.name,
        apiUrl: data.apiUrl,
        algorithmId: data.algorithmId,
        config,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConfigFields = () => {
    if (!selectedAlgorithm) return null;

    // For now, show fixed window configuration
    return (
      <>
        <FormField
          control={form.control}
          name="windowSeconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Window Time (seconds)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="60"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requests per Window</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingApi ? "Edit API" : "Register New API"}
          </DialogTitle>
          <DialogDescription>
            {editingApi
              ? "Update your API registration details."
              : "Register a new API with rate limiting configuration."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingAlgorithms ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading algorithms...</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter API name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://api.example.com/endpoint"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="algorithmId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate Limiting Algorithm</FormLabel>
                    <Select
                      onValueChange={handleAlgorithmChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an algorithm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {algorithms?.map((algorithm) => (
                          <SelectItem key={algorithm._id} value={algorithm._id}>
                            {algorithm.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedAlgorithm && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-3">
                      Configuration for {selectedAlgorithm.name}
                    </h4>
                    {selectedAlgorithm.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedAlgorithm.description}
                      </p>
                    )}
                    {renderConfigFields()}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting
                    ? editingApi
                      ? "Updating..."
                      : "Registering..."
                    : editingApi
                    ? "Update API"
                    : "Register API"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
