"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePredictionStore } from "@/lib/store"
import { LandingHero } from "@/components/landing-hero"
import { PredictionInput } from "@/components/prediction-input"
import { ProcessingAnimation } from "@/components/processing-animation"
import { PredictionResult } from "@/components/prediction-result"
import { LoadingAnimation } from "@/components/loading-animation"
import { CustomCursor } from "@/components/custom-cursor"
import { ThemeToggle } from "@/components/theme-toggle"
import dynamic from "next/dynamic"

// Dynamically import Three.js scene to avoid SSR issues
const ThreeScene = dynamic(
  () => import("@/components/three-scene").then((mod) => mod.ThreeScene),
  { ssr: false }
)

export default function DelulumeterApp() {
  const step = usePredictionStore((state) => state.step)
  
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Three.js Background - only show on landing */}
      {step === "landing" && <ThreeScene />}
      
      <AnimatePresence mode="wait">
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingAnimation />
          </motion.div>
        )}
        
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <LandingHero />
          </motion.div>
        )}
        
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <PredictionInput />
          </motion.div>
        )}
        
        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <ProcessingAnimation />
          </motion.div>
        )}
        
        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PredictionResult />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
