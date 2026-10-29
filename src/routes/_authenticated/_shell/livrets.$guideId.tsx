import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Plus,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PhoneFrame } from "@/components/guidebook/PhoneFrame";
import { SectionIcon } from "@/components/editor/SectionIcon";
import { BlockCard } from "@/components/editor/BlockCard";
import { ThemePanel } from "@/components/editor/ThemePanel";
import {
  RecommendationsPanel,
  type RecommendationDraft,
} from "@/components/editor/RecommendationsPanel";
import {
  GuidePreview,
  type PreviewRecommendation,
} from "@/components/editor/GuidePreview";
import { useLanguage } from "@/i18n/LanguageProvider";
import { editorCopy } from "@/i18n/editorCopy";
import {
  BLOCK_DEFS,
  SECTION_DEFS,
  SECTION_DEF_MAP,
  mergeTheme,
  type GuideTheme,
} from "@/lib/guide-schema";
import {
  addBlock,
  addSection,
  deleteBlock,
  deleteRecommendation,
  deleteSection,
  duplicateBlock,
  getGuideDetail,
  reorderBlocks,
  reorderSections,
  saveRecommendation,
  updateBlock,
  updateGuide,
  updateSection,
  type GuideBlockRow,
  type GuideSectionRow,

} from "@/lib/editor.functions";

export const Route = createFileRoute("/_authenticated/_shell/livrets/$guideId")({
  head: () => ({
    meta: [
      { title: "Éditeur de livret — Dalal" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GuideEditorPage,
});

interface Settings {
  title: string;
  cover_image_url: string | null;
  logo_url: string | null;
  welcome_message: string | null;
  host_name: string | null;
  host_avatar_url: string | null;
}

function GuideEditorPage() {
  const { guideId } = Route.useParams();
  const { lang } = useLanguage();
  const copy = editorCopy[lang];
  const queryClient = useQueryClient();

  const fetchDetail = useServerFn(getGuideDetail);
  const saveGuide = useServerFn(updateGuide);
  const saveBlock = useServerFn(updateBlock);
  const saveSection = useServerFn(updateSection);
  const createSection = useServerFn(addSection);
  const removeSection = useServerFn(deleteSection);
  const orderSections = useServerFn(reorderSections);
  const createBlock = useServerFn(addBlock);
  const removeBlock = useServerFn(deleteBlock);
  const copyBlock = useServerFn(duplicateBlock);
  const orderBlocks = useServerFn(reorderBlocks);
  const upsertRecommendation = useServerFn(saveRecommendation);
  const dropRecommendation = useServerFn(deleteRecommendation);

  const detail = useQuery({
    queryKey: ["guide", guideId],
    queryFn: () => fetchDetail({ data: { id: guideId } }),
  });

  const [sections, setSections] = useState<GuideSectionRow[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [theme, setTheme] = useState<GuideTheme>(mergeTheme({}));
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [tab, setTab] = useState<"content" | "design">("content");
  const [pending, setPending] = useState(0);
  const [mobilePreview, setMobilePreview] = useState(false);

  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    const data = detail.data;
    if (!data) return;
    if (loadedRef.current === data.guide.id) return;
    loadedRef.current = data.guide.id;
    setSections(data.sections);
    setSettings({
      title: data.guide.title,
      cover_image_url: data.guide.cover_image_url,
      logo_url: data.guide.logo_url,
      welcome_message: data.guide.welcome_message,
      host_name: data.guide.host_name,
      host_avatar_url: data.guide.host_avatar_url,
    });
    setTheme(mergeTheme(data.guide.theme));
    setTemplateId(data.guide.template_id);
    setActiveSectionId((current) => current ?? (data.sections[0]?.id ?? null));
  }, [detail.data]);

  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  /** Debounced autosave: one timer per logical target. */
  const schedule = useCallback((key: string, run: () => Promise<unknown>) => {
    const existing = timers.current.get(key);
    if (existing) clearTimeout(existing);
    setPending((count) => count + 1);
    const timer = setTimeout(() => {
      timers.current.delete(key);
      run()
        .catch((error: unknown) =>
          toast.error(error instanceof Error ? error.message : "Erreur"),
        )
        .finally(() => setPending((count) => Math.max(0, count - 1)));
    }, 700);
    timers.current.set(key, timer);
    setPending((count) => Math.max(0, count - 1));
  }, []);

  const track = useCallback(async (run: () => Promise<unknown>) => {
    setPending((count) => count + 1);
    try {
      await run();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setPending((count) => Math.max(0, count - 1));
    }
  }, []);

  const refresh = useCallback(async () => {
    loadedRef.current = null;
    await queryClient.invalidateQueries({ queryKey: ["guide", guideId] });
  }, [queryClient, guideId]);

  const recommendations = (detail.data?.recommendations ??
    []) as PreviewRecommendation[];
  const templates = detail.data?.templates ?? [];
  const guide = detail.data?.guide;

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeSectionId) ?? null,
    [sections, activeSectionId],
  );

  const availableSections = SECTION_DEFS.filter(
    (def) => !sections.some((section) => section.type === def.type),
  );

  // ---- structural actions -------------------------------------------------

  async function handleAddSection(type: string) {
    await track(async () => {
      const created = await createSection({ data: { guideId, type } });
      await refresh();
      setActiveSectionId(created.id);
    });
  }

  async function handleDeleteSection(id: string) {
    await track(async () => {
      await removeSection({ data: { id } });
      setActiveSectionId(null);
      await refresh();
    });
  }

  async function handleAddBlock(type: string) {
    if (!activeSection) return;
    await track(async () => {
      await createBlock({ data: { sectionId: activeSection.id, type } });
      await refresh();
    });
  }

  function updateBlockLocal(
    blockId: string,
    patch: { content?: unknown; visible?: boolean },
  ) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        blocks: section.blocks.map((block) =>
          block.id === blockId ? ({ ...block, ...patch } as GuideBlockRow) : block,
        ),
      })),
    );
  }


  // ---- drag & drop --------------------------------------------------------

  const [dragSection, setDragSection] = useState<string | null>(null);
  const [dragBlock, setDragBlock] = useState<string | null>(null);

  function moveSection(targetId: string) {
    if (!dragSection || dragSection === targetId) return;
    const from = sections.findIndex((section) => section.id === dragSection);
    const to = sections.findIndex((section) => section.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    setSections(next);
    void track(() => orderSections({ data: { ids: next.map((s) => s.id) } }));
  }

  function moveBlock(targetId: string) {
    if (!activeSection || !dragBlock || dragBlock === targetId) return;
    const blocks = activeSection.blocks;
    const from = blocks.findIndex((block) => block.id === dragBlock);
    const to = blocks.findIndex((block) => block.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    setSections((current) =>
      current.map((section) =>
        section.id === activeSection.id ? { ...section, blocks: next } : section,
      ),
    );
    void track(() => orderBlocks({ data: { ids: next.map((b) => b.id) } }));
  }

  if (detail.isLoading || !settings || !guide) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>;
  }

  const status = guide.status as "draft" | "published" | "archived";
  const link = `/livret/${guide.slug}`;

  const previewNode = (
    <PhoneFrame>
      <GuidePreview
        guide={settings}
        theme={theme}
        sections={sections}
        recommendations={recommendations}
      />
    </PhoneFrame>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/livrets">
              <ArrowLeft className="mr-1.5 size-4" />
              {copy.back}
            </Link>
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-card-foreground">
              {settings.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {(guide.properties as { name?: string } | null)?.name}
            </p>
          </div>
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {status === "published" ? copy.published : copy.draft}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {pending > 0 ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {copy.saving}
              </>
            ) : (
              <>
                <Check className="size-3.5 text-primary" />
                {copy.saved}
              </>
            )}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              void navigator.clipboard.writeText(`${window.location.origin}${link}`);
              toast.success(copy.copied);
            }}
          >
            <Copy className="mr-1.5 size-3.5" />
            {copy.copyLink}
          </Button>
          {status === "published" ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() =>
                void track(async () => {
                  await saveGuide({ data: { id: guideId, patch: { status: "draft" } } });
                  await refresh();
                })
              }
            >
              <Undo2 className="mr-1.5 size-3.5" />
              {copy.unpublish}
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-full"
              onClick={() =>
                void track(async () => {
                  await saveGuide({
                    data: { id: guideId, patch: { status: "published" } },
                  });
                  await refresh();
                  toast.success(copy.published);
                })
              }
            >
              <Send className="mr-1.5 size-3.5" />
              {copy.publish}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="rounded-full xl:hidden"
            onClick={() => setMobilePreview((value) => !value)}
          >
            {mobilePreview ? copy.editorTab : copy.previewTab}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)_23rem]">
        {/* Left: sections */}
        <aside
          className={`space-y-2 rounded-2xl border border-border bg-card p-3 shadow-soft ${mobilePreview ? "hidden xl:block" : ""}`}
        >
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {copy.sections}
          </p>
          <ul className="space-y-1">
            {sections.map((section) => {
              const def = SECTION_DEF_MAP[section.type];
              const selected = section.id === activeSectionId;
              return (
                <li
                  key={section.id}
                  draggable
                  onDragStart={() => setDragSection(section.id)}
                  onDragEnd={() => setDragSection(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveSection(section.id)}
                  className={`group flex items-center gap-2 rounded-xl px-2 py-2 text-sm transition-colors ${selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"} ${dragSection === section.id ? "opacity-40" : ""}`}
                >
                  <GripVertical className="size-3.5 shrink-0 cursor-grab opacity-40" />
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => setActiveSectionId(section.id)}
                  >
                    <SectionIcon name={def?.icon ?? "Info"} className="size-4" />
                    <span className="truncate font-medium">
                      {section.title ?? def?.label[lang] ?? section.type}
                    </span>
                  </button>
                  <button
                    type="button"
                    title={section.visible ? copy.hide : copy.show}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      const visible = !section.visible;
                      setSections((current) =>
                        current.map((item) =>
                          item.id === section.id ? { ...item, visible } : item,
                        ),
                      );
                      void track(() =>
                        saveSection({ data: { id: section.id, patch: { visible } } }),
                      );
                    }}
                  >
                    {section.visible ? (
                      <Eye className="size-3.5" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {availableSections.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start rounded-xl"
                >
                  <Plus className="mr-1.5 size-3.5" />
                  {copy.addSection}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {availableSections.map((def) => (
                  <DropdownMenuItem
                    key={def.type}
                    onClick={() => void handleAddSection(def.type)}
                  >
                    <SectionIcon name={def.icon} className="mr-2 size-4" />
                    {def.label[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </aside>

        {/* Center: editor */}
        <div
          className={`min-w-0 space-y-4 ${mobilePreview ? "hidden xl:block" : ""}`}
        >
          <div className="flex gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
            {(["content", "design"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {value === "content" ? copy.content : copy.design}
              </button>
            ))}
          </div>

          {tab === "design" ? (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <ThemePanel
                theme={theme}
                settings={settings}
                templates={templates}
                templateId={templateId}
                onThemeChange={(patch) => {
                  const next = { ...theme, ...patch };
                  setTheme(next);
                  schedule("theme", () =>
                    saveGuide({ data: { id: guideId, patch: { theme: next } } }),
                  );
                }}
                onSettingsChange={(patch) => {
                  const next = { ...settings, ...patch };
                  setSettings(next);
                  schedule("settings", () =>
                    saveGuide({ data: { id: guideId, patch: next } }),
                  );
                }}
                onTemplateChange={(id, nextTheme) => {
                  setTemplateId(id);
                  setTheme(nextTheme);
                  void track(() =>
                    saveGuide({
                      data: {
                        id: guideId,
                        patch: { template_id: id, theme: nextTheme },
                      },
                    }),
                  );
                }}
              />
            </div>
          ) : !activeSection ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {copy.sections}
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <div className="min-w-48 flex-1 space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {copy.sectionTitle}
                  </label>
                  <Input
                    value={activeSection.title ?? ""}
                    onChange={(event) => {
                      const title = event.target.value;
                      setSections((current) =>
                        current.map((section) =>
                          section.id === activeSection.id
                            ? { ...section, title }
                            : section,
                        ),
                      );
                      schedule(`section-${activeSection.id}`, () =>
                        saveSection({
                          data: { id: activeSection.id, patch: { title } },
                        }),
                      );
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => void handleDeleteSection(activeSection.id)}
                >
                  <Trash2 className="mr-1.5 size-4" />
                  {copy.deleteSection}
                </Button>
              </div>

              {activeSection.type === "local_guide" && (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <RecommendationsPanel
                    recommendations={recommendations}
                    onSave={(draft: RecommendationDraft) =>
                      void track(async () => {
                        await upsertRecommendation({
                          data: {
                            ...(draft.id ? { id: draft.id } : {}),
                            property_id: guide.property_id,
                            category: draft.category,
                            name: draft.name,
                            description: draft.description || null,
                            photo_url: draft.photo_url || null,
                            address: draft.address || null,
                            latitude: draft.latitude ? Number(draft.latitude) : null,
                            longitude: draft.longitude ? Number(draft.longitude) : null,
                            phone: draft.phone || null,
                            whatsapp: draft.whatsapp || null,
                            website: draft.website || null,
                            instagram: draft.instagram || null,
                          },
                        });
                        await refresh();
                      })
                    }
                    onDelete={(id) =>
                      void track(async () => {
                        await dropRecommendation({ data: { id } });
                        await refresh();
                      })
                    }
                  />
                </div>
              )}

              {activeSection.blocks.length === 0 &&
              activeSection.type !== "local_guide" ? (
                <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  {copy.emptySection}
                </p>
              ) : null}

              <div className="space-y-2">
                {activeSection.blocks.map((block) => (
                  <BlockCard
                    key={block.id}
                    type={block.type}
                    content={(block.content ?? {}) as Record<string, unknown>}
                    visible={block.visible}
                    dragging={dragBlock === block.id}
                    dragHandlers={{
                      draggable: true,
                      onDragStart: () => setDragBlock(block.id),
                      onDragEnd: () => setDragBlock(null),
                      onDragOver: (event) => event.preventDefault(),
                      onDrop: () => moveBlock(block.id),
                    }}
                    onChange={(content) => {
                      updateBlockLocal(block.id, { content });
                      schedule(`block-${block.id}`, () =>
                        saveBlock({
                          data: {
                            id: block.id,
                            patch: { content: content as GuideBlockRow["content"] },
                          },
                        }),

                      );
                    }}
                    onToggleVisible={() => {
                      const visible = !block.visible;
                      updateBlockLocal(block.id, { visible });
                      void track(() =>
                        saveBlock({ data: { id: block.id, patch: { visible } } }),
                      );
                    }}
                    onDuplicate={() =>
                      void track(async () => {
                        await copyBlock({ data: { id: block.id } });
                        await refresh();
                      })
                    }
                    onDelete={() =>
                      void track(async () => {
                        await removeBlock({ data: { id: block.id } });
                        await refresh();
                      })
                    }
                  />
                ))}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <Plus className="mr-1.5 size-4" />
                    {copy.addBlock}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-80 w-56 overflow-y-auto">
                  {BLOCK_DEFS.map((def) => (
                    <DropdownMenuItem
                      key={def.type}
                      onClick={() => void handleAddBlock(def.type)}
                    >
                      <SectionIcon name={def.icon} className="mr-2 size-4" />
                      {def.label[lang]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div className={`${mobilePreview ? "" : "hidden xl:block"}`}>
          <div className="xl:sticky xl:top-6">{previewNode}</div>
        </div>
      </div>
    </div>
  );
}
