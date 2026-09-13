"use client";

import {
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Globe2,
  History,
  Image as ImageIcon,
  Quote,
  Trash2,
  Volume2,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { WordDetail } from "../../../domain/types/word.types";
import {
  useDeleteWord,
  useVerifyWord,
} from "../../../application/mutation/word.mutation";

interface WordDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: WordDetail | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (word: WordDetail) => void;
}

export function WordDetailModal({
  open,
  onOpenChange,
  word,
  onEdit,
}: WordDetailModalProps) {
  const verifyMutation = useVerifyWord();
  const deleteMutation = useDeleteWord();

  if (!word) {
    return null;
  }

  const handleToggleVerification = async () => {
    await verifyMutation.mutateAsync({
      id: word.id,
      dto: {
        isVerified: !word.isVerified,
      },
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete word "${word.text}"?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(word.id);
    onOpenChange(false);
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(word);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[96vw] max-w-5xl! flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex flex-col justify-between gap-2 pr-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                {word.text}
              </h2>

              <Badge variant="outline" className="font-mono text-xs">
                {word.language?.name ?? "Language"} (
                {word.language?.code ?? "code"})
              </Badge>

              <Badge
                variant={word.isVerified ? "default" : "secondary"}
                className="text-xs"
              >
                {word.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>

            <Button
              type="button"
              variant={word.isVerified ? "outline" : "default"}
              size="sm"
              onClick={handleToggleVerification}
              disabled={verifyMutation.isPending || deleteMutation.isPending}
              className="h-8 gap-1.5 text-xs"
            >
              {word.isVerified ? (
                <>
                  <XCircle className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Revoke Verification</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Approve & Verify</span>
                </>
              )}
            </Button>
          </div>

          <DialogDescription>
            ID: <code className="font-mono text-[11px]">{word.id}</code> •
            Created at {new Date(word.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-2 pr-1">
          {/* Phonetics & Categories */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">
                Phonetics:
              </span>

              {word.phonetics && word.phonetics.length > 0 ? (
                word.phonetics.map((phonetic) => (
                  <div
                    key={phonetic.id}
                    className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs"
                  >
                    <span className="font-mono font-medium text-zinc-800">
                      {phonetic.text}
                    </span>

                    {phonetic.accent && (
                      <span className="text-[10px] capitalize text-zinc-400">
                        ({phonetic.accent})
                      </span>
                    )}

                    {phonetic.audioUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const audio = new Audio(phonetic.audioUrl);
                          void audio.play();
                        }}
                        className="p-1 text-zinc-600 hover:text-zinc-900"
                        title="Play pronunciation"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs italic text-zinc-400">
                  No phonetics registered
                </span>
              )}
            </div>

            {word.categories && word.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {word.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Meanings */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Meanings ({word.meanings?.length ?? 0})</span>
            </h3>

            {word.meanings && word.meanings.length > 0 ? (
              <div className="space-y-3">
                {word.meanings.map((meaning, meaningIndex) => (
                  <div
                    key={meaning.id}
                    className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          className="font-mono text-xs uppercase tracking-wider"
                        >
                          {meaning.partOfSpeech}
                        </Badge>

                        {meaning.isArchaic && (
                          <Badge variant="destructive" className="text-[10px]">
                            Archaic
                          </Badge>
                        )}

                        <Badge
                          variant={meaning.isVerified ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {meaning.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>

                      <span className="font-mono text-xs text-zinc-400">
                        Sense #{meaningIndex + 1}
                      </span>
                    </div>

                    {/* Definitions */}
                    <div className="space-y-1.5">
                      {meaning.definitions && meaning.definitions.length > 0 ? (
                        meaning.definitions.map(
                          (definition, definitionIndex) => (
                            <div
                              key={definition.id}
                              className="text-sm text-zinc-800"
                            >
                              <span className="font-semibold text-zinc-900">
                                {definitionIndex + 1}.{" "}
                              </span>

                              <span>{definition.text}</span>

                              {definition.usageNote && (
                                <span className="ml-2 text-xs italic text-zinc-500">
                                  ({definition.usageNote})
                                </span>
                              )}
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-xs italic text-zinc-400">
                          No definitions available.
                        </p>
                      )}
                    </div>

                    {/* Translations */}
                    {meaning.translations &&
                      meaning.translations.length > 0 && (
                        <div className="border-t border-zinc-100 pt-2">
                          <span className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
                            <Globe2 className="h-3 w-3 text-emerald-600" />
                            <span>Equivalent Translations:</span>
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {meaning.translations.map((translation) => (
                              <div
                                key={translation.id}
                                className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-900"
                              >
                                <span className="font-mono text-[10px] font-bold uppercase text-emerald-700">
                                  {translation.language?.code ?? "lang"}:
                                </span>

                                <span className="font-medium">
                                  {translation.text}
                                </span>

                                {translation.isVerified && (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Examples */}
                    {meaning.examples && meaning.examples.length > 0 && (
                      <div className="space-y-1 border-t border-zinc-100 pt-2">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
                          <Quote className="h-3 w-3 text-purple-600" />
                          <span>Contextual Examples:</span>
                        </span>

                        {meaning.examples.map((example) => (
                          <div
                            key={example.id}
                            className="border-l-2 border-purple-300 py-0.5 pl-3 text-xs italic text-zinc-600"
                          >
                            &quot;{example.text}&quot;
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-200 py-8 text-center">
                <BookOpen className="mx-auto mb-2 h-5 w-5 text-zinc-300" />
                <p className="text-xs text-zinc-400">
                  No meanings have been added to this word.
                </p>
              </div>
            )}
          </section>

          {/* Etymology & Sources */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Etymology */}
            <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">
                <History className="h-3.5 w-3.5" />
                <span>Etymology & Roots</span>
              </h4>

              {word.etymologies && word.etymologies.length > 0 ? (
                <div className="space-y-3">
                  {word.etymologies.map((etymology) => (
                    <div
                      key={etymology.id}
                      className="space-y-1 text-xs text-zinc-700"
                    >
                      <div className="font-semibold text-zinc-900">
                        {etymology.origin}
                      </div>

                      {etymology.originWord && (
                        <div className="font-mono text-[11px] text-zinc-500">
                          Root: {etymology.originWord}
                        </div>
                      )}

                      {etymology.description && (
                        <p className="text-zinc-600">{etymology.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-zinc-400">
                  No etymology records provided.
                </p>
              )}
            </div>

            {/* Sources */}
            <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">
                <BookmarkCheck className="h-3.5 w-3.5" />
                <span>Attribution & References</span>
              </h4>

              {word.sources && word.sources.length > 0 ? (
                <div>
                  {word.sources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between border-b border-zinc-100 py-1 text-xs last:border-0"
                    >
                      <span className="font-medium text-zinc-800">
                        {source.sourceName}
                      </span>

                      {source.sourceUrl && (
                        <a
                          href={source.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <span>Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-zinc-400">
                  No source citations attached.
                </p>
              )}
            </div>
          </div>

          {/* Media Gallery */}
          {word.media && word.media.length > 0 && (
            <section className="space-y-2">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zinc-500">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Media Gallery ({word.media.length})</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {word.media.map((media) => (
                  <div
                    key={media.id}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                  >
                    <img
                      src={media.imageUrl}
                      alt={media.altText ?? "Word media"}
                      referrerPolicy="no-referrer"
                      className="h-28 w-full object-cover"
                    />

                    {media.altText && (
                      <p className="truncate p-1.5 text-[10px] text-zinc-500">
                        {media.altText}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || verifyMutation.isPending}
            className="gap-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>
              {deleteMutation.isPending ? "Deleting..." : "Delete Word"}
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={deleteMutation.isPending || verifyMutation.isPending}
              className="gap-1 text-xs"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Entry</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={deleteMutation.isPending}
              className="text-xs"
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
