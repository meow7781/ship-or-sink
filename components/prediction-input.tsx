"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePredictionStore, type PredictionMode } from "@/lib/store"
import { soundManager } from "@/lib/sounds"
import { ArrowLeft, Brain, Volume2, VolumeX, Sparkles, Flame, Eye, Send } from "lucide-react"
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
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => {
            soundManager.play("click")
            setStep("landing")
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          data-cursor-hover
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-6">
          {/* Deep Thinking Mode Toggle */}
          <motion.div 
            className="flex items-center gap-3 bg-muted px-4 py-2 rounded-full"
            whileHover={{ scale: 1.02 }}
          >
            <Brain className="w-5 h-5" style={{ color: deepThinkingMode ? "#9b59b6" : "var(--muted-foreground)" }} />
            <span className="text-sm font-medium">Think Harder</span>
            <Switch 
              checked={deepThinkingMode} 
              onCheckedChange={() => {
                soundManager.play("click")
                toggleDeepThinking()
              }}
            />
          </motion.div>
          
          {/* Sound Toggle */}
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all"
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
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your life question..."
              className="w-full h-32 p-5 pr-14 text-lg bg-card border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
            />
            <motion.button
              onClick={handleSubmit}
              className="absolute bottom-4 right-4 p-3 rounded-xl text-white"
              style={{ backgroundColor: currentMode.color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={!inputValue.trim()}
              data-cursor-hover
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Example Questions */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Or try one of these:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions[mode].map((question, i) => (
                <motion.button
                  key={question}
                  onClick={() => handleExampleClick(question)}
                  className="px-4 py-2 text-sm bg-muted hover:bg-border rounded-full transition-colors text-foreground"
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
