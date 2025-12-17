import "./globals.css";
import React from "react";

export const metadata = {
  title: "Móni egészségjátéka",
  description: "D20 alapú napi egészség mini-feladatok és havi összesítő.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
