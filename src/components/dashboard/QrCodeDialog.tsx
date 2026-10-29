import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Image as ImageIcon, Link2, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageProvider";

const COPY = {
  fr: {
    trigger: "QR Code",
    title: "QR Code du livret",
    description:
      "Imprimez-le, collez-le dans le logement ou partagez-le : vos voyageurs accèdent au livret en un scan.",
    download: "Télécharger le PNG",
    poster: "Créer mon affiche QR Code",
    share: "Partager",
    copy: "Copier le lien",
    copied: "Lien copié !",
    scanTitle: "Scannez-moi",
    scanSub: "Votre livret d'accueil digital",
    unpublished:
      "Publiez ce livret pour que le lien et le QR Code fonctionnent pour vos voyageurs.",
  },
  en: {
    trigger: "QR Code",
    title: "Guidebook QR code",
    description:
      "Print it, display it in the property or share it: guests open the guidebook in one scan.",
    download: "Download PNG",
    poster: "Create my QR poster",
    share: "Share",
    copy: "Copy link",
    copied: "Link copied!",
    scanTitle: "Scan me",
    scanSub: "Your digital welcome book",
    unpublished:
      "Publish this guidebook so the link and QR code work for your guests.",
  },
} as const;

/** QR code generation, download, sharing and printable poster for a guidebook. */
export function QrCodeDialog({
  slug,
  title,
  city,
  published,
}: {
  slug: string;
  title: string;
  city?: string | null;
  published: boolean;
}) {
  const { lang } = useLanguage();
  const copy = COPY[lang];
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    const target = `${window.location.origin}/livret/${slug}`;
    setUrl(target);
    void QRCode.toDataURL(target, {
      width: 720,
      margin: 2,
      color: { dark: "#1B4FA0", light: "#FFFFFF" },
    }).then(setDataUrl);
  }, [open, slug]);

  const download = (href: string, name: string) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = name;
    link.click();
  };

  const makePoster = async () => {
    if (!dataUrl) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1B4FA0";
    ctx.fillRect(0, 0, canvas.width, 260);

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = "bold 64px Inter, sans-serif";
    ctx.fillText(copy.scanTitle, canvas.width / 2, 130);
    ctx.font = "500 34px Inter, sans-serif";
    ctx.fillText(copy.scanSub, canvas.width / 2, 190);

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(250, 380, 580, 580);
    ctx.drawImage(img, 270, 400, 540, 540);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 52px Inter, sans-serif";
    ctx.fillText(title.slice(0, 34), canvas.width / 2, 1060);
    if (city) {
      ctx.fillStyle = "#475569";
      ctx.font = "400 36px Inter, sans-serif";
      ctx.fillText(city, canvas.width / 2, 1115);
    }
    ctx.fillStyle = "#1B4FA0";
    ctx.font = "600 30px Inter, sans-serif";
    ctx.fillText("dalal", canvas.width / 2, 1250);

    download(canvas.toDataURL("image/png"), `affiche-qr-${slug}.png`);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success(copy.copied);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="rounded-full">
          <QrCode className="mr-1.5 size-3.5" />
          {copy.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt={`QR code ${title}`}
              className="size-52 rounded-2xl border border-border bg-white p-2"
              width={208}
              height={208}
            />
          ) : (
            <div className="size-52 animate-pulse rounded-2xl bg-muted" />
          )}
          <p className="max-w-full truncate text-xs text-muted-foreground">{url}</p>
          {!published && (
            <p className="rounded-xl bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">
              {copy.unpublished}
            </p>
          )}

          <div className="grid w-full grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => dataUrl && download(dataUrl, `qr-${slug}.png`)}
            >
              <Download className="mr-1.5 size-4" />
              {copy.download}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => void makePoster()}>
              <ImageIcon className="mr-1.5 size-4" />
              {copy.poster}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => void share()}>
              <Share2 className="mr-1.5 size-4" />
              {copy.share}
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                void navigator.clipboard.writeText(url);
                toast.success(copy.copied);
              }}
            >
              <Link2 className="mr-1.5 size-4" />
              {copy.copy}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
