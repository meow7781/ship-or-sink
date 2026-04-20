"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { indianMemes, usePredictionStore, type PredictionMode } from "@/lib/store"
import { assetMemes } from "@/lib/memeAssets"
import { soundManager } from "@/lib/sounds"
import { Sparkles, Brain, Zap, Star, User } from "lucide-react"
import roastMeme from "@/assets/Screenshot 2026-04-18 141502.png"
import deluluMeme from "@/assets/Screenshot 2026-04-18 141705.png"
import predictMeme from "@/assets/Screenshot 2026-04-18 141543.png"
import mainCharacterMeme from "@/assets/Screenshot 2026-04-18 141609.png"

export function LandingHero() {
  const { setStep, setMode, soundEnabled, toggleSound, scrapbook } = usePredictionStore()
  const indianMemeLabels = [
    "BETA MODE",
    "LIFE KHARAB",
    "UNIVERSE CHECK",
    "PRODUCTIVITY JUGAAD",
    "COMPARISON CLUB",
    "THIS IS FINE"
  ]
  const funnyMemes = [...indianMemes.slice(0, 3), ...assetMemes.slice(0, 3)]
  const sadMemes = [indianMemes[1], indianMemes[2], assetMemes[10], assetMemes[11]].filter(Boolean)
  const sampleCards = [
    {
      mode: "ROAST MODE",
      color: "#e85d4c",
      question: "Should I quit my job?",
      meme: roastMeme.src,
      caption: "When the resignation fantasy is stronger than the savings account.",
    },
    {
      mode: "DELULU MODE",
      color: "#9b59b6",
      question: "He's planning a surprise, right?",
      meme: deluluMeme.src,
      caption: "When the bare minimum starts looking like a romantic subplot.",
    },
    {
      mode: "PREDICTION MODE",
      color: "#f39c12",
      question: "Will I survive Monday?",
      meme: predictMeme.src,
      caption: "Me negotiating with the universe for one normal weekday.",
    },
  ]
  const bottomMeme = {
    mode: "DELULU CHECK",
    color: "#9b59b6",
    question: "Am I the main character?",
    meme: mainCharacterMeme.src,
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

  const handleModeStart = (nextMode: PredictionMode) => {
    soundManager.play("click")
    setMode(nextMode)
    setStep("input")
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center px-6 pb-16 pt-36 md:pt-40">
        {/* Title with marker effect */}
        <motion.div
          className="mt-6 text-center mb-8 md:mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif italic text-white mb-4 drop-shadow-[0_6px_30px_rgba(0,0,0,0.55)]">
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
          
          <p className="text-white/78 text-lg drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
            Because reality is just a lack of imagination.
          </p>
        </motion.div>
        
        {/* Feature Icons */}
        <motion.div 
          className="flex items-center gap-8 mb-10"
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
          className="group relative px-12 py-4 rounded-[2rem] text-white font-bold text-lg overflow-hidden shadow-[0_20px_45px_rgba(232,93,76,0.28)] ring-1 ring-white/20"
          style={{ backgroundColor: "#e85d4c" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => soundManager.play("hover")}
          data-cursor-hover
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            START YOUR DELUSION
          </span>
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_58%)] opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.25 }}
          />
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
          className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {sampleCards.map((card, i) => (
            <motion.div
              key={card.mode}
              className="prediction-card rounded-[2rem] border border-border/70 p-4 bg-card shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, delay: 0.1 * i }}
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
              <div className="mt-4 h-40 rounded-xl overflow-hidden relative border border-black/5 shadow-sm bg-muted">
                <img 
                  src={card.meme} 
                  alt="Meme preview" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-x-2 bottom-2 rounded-lg bg-black/72 px-3 py-2 text-white text-xs backdrop-blur-sm">
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
          className="mt-8 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-72 bg-muted">
              <img
                src={bottomMeme.meme}
                alt="Main character reaction meme"
                className="absolute inset-0 h-full w-full object-cover object-center"
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

        <motion.section
          className="mt-12 w-full max-w-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="mb-6 flex flex-col gap-3 text-center">
            <span className="mx-auto w-fit rounded-full bg-secondary/25 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-secondary-foreground">
              DESI MEME ARCHIVE
            </span>
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
              Indian meme mode, fully unlocked
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Extra section for full desi chaos: family drama, productivity lies, Monday suffering, and the exact energy of every overconfident life decision.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {indianMemes.map((meme, index) => (
              <motion.article
                key={`${meme.url}-${index}`}
                className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 1.15 + index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative h-56 bg-muted">
                  <img
                    src={meme.url}
                    alt={meme.caption}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white backdrop-blur-sm">
                    {indianMemeLabels[index] || "INDIAN MODE"}
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-base font-medium leading-7 text-foreground">
                    {meme.caption}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>DESI RELATABILITY</span>
                    <span className="font-bold text-primary">100%</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {scrapbook.length > 0 && (
          <motion.section
            className="mt-14 w-full max-w-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15 }}
          >
            <SectionHeader
              badge="SAVED VIBES"
              title="Your saved delulu collection"
              description="Saved locally right now, and ready for Firestore hookup once login/auth is added."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {scrapbook.slice(-3).reverse().map((entry) => (
                <article
                  key={entry.id}
                  className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-md"
                >
                  <div className="relative h-56 bg-muted">
                    <img src={entry.memeUrl} alt={entry.question} className="h-full w-full object-cover object-center" />
                    <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white backdrop-blur-sm">
                      SAVED
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{entry.mode}</p>
                    <p className="text-lg font-medium text-foreground">&quot;{entry.question}&quot;</p>
                    <p className="text-sm leading-6 text-muted-foreground">{entry.prediction}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        <MemeMoodSection
          badge="FUNNY MEMES"
          title="Funny memes people love to replay"
          description="Loud energy, overconfidence, and full waah-kya-scene reactions."
          items={funnyMemes}
          accent="FUNNY MODE"
        />

        <MemeMoodSection
          badge="SAD MEMES"
          title="Sad meme hours, but still dramatic"
          description="For the heartbreak, low-battery, life-kharab side of the scrapbook."
          items={sadMemes}
          accent="SAD HOURS"
        />
      </main>
      
      {/* Bottom Navigation */}
      <footer className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <div className="pointer-events-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-border/70 bg-card/90 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl md:flex-nowrap md:justify-between md:gap-4 md:px-6">
          <motion.div
            className="flex items-center gap-3 pr-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ color: "#e85d4c" }}>
              DELULUMETER
            </span>
          </motion.div>

          <motion.button
            className="px-6 py-2 rounded-[999px] text-white font-semibold text-sm shadow-sm"
            style={{ backgroundColor: "#e85d4c" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeStart("delulu")}
            data-cursor-hover
          >
            DELULU
          </motion.button>
          <button
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-[999px] transition-colors"
            onClick={() => handleModeStart("roast")}
            data-cursor-hover
          >
            ROAST
          </button>
          <button
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-[999px] transition-colors"
            onClick={() => handleModeStart("predict")}
            data-cursor-hover
          >
            PREDICT
          </button>
          <div className="w-full md:mx-2 md:max-w-sm md:flex-1">
            <input 
              type="text" 
              placeholder="Ask your life question..."
              className="w-full px-4 py-2 text-sm bg-muted rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <motion.button
            className="px-6 py-2 rounded-[999px] text-white font-semibold text-sm flex items-center gap-2 shadow-sm"
            style={{ backgroundColor: "#e85d4c" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            data-cursor-hover
          >
            <Sparkles className="w-4 h-4" />
            ADD TO SCRAPBOOK
          </motion.button>

          <div className="flex items-center gap-3">
            <button 
              className="p-2 hover:bg-muted rounded-full transition-colors"
              onClick={() => {
                toggleSound()
                soundManager.setEnabled(!soundEnabled)
                soundManager.play("click")
              }}
            >
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
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

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 text-center">
      <span className="mx-auto w-fit rounded-full bg-secondary/25 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-secondary-foreground">
        {badge}
      </span>
      <h2 className="text-3xl font-semibold text-foreground md:text-4xl">{title}</h2>
      <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
    </div>
  )
}

function MemeMoodSection({
  badge,
  title,
  description,
  items,
  accent,
}: {
  badge: string
  title: string
  description: string
  items: { url: string; caption: string }[]
  accent: string
}) {
  return (
    <motion.section
      className="mt-14 w-full max-w-6xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionHeader badge={badge} title={title} description={description} />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={`${badge}-${item.url}-${index}`}
            className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-md"
          >
            <div className="relative h-56 bg-muted">
              <img src={item.url} alt={item.caption} className="h-full w-full object-cover object-center" />
              <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-white backdrop-blur-sm">
                {accent}
              </div>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-base font-medium leading-7 text-foreground">{item.caption}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>MEME ENERGY</span>
                <span className="font-bold text-primary">VIRAL</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
