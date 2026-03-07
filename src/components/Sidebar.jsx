// Sidebar — playlists on üleval, žanrid ja artistid all

function Sidebar({ vaade, setVaade, laulud, playlists, kustutaPlaylist }) {
  const lemmikuteArv = laulud.filter(l => l.liked).length

  const žanrid = [
    { id: "rap",      label: "Rap" },
    { id: "trap",     label: "Trap" },
    { id: "hyperpop", label: "Hyperpop" },
    { id: "lofi",     label: "Lo-fi" },
  ]

  const artistid = [
    { id: "Edward Skeletrix",   label: "Edward Skeletrix" },
    { id: "Lucy Bedroque",      label: "Lucy Bedroque" },
    { id: "slayr",              label: "slayr" },
    { id: "2hollis",            label: "2hollis" },
    { id: "prettifun",          label: "prettifun" },
    { id: "Che",                label: "Che" },
    { id: "Che, xaviersobased", label: "Che, xaviersobased" },
    { id: "OsamaSon",           label: "OsamaSon" },
    { id: "jaydes",             label: "jaydes" },
    { id: "Bladee",             label: "Bladee" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        SOUND<span>PLAYER</span>
      </div>

      {/* Avaleht + Lemmikud */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${vaade === "kõik" ? "active" : ""}`}
          onClick={() => setVaade("kõik")}
        >
          Avaleht
        </button>
        <button
          className={`nav-item ${vaade === "lemmikud" ? "active" : ""}`}
          onClick={() => setVaade("lemmikud")}
        >
          Lemmikud {lemmikuteArv > 0 && <span style={{ opacity: 0.5 }}>{lemmikuteArv}</span>}
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* PLAYLISTS — üleval */}
      <div className="sidebar-section-title">Playlists</div>
      <div className="sidebar-playlists">
        {playlists.length === 0 && (
          <div className="playlist-item" style={{ opacity: 0.35, cursor: "default", fontSize: "0.72rem" }}>
            Pole playliste
          </div>
        )}
        {playlists.map(pl => (
          <div
            key={pl.id}
            className={`playlist-item playlist-item-row ${vaade === `playlist:${pl.id}` ? "active" : ""}`}
          >
            <span onClick={() => setVaade(`playlist:${pl.id}`)}>
              {pl.nimi} <span style={{ opacity: 0.4 }}>({pl.lauludIds.length})</span>
            </span>
            <button
              className="pl-delete-btn"
              onClick={e => { e.stopPropagation(); kustutaPlaylist(pl.id) }}
              title="Kustuta"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* Žanrid */}
      <div className="sidebar-section-title">Žanrid</div>
      <div className="sidebar-playlists">
        {žanrid.map(z => (
          <div
            key={z.id}
            className={`playlist-item ${vaade === z.id ? "active" : ""}`}
            onClick={() => setVaade(z.id)}
          >
            {z.label}
          </div>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* Artistid */}
      <div className="sidebar-section-title">Artistid</div>
      <div className="sidebar-playlists">
        {artistid.map(a => (
          <div
            key={a.id}
            className={`playlist-item ${vaade === a.id ? "active" : ""}`}
            onClick={() => setVaade(a.id)}
          >
            {a.label}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar