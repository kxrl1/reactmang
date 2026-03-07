import { useState, useRef, useEffect } from "react"
import SongCard from "./SongCard"

function MainContent({ laulud, praeguneId, maabib, valiLaul, toggleLiked, vaade }) {
  const [otsing, setOtsing] = useState("")
  const otsinguRef = useRef(null) // useRef — fokuseeri otsinguriba Ctrl+F vajutamisel

  const pealkiriMap = {
    "kõik":             "Kõik laulud",
    "lemmikud":         "Lemmikud",
    "Edward Skeletrix": "Edward Skeletrix",
    "Lucy Bedroque":    "Lucy Bedroque",
    "slayr":            "slayr",
    "2hollis":          "2hollis",
    "prettifun":        "prettifun",
  }

  // useEffect — Ctrl+K vajutus fokuseeri otsinguriba
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

  // Filtreeri laulud otsingu järgi
  const nahtavad = otsing.trim() === ""
    ? laulud
    : laulud.filter(l =>
        l.pealkiri.toLowerCase().includes(otsing.toLowerCase()) ||
        l.artist.toLowerCase().includes(otsing.toLowerCase())
      )

  return (
    <main className="main-content">
      <div className="main-header">
        <h1>SOUNDPLAYER</h1>

        {/* Search bar */}
        <div className="search-wrap">
          <span className="search-icon">_</span>
          <input
            ref={otsinguRef}
            className="search-input"
            type="text"
            placeholder="Otsi laule... (Ctrl+K)"
            value={otsing}
            onChange={(e) => setOtsing(e.target.value)}
          />
          {/* Tingimuslik renderdamine — näita X nuppu ainult kui midagi kirjutatud */}
          {otsing && (
            <button className="search-clear" onClick={() => setOtsing("")}>
              x
            </button>
          )}
        </div>
      </div>

      <div className="main-inner">
        <div className="section-title">
          {otsing
            ? `Otsing: "${otsing}" — ${nahtavad.length} tulemust`
            : pealkiriMap[vaade] ?? "Laulud"
          }
        </div>

        {nahtavad.length === 0 ? (
          <p className="tühi-olek">Tulemusi ei leitud</p>
        ) : (
          <div className="card-grid">
            {nahtavad.map(laul => (
              <SongCard
                key={laul.id}
                laul={laul}
                onAktiivne={laul.id === praeguneId}
                maabib={maabib}
                onKlõps={() => valiLaul(laul.id)}
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