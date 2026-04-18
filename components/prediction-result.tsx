"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Share2, RotateCcw, Twitter, Sparkles, Star, Play, ThumbsUp, ThumbsDown, Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePredictionStore, predictionsByMode, fetchMeme } from "@/lib/store"
import { soundManager } from "@/lib/sounds"
import { useEffect, useRef, useState } from "react"

export function PredictionResult() {
  const { 
    question, 
    prediction, 
    memeUrl, 
    memeCaption: savedMemeCaption,
    mode, 
    reset, 
    deepThinkingMode, 
    setStep,
    setMemeUrl,
    usedMemeIds,
    addUsedMemeId,
    theme,
    soundEnabled
  } = usePredictionStore()
  
  const [stat, setStat] = useState({ label: "HEARTBREAK ODDS", value: "99.9%" })
  const [roastComment, setRoastComment] = useState("")
  const [memeCaption, setMemeCaption] = useState("")
  const [isLoadingMeme, setIsLoadingMeme] = useState(true)
  const [showMeme, setShowMeme] = useState(false)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const hasLoadedMemeRef = useRef(false)
  
  useEffect(() => {
    const modeData = predictionsByMode[mode]
    setStat(modeData.stats[Math.floor(Math.random() * modeData.stats.length)])
    setRoastComment(modeData.roasts[Math.floor(Math.random() * modeData.roasts.length)])

    if (soundEnabled) {
      soundManager.play("success")
    }
  }, [mode, soundEnabled])

  useEffect(() => {
    if (hasLoadedMemeRef.current) return
    hasLoadedMemeRef.current = true

    let isActive = true
    let revealTimer: ReturnType<typeof setTimeout>

    async function loadMemeOnce() {
      setShowMeme(false)

      if (memeUrl) {
        setMemeCaption(savedMemeCaption || "This meme was chosen for your exact level of delulu.")
        setIsLoadingMeme(false)
      } else {
        setIsLoadingMeme(true)
        const meme = await fetchMeme(mode, question, usedMemeIds)
        if (!isActive) return

        if (meme.id) {
          addUsedMemeId(meme.id)
        }
        setMemeUrl(meme.url)
        setMemeCaption(meme.caption || "This meme was chosen for your exact level of delulu.")
        setIsLoadingMeme(false)
      }

      revealTimer = setTimeout(() => {
        if (!isActive) return
        setShowMeme(true)
        if (soundEnabled) {
          soundManager.playMemeReveal()
        }
      }, 300)
    }

    loadMemeOnce()

    return () => {
      isActive = false
      clearTimeout(revealTimer)
    }
  }, [addUsedMemeId, memeUrl, mode, question, savedMemeCaption, setMemeUrl, soundEnabled, usedMemeIds])
  
  const handleShare = async () => {
    soundManager.play("click")
    const text = `I asked the DELULUMETER: "${question}"\n\nThe verdict: "${prediction}"\n\nFind your delusion at:`
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Delulu Prediction",
          text: text,
          url: window.location.href,
        })
      } catch {
        // User cancelled
      }
    } else {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
      window.open(tweetUrl, "_blank")
    }
  }
  
  const handlePlayVoice = async () => {
    setIsPlayingVoice(true)
    soundManager.play("dramatic")
    
    // Simulate TTS with funny sound
    setTimeout(() => {
      soundManager.fetchAndPlay("funny")
    }, 500)
    
    setTimeout(() => {
      setIsPlayingVoice(false)
    }, 2000)
  }
  
  const handleTryAgain = () => {
    soundManager.play("click")
    reset()
  }
  
  const handleRevealFate = () => {
    soundManager.play("magic")
    setStep("input")
  }
  
  const modeColors: Record<string, string> = {
    delulu: "#9b59b6",
    roast: "#e85d4c",
    predict: "#f39c12",
  }
  
  const modeLabels: Record<string, string> = {
    delulu: "DELULU MODE",
    roast: "ROAST MODE",
    predict: "PREDICTION MODE",
  }
  
  const accentColor = modeColors[mode] || "#e85d4c"
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 ${theme === "chaos" ? "chaos-shake" : ""}`}>
      {/* Celebration particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{ 
              x: "50vw", 
              y: "50vh",
              scale: 0,
              opacity: 1,
            }}
            animate={{ 
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ 
              duration: 2.5,
              delay: i * 0.08,
              ease: "easeOut",
            }}
          >
            {["✨", "⭐", "💫", "🔮", "🌟"][i % 5]}
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto"
      >
        {/* Main Result Card */}
        <motion.div
          className={`prediction-card bg-card p-6 mb-6 ${theme === "chaos" ? "border-4 border-dashed" : ""}`}
          style={theme === "chaos" ? { borderColor: accentColor } : {}}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          {/* Mode Badge */}
          <span 
            className={`inline-block px-3 py-1 rounded text-xs font-bold text-white mb-4 ${theme === "chaos" ? "animate-wiggle" : ""}`}
            style={{ backgroundColor: accentColor }}
          >
            {modeLabels[mode]}
          </span>
          
          {/* Question */}
          <p className={`text-lg font-medium text-foreground mb-4 ${theme === "chaos" ? "chaos-text" : ""}`}>
            &quot;{question}&quot;
          </p>
          
          {/* Meme Image with API loading */}
          <div className="relative rounded-xl overflow-hidden mb-4 bg-muted min-h-64">
            <AnimatePresence mode="wait">
              {isLoadingMeme ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Fetching the perfect meme...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="meme"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: showMeme ? 1 : 0, scale: showMeme ? 1 : 0.8 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                >
                  {memeUrl && (
                    <img
                      src={memeUrl}
                      alt="Reaction meme"
                      className="w-full h-64 object-cover"
                      crossOrigin="anonymous"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Meme Caption Overlay */}
            {showMeme && !isLoadingMeme && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
              >
                <p className="text-white text-sm font-medium" style={{ color: accentColor }}>
                  &quot;{memeCaption || prediction?.substring(0, 50) + "..."}&quot;
                </p>
              </motion.div>
            )}
            
            {/* MAX DELULU Badge */}
            {mode === "delulu" && showMeme && (
              <motion.div
                className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold text-white"
                style={{ backgroundColor: accentColor }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                MAX DELULU
              </motion.div>
            )}
            
            {/* Sound indicator */}
            {soundEnabled && showMeme && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 p-2 rounded-full bg-black/50"
              >
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              </motion.div>
            )}
          </div>
          
          {/* Prediction Text */}
          <p className={`text-base text-foreground mb-4 leading-relaxed ${theme === "chaos" ? "chaos-rainbow" : ""}`}>
            {prediction}
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between py-3 border-t border-border">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <motion.span 
              className={`font-bold ${theme === "chaos" ? "animate-wiggle" : ""}`}
              style={{ color: accentColor }}
              animate={theme === "chaos" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {stat.value}
            </motion.span>
          </div>
          
          {/* Roast Comment */}
          <div className="pt-3 border-t border-border">
            <p className={`text-sm text-muted-foreground italic ${theme === "chaos" ? "text-destructive" : ""}`}>
              {roastComment}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <motion.button
              onClick={handlePlayVoice}
              disabled={isPlayingVoice}
              className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm ${isPlayingVoice ? "opacity-50" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor-hover
            >
              {isPlayingVoice ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isPlayingVoice ? "Playing..." : "Play Voice"}
            </motion.button>
            
            <motion.button
              onClick={handleShare}
              className="p-2 rounded-full bg-muted"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-cursor-hover
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            
            <div className="flex-1" />
            
            <motion.button
              onClick={() => soundManager.play("pop")}
              className="p-2 rounded-full hover:bg-muted"
              whileHover={{ scale: 1.1 }}
              data-cursor-hover
            >
              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <motion.button
              onClick={() => soundManager.play("click")}
              className="p-2 rounded-full hover:bg-muted"
              whileHover={{ scale: 1.1 }}
              data-cursor-hover
            >
              <ThumbsDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
        </motion.div>
        
        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            onClick={handleRevealFate}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold ${theme === "chaos" ? "animate-scale-pulse" : ""}`}
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-cursor-hover
          >
            <Sparkles className="w-5 h-5" />
            Reveal Fate
          </motion.button>
          
          <div className="flex gap-3">
            <Button
              onClick={handleTryAgain}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 rounded-full"
              data-cursor-hover
            >
              <RotateCcw className="w-4 h-4" />
              Ask Again
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 rounded-full"
              data-cursor-hover
            >
              <Twitter className="w-4 h-4" />
              Share
            </Button>
          </div>
          
          <motion.button
            onClick={() => soundManager.play("magic")}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold border-2 ${theme === "chaos" ? "border-dashed animate-wiggle" : ""}`}
            style={{ borderColor: accentColor, color: accentColor }}
            whileHover={{ scale: 1.02, backgroundColor: `${accentColor}10` }}
            whileTap={{ scale: 0.98 }}
            data-cursor-hover
          >
            <Star className="w-5 h-5" />
            ADD TO SCRAPBOOK
          </motion.button>
        </motion.div>
        
        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-8 text-xs text-center text-muted-foreground ${theme === "chaos" ? "text-destructive" : ""}`}
        >
          * Memes fetched live from GIPHY. Sounds from Freesound/Mixkit. 
          {deepThinkingMode && " Extra deep thinking was applied (more API calls)."}
        </motion.p>
      </motion.div>
    </div>
  )
}
