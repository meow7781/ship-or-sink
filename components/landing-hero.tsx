"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { usePredictionStore } from "@/lib/store"
import { soundManager } from "@/lib/sounds"
import { Sparkles, Brain, Zap, Star, Settings, User } from "lucide-react"

export function LandingHero() {
  const { setStep, soundEnabled, toggleSound } = usePredictionStore()
  const sampleCards = [
    {
      mode: "ROAST MODE",
      color: "#e85d4c",
      question: "Should I quit my job?",
      meme: "https://i.imgflip.com/4/1ihzfe.jpg",
      caption: "When the resignation fantasy is stronger than the savings account.",
    },
    {
      mode: "DELULU MODE",
      color: "#9b59b6",
      question: "He's planning a surprise, right?",
      meme: "https://i.imgflip.com/4/4t0me5.jpg",
      caption: "When the bare minimum starts looking like a romantic subplot.",
    },
    {
      mode: "PREDICTION MODE",
      color: "#f39c12",
      question: "Will I survive Monday?",
      meme: "https://i.imgflip.com/4/30b1gx.jpg",
      caption: "Me negotiating with the universe for one normal weekday.",
    },
  ]
  const bottomMeme = {
    mode: "DELULU CHECK",
    color: "#9b59b6",
    question: "Am I the main character?",
    meme: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
    caption: "When one tiny sign becomes a full cinematic universe in your head.",
  }
  
  useEffect(() => {
    soundManager.init()
    soundManager.setEnabled(soundEnabled)
  }, [soundEnabled])
  
  const handleStart = () => {
    soundManager.play("click")
    setStep("input")
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-xs text-green-700 bg-green-200 px-2 py-0.5 rounded-full font-medium">Connected</span>
            <span className="font-bold text-xl tracking-tight" style={{ color: "#e85d4c" }}>
              DELULUMETER
            </span>
          </motion.div>
          
          <div className="flex items-center gap-2 ml-8">
            <NavTab label="JOURNAL" connected />
            <NavTab label="ROASTS" connected />
            <NavTab label="PREDICTIONS" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-muted rounded-full transition-colors"
            onClick={() => {
              toggleSound()
              soundManager.setEnabled(!soundEnabled)
              soundManager.play("click")
            }}
            data-cursor-hover
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors" data-cursor-hover>
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </nav>
      
      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Title with marker effect */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative inline-block mb-2">
            <span className="text-xs text-muted-foreground bg-yellow-300 px-2 py-0.5 rounded">Select</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif italic text-foreground mb-4">
            My delulu scrapbook
          </h1>
          
          {/* Animated dashed underline */}
          <div className="relative w-full max-w-xl mx-auto h-8 mb-4">
            <svg className="w-full h-full" viewBox="0 0 400 20">
              <motion.path
                d="M0,10 Q100,0 200,10 Q300,20 400,10"
                fill="none"
                stroke="#ffe066"
                strokeWidth="3"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </div>
          
          <p className="text-muted-foreground text-lg">
            Because reality is just a lack of imagination.
          </p>
        </motion.div>
        
        {/* Feature Icons */}
        <motion.div 
          className="flex items-center gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: Brain, label: "AI Brain", color: "#e85d4c" },
            { icon: Sparkles, label: "Magic", color: "#9b59b6" },
            { icon: Zap, label: "Instant", color: "#f1c40f" },
            { icon: Star, label: "Accurate*", color: "#e91e8c" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              onHoverStart={() => soundManager.play("hover")}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon className="w-7 h-7" style={{ color: item.color }} />
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Button */}
        <motion.button
          onClick={handleStart}
          className="group relative px-12 py-4 rounded-full text-white font-bold text-lg overflow-hidden"
          style={{ backgroundColor: "#e85d4c" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => soundManager.play("hover")}
          data-cursor-hover
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            START YOUR DELUSION
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        </motion.button>
        
        {/* Disclaimer */}
        <motion.p
          className="mt-6 text-xs text-muted-foreground max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          *Accuracy measured in vibes only. Not responsible for existential crises, reality checks, or sudden clarity.
        </motion.p>
        
        {/* Sample Cards Preview */}
        <motion.div
          className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {sampleCards.map((card, i) => (
            <motion.div
              key={card.mode}
              className="prediction-card p-4 bg-card"
              initial={{ rotate: i === 1 ? 0 : i === 0 ? -3 : 3 }}
              whileHover={{ y: -10, rotate: 0, scale: 1.02 }}
              transition={{ type: "spring" }}
              onHoverStart={() => soundManager.play("hover")}
              data-cursor-hover
            >
              <span 
                className="mode-badge text-white text-xs px-2 py-1 rounded"
                style={{ backgroundColor: card.color }}
              >
                {card.mode}
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">
                &quot;{card.question}&quot;
              </p>
              <div className="mt-4 h-40 bg-muted rounded-lg overflow-hidden relative">
                <img 
                  src={card.meme} 
                  alt="Meme preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded">
                  &quot;{card.caption}&quot;
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>HEARTBREAK ODDS</span>
                <span className="font-bold" style={{ color: card.color }}>99.9%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-72 bg-muted">
              <img
                src={bottomMeme.meme}
                alt="Main character reaction meme"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
              <span
                className="w-fit rounded px-3 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: bottomMeme.color }}
              >
                {bottomMeme.mode}
              </span>
              <p className="text-xl font-semibold text-foreground">
                &quot;{bottomMeme.question}&quot;
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {bottomMeme.caption}
              </p>
              <ButtonLikeStart onClick={handleStart} color={bottomMeme.color} />
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Bottom Navigation */}
      <footer className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-center gap-4">
          <motion.button
            className="px-6 py-2 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: "#e85d4c" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            data-cursor-hover
          >
            DELULU
          </motion.button>
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground" data-cursor-hover>
            ROAST
          </button>
          <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground" data-cursor-hover>
            PREDICT
          </button>
          <div className="flex-1 max-w-xs mx-4">
            <input 
              type="text" 
              placeholder="Ask your life question..."
              className="w-full px-4 py-2 text-sm bg-muted rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <motion.button
            className="px-6 py-2 rounded-full text-white font-semibold text-sm flex items-center gap-2"
            style={{ backgroundColor: "#e85d4c" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            data-cursor-hover
          >
            <Sparkles className="w-4 h-4" />
            ADD TO SCRAPBOOK
          </motion.button>
        </div>
      </footer>
    </div>
  )
}

function ButtonLikeStart({ onClick, color }: { onClick: () => void; color: string }) {
  return (
    <motion.button
      className="w-fit rounded px-5 py-3 text-sm font-semibold text-white"
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-cursor-hover
    >
      Try this vibe
    </motion.button>
  )
}

function NavTab({ label, connected }: { label: string; connected?: boolean }) {
  return (
    <div className="relative">
      {connected && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-green-700 bg-green-200 px-1.5 py-0.5 rounded-full font-medium">
          Connected
        </span>
      )}
      <button 
        className="px-3 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md"
        data-cursor-hover
      >
        {label}
      </button>
    </div>
  )
}
