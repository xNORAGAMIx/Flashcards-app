import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const DynamicQRCode = ({
  value
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: 200,
          margin: 2,
          color: {
            dark: "#111111",
            light: "#ffffff",
          },
        },
        (err) => {
          if (err) console.error("QR Code generation failed:", err);
        }
      );
    }
  }, [value]);

  return (
    <div className=" py-2 w-fit shadow-lg rounded-2xl">
      <canvas ref={canvasRef} className="rounded-2xl w-[128px] h-[128px]" />
    </div>
  );
};

export default DynamicQRCode;
