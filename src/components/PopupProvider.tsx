"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Popup } from "./Popup";
import { Toaster } from "@/components/ui/toaster";

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Don't show popup on admin pages
    if (pathname?.startsWith("/admin")) {
      return;
    }

    // const hasSeenPopup = localStorage.getItem("hasSeenPopup");

    // if (!hasSeenPopup) {
    const fetchPopupContent = async () => {
      try {
        const response = await fetch("/api/popup");
        const data = (await response.json()) as { content: string };
        setPopupContent(data.content);
        setIsPopupVisible(true);
      } catch (error) {
        console.error("Error fetching popup content:", error);
      }
    };

    fetchPopupContent();
    // }
  }, [pathname]);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    localStorage.setItem("hasSeenPopup", "true");
  };

  return (
    <>
      {children}
      <Popup
        content={popupContent}
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
      />
      <Toaster />
    </>
  );
}
