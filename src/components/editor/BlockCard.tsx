import { useState } from "react";
import { ChevronDown, Copy, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import { editorCopy } from "@/i18n/editorCopy";
import { BLOCK_DEF_MAP } from "@/lib/guide-schema";
import { BlockFields, type BlockContent } from "@/components/editor/BlockFields";
import { SectionIcon } from "@/components/editor/SectionIcon";

/** One editable block with its actions (hide, duplicate, delete, drag). */
export function BlockCard({
  type,
  content,
  visible,
  dragging,
  onChange,
  onToggleVisible,
  onDuplicate,
  onDelete,
  dragHandlers,
}: {
  type: string;
  content: BlockContent;
  visible: boolean;
  dragging?: boolean;
  onChange: (content: BlockContent) => void;
  onToggleVisible: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  dragHandlers: React.HTMLAttributes<HTMLDivElement> & { draggable?: boolean };
}) {
  const { lang } = useLanguage();
  const copy = editorCopy[lang];
  const [open, setOpen] = useState(false);
  const def = BLOCK_DEF_MAP[type];

  return (
    <div
      {...dragHandlers}
      className={`rounded-2xl border border-border bg-card shadow-soft transition-opacity ${dragging ? "opacity-40" : ""} ${visible ? "" : "opacity-60"}`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span className="cursor-grab text-muted-foreground" aria-label={copy.dragHint}>
          <GripVertical className="size-4" />
        </span>
        <span className="inline-flex size-8 items-center justify-center rounded-xl bg-secondary text-primary">
          <SectionIcon name={def?.icon ?? "Info"} className="size-4" />
        </span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="text-sm font-semibold text-card-foreground">
            {def?.label[lang] ?? type}
          </span>
          {!visible && (
            <span className="ml-2 text-xs text-muted-foreground">({copy.hidden})</span>
          )}
        </button>

        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-lg text-muted-foreground"
          title={visible ? copy.hide : copy.show}
          onClick={onToggleVisible}
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-lg text-muted-foreground"
          title={copy.duplicate}
          onClick={onDuplicate}
        >
          <Copy className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive"
          title={copy.delete}
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-lg text-muted-foreground"
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {open && (
        <div className="border-t border-border p-4">
          <BlockFields type={type} content={content} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
