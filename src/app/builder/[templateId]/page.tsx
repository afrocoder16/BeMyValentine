"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Monitor,
  Plus,
  Smartphone,
  Trash2,
} from "lucide-react";
import { getTemplateById } from "@/data/templates";
import { buttonClasses } from "@/components/Button";
import TemplateLivePreview from "@/components/TemplateLivePreview";
import {
  createPhoto,
  loadDraft,
  resetDraft,
  saveDraft,
  type TemplateDraft,
} from "@/lib/templates/drafts";
import { demoTracks, type MusicTrack } from "@/lib/templates/music";

const MAX_PHOTOS = 3;
const MIN_MOMENTS = 3;
const MAX_MOMENTS = 6;
const AUTOSAVE_DELAY_MS = 600;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

type MusicPreviewProps = {
  track: MusicTrack | null;
};

function MusicPreview({ track }: MusicPreviewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, [track?.id]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio || !track) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/85 px-4 py-3 shadow-soft">
      <button
        type="button"
        onClick={handleToggle}
        disabled={!track}
        className="rounded-full bg-rose-600 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-rose-400">
          Music preview
        </p>
        <p className="text-sm text-slate-700">
          {track ? (
            <>
              <span aria-hidden="true">&#9835;</span> {track.label}
            </>
          ) : (
            "No track selected"
          )}
        </p>
      </div>
      {track ? <audio ref={audioRef} src={track.src} preload="metadata" /> : null}
    </div>
  );
}

type AutoResizeTextareaProps = {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
};

function AutoResizeTextarea({
  value,
  onChange,
  className = "",
  rows = 2,
  placeholder,
}: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={className}
    />
  );
}

type EditorSectionProps = {
  title: string;
  helper: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function EditorSection({
  title,
  helper,
  children,
  defaultOpen = true,
}: EditorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[2rem] bg-white/90 p-5 shadow-soft">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
            {title}
          </p>
          <p className="mt-2 text-sm text-slate-500">{helper}</p>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 text-slate-400 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen ? <div className="mt-5 space-y-4">{children}</div> : null}
    </div>
  );
}

type ToastItem = {
  id: string;
  message: string;
};

export default function BuilderTemplatePage() {
  const params = useParams();
  const templateId =
    typeof params.templateId === "string"
      ? params.templateId
      : Array.isArray(params.templateId)
        ? params.templateId[0]
        : null;
  const template = templateId ? getTemplateById(templateId) : null;
  const isSupported = template?.id === "cute-classic";

  const [draft, setDraft] = useState<TemplateDraft | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewMode, setPreviewMode] = useState<"desktop" | "phone">("desktop");
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving">("Saved");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [showPublishModal, setShowPublishModal] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingPhotoIndex, setPendingPhotoIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!templateId || !isSupported) {
      return;
    }
    const initialDraft = loadDraft(templateId);
    setDraft(initialDraft);
    setHydrated(true);
  }, [templateId, isSupported]);

  useEffect(() => {
    if (!hydrated || !draft || !templateId) {
      return;
    }
    setSaveStatus("Saving");
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(() => {
      saveDraft(templateId, draft);
      setSaveStatus("Saved");
    }, AUTOSAVE_DELAY_MS);
  }, [draft, hydrated, templateId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      Object.values(toastTimers.current).forEach(clearTimeout);
    };
  }, []);

  const addToast = (message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete toastTimers.current[id];
    }, 2200);
    toastTimers.current[id] = timeout;
  };

  if (!isSupported || !templateId || !template) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16 md:pt-24">
        <div className="rounded-[2.5rem] bg-white/90 p-8 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
            Builder
          </p>
          <h1 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
            Template not found.
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Choose another template to start editing.
          </p>
          <Link href="/templates" className={`${buttonClasses("primary")} mt-6`}>
            Browse templates
          </Link>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-16 md:pt-24">
        <div className="rounded-[2.5rem] bg-white/90 p-8 text-center shadow-soft">
          <p className="text-sm text-slate-600">Loading your draft...</p>
        </div>
      </main>
    );
  }

  const handleTextChange =
    (field: keyof Pick<TemplateDraft, "title" | "subtitle" | "loveNote">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((prev) => (prev ? { ...prev, [field]: event.target.value } : prev));
    };

  const handleMomentChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDraft((prev) => {
      if (!prev) {
        return prev;
      }
      const nextMoments = [...prev.moments];
      nextMoments[index] = value;
      return { ...prev, moments: nextMoments };
    });
  };

  const handleAddMoment = () => {
    setDraft((prev) => {
      if (!prev || prev.moments.length >= MAX_MOMENTS) {
        return prev;
      }
      addToast("Added moment");
      return { ...prev, moments: [...prev.moments, ""] };
    });
  };

  const handleRemoveMoment = (index: number) => () => {
    setDraft((prev) => {
      if (!prev || prev.moments.length <= MIN_MOMENTS) {
        return prev;
      }
      return {
        ...prev,
        moments: prev.moments.filter((_, momentIndex) => momentIndex !== index),
      };
    });
  };

  const triggerPhotoSelect = (index: number | null) => {
    setPendingPhotoIndex(index);
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    const targetIndex = pendingPhotoIndex;
    const isReplace = targetIndex !== null && targetIndex < draft.photos.length;

    setDraft((prev) => {
      if (!prev) {
        return prev;
      }
      const nextPhotos = [...prev.photos];
      if (targetIndex !== null && targetIndex < nextPhotos.length) {
        nextPhotos[targetIndex] = createPhoto(dataUrl);
      } else {
        nextPhotos.push(createPhoto(dataUrl));
      }
      return { ...prev, photos: nextPhotos.slice(0, MAX_PHOTOS) };
    });

    addToast(isReplace ? "Photo replaced" : "Photo added");
    setPendingPhotoIndex(null);
    event.target.value = "";
  };

  const handleRemovePhoto = (index: number) => () => {
    setDraft((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, photos: prev.photos.filter((_, photoIndex) => photoIndex !== index) };
    });
    addToast("Photo removed");
  };

  const movePhoto = (index: number, direction: -1 | 1) => () => {
    setDraft((prev) => {
      if (!prev) {
        return prev;
      }
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.photos.length) {
        return prev;
      }
      const nextPhotos = [...prev.photos];
      const [moved] = nextPhotos.splice(index, 1);
      nextPhotos.splice(targetIndex, 0, moved);
      return { ...prev, photos: nextPhotos };
    });
  };

  const handleSelectMusic = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const selected = demoTracks.find((track) => track.id === value) ?? null;
    setDraft((prev) => (prev ? { ...prev, music: selected } : prev));
  };

  const handleReset = () => {
    const nextDraft = resetDraft(templateId);
    setDraft(nextDraft);
    addToast("Reset to defaults");
  };

  const handleSave = () => {
    saveDraft(templateId, draft);
    setSaveStatus("Saved");
    addToast("Saved");
  };

  const iconButtonClasses =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50";

  const secondaryButtonClasses =
    "inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600 transition hover:border-rose-300 hover:bg-rose-50/70";

  return (
    <main className="h-screen overflow-hidden px-4 pb-6 pt-4 sm:px-6">
      <div className="flex h-full flex-col rounded-[2.5rem] bg-white/60 shadow-soft">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/70 bg-white/80 px-6 py-4 backdrop-blur">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-500 transition hover:text-rose-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Templates
          </Link>
          <div className="flex flex-col items-center text-center">
            <p className="font-display text-lg text-slate-900 sm:text-xl">
              {template.name} Builder
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  saveStatus === "Saving" ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              <span>{saveStatus === "Saving" ? "Saving..." : "Autosaved"}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-white/80 p-1 shadow-soft">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                  previewMode === "desktop"
                    ? "bg-rose-600 text-white shadow-soft"
                    : "text-slate-600 hover:text-rose-500"
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("phone")}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                  previewMode === "phone"
                    ? "bg-rose-600 text-white shadow-soft"
                    : "text-slate-600 hover:text-rose-500"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Phone</span>
              </button>
            </div>
            <button
              type="button"
              className="rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-500"
              onClick={() => setShowPublishModal(true)}
            >
              Publish
            </button>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
          <aside
            className={`flex h-full w-full flex-col gap-6 overflow-y-auto border-b border-white/60 px-5 py-6 lg:w-[400px] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 ${
              activeTab === "preview" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="lg:hidden">
              <div className="grid grid-cols-2 rounded-full bg-white/80 p-1 shadow-soft">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${
                    activeTab === "edit"
                      ? "bg-rose-600 text-white shadow-soft"
                      : "text-slate-600"
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${
                    activeTab === "preview"
                      ? "bg-rose-600 text-white shadow-soft"
                      : "text-slate-600"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600 transition hover:border-rose-300 hover:bg-rose-50/70"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 transition hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-500"
              >
                Reset
              </button>
            </div>

            <EditorSection
              title="Text"
              helper="Set the headline, subtitle, and love note."
            >
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Title
                </span>
                <input
                  value={draft.title}
                  onChange={handleTextChange("title")}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 font-display text-xl text-slate-900 shadow-soft focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200/60"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Subtitle
                </span>
                <AutoResizeTextarea
                  value={draft.subtitle}
                  onChange={handleTextChange("subtitle")}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200/60"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Love note
                </span>
                <AutoResizeTextarea
                  value={draft.loveNote}
                  onChange={handleTextChange("loveNote")}
                  rows={5}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200/60"
                />
              </label>
            </EditorSection>

            <EditorSection
              title="Cute moments"
              helper="Short highlights you want them to remember."
            >
              <div className="space-y-3">
                {draft.moments.map((moment, index) => (
                  <div key={`${moment}-${index}`} className="flex items-center gap-3">
                    <input
                      value={moment}
                      onChange={handleMomentChange(index)}
                      className="flex-1 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200/60"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveMoment(index)}
                      disabled={draft.moments.length <= MIN_MOMENTS}
                      className={iconButtonClasses}
                      aria-label="Remove moment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMoment}
                  disabled={draft.moments.length >= MAX_MOMENTS}
                  className={secondaryButtonClasses}
                >
                  <Plus className="h-4 w-4" />
                  Add moment
                </button>
              </div>
            </EditorSection>

            <EditorSection
              title="Photos"
              helper="Add up to 3 photos to tell your story."
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: MAX_PHOTOS }).map((_, index) => {
                  const photo = draft.photos[index];
                  if (photo) {
                    return (
                      <div key={photo.id} className="space-y-2">
                        <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/80 shadow-soft">
                          <Image
                            src={photo.dataUrl}
                            alt={`Uploaded photo ${index + 1}`}
                            fill
                            sizes="120px"
                            className="object-cover"
                            unoptimized={photo.dataUrl.startsWith("data:")}
                          />
                          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => triggerPhotoSelect(index)}
                              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-rose-600 shadow-soft"
                            >
                              <ImagePlus className="h-3 w-3" />
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={handleRemovePhoto(index)}
                              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-rose-600 shadow-soft"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={movePhoto(index, -1)}
                            disabled={index === 0}
                            className={iconButtonClasses}
                            aria-label="Move photo up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={movePhoto(index, 1)}
                            disabled={index === draft.photos.length - 1}
                            className={iconButtonClasses}
                            aria-label="Move photo down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePhoto(index)}
                            className={iconButtonClasses}
                            aria-label="Remove photo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={`empty-${index}`}
                      type="button"
                      onClick={() => triggerPhotoSelect(index)}
                      className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-rose-200 bg-white/70 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:border-rose-300 hover:bg-rose-50/70"
                    >
                      <ImagePlus className="h-5 w-5" />
                      Add photo
                    </button>
                  );
                })}
              </div>
            </EditorSection>

            <EditorSection
              title="Music"
              helper="Pick a soundtrack that feels like you two."
            >
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Select track
                </span>
                <select
                  value={draft.music?.id ?? ""}
                  onChange={handleSelectMusic}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200/60"
                >
                  <option value="">No music</option>
                  {demoTracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.label}
                    </option>
                  ))}
                </select>
              </label>
              <MusicPreview track={draft.music} />
            </EditorSection>
          </aside>

          <section
            className={`flex h-full w-full flex-1 flex-col overflow-y-auto border-t border-white/60 px-5 py-6 lg:border-l lg:border-t-0 lg:px-8 ${
              activeTab === "edit" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="mx-auto flex w-full max-w-5xl flex-1 items-start justify-center">
              <TemplateLivePreview
                template={template}
                draft={draft}
                mode={previewMode}
              />
            </div>
          </section>
        </div>
      </div>

      {toasts.length > 0 ? (
        <div className="pointer-events-none fixed right-6 top-24 z-40 space-y-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-500 shadow-soft"
            >
              {toast.message}
            </div>
          ))}
        </div>
      ) : null}

      {showPublishModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-6">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 text-center shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Publish
            </p>
            <h2 className="mt-4 font-display text-2xl text-slate-900">
              Share links arrive in Phase 4
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              We will add shareable links and publishing next. Your draft is
              saved locally for now.
            </p>
            <button
              type="button"
              className={`${buttonClasses("primary")} mt-6`}
              onClick={() => setShowPublishModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
