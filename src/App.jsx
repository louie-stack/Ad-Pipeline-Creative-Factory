import { useState, useEffect, useRef } from "react";

const BRAND_CONTEXT = `
BRAND: AQUALA — Premium D2C residential water filtration. Subsidiary of MDC Water (28-year B2B industrial water engineering). Targeting $1M/month by end of 2026.
VOICE: Premium but approachable. Science-backed authority without being clinical. Confident, warm, educational. Never fear-mongering — always empowering.
PRODUCTS: AQUALA Pure (whole-home, $1,499), AQUALA Essential (under-sink, $899), AQUALA Flow (shower filter, $249), Replacement filters ($89-149).
AUDIENCE: Homeowners 28-55, health-conscious, premium home investment mindset. US/Australian market.
COMPETITORS: Berkey, Pentair, SpringWell, iSpring — AQUALA differentiates on 28yr engineering heritage and premium experience.
`;

const PLATFORM_SPECS = {
  meta: {
    name: "Meta Ads",
    icon: "📘",
    color: "#3B82F6",
    formats: [
      { type: "Single Image / Video", primary_text: 125, headline: 40, description: 30, cta_options: ["Shop Now", "Learn More", "Sign Up", "Get Offer", "Book Now"] },
      { type: "Carousel", primary_text: 125, headline: 40, description: 20, cta_options: ["Shop Now", "Learn More", "Sign Up"] },
      { type: "Story / Reel", primary_text: 72, overlay_text: 30, cta_options: ["Shop Now", "Learn More", "Swipe Up"] },
    ],
    placements: ["Feed", "Stories", "Reels", "Right Column", "Marketplace"],
    image_specs: "1080×1080 (1:1), 1080×1920 (9:16 Stories/Reels), 1200×628 (Landscape)",
  },
  google: {
    name: "Google Ads",
    icon: "🔍",
    color: "#10B981",
    formats: [
      { type: "Responsive Search Ad", headlines: { count: 15, max_chars: 30 }, descriptions: { count: 4, max_chars: 90 }, sitelinks: { count: 4, max_chars: 25 } },
      { type: "Performance Max", headlines: { count: 5, max_chars: 30 }, long_headline: 90, descriptions: { count: 5, max_chars: 90 }, cta_options: ["Shop Now", "Learn More", "Get Quote"] },
    ],
    placements: ["Search", "Display", "YouTube", "Shopping", "Discover"],
  },
  tiktok: {
    name: "TikTok Ads",
    icon: "🎵",
    color: "#EF4444",
    formats: [
      { type: "In-Feed Video", duration: "15-60 seconds", ad_text: 100, cta_options: ["Shop Now", "Learn More", "Download", "Sign Up"] },
      { type: "Spark Ad (Boosted UGC)", duration: "15-60 seconds", ad_text: 100, cta_options: ["Shop Now", "Learn More"] },
    ],
    placements: ["For You Page", "Following Feed", "Search Results"],
    video_specs: "9:16 vertical, 1080×1920, .mp4/.mov, max 500MB",
  },
};

const PRESET_BRIEFS = [
  {
    id: 1, name: "New Customer Acquisition",
    brief: "Generate ads to acquire new customers for AQUALA's whole-home water filtration systems. Focus on the premium quality, 28 years of engineering heritage from MDC Water, and the health benefits of filtered water throughout the entire home. Target homeowners 28-55 who invest in premium home infrastructure. Angle: transformation — what life looks like when every tap in your home delivers pure water.",
    angle: "Transformation",
    product: "AQUALA Pure ($1,499)",
  },
  {
    id: 2, name: "Competitor Conquest",
    brief: "Create ads targeting people researching Berkey, Pentair, and other water filter brands. Highlight what makes AQUALA different: industrial-grade engineering in a consumer product, whole-home coverage vs single-point filters, and the MDC Water pedigree. Don't trash competitors — position AQUALA as the premium upgrade they didn't know existed. Angle: authority and engineering credibility.",
    angle: "Competitor Conquest",
    product: "AQUALA Pure + Essential",
  },
  {
    id: 3, name: "Filter Replacement Campaign",
    brief: "Drive recurring revenue through filter replacement ads. Target existing AQUALA customers approaching their 6-12 month replacement window. Emphasize the importance of regular replacement for water quality, make it easy with subscription options. Angle: maintenance and care — protecting the investment they've already made.",
    angle: "Retention / Replenishment",
    product: "Replacement Filters ($89-149)",
  },
  {
    id: 4, name: "Seasonal — Summer Water Quality",
    brief: "Summer seasonal campaign highlighting increased water usage and quality concerns during hot months. Position AQUALA as essential for summer: better-tasting water for hydration, cleaner water for cooking, better shower experience. Target homeowners thinking about home improvement during summer. Angle: seasonal relevance — summer is when water quality matters most.",
    angle: "Seasonal",
    product: "Full Range",
  },
  {
    id: 5, name: "UGC-Style Social Proof",
    brief: "Generate ad concepts designed to look and feel like organic user-generated content. Focus on real customer moments: unboxing, installation, first taste test, showing visitors, before/after water tests. These should feel authentic, not polished. Angle: social proof — real people, real results. Designed for TikTok and Instagram Reels primarily.",
    angle: "UGC / Social Proof",
    product: "AQUALA Pure + Essential",
  },
];

const t = {
  bg: "#0B1121", card: "#111827", border: "#1E293B",
  text: "#E2E8F0", sec: "#94A3B8", muted: "#64748B",
  cyan: "#06B6D4", green: "#10B981", amber: "#F59E0B",
  purple: "#8B5CF6", red: "#EF4444", blue: "#3B82F6",
};

const Pill = ({ color, children }) => (
  <span style={{ background: color + "18", color, border: `1px solid ${color}33`, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 4 }}>
    {children}
  </span>
);

const CharCount = ({ current, max, label }) => {
  const pct = (current / max) * 100;
  const over = current > max;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
      <span style={{ color: t.muted }}>{label}</span>
      <div style={{ flex: 1, height: 3, background: t.border, borderRadius: 2, minWidth: 40 }}>
        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: over ? t.red : pct > 85 ? t.amber : t.green, borderRadius: 2, transition: "all 0.3s" }} />
      </div>
      <span style={{ color: over ? t.red : t.sec, fontWeight: 600 }}>{current}/{max}</span>
    </div>
  );
};

async function generateAds(brief, platforms) {
  const platformInstructions = platforms.map(p => {
    const spec = PLATFORM_SPECS[p];
    if (p === "meta") {
      return `META ADS — Generate 3 ad variants:
For each variant provide: headline (max 40 chars), primary_text (max 125 chars), description (max 30 chars), cta (from: ${spec.formats[0].cta_options.join(", ")}), format (Single Image, Carousel, or Story/Reel), placement_recommendation (from: ${spec.placements.join(", ")}), image_direction (describe the visual concept for the ad image in detail — mood, composition, subject, style), image_prompt (a detailed DALL-E 3 prompt to generate the ad image — photorealistic commercial photography style, describe exact scene, lighting, composition, mood, subjects, and product placement. Always include "commercial product photography" or "lifestyle advertisement photography" in the prompt. Never include any text, words, logos, or watermarks in the image. Max 300 chars.), hook (the first 3 words that stop the scroll).`;
    }
    if (p === "google") {
      return `GOOGLE ADS — Generate 1 Responsive Search Ad set:
Provide: headlines (array of 10 headlines, each max 30 chars), descriptions (array of 4 descriptions, each max 90 chars), sitelinks (array of 4 sitelinks with title max 25 chars and description max 35 chars), display_url_path (2 segments, max 15 chars each like "water-filters/whole-home"), keyword_themes (5 suggested keyword themes to target).`;
    }
    if (p === "tiktok") {
      return `TIKTOK ADS — Generate 2 video script concepts:
For each provide: hook (first 2 seconds text/action that stops the scroll), script (full scene-by-scene script with timing markers like [0:00-0:03], [0:03-0:08] etc, 15-30 seconds total), ad_text (max 100 chars, the text that appears with the ad), cta (from: ${spec.formats[0].cta_options.join(", ")}), format_style (UGC, Product Demo, Before/After, Testimonial, Educational), music_suggestion (mood/genre for background), text_overlays (array of on-screen text with timing).`;
    }
    return "";
  }).join("\n\n");

  const prompt = `You are an expert performance marketing creative strategist. Generate platform-compliant ad creatives based on the following brief.

CREATIVE BRIEF:
${brief}

${BRAND_CONTEXT}

GENERATE ADS FOR THESE PLATFORMS:
${platformInstructions}

CRITICAL: All character counts must be WITHIN the specified limits. Verify before outputting.

Respond ONLY with a JSON object (no markdown, no backticks, no preamble) with this structure:
{
  "brief_summary": "One line summary of the creative direction",
  "target_audience": "Specific audience description",
  "meta": [ ... array of ad objects if meta was requested ... ],
  "google": { ... google ad object if requested ... },
  "tiktok": [ ... array of script objects if requested ... ]
}

Only include the platforms that were requested. Raw JSON only.`;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Generation error:", err);
    return null;
  }
}

// ── Pipeline Stage Indicator ──
const PipelineStage = ({ stages, current }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "20px 0" }}>
    {stages.map((s, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stages.length - 1 ? 1 : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: i < current ? t.green + "25" : i === current ? t.cyan + "25" : t.border,
            border: `2px solid ${i < current ? t.green : i === current ? t.cyan : t.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: i < current ? t.green : i === current ? t.cyan : t.muted,
          }}>
            {i < current ? "✓" : i + 1}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: i <= current ? t.text : t.muted }}>{s}</span>
        </div>
        {i < stages.length - 1 && (
          <div style={{ flex: 1, height: 2, background: i < current ? t.green + "40" : t.border, margin: "0 12px", minWidth: 20 }} />
        )}
      </div>
    ))}
  </div>
);

// ── Meta Ad Card ──
// ── Image generation ──
async function generateImage(imagePrompt) {
  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: imagePrompt }),
    });
    const data = await res.json();
    if (data.error) { console.error("Image error:", data.error); return null; }
    return data.url;
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
}

const MetaAdCard = ({ ad, index }) => {
  const [imgUrl, setImgUrl] = useState(ad._generatedImage || null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleGenerateImage = async () => {
    if (!ad.image_prompt) return;
    setImgLoading(true);
    setImgError(false);
    const url = await generateImage(ad.image_prompt);
    if (url) {
      setImgUrl(url);
      ad._generatedImage = url;
    } else {
      setImgError(true);
    }
    setImgLoading(false);
  };

  return (
  <div style={{ background: t.card, borderRadius: 12, padding: 20, border: `1px solid ${t.border}`, animation: `slideIn 0.4s ease ${index * 0.1}s both` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Pill color={t.blue}>Variant {index + 1}</Pill>
        <Pill color={t.muted}>{ad.format || "Single Image"}</Pill>
      </div>
      <span style={{ fontSize: 11, color: t.muted }}>{ad.placement_recommendation}</span>
    </div>

    {/* Ad Preview */}
    <div style={{ background: t.bg, borderRadius: 10, overflow: "hidden", border: `1px solid ${t.border}` }}>
      {/* Image area */}
      {imgUrl ? (
        <div style={{ position: "relative" }}>
          <img src={imgUrl} alt={ad.headline} style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <Pill color={t.green}>AI Generated</Pill>
          </div>
        </div>
      ) : (
        <div style={{ background: `linear-gradient(135deg, ${t.blue}15, ${t.purple}15)`, padding: 20, minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${t.border}`, gap: 12 }}>
          {imgLoading ? (
            <>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${t.border}`, borderTopColor: t.blue, animation: "spin 1s linear infinite" }} />
              <div style={{ fontSize: 12, color: t.sec }}>Generating image with DALL·E 3...</div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>Image Direction</div>
                <div style={{ fontSize: 13, color: t.sec, maxWidth: 350, lineHeight: 1.5, marginBottom: 10 }}>{ad.image_direction}</div>
              </div>
              {ad.image_prompt && (
                <button
                  onClick={handleGenerateImage}
                  style={{
                    background: `linear-gradient(135deg, ${t.blue}, ${t.purple})`,
                    color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8,
                    fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  🎨 Generate Image
                </button>
              )}
              {imgError && <div style={{ fontSize: 11, color: t.red }}>Image generation failed — check OpenAI key in Vercel</div>}
            </>
          )}
        </div>
      )}
      {/* Ad content */}
      <div style={{ padding: 16 }}>
        {ad.hook && <div style={{ fontSize: 12, color: t.amber, fontWeight: 700, marginBottom: 6 }}>🪝 Hook: "{ad.hook}"</div>}
        <div style={{ fontSize: 14, color: t.text, lineHeight: 1.5, marginBottom: 8 }}>{ad.primary_text}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>{ad.headline}</div>
        {ad.description && <div style={{ fontSize: 13, color: t.sec }}>{ad.description}</div>}
        <div style={{ marginTop: 10, display: "inline-block", background: t.blue, color: "#fff", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{ad.cta}</div>
      </div>
    </div>

    {/* Char validation */}
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
      <CharCount current={ad.headline?.length || 0} max={40} label="Headline" />
      <CharCount current={ad.primary_text?.length || 0} max={125} label="Primary Text" />
      {ad.description && <CharCount current={ad.description.length} max={30} label="Description" />}
    </div>
  </div>
  );
};

// ── Google Ad Card ──
const GoogleAdCard = ({ ad }) => (
  <div style={{ background: t.card, borderRadius: 12, padding: 24, border: `1px solid ${t.border}`, animation: "slideIn 0.4s ease both" }}>
    {/* Search Preview */}
    <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Search Preview</div>
    <div style={{ background: "#fff", borderRadius: 10, padding: 20, marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: "#202124", marginBottom: 2 }}>Sponsored · aquala.com.au/{ad.display_url_path || "water-filters"}</div>
      <div style={{ fontSize: 18, color: "#1a0dab", fontWeight: 400, marginBottom: 4, cursor: "pointer", lineHeight: 1.3 }}>
        {ad.headlines?.[0]} | {ad.headlines?.[1]} | {ad.headlines?.[2]}
      </div>
      <div style={{ fontSize: 13, color: "#4d5156", lineHeight: 1.4 }}>{ad.descriptions?.[0]}</div>
      {ad.sitelinks && (
        <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          {ad.sitelinks.slice(0, 4).map((sl, i) => (
            <div key={i} style={{ color: "#1a0dab", fontSize: 13 }}>{sl.title || sl}</div>
          ))}
        </div>
      )}
    </div>

    {/* Headlines */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Headlines ({ad.headlines?.length || 0})</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {ad.headlines?.map((h, i) => (
          <div key={i} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: h.length > 30 ? t.red : t.text, display: "flex", alignItems: "center", gap: 6 }}>
            <span>{h}</span>
            <span style={{ color: h.length > 30 ? t.red : t.muted, fontSize: 10, fontWeight: 600 }}>{h.length}/30</span>
          </div>
        ))}
      </div>
    </div>

    {/* Descriptions */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Descriptions ({ad.descriptions?.length || 0})</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ad.descriptions?.map((d, i) => (
          <div key={i} style={{ background: t.bg, borderRadius: 8, padding: 10, border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 13, color: t.text, marginBottom: 4 }}>{d}</div>
            <CharCount current={d.length} max={90} label={`Desc ${i + 1}`} />
          </div>
        ))}
      </div>
    </div>

    {/* Sitelinks */}
    {ad.sitelinks && (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Sitelinks</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {ad.sitelinks.map((sl, i) => (
            <div key={i} style={{ background: t.bg, borderRadius: 8, padding: 10, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.green }}>{sl.title || sl}</div>
              {sl.description && <div style={{ fontSize: 12, color: t.sec, marginTop: 2 }}>{sl.description}</div>}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Keywords */}
    {ad.keyword_themes && (
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Suggested Keyword Themes</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ad.keyword_themes.map((kw, i) => (
            <Pill key={i} color={t.green}>{kw}</Pill>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ── TikTok Script Card ──
const TikTokScriptCard = ({ script, index }) => (
  <div style={{ background: t.card, borderRadius: 12, padding: 20, border: `1px solid ${t.border}`, animation: `slideIn 0.4s ease ${index * 0.1}s both` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 6 }}>
        <Pill color={t.red}>Concept {index + 1}</Pill>
        <Pill color={t.muted}>{script.format_style || "Video"}</Pill>
      </div>
      {script.music_suggestion && <span style={{ fontSize: 11, color: t.muted }}>🎵 {script.music_suggestion}</span>}
    </div>

    {/* Hook */}
    <div style={{ background: t.red + "10", border: `1px solid ${t.red}25`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: t.red, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>🪝 Hook — First 2 Seconds</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{script.hook}</div>
    </div>

    {/* Script */}
    <div style={{ background: t.bg, borderRadius: 8, padding: 16, marginBottom: 12, border: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, marginBottom: 8 }}>FULL SCRIPT</div>
      <div style={{ fontSize: 13, color: t.sec, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{script.script}</div>
    </div>

    {/* Text Overlays */}
    {script.text_overlays && script.text_overlays.length > 0 && (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 600, marginBottom: 8 }}>TEXT OVERLAYS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {script.text_overlays.map((overlay, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ color: t.cyan, fontWeight: 600, minWidth: 60 }}>{overlay.timing || overlay.time || `[${i + 1}]`}</span>
              <span style={{ color: t.text }}>{overlay.text || overlay}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Ad text + CTA */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${t.border}` }}>
      <div>
        <div style={{ fontSize: 13, color: t.text }}>{script.ad_text}</div>
        <CharCount current={script.ad_text?.length || 0} max={100} label="Ad Text" />
      </div>
      <div style={{ background: t.red, color: "#fff", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{script.cta}</div>
    </div>
  </div>
);

// ── Video Storyboard Preview ──
function parseTime(str) {
  if (!str) return 0;
  const clean = str.replace(/[\[\]]/g, "").trim();
  const match = clean.match(/(\d+):(\d+)/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function parseOverlayTiming(overlay) {
  const timing = overlay.timing || overlay.time || "";
  const text = overlay.text || (typeof overlay === "string" ? overlay : "");
  const parts = timing.replace(/[\[\]]/g, "").split(/[-–]/);
  const start = parseTime(parts[0]);
  const end = parts[1] ? parseTime(parts[1]) : start + 3;
  return { text, start, end };
}

const VideoPreview = ({ script, imageUrl, index }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const overlays = (script.text_overlays || []).map(parseOverlayTiming);
  const totalDuration = Math.max(
    ...overlays.map(o => o.end),
    30
  );

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - currentTime * 1000;
    const tick = (now) => {
      const elapsed = (now - startRef.current) / 1000;
      if (elapsed >= totalDuration) {
        setCurrentTime(0);
        setPlaying(false);
        return;
      }
      setCurrentTime(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  const progress = (currentTime / totalDuration) * 100;
  const zoomScale = 1 + (currentTime / totalDuration) * 0.15;
  const panX = Math.sin(currentTime * 0.3) * 3;
  const panY = Math.cos(currentTime * 0.2) * 2;

  const activeOverlays = overlays.filter(o => currentTime >= o.start && currentTime < o.end);

  const formatTimestamp = (s) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ background: t.card, borderRadius: 12, padding: 20, border: `1px solid ${t.border}`, animation: `slideIn 0.4s ease ${index * 0.15}s both` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Pill color={t.red}>Storyboard Preview</Pill>
          <Pill color={t.muted}>{script.format_style || "Video"}</Pill>
        </div>
        <span style={{ fontSize: 11, color: t.muted }}>Motion storyboard · {totalDuration}s</span>
      </div>

      {/* 9:16 Preview Window */}
      <div style={{
        width: "100%", maxWidth: 280, margin: "0 auto", aspectRatio: "9/16",
        borderRadius: 16, overflow: "hidden", position: "relative",
        background: "#000", border: `2px solid ${t.border}`,
        cursor: "pointer",
      }} onClick={() => setPlaying(!playing)}>

        {/* Background Image with Ken Burns */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            style={{
              position: "absolute", inset: -20, width: "calc(100% + 40px)", height: "calc(100% + 40px)",
              objectFit: "cover", filter: "brightness(0.6)",
              transform: `scale(${zoomScale}) translate(${panX}px, ${panY}px)`,
              transition: playing ? "none" : "transform 0.3s ease",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${t.red}30, ${t.purple}30, ${t.blue}30)`,
            filter: "brightness(0.5)",
            transform: `scale(${zoomScale})`,
          }} />
        )}

        {/* TikTok UI Chrome */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 12 }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fff9", fontSize: 10, fontWeight: 600 }}>Following | For You</span>
            <span style={{ color: "#fff9", fontSize: 12 }}>🔍</span>
          </div>

          {/* Center - Text Overlays */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, padding: "0 8px" }}>
            {!playing && currentTime === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 0, height: 0, borderLeft: "16px solid #fff", borderTop: "10px solid transparent", borderBottom: "10px solid transparent", marginLeft: 4 }} />
                </div>
                <span style={{ color: "#fffc", fontSize: 11, fontWeight: 600 }}>Play Storyboard</span>
              </div>
            )}

            {activeOverlays.map((overlay, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
                  padding: "8px 14px", borderRadius: 8, maxWidth: "90%",
                  animation: "slideIn 0.3s ease both",
                }}
              >
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", lineHeight: 1.3, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  {overlay.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div>
            {/* CTA Button */}
            {currentTime > totalDuration * 0.7 && (
              <div style={{ background: t.red, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 8, animation: "slideIn 0.3s ease both" }}>
                {script.cta || "Shop Now"}
              </div>
            )}

            {/* Username / Music */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>@aquala.water</div>
              <div style={{ color: "#fffa", fontSize: 10, marginTop: 2 }}>{script.ad_text?.slice(0, 60)}</div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#fff", borderRadius: 2, transition: playing ? "none" : "width 0.2s" }} />
            </div>
          </div>
        </div>

        {/* Right side TikTok icons */}
        <div style={{ position: "absolute", right: 8, bottom: 80, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {["❤️", "💬", "↗️", "🔖"].map((icon, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ color: "#fff9", fontSize: 9 }}>{["24.3K", "847", "1.2K", ""][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Playback controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, maxWidth: 280, margin: "12px auto 0" }}>
        <button
          onClick={() => { setPlaying(!playing); }}
          style={{ background: t.red, color: "#fff", border: "none", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12, flexShrink: 0 }}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <div style={{ flex: 1, height: 4, background: t.border, borderRadius: 2, overflow: "hidden", cursor: "pointer" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(pct * totalDuration);
            startRef.current = performance.now() - pct * totalDuration * 1000;
          }}
        >
          <div style={{ height: "100%", width: `${progress}%`, background: t.red, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 11, color: t.muted, fontWeight: 600, minWidth: 48, textAlign: "right" }}>
          {formatTimestamp(currentTime)} / {formatTimestamp(totalDuration)}
        </span>
      </div>

      {/* Info bar */}
      <div style={{ maxWidth: 280, margin: "10px auto 0", padding: "8px 10px", background: t.bg, borderRadius: 8, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 10, color: t.muted, lineHeight: 1.4 }}>
          <span style={{ color: t.amber, fontWeight: 600 }}>Motion storyboard</span> — animated preview using AI-generated imagery with timed text overlays from the script. Ready for production handoff. For AI-generated video, upgrade to video pipeline (est. $2-8 per clip via Runway/Kling).
        </div>
      </div>
    </div>
  );
};

// ── MAIN APP ──
export default function AdPipeline() {
  const [brief, setBrief] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [platforms, setPlatforms] = useState(["meta", "google", "tiktok"]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("meta");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handlePreset = (preset) => {
    setSelectedPreset(preset);
    setBrief(preset.brief);
  };

  const handleGenerate = async () => {
    if (!brief.trim() || platforms.length === 0) return;
    setGenerating(true);
    setResult(null);
    const ads = await generateAds(brief, platforms);
    if (ads) {
      setResult(ads);
      setActiveTab(platforms[0]);
      setHistory(prev => [{ brief: brief.slice(0, 60) + "...", time: new Date().toLocaleTimeString(), platforms: [...platforms], result: ads }, ...prev]);
    }
    setGenerating(false);
  };

  const exportAll = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pipelineStage = !result && !generating ? 0 : generating ? 1 : 2;

  return (
    <div style={{ background: t.bg, minHeight: "100vh", color: t.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(90deg, ${t.red}15, ${t.green}15, ${t.blue}15)`, padding: "8px 24px", fontSize: 12, color: t.sec, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${t.border}` }}>
        <span>🚀</span>
        <span>Ad Publishing Pipeline — Brief to platform-ready creatives for Meta, Google & TikTok in one generation</span>
      </div>

      {/* Header */}
      <div style={{ padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
              <span style={{ color: t.red }}>Ad</span> <span style={{ color: t.text }}>Pipeline</span>
            </div>
            <div style={{ fontSize: 10, color: t.muted, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Content Factory → Platform-Ready Ads</div>
          </div>
          <div style={{ height: 28, width: 1, background: t.border }} />
          <div style={{ fontSize: 12, color: t.muted }}>AQUALA × MDC Water</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: t.muted }}>
          <span>3 platforms</span>
          <span>·</span>
          <span style={{ color: t.green }}>{history.length} runs this session</span>
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Pipeline Stages */}
        <PipelineStage stages={["Brief Input", "Content Factory (AI)", "Platform Creatives", "Ready to Publish"]} current={pipelineStage} />

        {/* Brief Input Section */}
        <div style={{ background: t.card, borderRadius: 12, padding: 24, marginBottom: 24, border: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Creative Brief</div>
              <div style={{ fontSize: 13, color: t.muted }}>Describe the campaign or select a preset — the Content Factory handles the rest</div>
            </div>
          </div>

          {/* Presets */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {PRESET_BRIEFS.map(p => (
              <button
                key={p.id}
                onClick={() => handlePreset(p)}
                style={{
                  background: selectedPreset?.id === p.id ? t.cyan + "15" : t.bg,
                  border: `1px solid ${selectedPreset?.id === p.id ? t.cyan + "40" : t.border}`,
                  color: selectedPreset?.id === p.id ? t.cyan : t.sec,
                  padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Brief textarea */}
          <textarea
            value={brief}
            onChange={(e) => { setBrief(e.target.value); setSelectedPreset(null); }}
            placeholder="Describe your campaign: What product? What angle? Who's the audience? What action do you want them to take?"
            style={{
              width: "100%", minHeight: 100, background: t.bg, border: `1px solid ${t.border}`,
              borderRadius: 10, padding: 16, color: t.text, fontSize: 14, fontFamily: "inherit",
              lineHeight: 1.6, resize: "vertical",
            }}
          />

          {/* Platform select + Generate */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(PLATFORM_SPECS).map(([key, spec]) => (
                <button
                  key={key}
                  onClick={() => togglePlatform(key)}
                  style={{
                    background: platforms.includes(key) ? spec.color + "18" : t.bg,
                    border: `1px solid ${platforms.includes(key) ? spec.color + "50" : t.border}`,
                    color: platforms.includes(key) ? spec.color : t.muted,
                    padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span>{spec.icon}</span> {spec.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !brief.trim() || platforms.length === 0}
              style={{
                background: generating ? t.muted : `linear-gradient(135deg, ${t.red}, ${t.amber})`,
                color: "#fff", border: "none", padding: "12px 32px", borderRadius: 10,
                fontSize: 14, fontWeight: 700, cursor: generating ? "wait" : "pointer",
                fontFamily: "inherit", opacity: (!brief.trim() || platforms.length === 0) ? 0.4 : 1,
                transition: "all 0.2s", minWidth: 200,
              }}
            >
              {generating ? "⟳ Generating Ads..." : "⚡ Generate Creatives"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {generating && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${t.border}`, borderTopColor: t.cyan, animation: "spin 1s linear infinite" }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Content Factory Processing...</div>
            <div style={{ fontSize: 13, color: t.muted }}>Generating platform-compliant creatives for {platforms.map(p => PLATFORM_SPECS[p].name).join(", ")}</div>
          </div>
        )}

        {/* Results */}
        {result && !generating && (
          <div>
            {/* Summary bar */}
            <div style={{ background: `linear-gradient(135deg, ${t.cyan}10, ${t.purple}10)`, border: `1px solid ${t.cyan}25`, borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{result.brief_summary}</div>
                <div style={{ fontSize: 12, color: t.muted }}>Target: {result.target_audience}</div>
              </div>
              <button
                onClick={exportAll}
                style={{ background: copied ? t.green : t.cyan, color: "#000", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              >
                {copied ? "✓ Copied!" : "Export All JSON"}
              </button>
            </div>

            {/* Platform tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${t.border}` }}>
              {platforms.map(p => {
                const spec = PLATFORM_SPECS[p];
                const count = p === "google" ? (result[p] ? 1 : 0) : (result[p]?.length || 0);
                return (
                  <button
                    key={p}
                    onClick={() => setActiveTab(p)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      padding: "12px 24px", fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                      color: activeTab === p ? spec.color : t.muted,
                      borderBottom: activeTab === p ? `2px solid ${spec.color}` : "2px solid transparent",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    {spec.icon} {spec.name} <span style={{ fontSize: 11, color: t.muted }}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Platform content */}
            {activeTab === "meta" && result.meta && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: t.muted }}>{result.meta.length} ad variants generated — click individual images or generate all at once</div>
                  <button
                    onClick={async () => {
                      setGeneratingImages(true);
                      for (const ad of result.meta) {
                        if (!ad._generatedImage && ad.image_prompt) {
                          const url = await generateImage(ad.image_prompt);
                          if (url) ad._generatedImage = url;
                        }
                      }
                      setGeneratingImages(false);
                      setResult({ ...result });
                    }}
                    disabled={generatingImages}
                    style={{
                      background: generatingImages ? t.muted : `linear-gradient(135deg, ${t.blue}, ${t.purple})`,
                      color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8,
                      fontSize: 12, fontWeight: 700, cursor: generatingImages ? "wait" : "pointer",
                      fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
                      opacity: generatingImages ? 0.7 : 1,
                    }}
                  >
                    {generatingImages ? "⟳ Generating Images..." : "🎨 Generate All Images"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: result.meta.length > 2 ? "repeat(3, 1fr)" : result.meta.length === 2 ? "repeat(2, 1fr)" : "1fr", gap: 16 }}>
                  {result.meta.map((ad, i) => <MetaAdCard key={`${i}-${ad._generatedImage || ''}`} ad={ad} index={i} />)}
                </div>
              </div>
            )}

            {activeTab === "google" && result.google && (
              <GoogleAdCard ad={result.google} />
            )}

            {activeTab === "tiktok" && result.tiktok && (
              <div>
                {/* Storyboard Previews */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Animated Storyboard Previews</div>
                      <div style={{ fontSize: 12, color: t.muted }}>Click to play — timed text overlays on AI-generated imagery with Ken Burns motion</div>
                    </div>
                    {!(result.meta || []).some(a => a._generatedImage) && (
                      <div style={{ fontSize: 11, color: t.amber, maxWidth: 250, textAlign: "right" }}>💡 Generate Meta ad images first for full storyboard previews</div>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: result.tiktok.length > 1 ? "1fr 1fr" : "1fr", gap: 16 }}>
                    {result.tiktok.map((script, i) => (
                      <VideoPreview
                        key={i}
                        script={script}
                        imageUrl={(result.meta || [])[i]?._generatedImage || (result.meta || [])[0]?._generatedImage || null}
                        index={i}
                      />
                    ))}
                  </div>
                </div>

                {/* Full Scripts */}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 12 }}>Full Production Scripts</div>
                  <div style={{ display: "grid", gridTemplateColumns: result.tiktok.length > 1 ? "1fr 1fr" : "1fr", gap: 16 }}>
                    {result.tiktok.map((script, i) => <TikTokScriptCard key={i} script={script} index={i} />)}
                  </div>
                </div>
              </div>
            )}

            {/* Platform Specs Reference */}
            <div style={{ background: t.card, borderRadius: 12, padding: 20, marginTop: 20, border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>Platform Specs Reference</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {platforms.map(p => {
                  const spec = PLATFORM_SPECS[p];
                  return (
                    <div key={p} style={{ background: t.bg, borderRadius: 8, padding: 12, border: `1px solid ${t.border}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: spec.color, marginBottom: 8 }}>{spec.icon} {spec.name}</div>
                      <div style={{ fontSize: 11, color: t.sec, lineHeight: 1.5 }}>
                        <div>Placements: {spec.placements.join(", ")}</div>
                        {spec.image_specs && <div style={{ marginTop: 4 }}>Images: {spec.image_specs}</div>}
                        {spec.video_specs && <div style={{ marginTop: 4 }}>Video: {spec.video_specs}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !generating && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: t.text, marginBottom: 8 }}>Enter a Brief to Generate Ads</div>
            <div style={{ fontSize: 14, color: t.sec, maxWidth: 450, lineHeight: 1.6 }}>
              Select a preset campaign or write a custom brief. The Content Factory generates platform-compliant creatives for Meta, Google, and TikTok — with character validation, format specs, and image direction included.
            </div>
          </div>
        )}

        {/* Session History */}
        {history.length > 0 && (
          <div style={{ marginTop: 32, background: t.card, borderRadius: 12, padding: 20, border: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>Session History</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: t.bg, borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: t.text }}>{h.brief}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {h.platforms.map(p => <span key={p} style={{ fontSize: 14 }}>{PLATFORM_SPECS[p].icon}</span>)}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: t.muted }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px 0 12px", fontSize: 11, color: t.muted }}>
          Powered by <span style={{ color: t.red, fontWeight: 600 }}>Maupan</span> · AI Marketing Intelligence
        </div>
      </div>
    </div>
  );
}
