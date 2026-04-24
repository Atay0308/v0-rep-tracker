"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"

interface DropdownMenuProps {
  trigger: ReactNode
  children: ReactNode
  align?: "left" | "right"
}

export function DropdownMenu({ trigger, children, align = "right" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="dropdown" ref={menuRef}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      <div 
        className={`dropdown-menu ${isOpen ? "open" : ""}`}
        style={{ [align === "left" ? "left" : "right"]: 0 }}
      >
        {children}
      </div>
    </div>
  )
}

interface DropdownMenuItemProps {
  children: ReactNode
  onClick?: () => void
  variant?: "default" | "danger"
}

export function DropdownMenuItem({ children, onClick, variant = "default" }: DropdownMenuItemProps) {
  return (
    <button 
      className={`dropdown-item ${variant === "danger" ? "danger" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
