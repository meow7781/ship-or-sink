import { NextResponse } from "next/server";
import { selectLocalAssetMeme, buildMemeCaption } from "@/lib/memeAssets";

const defaultMemeKeywords = [
  "relatable meme",
  "reaction meme",
  "funny meme",
  "office meme",
  "dating meme",
  "heartbreak meme",
  "awkward moment meme",
  "work from home meme",
  "sleepy meme",
  "crush meme",
  "friendship meme",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "delulu";
  const query = (searchParams.get("query") || "").trim();
  const exclude = (searchParams.get("exclude") || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  let searchTerm = query ? `${query} meme` : defaultMemeKeywords[Math.floor(Math.random() * defaultMemeKeywords.length)];

  if (!query) {
    if (mode === "roast") {
      searchTerm = ["roast meme", "savage reaction meme", "burn meme", "funny clapback meme"][
        Math.floor(Math.random() * 4)
      ];
    } else if (mode === "predict") {
      searchTerm = ["future meme", "guessing meme", "prediction meme", "astrology meme"][
        Math.floor(Math.random() * 4)
      ];
    }
  } else {
    const q = query.toLowerCase();
    if (q.includes("job") || q.includes("work") || q.includes("career") || q.includes("office")) {
      searchTerm = `${query} workplace meme`;
    } else if (q.includes("love") || q.includes("ex") || q.includes("relationship") || q.includes("crush")) {
      searchTerm = `${query} dating meme`;
    } else if (q.includes("money") || q.includes("rich") || q.includes("salary") || q.includes("paisa")) {
      searchTerm = `${query} money meme`;
    } else if (q.includes("family") || q.includes("mom") || q.includes("dad") || q.includes("marriage") || q.includes("shaadi")) {
      searchTerm = `${query} family meme`;
    }
  }

  // IMPORTANT: Get your FREE GIPHY API key
  // 1. Go to https://developers.giphy.com/
  // 2. Create an app → copy the key
  // 3. Add to your .env.local: GIPHY_API_KEY=your_key_here
  const apiKey = process.env.GIPHY_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GIPHY_API_KEY not found in .env → using fallback memes");
    return NextResponse.json({
      success: true,
      meme: selectLocalAssetMeme(query, exclude),
      note: "Set GIPHY_API_KEY in .env.local to fetch live memes from GIPHY",
    });
  }

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchTerm)}&limit=50&rating=pg-13&lang=en`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) throw new Error(`GIPHY error: ${response.status}`);

    const data = await response.json();
    const gifs = Array.isArray(data.data) ? data.data : [];
    const filteredGifs = gifs.filter((gif: any) => !exclude.includes(gif.id));
    const pool = filteredGifs.length > 0 ? filteredGifs : gifs;

    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const gif = pool[randomIndex];

      const gifUrl = gif.images?.fixed_height?.url || gif.images?.downsized_medium?.url || gif.images?.original?.url
      const caption = gif.title?.trim() || buildMemeCaption(query, mode)

      return NextResponse.json({
        success: true,
        meme: {
          id: gif.id,
          url: gifUrl,
          title: gif.title || searchTerm,
          caption,
          source: "giphy",
        },
      });
    }

    throw new Error("No GIFs found");
  } catch (error) {
    console.error("GIPHY fetch failed:", error);
    return NextResponse.json({
      success: true,
      meme: selectLocalAssetMeme(query, exclude),
    });
  }
}
