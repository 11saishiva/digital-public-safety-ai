import { useCallback, useRef, useState, type DragEvent } from "react";
import { UploadCloud, ImageOff } from "lucide-react";

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  error?: string | null;
}

export function FileUpload({ onFileSelected, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) return;
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={`scan-corner flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        isDragging ? "border-teal bg-teal-light/40" : "border-border bg-surface-sunken/50 hover:border-teal/60"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-teal">
        <UploadCloud className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-medium text-ink">
          Drag & drop a currency note image, or{" "}
          <span className="font-semibold text-action underline underline-offset-2">browse files</span>
        </p>
        <p className="mt-1 text-xs text-ink-muted">Supports JPG, PNG, WEBP</p>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <ImageOff className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
