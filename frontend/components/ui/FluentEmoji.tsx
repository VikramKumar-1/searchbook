import React, { useState } from 'react';

interface FluentEmojiProps {
  name: string;      // e.g., 'Bed', 'House', 'Wrench', 'Sparkles'
  size?: number;     // e.g. 32
  fallback?: string; // e.g. '🛏️'
}

export function FluentEmoji({ name, size = 32, fallback }: FluentEmojiProps) {
  const [error, setError] = useState(false);

  // Microsoft Fluent Emoji Repo Structure:
  // Folder: "Bed" / "High voltage"
  // File: "bed_3d.png" / "high_voltage_3d.png"
  const folderName = name.charAt(0).toUpperCase() + name.slice(1);
  const fileName = name.toLowerCase().replace(/ /g, '_') + '_3d.png';
  
  const url = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${encodeURIComponent(folderName)}/3D/${encodeURIComponent(fileName)}`;

  if (error && fallback) {
    return (
      <div 
        className="flex items-center justify-center shrink-0" 
        style={{ width: size, height: size, fontSize: size * 0.7 }}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 object-contain drop-shadow-sm"
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  );
}
