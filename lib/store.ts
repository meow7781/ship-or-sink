import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { selectLocalAssetMeme } from './memeAssets'

export type AppStep = 'landing' | 'input' | 'processing' | 'result' | 'scrapbook'
export type PredictionMode = 'delulu' | 'roast' | 'predict'
export type ThemeMode = 'light' | 'pink' | 'chaos'
export type ThemeSelection = ThemeMode | 'random'

interface PredictionEntry {
  id: string
  question: string
  prediction: string
  memeUrl: string
  mode: PredictionMode
  stat: { label: string; value: string }
  roastComment: string
  timestamp: number
}

interface PredictionState {
  step: AppStep
  mode: PredictionMode
  theme: ThemeMode
  question: string
  prediction: string | null
  memeUrl: string | null
  memeCaption: string | null
  deepThinkingMode: boolean
  soundEnabled: boolean
  confidenceLevel: number
  scrapbook: PredictionEntry[]
  usedMemeIds: string[]
  isLoadingMeme: boolean
  isLoadingSound: boolean
  
  setStep: (step: AppStep) => void
  setMode: (mode: PredictionMode) => void
  setTheme: (theme: ThemeSelection) => void
  setQuestion: (question: string) => void
  setPrediction: (prediction: string, memeUrl: string, memeCaption?: string | null) => void
  setMemeUrl: (url: string) => void
  addUsedMemeId: (id: string) => void
  clearUsedMemeIds: () => void
  toggleDeepThinking: () => void
  toggleSound: () => void
  setConfidenceLevel: (level: number) => void
  setIsLoadingMeme: (loading: boolean) => void
  setIsLoadingSound: (loading: boolean) => void
  addToScrapbook: (entry: Omit<PredictionEntry, 'id' | 'timestamp'>) => void
  reset: () => void
}

export const usePredictionStore = create<PredictionState>()(
  persist(
    (set) => ({
      step: 'landing',
      mode: 'delulu',
      theme: 'light',
      question: '',
      prediction: null,
      memeUrl: null,
      memeCaption: null,
      deepThinkingMode: false,
      soundEnabled: true,
      confidenceLevel: 0,
      scrapbook: [],
      usedMemeIds: [],
      isLoadingMeme: false,
      isLoadingSound: false,
      
      setStep: (step) => set({ step }),
      setMode: (mode) => set({ mode }),
      setTheme: (theme) => {
        if (theme === 'random') {
          // When random is selected, immediately pick a random theme
          const themes: ThemeMode[] = ['light', 'pink', 'chaos']
          const randomTheme = themes[Math.floor(Math.random() * themes.length)]
          
          // Update document class for CSS theming
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'pink-mode', 'chaos-mode', 'random-mode')
            if (randomTheme === 'pink') {
              document.documentElement.classList.add('pink-mode')
            } else if (randomTheme === 'chaos') {
              document.documentElement.classList.add('chaos-mode')
            }
          }
          set({ theme: randomTheme })
        } else {
          // Update document class for CSS theming
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'pink-mode', 'chaos-mode', 'random-mode')
            if (theme === 'pink') {
              document.documentElement.classList.add('pink-mode')
            } else if (theme === 'chaos') {
              document.documentElement.classList.add('chaos-mode')
            }
          }
          set({ theme })
        }
      },

      setQuestion: (question) => set({ question }),
      setPrediction: (prediction, memeUrl, memeCaption = null) => set({ prediction, memeUrl, memeCaption }),
      setMemeUrl: (url) => set({ memeUrl: url }),
      addUsedMemeId: (id) => set((state) => ({ usedMemeIds: [...state.usedMemeIds, id] })),
      clearUsedMemeIds: () => set({ usedMemeIds: [] }),
      toggleDeepThinking: () => set((state) => ({ deepThinkingMode: !state.deepThinkingMode })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setConfidenceLevel: (level) => set({ confidenceLevel: level }),
      setIsLoadingMeme: (loading) => set({ isLoadingMeme: loading }),
      setIsLoadingSound: (loading) => set({ isLoadingSound: loading }),
      addToScrapbook: (entry) => set((state) => ({
        scrapbook: [...state.scrapbook, { ...entry, id: crypto.randomUUID(), timestamp: Date.now() }]
      })),
      reset: () => set({ step: 'landing', question: '', prediction: null, memeUrl: null, memeCaption: null, confidenceLevel: 0, usedMemeIds: [] }),
    }),
    {
      name: 'delulu-meter-storage',
      partialize: (state) => ({ 
        deepThinkingMode: state.deepThinkingMode, 
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        scrapbook: state.scrapbook,
        usedMemeIds: state.usedMemeIds,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'pink-mode', 'chaos-mode')
          if (state.theme === 'pink') {
            document.documentElement.classList.add('pink-mode')
          } else if (state.theme === 'chaos') {
            document.documentElement.classList.add('chaos-mode')
          }
        }
      },
    }
  )
)

// Indian meme images - fallback only
export const indianMemes = [
  {
    url: "https://i.imgflip.com/7wls4h.jpg",
    caption: "Aree baccha hai tu mera... dimaag abhi ghutno mein hai.",
  },
  {
    url: "https://i.imgflip.com/4/1ihzfe.jpg",
    caption: "Mera toh itna life kharab ho gaya...",
  },
  {
    url: "https://i.imgflip.com/4/4t0me5.jpg",
    caption: "The Universe is watching your weak decision-making skills.",
  },
  {
    url: "https://i.imgflip.com/2/1jgrgn.jpg",
    caption: "Me pretending to be productive",
  },
  {
    url: "https://i.imgflip.com/4/30b1gx.jpg",
    caption: "Corporate wants you to find the difference",
  },
  {
    url: "https://i.imgflip.com/4/9ehk.jpg",
    caption: "This is fine",
  },
]

// Satirical prediction templates by mode
export const predictionsByMode = {
  delulu: {
    predictions: [
      "He hasn't texted back in 3 days because he's planning the surprise wedding, right?",
      "Your crush definitely noticed you... from across 3 Instagram stories ago.",
      "That interview went AMAZING. The silence was just them processing your brilliance.",
      "Mercury retrograde is why your ex texted. Not their loneliness. Mercury.",
      "Your manifestation board is working! Just... on a cosmic delay of 47 years.",
      "They're not ghosting you, their phone just fell into a volcano. Twice.",
    ],
    stats: [
      { label: "HEARTBREAK ODDS", value: "99.9%" },
      { label: "REALITY CHECK", value: "Denied" },
      { label: "COPIUM LEVELS", value: "Maximum" },
      { label: "DENIAL INDEX", value: "Over 9000" },
    ],
    roasts: [
      "@cupid_is_dead: Girl, he's just not that into you... but your delusion is cute.",
      "@reality_check: Babe, that ship didn't sail, it sank in 2019.",
      "@your_therapist: We've talked about this...",
      "@the_universe: I literally sent you 47 red flags.",
    ]
  },
  roast: {
    predictions: [
      "Should I quit my job to become a full-time professional napper?",
      "Your productivity level matches a sloth on melatonin.",
      "That diet starts Monday. Which Monday? We don't know either.",
      "Your savings account called. It's filing for emotional damages.",
      "You'll find motivation! In 2089. Maybe.",
      "Your screen time report filed a restraining order.",
    ],
    stats: [
      { label: "REGRET INDEX", value: "Maximum" },
      { label: "ADULTING SCORE", value: "-47" },
      { label: "LIFE TOGETHER", value: "Scattered" },
      { label: "CHAOS LEVEL", value: "Expert" },
    ],
    roasts: [
      "@the_realist: even the blanket doesn't want you full time bro.",
      "@hr_manager: We saw that yawn in 4K.",
      "@your_alarm: I've given up on you.",
      "@gym_membership: Remember me? 3 years later...",
    ]
  },
  predict: {
    predictions: [
      "Will I survive this Monday morning meeting without coffee?",
      "You'll achieve enlightenment! After scrolling TikTok for 6 more hours.",
      "Success is coming! Via the longest route possible with traffic.",
      "The stars align for you! Into the shape of a question mark.",
      "Financial freedom awaits! In your Monopoly game tonight.",
      "Love is around the corner! It's been there for 7 years, hiding.",
    ],
    stats: [
      { label: "SURVIVAL RATE", value: "Critical" },
      { label: "CONFIDENCE", value: "Fake" },
      { label: "LUCK METER", value: "Error 404" },
      { label: "FATE STATUS", value: "Pending" },
    ],
    roasts: [
      "@hr_manager: We saw that yawn in 4K.",
      "@monday: I'm not the problem, your sleep schedule is.",
      "@coffee_machine: I can't save you anymore.",
      "@productivity: We've never actually met.",
    ]
  }
}

// Processing phrases
export const processingPhrases = [
  "Consulting the ancient algorithms...",
  "Downloading your karma from the cloud...",
  "Running Math.random() with extra steps...",
  "Asking ChatGPT's cousin who dropped out...",
  "Calculating your destiny points...",
  "Scanning your vibe frequencies...",
  "Loading crystal ball drivers...",
  "Defragmenting the astral plane...",
  "Compiling your life choices...",
  "Running if(lucky) return success...",
  "Querying the universe database...",
  "Parsing your aura JSON...",
  "Initializing fate.exe...",
]

export const deepThinkingPhrases = [
  "ENGAGING MAXIMUM BRAIN POWER...",
  "Activating neural pathways we definitely have...",
  "Summoning the spirit of confused scientists...",
  "Overclocking the imagination cores...",
  "Running advanced procrastination algorithms...",
  "Loading extra neurons (found in couch cushions)...",
]

// Fetch meme from API
export async function fetchMeme(mode: PredictionMode, query: string, excludeIds: string[] = []): Promise<{ url: string; id?: string; caption?: string }> {
  try {
    const params = new URLSearchParams({
      mode,
      query,
    })

    if (excludeIds.length > 0) {
      params.set("exclude", excludeIds.join(","))
    }

    const response = await fetch(`/api/memes?${params.toString()}`)
    const data = await response.json()
    if (data.success && data.meme?.url) {
      return {
        url: data.meme.url,
        id: data.meme.id,
        caption: data.meme.caption,
      }
    }
  } catch (error) {
    console.error("Failed to fetch meme:", error)
  }

  const fallback = selectLocalAssetMeme(query, excludeIds)
  return {
    url: fallback.url,
    id: fallback.id,
    caption: fallback.caption,
  }
}

// Fetch sound from API
export async function fetchSound(category: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/sounds?category=${category}`)
    const data = await response.json()
    if (data.success && data.sound?.url) {
      return data.sound.url
    }
  } catch (error) {
    console.error("Failed to fetch sound:", error)
  }
  return null
}

export function getRandomPrediction(question: string, mode: PredictionMode): {
  prediction: string
  stat: { label: string; value: string }
  roastComment: string
} {
  const modeData = predictionsByMode[mode]
  const prediction = modeData.predictions[Math.floor(Math.random() * modeData.predictions.length)]
  const stat = modeData.stats[Math.floor(Math.random() * modeData.stats.length)]
  const roastComment = modeData.roasts[Math.floor(Math.random() * modeData.roasts.length)]
  
  return { prediction, stat, roastComment }
}
