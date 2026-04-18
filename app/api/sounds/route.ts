import { NextResponse } from "next/server"

// Sound effect categories
const soundCategories = {
  reveal: ["magic sparkle", "reveal sound", "ta da", "fanfare short", "achievement"],
  click: ["click button", "ui click", "pop sound", "tap"],
  success: ["success chime", "level up", "win sound", "celebration"],
  thinking: ["processing", "computer thinking", "digital loading", "sci-fi scan"],
  dramatic: ["dramatic reveal", "suspense hit", "orchestra hit", "impact"],
  funny: ["comedy sound", "cartoon boing", "silly", "whoopee"],
  likee: ["viral drop", "instagram trend", "tiktok clap", "social media vibe"],
}

// Curated Freesound IDs for reliable playback (CC0/CC-BY licensed)
const curatedSounds = {
  reveal: [
    { id: 320655, name: "Magic Sparkle", preview: "https://freesound.org/data/previews/320/320655_5260872-lq.mp3" },
    { id: 270404, name: "Success", preview: "https://freesound.org/data/previews/270/270404_5123851-lq.mp3" },
  ],
  click: [
    { id: 219069, name: "Click", preview: "https://freesound.org/data/previews/219/219069_4082826-lq.mp3" },
    { id: 242501, name: "UI Click", preview: "https://freesound.org/data/previews/242/242501_4284968-lq.mp3" },
  ],
  success: [
    { id: 341695, name: "Fanfare", preview: "https://freesound.org/data/previews/341/341695_5858296-lq.mp3" },
    { id: 270402, name: "Achievement", preview: "https://freesound.org/data/previews/270/270402_5123851-lq.mp3" },
  ],
  thinking: [
    { id: 253172, name: "Loading", preview: "https://freesound.org/data/previews/253/253172_4597519-lq.mp3" },
  ],
  dramatic: [
    { id: 325805, name: "Impact", preview: "https://freesound.org/data/previews/325/325805_3908619-lq.mp3" },
  ],
  funny: [
    { id: 131660, name: "Boing", preview: "https://freesound.org/data/previews/131/131660_2398403-lq.mp3" },
  ],
  likee: [
    { id: 338005, name: "Sassy Pop", preview: "https://freesound.org/data/previews/338/338005_5239052-lq.mp3" },
    { id: 315785, name: "Viral Snap", preview: "https://freesound.org/data/previews/315/315785_5123851-lq.mp3" },
  ],
}

// Reliable CDN-hosted sounds as fallback
const cdnSounds = {
  reveal: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  success: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  thinking: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3",
  dramatic: "https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3",
  funny: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
  pop: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  whoosh: "https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3",
  magic: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
  likee: "https://assets.mixkit.co/active_storage/sfx/4225/4225-preview.mp3",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "reveal"
  
  // Check if we have Freesound API key
  const apiKey = process.env.FREESOUND_API_KEY
  
  if (apiKey) {
    try {
      const searchTerms = soundCategories[category as keyof typeof soundCategories] || soundCategories.reveal
      const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)]
      
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(searchTerm)}&filter=duration:[0 TO 5]&fields=id,name,previews&page_size=5&token=${apiKey}`,
        { next: { revalidate: 3600 } }
      )
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          const sound = data.results[Math.floor(Math.random() * data.results.length)]
          
          return NextResponse.json({
            success: true,
            sound: {
              url: sound.previews["preview-lq-mp3"],
              name: sound.name,
              source: "freesound",
            }
          })
        }
      }
    } catch {
      // Fall through to curated/CDN sounds
    }
  }
  
  // Try curated Freesound previews first
  const curated = curatedSounds[category as keyof typeof curatedSounds]
  if (curated && curated.length > 0) {
    const sound = curated[Math.floor(Math.random() * curated.length)]
    return NextResponse.json({
      success: true,
      sound: {
        url: sound.preview,
        name: sound.name,
        source: "freesound-curated",
      }
    })
  }
  
  // Final fallback to CDN sounds
  const cdnUrl = cdnSounds[category as keyof typeof cdnSounds] || cdnSounds.reveal
  
  return NextResponse.json({
    success: true,
    sound: {
      url: cdnUrl,
      name: category,
      source: "cdn",
    }
  })
}
