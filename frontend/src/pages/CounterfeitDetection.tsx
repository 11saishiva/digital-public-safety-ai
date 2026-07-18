import { useState } from "react";
import { RotateCcw, ScanSearch, Clock, Cpu, CalendarClock, Percent } from "lucide-react";
import { FileUpload } from "../components/FileUpload";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Loader } from "../components/Loader";
import { PredictionChip } from "../components/Badge";
import { ErrorState } from "../components/StateViews";
import { useCounterfeitPredict } from "../hooks/useCounterfeit";
import { formatConfidence, formatDate, formatMs } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";

export function CounterfeitDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { mutate, data, isPending, isError, error, reset } = useCounterfeitPredict();
  const { showToast } = useToast();

  const handleFile = (f: File) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    reset();
  };

  const handlePredict = () => {
    if (!file) return;
    mutate(file, {
      onError: (err) => showToast("error", err instanceof ApiError ? err.message : "Prediction failed."),
      onSuccess: () => showToast("success", "Analysis complete."),
    });
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    reset();
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Counterfeit Detection</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Upload a clear photo of an Indian currency note to check its authenticity.
        </p>
      </div>

      {!previewUrl ? (
        <FileUpload onFileSelected={handleFile} />
      ) : (
        <Card className="flex flex-col items-center gap-4">
          <div className="scan-corner overflow-hidden rounded-lg border border-border">
            <img src={previewUrl} alt="Uploaded currency note preview" className="max-h-80 w-full object-contain bg-surface-sunken" />
          </div>
          <div className="flex w-full items-center gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4" /> Choose different image
            </Button>
            <Button onClick={handlePredict} loading={isPending} className="flex-1">
              <ScanSearch className="h-4 w-4" /> Predict
            </Button>
          </div>
        </Card>
      )}

      {isPending && (
        <Card>
          <Loader label="Analyzing note…" />
        </Card>
      )}

      {isError && (
        <ErrorState
          message={error instanceof ApiError ? error.message : "Prediction failed."}
          onRetry={handlePredict}
        />
      )}

      {data && !isPending && (
        <Card className="animate-fade-up flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Result</h2>
            <PredictionChip prediction={data.prediction} />
          </div>
          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <Stat icon={Percent} label="Confidence" value={formatConfidence(data.confidence)} />
            <Stat icon={Clock} label="Processing time" value={formatMs(data.processing_time_ms)} />
            <Stat icon={Cpu} label="Model version" value={data.model_version} />
            <Stat icon={CalendarClock} label="Timestamp" value={formatDate(data.created_at)} />
          </dl>
        </Card>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 text-teal" strokeWidth={1.9} />
      <div>
        <dt className="text-xs text-ink-muted">{label}</dt>
        <dd className="font-mono-data text-sm font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
