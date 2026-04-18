"use client"

import { Howl, Howler } from "howler"

// Default sound URLs - using free sounds from CDNs
const defaultSoundUrls: Record<string, string> = {
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  hover: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  success: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
  whoosh: "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3",
  magic: "https://assets.mixkit.co/active_storage/sfx/2015/2015-preview.mp3",
  pop: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
  reveal: "https://assets.mixkit.co/active_storage/sfx/1019/1019-preview.mp3",
  thinking: "https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3",
  dramatic: "https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3",
  funny: "https://assets.mixkit.co/active_storage/sfx/2016/2016-preview.mp3",
  likee: "https://assets.mixkit.co/active_storage/sfx/4747/4747-preview.mp3",
}

type SoundName = keyof typeof defaultSoundUrls

class SoundManager {
  private sounds: Map<string, Howl> = new Map()
  private enabled: boolean = true
  private initialized: boolean = false
  private fetchedSounds: Map<string, string> = new Map()
  
  init() {
    if (this.initialized || typeof window === "undefined") return
    
    // Initialize default sounds
    Object.entries(defaultSoundUrls).forEach(([name, url]) => {
      this.sounds.set(name, new Howl({
        src: [url],
        volume: name === "hover" ? 0.15 : 0.35,
        preload: true,
      }))
    })
    
    this.initialized = true
  }
  
  play(name: SoundName | string) {
    if (!this.enabled) return
    
    // Initialize if not done
    if (!this.initialized) {
      this.init()
    }
    
    const sound = this.sounds.get(name)
    if (sound) {
      sound.stop()
      sound.play()
    }
  }
  
  // Fetch sound from API and cache it
  async fetchAndPlay(category: string): Promise<void> {
    if (!this.enabled) return
    
    // Check cache first
    if (this.fetchedSounds.has(category)) {
      const cachedUrl = this.fetchedSounds.get(category)!
      this.playUrl(cachedUrl)
      return
    }
    
    try {
      const response = await fetch(`/api/sounds?category=${category}`)
      const data = await response.json()
      
      if (data.success && data.sound?.url) {
        this.fetchedSounds.set(category, data.sound.url)
        this.playUrl(data.sound.url)
      } else {
        // Fallback to default
        this.play(category as SoundName)
      }
    } catch {
      // Fallback to default
      this.play(category as SoundName)
    }
  }
  
  // Play a URL directly
  playUrl(url: string, volume: number = 0.4) {
    if (!this.enabled) return
    
    const sound = new Howl({
      src: [url],
      volume,
      html5: true, // Better for streaming
    })
    sound.play()
  }
  
  // Play reveal sound with dramatic effect
  playReveal() {
    if (!this.enabled) return
    
    // Play multiple sounds for dramatic effect
    this.play("reveal")
    setTimeout(() => this.play("magic"), 200)
  }
  
  // Play meme reveal sound
  async playMemeReveal(): Promise<void> {
    if (!this.enabled) return
    
    await this.fetchAndPlay("reveal")
    setTimeout(() => this.fetchAndPlay("funny"), 300)
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled) {
      // Stop all sounds
      this.sounds.forEach(sound => sound.stop())
      Howler.stop()
    }
  }
  
  isEnabled() {
    return this.enabled
  }
  
  // Get global volume
  getVolume() {
    return Howler.volume()
  }
  
  // Set global volume
  setVolume(vol: number) {
    Howler.volume(Math.max(0, Math.min(1, vol)))
  }
}

export const soundManager = new SoundManager()

// Initialize on import
if (typeof window !== "undefined") {
  soundManager.init()
}
