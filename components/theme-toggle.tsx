"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Zap, Settings, Shuffle, Sparkles } from "lucide-react"
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
    icon: Moon,
    label: "Dark Mode",
    description: "Everything is pink now",
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
  const { theme, setTheme, soundEnabled } = usePredictionStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isRandomizing, setIsRandomizing] = useState(false)
  
  const handleThemeChange = (newTheme: ThemeMode) => {
    if (soundEnabled) {
      soundManager.play(newTheme === "chaos" ? "magic" : "click")
    }
    setTheme(newTheme)
    setIsOpen(false)
  }
  
  const handleRandomTheme = () => {
    if (soundEnabled) {
      soundManager.play("magic")
    }
    setIsRandomizing(true)
    setTheme('random')
    
    // Stop the randomization animation after a short delay
    setTimeout(() => setIsRandomizing(false), 1000)
  }
  
  const CurrentIcon = themeConfig[theme].icon
  
  return (
    <div className="relative flex items-center gap-2">
      {/* Special Pink Random Theme Button */}
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
          {/* Sparkle effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          🎲 Random Theme Switch!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
        </div>
      </div>
      
      {/* Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-cursor-hover
        aria-label="Theme settings"
      >
        <Settings className="w-5 h-5 text-foreground" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-card rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground chaos-text">Theme Settings</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose your visual experience
                </p>
              </div>
              
              <div className="p-2">
                {(['light', 'pink', 'chaos'] as ThemeMode[]).map((themeKey) => {
                  const config = themeConfig[themeKey]
                  const Icon = config.icon
                  const isActive = theme === themeKey
                  
                  return (
                    <motion.button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors relative overflow-hidden ${
                        isActive 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "hover:bg-muted border-2 border-transparent"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      data-cursor-hover
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: config.color }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                          {config.label}
                          {themeKey === "pink" && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-pink/20 text-pink">
                              Inverted
                            </span>
                          )}
                          {themeKey === "chaos" && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
                              Chaotic
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Chaos mode warning */}
              {theme === "chaos" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 pb-4"
                >
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-destructive font-medium chaos-rainbow">
                      WARNING: High Contrast mode may cause eye strain, confusion, and an inexplicable urge to use WordArt. 
                      Proceed at your own risk.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
