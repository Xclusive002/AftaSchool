import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export const QrCodeViewer: React.FC<QrCodeProps> = ({
  value,
  size = 120,
  className = '',
  darkColor = '#0f172a',
  lightColor = '#ffffff'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: {
          dark: darkColor,
          light: lightColor
        }
      }, (error) => {
        if (error) console.error('QR code generation error:', error);
      });
    }
  }, [value, size, darkColor, lightColor]);

  return (
    <div className={`inline-block p-1 bg-white rounded-md shadow-xs ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};
