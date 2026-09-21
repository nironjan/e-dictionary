import type { CreateWordFormData } from "../../../domain/schema/word.schema";

export type MeaningItem = NonNullable<CreateWordFormData["meanings"]>[number];

export type DefinitionItem = NonNullable<MeaningItem["definitions"]>[number];

export type TranslationItem = NonNullable<MeaningItem["translations"]>[number];

export type ExampleItem = NonNullable<MeaningItem["examples"]>[number];
export type RelationItem = NonNullable<MeaningItem["relations"]>[number];

export type DefinitionUpdate = Partial<DefinitionItem>;
export type TranslationUpdate = Partial<TranslationItem>;
export type ExampleUpdate = Partial<ExampleItem>;
export type RelationUpdate = Partial<RelationItem>;
