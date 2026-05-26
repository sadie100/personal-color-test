import { useCallback, useEffect, useMemo, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

interface UseCameraResult {
  status: CameraStatus;
  stream: MediaStream | null;
  request: () => void;
}

const isMediaDevicesSupported = () =>
  typeof navigator !== "undefined" &&
  typeof navigator.mediaDevices !== "undefined" &&
  typeof navigator.mediaDevices.getUserMedia === "function";

export const useCamera = (enabled: boolean): UseCameraResult => {
  const supported = useMemo(() => isMediaDevicesSupported(), []);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [denied, setDenied] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const status: CameraStatus = !supported
    ? "unsupported"
    : !enabled
      ? "idle"
      : stream
        ? "granted"
        : denied
          ? "denied"
          : "requesting";

  const request = useCallback(() => {
    setDenied(false);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !supported) {
      return;
    }

    let cancelled = false;
    let acquired: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        acquired = mediaStream;
        setStream(mediaStream);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setStream(null);
        setDenied(true);
      });

    return () => {
      cancelled = true;
      if (acquired) {
        acquired.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    };
  }, [enabled, supported, attempt]);

  return { status, stream, request };
};
