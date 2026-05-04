"use client";

import { useState } from "react";
import styles from "./side-bar.module.css";
import { useSwipe } from "@/hooks/use-swipe";
import UserMenu from "../UserMenu/user-menu";
import { SessionProvider } from "next-auth/react"

export default function Sidebar() {
  // steuert ob Sidebar offen ist oder nicht
  const [open, setOpen] = useState(false);
  const { handleTouchStart, handleTouchEnd } = useSwipe(() => setOpen(false));

  return (
    <>
      {/* 🔘 Hamburger Button (öffnet Sidebar) */}
      <button className={styles.hamburger} onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* 🌑 Overlay (dunkler Hintergrund) */}
      {/* Klick außerhalb schließt Sidebar */}
      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}

      {/* 📦 Sidebar Container - aside wie div, aber semantisch für sidebar */}
      <aside    
        className={`${styles.sidebar} ${open ? styles.open : ""}`}

        // Touch Events für Swipe-Gesten
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 🔝 Oberer Bereich */}
        <div className={styles.top}>
          <SessionProvider>
            <UserMenu />
          </SessionProvider>
        </div>

        {/* 🔻 Unterer Bereich */}
        <div className={styles.bottom}>
          <button className={styles.settings}>
            Einstellungen
          </button>
        </div>
      </aside>
    </>
  );
}