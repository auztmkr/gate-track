import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function CameraScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (text) => {
        onScan(text);
        scanner.clear();
      },
      () => {}
    );

    return () => scanner.clear().catch(() => {});
  }, []);

  return <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />;
}
