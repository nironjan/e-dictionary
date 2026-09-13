"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import type { useWordAppForm } from "../form/use-word-app-form";
import { BasicInfoTab } from "./tabs/basic-info-tab";
import { PhoneticsTab } from "./tabs/phonetics-tab";

const TAB_ITEMS = [
  { value: "basic", label: "Basic Info" },
  { value: "phonetics", label: "Phonetics" },
  { value: "meanings", label: "Meanings" },
  { value: "etymologies", label: "Etymologies" },
  { value: "sources", label: "Sources" },
  { value: "media", label: "Media" },
] as const;

interface WordFormProps {
  form: ReturnType<typeof useWordAppForm>;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function WordForm({
  form,
  isSubmitting,
  submitLabel = "Save",
}: WordFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoTab form={form} />
        </TabsContent>
        <TabsContent value="phonetics">
          <PhoneticsTab form={form} />
        </TabsContent>
        <TabsContent value="meanings">
          <p className="py-4 text-sm text-muted-foreground">Next up.</p>
        </TabsContent>
        <TabsContent value="etymologies">
          <p className="py-4 text-sm text-muted-foreground">Next up.</p>
        </TabsContent>
        <TabsContent value="sources">
          <p className="py-4 text-sm text-muted-foreground">Next up.</p>
        </TabsContent>
        <TabsContent value="media">
          <p className="py-4 text-sm text-muted-foreground">Next up.</p>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
