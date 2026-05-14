import React from 'react';
import { RPProvider, RPLayout, RPPages } from "@react-pdf-kit/viewer";

export default function PDFViewer({ url }) {
  if (!url) return null;
  return (
    <div className="w-full h-full relative overflow-hidden bg-white/5 flex items-center justify-center">
      <RPProvider src={url}>
        <RPLayout>
          <RPPages />
        </RPLayout>
      </RPProvider>
    </div>
  );
}
