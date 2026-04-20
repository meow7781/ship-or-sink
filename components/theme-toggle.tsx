"use client"

import { motion } from "framer-motion"
import { Sun, Heart, Zap, Sparkles } from "lucide-react"
import { usePredictionStore, ThemeMode } from "@/lib/store"
import { soundManager } from "@/lib/sounds"
import { useState } from "react"

const themeConfig: Record<ThemeMode, { icon: typeof Sun; label: string; description: string; color: string }> = {
  light: {
    icon: Sun,
    label: "Light",
    description: "Warm & cozy cream vibes",
    color: "#f5e6d3",
  },
  pink: {
    icon: Heart,
    label: "Pink Mode",
    description: "No dark mode, only pink vibes",
    color: "#e879a9",
  },
  chaos: {
    icon: Zap,
    label: "High Contrast",
    description: "Comic Sans & clashing colors",
    color: "#ff6b6b",
  },
}

export function ThemeToggle() {
  const { setTheme, soundEnabled } = usePredictionStore()
  const [isRandomizing, setIsRandomizing] = useState(false)
  
  const handleRandomTheme = () => {
    if (soundEnabled) {
      soundManager.play("magic")
    }
    setIsRandomizing(true)
    setTheme('random')
    
    // Stop the randomization animation after a short delay
    setTimeout(() => setIsRandomizing(false), 1000)
  }
  
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative group">
      <motion.button
        onClick={handleRandomTheme}
        className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-2 border-pink-300 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.9 }}
        animate={isRandomizing ? {
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        } : {}}
        transition={isRandomizing ? {
          duration: 0.5,
          ease: "easeInOut"
        } : {}}
        data-cursor-hover
        aria-label="Random theme surprise!"
      >
        <Sparkles className="w-5 h-5 text-white relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </motion.button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Random Theme Switch
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
        </div>
      </div>
    </div>
  )
}
