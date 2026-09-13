"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { WordFormApi } from "../../form/use-word-app-form";
import type { WordPhoneticInput } from "../../../../domain/schema/word.schema old";

interface PhoneticsTabProps {
  form: WordFormApi;
}

const makeEmptyPhonetic = (index: number): WordPhoneticInput => ({
  text: "",
  type: "",
  accent: "",
  audioUrl: "",
  sourceUrl: "",
  isPrimary: false,
  sortOrder: index,
});

export function PhoneticsTab({ form }: PhoneticsTabProps) {
  return (
    <div className="space-y-4 py-4">
      <form.Field name="phonetics" mode="array">
        {(phoneticsField) => (
          <div className="space-y-3">
            {(phoneticsField.state.value ?? []).map((_, index) => (
              <Card key={index}>
                <CardContent className="grid grid-cols-2 gap-3 pt-4">
                  <form.AppField name={`phonetics[${index}].text`}>
                    {(field) => <field.TextField label="Text (IPA)" />}
                  </form.AppField>
                  <form.AppField name={`phonetics[${index}].type`}>
                    {(field) => <field.TextField label="Type" />}
                  </form.AppField>
                  <form.AppField name={`phonetics[${index}].accent`}>
                    {(field) => <field.TextField label="Accent" />}
                  </form.AppField>
                  <form.AppField name={`phonetics[${index}].audioUrl`}>
                    {(field) => <field.TextField label="Audio URL" />}
                  </form.AppField>
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => phoneticsField.removeValue(index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                phoneticsField.pushValue(
                  makeEmptyPhonetic(phoneticsField.state.value.length),
                )
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add phonetic
            </Button>
          </div>
        )}
      </form.Field>
    </div>
  );
}
