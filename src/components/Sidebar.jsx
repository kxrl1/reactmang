// Sidebar — filtreerib artisti järgi

function Sidebar({ vaade, setVaade, laulud }) {
  const lemmikuteArv = laulud.filter(l => l.liked).length

  const navItems = [
    { id: "kõik",     label: "Avaleht" },
    { id: "lemmikud", label: `Lemmikud  ${lemmikuteArv > 0 ? lemmikuteArv : ""}` },
  ]

  // Artistide nimekiri sidebaris — klikk filtreerib selle artisti laulud
  const artistid = [
    { id: "Edward Skeletrix", label: "Edward Skeletrix" },
    { id: "Lucy Bedroque",    label: "Lucy Bedroque" },
    { id: "slayr",            label: "slayr" },
    { id: "2hollis",          label: "2hollis" },
    { id: "prettifun",        label: "prettifun" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        SOUND<span>PLAYER</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${vaade === item.id ? "active" : ""}`}
            onClick={() => setVaade(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />

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