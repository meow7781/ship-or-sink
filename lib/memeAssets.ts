export type AssetMeme = {
  id: string
  url: string
  caption: string
  tags: string[]
}

export const assetMemes: AssetMeme[] = [
  {
    id: "asset-1",
    url: "https://media.giphy.com/media/xT0GqfvuVpjJbG1Hu8/giphy.gif",
    caption: "When your boss says 'quick chat' and your brain already schedules an apology speech.",
    tags: ["boss", "work", "job", "office", "chat"],
  },
  {
    id: "asset-2",
    url: "https://media.giphy.com/media/l0MYryZTmQgvHI5sA/giphy.gif",
    caption: "That face when you nod through the meeting and have no idea what's happening.",
    tags: ["meeting", "confused", "work", "school", "study"],
  },
  {
    id: "asset-3",
    url: "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
    caption: "The moment your crush says 'we should hang' and your brain writes a 10-chapter plan.",
    tags: ["crush", "love", "dating", "relationship", "surprise", "text"],
  },
  {
    id: "asset-ex-1",
    url: "https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif",
    caption: "When you ask if your ex is thinking about you and the answer is probably 'about lunch.'",
    tags: ["ex", "thinking", "miss", "relationship", "breakup", "love", "dating", "ghosting"],
  },
  {
    id: "asset-ex-2",
    url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    caption: "Checking their story like that counts as spiritual communication.",
    tags: ["ex", "crush", "instagram", "story", "text", "ghosting", "relationship", "love"],
  },
  {
    id: "asset-ex-3",
    url: "https://media.giphy.com/media/3o7TKsQ8UQ4l4LhGz6/giphy.gif",
    caption: "When one dry reply becomes evidence for a grand romantic comeback.",
    tags: ["ex", "reply", "text", "relationship", "love", "dating", "delulu", "crush"],
  },
  {
    id: "asset-4",
    url: "https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif",
    caption: "Thinking about what to eat for dinner like it's a national emergency.",
    tags: ["food", "dinner", "plan", "thinking", "procrastination"],
  },
  {
    id: "asset-5",
    url: "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
    caption: "When you finally remember that assignment due tomorrow and your soul leaves your body.",
    tags: ["deadline", "school", "work", "panic", "shock"],
  },
  {
    id: "asset-6",
    url: "https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif",
    caption: "If overthinking burned calories, you'd already be shredded.",
    tags: ["overthink", "mood", "funny", "lazy", "energy"],
  },
  {
    id: "asset-7",
    url: "https://i.imgflip.com/4/30b1gx.jpg",
    caption: "Me at 2AM saying 'just one more episode' for the tenth time.",
    tags: ["sleep", "binge", "night", "tv", "lazy"],
  },
  {
    id: "asset-money-1",
    url: "https://i.imgflip.com/4/1bij.jpg",
    caption: "When payday arrives and your bills are already standing at the door.",
    tags: ["money", "salary", "rich", "broke", "paisa", "payday", "budget"],
  },
  {
    id: "asset-family-1",
    url: "https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif",
    caption: "When the family group chat turns one small update into a full investigation.",
    tags: ["family", "mom", "dad", "marriage", "shaadi", "relatives", "home"],
  },
  {
    id: "asset-8",
    url: "https://i.imgflip.com/4/4t0me5.jpg",
    caption: "When everyone else is doing something productive and you're still on page one.",
    tags: ["comparison", "productivity", "friends", "mood"],
  },
]

export function selectLocalAssetMeme(query: string = "", excludeIds: string[] = []) {
  const normalizedQuery = query.trim().toLowerCase()
  const eligible = assetMemes.filter((meme) => !excludeIds.includes(meme.id))
  if (eligible.length === 0) {
    return assetMemes[Math.floor(Math.random() * assetMemes.length)]
  }

  if (normalizedQuery) {
    const queryWords = new Set(normalizedQuery.split(/[^a-z0-9]+/).filter(Boolean))
    const scored = eligible
      .map((meme) => {
        const score = meme.tags.reduce((total, tag) => {
          const normalizedTag = tag.toLowerCase()
          if (normalizedQuery.includes(normalizedTag)) return total + 8
          if (queryWords.has(normalizedTag)) return total + 5
          if (normalizedTag.split(/\s+/).some((word) => queryWords.has(word))) return total + 2
          return total
        }, getIntentScore(normalizedQuery, meme.tags))

        return { meme, score }
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)

    if (scored.length > 0) {
      const bestScore = scored[0].score
      const bestMatches = scored.filter(({ score }) => score === bestScore)
      return bestMatches[Math.floor(Math.random() * bestMatches.length)].meme
    }
  }

  return eligible[Math.floor(Math.random() * eligible.length)]
}

function getIntentScore(query: string, tags: string[]) {
  const tagSet = new Set(tags.map((tag) => tag.toLowerCase()))
  const intents = [
    {
      keywords: ["ex", "crush", "love", "relationship", "dating", "ghost", "ghosting", "text", "miss", "thinking"],
      tags: ["ex", "crush", "love", "relationship", "dating", "ghosting", "text"],
    },
    {
      keywords: ["job", "work", "career", "office", "boss", "meeting", "interview"],
      tags: ["job", "work", "career", "office", "boss", "meeting"],
    },
    {
      keywords: ["money", "rich", "salary", "paisa", "broke", "payday"],
      tags: ["money", "rich", "salary", "paisa", "broke", "payday"],
    },
    {
      keywords: ["family", "mom", "dad", "marriage", "shaadi", "relatives"],
      tags: ["family", "mom", "dad", "marriage", "shaadi", "relatives"],
    },
  ]

  return intents.reduce((score, intent) => {
    const queryMatchesIntent = intent.keywords.some((keyword) => query.includes(keyword))
    if (!queryMatchesIntent) return score

    const tagMatchesIntent = intent.tags.some((tag) => tagSet.has(tag))
    return tagMatchesIntent ? score + 4 : score
  }, 0)
}

export function buildMemeCaption(query: string, mode: string) {
  if (query) {
    return `When you asked “${query}” and the answer came back like this.`
  }

  if (mode === "roast") {
    return "Roast mode activated: the meme speaks the truth."
  }

  if (mode === "predict") {
    return "Prediction delivered with the sassiest meme energy."
  }

  return "Relatable meme loading... enjoy the chaos."
}
