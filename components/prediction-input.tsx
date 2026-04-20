"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePredictionStore, type PredictionMode } from "@/lib/store"
import { soundManager } from "@/lib/sounds"
import { ArrowLeft, Brain, Volume2, VolumeX, Sparkles, Flame, Eye, Send, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const modeConfig: Record<PredictionMode, { label: string; icon: typeof Sparkles; color: string; description: string }> = {
  delulu: {
    label: "DELULU",
    icon: Sparkles,
    color: "#9b59b6",
    description: "Maximum copium, zero reality checks"
  },
  roast: {
    label: "ROAST",
    icon: Flame,
    color: "#e85d4c",
    description: "Brutal honesty, extra spicy"
  },
  predict: {
    label: "PREDICT",
    icon: Eye,
    color: "#f39c12",
    description: "Fake prophecies, real entertainment"
  }
}

const exampleQuestions: Record<PredictionMode, string[]> = {
  delulu: [
    "He hasn't texted back in 3 days because he's planning the surprise wedding, right?",
    "Is my ex thinking about me right now?",
    "Will my crush notice me this year?",
    "Am I the main character?",
  ],
  roast: [
    "Should I quit my job to become a full-time professional napper?",
    "Why is my bank account screaming?",
    "Will my diet start this Monday?",
    "Is my productivity level even measurable?",
  ],
  predict: [
    "Will I survive this Monday morning meeting without coffee?",
    "What does my future look like?",
    "Will I find love this year?",
    "Is success in my destiny?",
  ]
}

export function PredictionInput() {
  const { 
    setStep, 
    setQuestion, 
    mode, 
    setMode,
    deepThinkingMode, 
    toggleDeepThinking, 
    soundEnabled, 
    toggleSound 
  } = usePredictionStore()
  const [inputValue, setInputValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showComposerTools, setShowComposerTools] = useState(false)
  
  const handleSubmit = async () => {
    if (!inputValue.trim()) return
    soundManager.play("whoosh")
    await soundManager.fetchAndPlay("likee")
    setQuestion(inputValue)
    setStep("processing")
  }
  
  const handleModeChange = (newMode: PredictionMode) => {
    soundManager.play("pop")
    setMode(newMode)
  }
  
  const handleExampleClick = (question: string) => {
    soundManager.play("pop")
    setInputValue(question)
  }
  
  const currentMode = modeConfig[mode]
  const dynamicPlaceholder = exampleQuestions[mode][placeholderIndex] || "Ask your life question..."

  useEffect(() => {
    setPlaceholderIndex(0)
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % exampleQuestions[mode].length)
    }, 2400)

    return () => clearInterval(interval)
  }, [mode])
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => {
            soundManager.play("click")
            setStep("landing")
          }}
          className="flex items-center gap-2 rounded-[999px] px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          data-cursor-hover
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              toggleSound()
              soundManager.setEnabled(!soundEnabled)
            }}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            data-cursor-hover
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-foreground" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mode Selector */}
        <motion.div
          className="flex gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {(Object.entries(modeConfig) as [PredictionMode, typeof currentMode][]).map(([key, config]) => (
            <motion.button
              key={key}
              onClick={() => handleModeChange(key)}
              className="flex items-center gap-2 px-6 py-3 rounded-[999px] font-semibold text-sm shadow-sm transition-all"
              style={{
                backgroundColor: mode === key ? config.color : "var(--muted)",
                color: mode === key ? "white" : "var(--foreground)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => soundManager.play("hover")}
              data-cursor-hover
            >
              <config.icon className="w-4 h-4" />
              {config.label}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Mode Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {currentMode.description}
          </motion.p>
        </AnimatePresence>
        
        {/* Input Area */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="rounded-[1.75rem] border border-border bg-card shadow-sm">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={dynamicPlaceholder}
                className="w-full h-32 bg-transparent p-5 text-lg resize-none focus:outline-none rounded-t-[1.75rem] placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />

              <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => {
                      soundManager.play("click")
                      setShowComposerTools((current) => !current)
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    data-cursor-hover
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showComposerTools && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-3 rounded-full bg-muted px-4 py-2"
                      >
                        <Brain className="w-4 h-4" style={{ color: deepThinkingMode ? "#9b59b6" : "var(--muted-foreground)" }} />
                        <span className="text-sm font-medium">Think Harder</span>
                        <Switch 
                          checked={deepThinkingMode} 
                          onCheckedChange={() => {
                            soundManager.play("click")
                            toggleDeepThinking()
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  onClick={handleSubmit}
                  className="rounded-[1.25rem] p-3 text-white shadow-sm"
                  style={{ backgroundColor: currentMode.color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!inputValue.trim()}
                  data-cursor-hover
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Example Questions */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Or try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions[mode].map((question, i) => (
                <motion.button
                  key={question}
                  onClick={() => handleExampleClick(question)}
                  className="px-4 py-2 text-sm bg-muted hover:bg-border rounded-[999px] border border-border/50 transition-colors text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => soundManager.play("hover")}
                  data-cursor-hover
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Fun Stats */}
        <motion.div
          className="mt-16 flex gap-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "2.4M+", label: "Delusions Processed" },
            { value: "0%", label: "Accuracy Rate" },
            { value: "100%", label: "Entertainment Value" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold" style={{ color: currentMode.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
