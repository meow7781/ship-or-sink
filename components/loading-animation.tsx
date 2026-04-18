"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { Sparkles, Brain, Zap } from "lucide-react"
import { usePredictionStore } from "@/lib/store"

export function LoadingAnimation() {
  const setStep = usePredictionStore((state) => state.setStep)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('landing')
    }, 3000) // 3 seconds loading

    return () => clearTimeout(timer)
  }, [setStep])

  const safeWidth = typeof window !== "undefined" ? window.innerWidth : 1200
  const safeHeight = typeof window !== "undefined" ? window.innerHeight : 800

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
            initial={{
              x: Math.random() * safeWidth,
              y: Math.random() * safeHeight,
              scale: 0
            }}
            animate={{
              y: [null, -20, null],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <Brain className="w-24 h-24 text-purple-400 mx-auto mb-4" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="w-8 h-8 text-pink-400 absolute top-0 left-1/2 transform -translate-x-1/2" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Zap className="w-6 h-6 text-blue-400 absolute bottom-0 right-0" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4"
        >
          DelluMeter
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Initializing quantum prediction engine...
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
          className="w-64 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 2.5, duration: 0.5, repeat: Infinity }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Ready to predict your delulu level
        </motion.div>
      </div>
    </div>
  )
}