"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Brain, Sparkles, Zap, AlertTriangle } from "lucide-react"
import { 
  usePredictionStore, 
  processingPhrases, 
  deepThinkingPhrases, 
  getRandomPrediction,
  fetchMeme
} from "@/lib/store"
import { soundManager } from "@/lib/sounds"

const fakeEquations = [
  "destiny(t) = chaos + snacks",
  "E = mc^2 + bad_decisions",
  "P(success) = rand() x hope",
  "life_choices = shrug",
  "d(future)/dt = confusion x 10^9",
]

export function ProcessingAnimation() {
  const { question, mode, deepThinkingMode, setStep, setPrediction, usedMemeIds, addUsedMemeId } = usePredictionStore()
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [currentEquation, setCurrentEquation] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [localConfidence, setLocalConfidence] = useState(0)
  const [progress, setProgress] = useState(0)
  const hasCompletedRef = useRef(false)
  
  const phrases = deepThinkingMode 
    ? [...deepThinkingPhrases, ...processingPhrases] 
    : processingPhrases
  
  const totalDuration = deepThinkingMode ? 10000 : 5000
  
  useEffect(() => {
    soundManager.play("thinking")
    
    hasCompletedRef.current = false
    setLocalConfidence(0)
    setProgress(0)
    
    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    }, 1500)
    
    const equationInterval = setInterval(() => {
      setCurrentEquation((prev) => (prev + 1) % fakeEquations.length)
    }, 2000)
    
    const confidenceInterval = setInterval(() => {
      setLocalConfidence((prev) => Math.min(prev + Math.random() * 15, 99.9))
    }, 300)
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (totalDuration / 100)), 100))
    }, 100)
    
    let warningTimeout: NodeJS.Timeout
    let hideWarningTimeout: NodeJS.Timeout
    if (deepThinkingMode) {
      warningTimeout = setTimeout(() => setShowWarning(true), 4000)
      hideWarningTimeout = setTimeout(() => setShowWarning(false), 7000)
    }
    
    const completeTimeout = setTimeout(async () => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true
        soundManager.play("reveal")
        const result = getRandomPrediction(question, mode)
        // Fetch meme from GIPHY API and skip repeats
        const meme = await fetchMeme(mode, question, usedMemeIds)
        if (meme.id) {
          addUsedMemeId(meme.id)
        }
        setPrediction(result.prediction, meme.url, meme.caption)
        setStep("result")
      }
    }, totalDuration)
    
    return () => {
      clearInterval(phraseInterval)
      clearInterval(equationInterval)
      clearInterval(confidenceInterval)
      clearInterval(progressInterval)
      clearTimeout(completeTimeout)
      if (warningTimeout) clearTimeout(warningTimeout)
      if (hideWarningTimeout) clearTimeout(hideWarningTimeout)
    }
  }, [deepThinkingMode, phrases.length, question, mode, setStep, setPrediction, totalDuration])
  
  const modeColors: Record<string, string> = {
    delulu: "#9b59b6",
    roast: "#e85d4c",
    predict: "#f39c12",
  }
  
  const accentColor = modeColors[mode] || "#e85d4c"
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Floating equations background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fakeEquations.map((eq, i) => (
          <motion.div
            key={eq}
            className="absolute font-mono text-sm opacity-20"
            style={{ color: accentColor }}
            initial={{ 
              x: `${10 + (i * 20)}%`, 
              y: "110%",
            }}
            animate={{ 
              y: "-10%",
            }}
            transition={{ 
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          >
            {eq}
          </motion.div>
        ))}
      </div>
      
      {/* Main brain animation */}
      <motion.div
        className="relative mb-8"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: `${accentColor}20`,
            boxShadow: `0 0 40px ${accentColor}40, 0 0 80px ${accentColor}20`,
          }}
          animate={{ 
            boxShadow: [
              `0 0 20px ${accentColor}40, 0 0 40px ${accentColor}20`,
              `0 0 60px ${accentColor}60, 0 0 100px ${accentColor}40`,
              `0 0 20px ${accentColor}40, 0 0 40px ${accentColor}20`,
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: deepThinkingMode ? 360 : 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-20 h-20 md:w-28 md:h-28" style={{ color: accentColor }} />
          </motion.div>
        </motion.div>
        
        {/* Orbiting elements */}
        {[...Array(deepThinkingMode ? 8 : 4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ 
              duration: 2 + i * 0.5, 
              repeat: Infinity, 
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute"
              style={{ 
                top: -8, 
                left: "50%", 
                transform: "translateX(-50%)",
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            >
              {i % 3 === 0 ? (
                <Sparkles className="w-5 h-5" style={{ color: "#f1c40f" }} />
              ) : i % 3 === 1 ? (
                <Zap className="w-5 h-5" style={{ color: accentColor }} />
              ) : (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Current equation display */}
      <motion.div
        key={currentEquation}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="font-mono text-lg md:text-xl mb-6 opacity-60"
        style={{ color: accentColor }}
      >
        {fakeEquations[currentEquation]}
      </motion.div>
      
      {/* Processing phrase */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-lg md:text-xl text-center max-w-md mb-8 text-foreground"
        >
          {phrases[currentPhrase]}
        </motion.p>
      </AnimatePresence>
      
      {/* Progress bar */}
      <div className="w-64 md:w-80 h-3 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor, width: `${progress}%` }}
        />
      </div>
      
      {/* Confidence meter */}
      <motion.div
        className="text-center"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <p className="text-sm text-muted-foreground">Confidence Level</p>
        <p className="text-3xl md:text-4xl font-bold font-mono" style={{ color: accentColor }}>
          {localConfidence.toFixed(1)}%
        </p>
        <p className="text-xs text-muted-foreground">(Totally real number)</p>
      </motion.div>
      
      {/* Deep thinking warning */}
      <AnimatePresence>
        {showWarning && deepThinkingMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-24 bg-card border border-border rounded-lg p-4 flex items-center gap-3 max-w-sm shadow-lg"
          >
            <AlertTriangle className="w-6 h-6 shrink-0" style={{ color: "#f39c12" }} />
            <p className="text-sm">
              WARNING: Deep thinking may cause existential contemplation and/or snack cravings
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Question being analyzed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center max-w-md px-4"
      >
        <p className="text-xs text-muted-foreground">Analyzing your question:</p>
        <p className="text-sm text-muted-foreground italic truncate">
          &quot;{question}&quot;
        </p>
      </motion.div>
    </div>
  )
}
