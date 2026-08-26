"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { generateQrPng, generateQrSvg, contrastWarning } from "@/lib/qr/generate";

export function QrModal({
  open,
  onClose,
  value,
  title = "QR code",
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  title?: string;
}) {
  const [fg, setFg] = useState("#171717");
  const [bg, setBg] = useState("#FFFFFF");
  const [png, setPng] = useState<string>("");

  const warning = contrastWarning(fg, bg);

  useEffect(() => {
    if (!open || !value) return;
    let active = true;
    void generateQrPng(value, { foreground: fg, background: bg, size: 512 }).then(
      (url) => {
        if (active) setPng(url);
      },
    );
    return () => {
      active = false;
    };
  }, [open, value, fg, bg]);

  function download(dataUrl: string, ext: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `fenix-qr.${ext}`;
    a.click();
  }

  async function downloadSvg() {
    const svg = await generateQrSvg(value, { foreground: fg, background: bg });
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    download(url, "svg");
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex justify-center rounded-xl border border-line bg-workspace p-4">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt="QR code preview" className="size-48" />
          ) : (
            <div className="size-48 animate-pulse rounded-lg bg-line" />
          )}
        </div>
        <p className="break-all text-center text-xs text-ink-secondary">{value}</p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Foreground" htmlFor="qr-fg">
            <Input id="qr-fg" value={fg} onChange={(e) => setFg(e.target.value)} />
          </Field>
          <Field label="Background" htmlFor="qr-bg">
            <Input id="qr-bg" value={bg} onChange={(e) => setBg(e.target.value)} />
          </Field>
        </div>
        {warning ? (
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
            {warning}
          </p>
        ) : null}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => download(png, "png")}>
            <Download className="size-4" /> PNG
          </Button>
          <Button variant="outline" className="flex-1" onClick={downloadSvg}>
            <Download className="size-4" /> SVG
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
