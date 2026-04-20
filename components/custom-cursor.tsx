"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue } from "framer-motion"
import { Sparkles } from "lucide-react"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Handle hydration - only render on client
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    setIsVisible(true)
  }, [cursorX, cursorY])
  
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.dataset.cursorHover
      ) {
        setIsHovering(true)
      }
    }
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.dataset.cursorHover
      ) {
        setIsHovering(false)
      }
    }
    
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)
    
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [handleMouseMove])
  
  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) return null
  
  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? 28 : 18,
          height: isHovering ? 28 : 18,
          backgroundColor: isHovering ? "#111111" : "#ffffff",
          borderColor: isHovering ? "#ffffff" : "#111111",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.06 }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Sparkles
            size={isHovering ? 12 : 10}
            strokeWidth={2.5}
            color={isHovering ? "#ffffff" : "#111111"}
          />
        </div>
      </motion.div>
      
      {/* Cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border-2"
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? 46 : 34,
          height: isHovering ? 46 : 34,
          borderColor: isHovering ? "#111111" : "#ffffff",
          opacity: isVisible ? 0.9 : 0,
        }}
        transition={{ duration: 0.08 }}
      />
    </>
  )
}
