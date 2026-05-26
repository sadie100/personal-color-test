import { useEffect, useRef } from "react";

import { getChipName } from "../data/colorData";
import { useCamera } from "../hooks/useCamera";
import { translations } from "../i18n/translations";
import type { DiagnosticChip, Lang } from "../types";
import { ShirtSwatch } from "./ShirtSwatch";

interface CameraStageProps {
  color: DiagnosticChip | null;
  lang: Lang;
  dragX: number;
  isDragging: boolean;
  exitDirection: "left" | "right" | null;
  onBackToSetup: () => void;
}

export const CameraStage = ({
  color,
  lang,
  dragX,
  isDragging,
  exitDirection,
  onBackToSetup,
}: CameraStageProps) => {
  const t = translations[lang];
  const { status, stream, request } = useCamera(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    if (stream) {
      video.play().catch(() => {
        // autoplay can fail without a user gesture on some browsers; the user
        // has already gestured to enter this screen, so this should be rare.
      });
    }
  }, [stream]);

  if (status === "unsupported" || status === "denied") {
    const title = status === "unsupported" ? t.test.camera.unsupportedTitle : t.test.camera.deniedTitle;
    const message =
      status === "unsupported" ? t.test.camera.unsupportedMessage : t.test.camera.deniedMessage;
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-600 p-6"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-6 text-center text-gray-800 shadow-2xl">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{message}</p>
          <div className="mt-6 flex flex-col gap-2">
            {status === "denied" && (
              <button
                type="button"
                onClick={request}
                className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 active:scale-95"
              >
                {t.test.camera.retry}
              </button>
            )}
            <button
              type="button"
              onClick={onBackToSetup}
              className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
            >
              {t.test.camera.backToSetup}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "scaleX(-1)" }}
      />

      {status === "requesting" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
          <p className="text-sm">{t.test.camera.requesting}</p>
        </div>
      )}

      {status === "granted" && (
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/85 backdrop-blur-sm">
          {t.test.camera.faceHint}
        </div>
      )}

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[55%]">
        {color && (
          <ShirtSwatch
            color={color.hex}
            dragX={dragX}
            isDragging={isDragging}
            exitDirection={exitDirection}
          />
        )}
      </div>

      {color && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-1.5 text-center text-white shadow-lg backdrop-blur-sm">
          <p className="text-sm font-semibold">{getChipName(color, lang)}</p>
          <p className="text-xs text-white/75">{color.hex}</p>
        </div>
      )}
    </div>
  );
};
