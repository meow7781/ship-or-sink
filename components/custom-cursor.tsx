"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Handle hydration - only render on client
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const springConfig = { damping: 25, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    setIsVisible(true)
    
    // Add trail particle
    setTrail(prev => {
      const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]
      return newTrail.slice(-8) // Keep last 8 particles
    })
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
  
  // Clean up old trail particles
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.filter(p => Date.now() - p.id < 300))
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) return null
  
  return (
    <>
      {/* Trail particles */}
      {trail.map((particle, i) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[9997] rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: 8 - i * 0.8,
            height: 8 - i * 0.8,
            background: `hsl(${25 + i * 10}, 80%, 60%)`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      ))}
      
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? 24 : 14,
          height: isHovering ? 24 : 14,
          backgroundColor: isHovering ? "#ff6b4a" : "#ff8566",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Cursor ring */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full border-2"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: isHovering ? 60 : 44,
          height: isHovering ? 60 : 44,
          borderColor: isHovering ? "#ff6b4a" : "#ff8566",
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Sparkle effect on hover */}
      {isHovering && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none z-[9996]"
              style={{
                left: cursorXSpring,
                top: cursorYSpring,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI) / 2) * 30 - 4,
                y: Math.sin((i * Math.PI) / 2) * 30 - 4,
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="#ff6b4a">
                <polygon points="4,0 5,3 8,4 5,5 4,8 3,5 0,4 3,3" />
              </svg>
            </motion.div>
          ))}
        </>
      )}
    </>
  )
}
