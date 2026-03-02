import SongCard from "./SongCard"

function MainContent({ laulud, praeguneId, maabib, valiLaul, toggleLiked, vaade }) {
  const pealkiriMap = {
    "kõik":             "Kõik laulud",
    "lemmikud":         "Lemmikud",
    "Edward Skeletrix": "Edward Skeletrix",
    "Lucy Bedroque":    "Lucy Bedroque",
    "slayr":            "slayr",
    "2hollis":          "2hollis",
    "prettifun":        "prettifun",
  }

  return (
    <main className="main-content">
      <div className="main-header">
        <h1>SOUNDPLAYER</h1>
      </div>

      <div className="main-inner">
        <div className="section-title">{pealkiriMap[vaade] ?? "Laulud"}</div>

        {laulud.length === 0 ? (
          <p className="tühi-olek">Siin pole veel laulud</p>
        ) : (
          <div className="card-grid">
            {laulud.map(laul => (
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