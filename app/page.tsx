"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePredictionStore } from "@/lib/store"
import { LandingHero } from "@/components/landing-hero"
import { PredictionInput } from "@/components/prediction-input"
import { ProcessingAnimation } from "@/components/processing-animation"
import { PredictionResult } from "@/components/prediction-result"
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
      {step === "landing" && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 78% 46%, rgba(151,228,255,0.95) 0%, rgba(81,178,255,0.88) 10%, rgba(36,100,196,0.45) 18%, rgba(8,26,62,0.08) 29%, transparent 34%), radial-gradient(ellipse at 82% 46%, rgba(255,255,255,0.95) 0%, rgba(193,236,255,0.52) 6%, transparent 16%), radial-gradient(ellipse at 74% 40%, rgba(82,142,255,0.34) 0%, transparent 22%), radial-gradient(ellipse at 93% 18%, rgba(255,255,255,0.18) 0%, transparent 14%), linear-gradient(110deg, rgba(1,4,12,0.99) 0%, rgba(3,8,18,0.98) 32%, rgba(6,15,31,0.96) 56%, rgba(11,24,48,0.9) 74%, rgba(14,31,58,0.82) 100%)",
          }}
        />
      )}
      {step === "landing" && (
        <div
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle at 86% 33%, rgba(255,255,255,0.16) 0 1px, transparent 1.5px), radial-gradient(circle at 76% 27%, rgba(255,255,255,0.14) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 46%, rgba(255,255,255,0.14) 0 1px, transparent 1.5px), radial-gradient(circle at 90% 29%, rgba(255,255,255,0.14) 0 1px, transparent 1.5px), radial-gradient(circle at 94% 49%, rgba(255,255,255,0.12) 0 1px, transparent 1.5px), radial-gradient(circle at 80% 12%, rgba(255,255,255,0.12) 0 1px, transparent 1.5px), radial-gradient(circle at 61% 22%, rgba(255,210,140,0.2) 0 1px, transparent 1.6px), radial-gradient(circle at 66% 70%, rgba(255,210,140,0.18) 0 1px, transparent 1.6px)",
          }}
        />
      )}
      {step === "landing" && (
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 86% 44%, transparent 0 58%, rgba(255,255,255,0.08) 60%, transparent 63%)",
          }}
        />
      )}
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Three.js Background - only show on landing */}
      {step === "landing" && <ThreeScene />}
      
      <AnimatePresence mode="wait">
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
