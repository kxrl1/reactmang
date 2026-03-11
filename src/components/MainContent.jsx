import { useState, useRef, useEffect } from "react"
import SongCard from "./SongCard"

function MainContent({ laulud, vaade, toggleLiked, avaPlaylistModal }) {
  const [otsing, setOtsing] = useState("")
  const otsinguRef = useRef(null)

  const pealkiriMap = {
    "kõik":               "Kõik laulud",
    "lemmikud":           "Lemmikud",
    "rap":                "Rap",
    "trap":               "Trap",
    "hyperpop":           "Hyperpop",
    "lofi":               "Lo-fi",
    "Edward Skeletrix":   "Edward Skeletrix",
    "Lucy Bedroque":      "Lucy Bedroque",
    "slayr":              "slayr",
    "2hollis":            "2hollis",
    "prettifun":          "prettifun",
    "Che":                "Che",
    "Che, xaviersobased": "Che, xaviersobased",
    "OsamaSon":           "OsamaSon",
    "jaydes":             "jaydes",
    "Bladee":             "Bladee",
  }

  // useEffect — Ctrl+K fookus otsingule
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        otsinguRef.current?.focus()
      }
      if (e.key === "Escape") {
        setOtsing("")
        otsinguRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const nahtavad = otsing.trim() === ""
    ? laulud
    : laulud.filter(l =>
        l.pealkiri.toLowerCase().includes(otsing.toLowerCase()) ||
        l.artist.toLowerCase().includes(otsing.toLowerCase())
      )

  const sectionTitle = vaade.startsWith("playlist:")
    ? "Playlist"
    : pealkiriMap[vaade] ?? "Laulud"

  return (
    <main className="main-content">
      <div className="main-header">
        <h1>SOUNDPLAYER</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="playlist-modal-btn" onClick={avaPlaylistModal}>
            + Playlist
          </button>
          <div className="search-wrap">
            <span className="search-icon">_</span>
            <input
              ref={otsinguRef}
              className="search-input"
              type="text"
              placeholder="Otsi... (Ctrl+K)"
              value={otsing}
              onChange={e => setOtsing(e.target.value)}
            />
            {otsing && (
              <button className="search-clear" onClick={() => setOtsing("")}>x</button>
            )}
          </div>
        </div>
      </div>

      <div className="main-inner">
        <div className="section-title">
          {otsing ? `"${otsing}" — ${nahtavad.length} tulemust` : sectionTitle}
        </div>

        {nahtavad.length === 0 ? (
          <p className="tühi-olek">Tulemusi ei leitud</p>
        ) : (
          <div className="card-grid">
            {nahtavad.map(laul => (
              <SongCard
                key={laul.id}
                laul={laul}
                onLiked={() => toggleLiked(laul.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContent