import { useState, useEffect } from "react"
import { PlayerProvider } from "./context/PlayerContext"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import Player from "./components/Player"
import "./App.css"

const LAULUD = [
  { id: 1,  pealkiri: "Skeletrix Island 3",          artist: "Edward Skeletrix",   žanr: "rap",        liked: false, pilt: "/images/Skeletrix_Island_3.jpg",          audioUrl: "/audio/skeletrix-island-3.mp3" },
  { id: 2,  pealkiri: "Love U",                       artist: "Edward Skeletrix",   žanr: "rap",        liked: false, pilt: "/images/Love_U.jpg",                      audioUrl: "/audio/love-u.mp3" },
  { id: 3,  pealkiri: "G6 Anthem",                    artist: "Lucy Bedroque",      žanr: "rap",        liked: false, pilt: "/images/G6_Anthem.jpg",                   audioUrl: "/audio/g6-anthem.mp3" },
  { id: 4,  pealkiri: "2010 Justin Bieber",           artist: "Lucy Bedroque",      žanr: "rap",        liked: false, pilt: "/images/2010_Justin_Bieber.jpg",          audioUrl: "/audio/2010-justin-bieber.mp3" },
  { id: 5,  pealkiri: "Set In Stone",                 artist: "slayr",              žanr: "trap",       liked: false, pilt: "/images/Set_In_Stone.jpg",                audioUrl: "/audio/set-in-stone.mp3" },
  { id: 6,  pealkiri: "Holding",                      artist: "slayr",              žanr: "trap",       liked: false, pilt: "/images/Holding.jpg",                     audioUrl: "/audio/holding.mp3" },
  { id: 7,  pealkiri: "all 2s",                       artist: "2hollis",            žanr: "hyperpop",   liked: false, pilt: "/images/all_2s.jpg",                      audioUrl: "/audio/all-2s.mp3" },
  { id: 8,  pealkiri: "two bad",                      artist: "2hollis",            žanr: "hyperpop",   liked: false, pilt: "/images/two_bad.jpg",                     audioUrl: "/audio/two-bad.mp3" },
  { id: 9,  pealkiri: "Sides",                        artist: "prettifun",          žanr: "hyperpop",   liked: false, pilt: "/images/Sides.jpg",                       audioUrl: "/audio/sides.mp3" },
  { id: 10, pealkiri: "Digital Love",                 artist: "prettifun",          žanr: "hyperpop",   liked: false, pilt: "/images/Digital_Love.jpg",                audioUrl: "/audio/digital-love.mp3" },
  { id: 11, pealkiri: "agenda",                       artist: "Che",                žanr: "rap",        liked: false, pilt: "/images/agenda.jpg",                      audioUrl: "/audio/agenda.mp3" },
  { id: 12, pealkiri: "Miley Cyrus",                  artist: "Che",                žanr: "rap",        liked: false, pilt: "/images/Miley_Cyrus.jpg",                 audioUrl: "/audio/miley-cyrus.mp3" },
  { id: 13, pealkiri: "MANNEQUIN",                    artist: "Che, xaviersobased", žanr: "rap",        liked: false, pilt: "/images/MANNEQUIN.jpg",                   audioUrl: "/audio/mannequin.mp3" },
  { id: 14, pealkiri: "Pop",                          artist: "OsamaSon",           žanr: "trap",       liked: false, pilt: "/images/Pop.jpg",                         audioUrl: "/audio/pop.mp3" },
  { id: 15, pealkiri: "ik what you did last summer",  artist: "OsamaSon",           žanr: "trap",       liked: false, pilt: "/images/ik_what_you_did_last_summer.jpg", audioUrl: "/audio/ik-what-you-did-last-summer.mp3" },
  { id: 16, pealkiri: "Kills",                        artist: "OsamaSon",           žanr: "trap",       liked: false, pilt: "/images/Kills.jpg",                       audioUrl: "/audio/kills.mp3" },
  { id: 17, pealkiri: "poison",                       artist: "jaydes",             žanr: "lofi",       liked: false, pilt: "/images/poison.jpg",                      audioUrl: "/audio/poison.mp3" },
  { id: 18, pealkiri: "sedated",                      artist: "jaydes",             žanr: "lofi",       liked: false, pilt: "/images/sedated.jpg",                     audioUrl: "/audio/sedated.mp3" },
  { id: 19, pealkiri: "Be Nice 2 Me",                 artist: "Bladee",             žanr: "hyperpop",   liked: false, pilt: "/images/Be_Nice_2_Me.jpg",                audioUrl: "/audio/be-nice-2-me.mp3" },
  { id: 20, pealkiri: "I don't want to be a Dad",     artist: "Edward Skeletrix",   žanr: "rap",        liked: false, pilt: "/images/I_dont_want_to_be_a_Dad.jpg",     audioUrl: "/audio/i-dont-want-to-be-a-dad.mp3" },
]

function App() {
  // Laulud — liked laaditakse localStorage-ist
  const [laulud, setLaulud] = useState(() => {
    try {
      const savedLiked = localStorage.getItem("sp_liked")
      if (!savedLiked) return LAULUD
      const likedIds = JSON.parse(savedLiked)
      return LAULUD.map(l => ({ ...l, liked: likedIds.includes(l.id) }))
    } catch { return LAULUD }
  })

  const [vaade, setVaade] = useState("kõik")

  // Playlists localStorage-ist
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem("sp_playlists")
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [playlistModal, setPlaylistModal] = useState(false)
  const [valitudLaulud, setValitudLaulud] = useState([])
  const [uusNimi, setUusNimi] = useState("")
  const [lisaOlemasolevasse, setLisaOlemasolevasse] = useState(null)

  // Salvesta playlists
  useEffect(() => {
    localStorage.setItem("sp_playlists", JSON.stringify(playlists))
  }, [playlists])

  // Salvesta liked
  useEffect(() => {
    const likedIds = laulud.filter(l => l.liked).map(l => l.id)
    localStorage.setItem("sp_liked", JSON.stringify(likedIds))
  }, [laulud])

  // Nähtavad laulud vaate järgi
  const nahtavadLaulud = laulud.filter(l => {
    if (vaade === "lemmikud") return l.liked
    if (vaade === "kõik") return true
    if (vaade.startsWith("playlist:")) {
      const id = vaade.replace("playlist:", "")
      const pl = playlists.find(p => p.id === id)
      return pl ? pl.lauludIds.includes(l.id) : false
    }
    if (["rap","trap","hyperpop","lofi"].includes(vaade)) return l.žanr === vaade
    return l.artist === vaade
  })

  function toggleLiked(id) {
    setLaulud(p => p.map(l => l.id === id ? { ...l, liked: !l.liked } : l))
  }

  function avaPlaylistModal() {
    setValitudLaulud([])
    setUusNimi("")
    setLisaOlemasolevasse(null)
    setPlaylistModal(true)
  }

  function toggleValitud(id) {
    setValitudLaulud(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  }

  function looPlaylist() {
    if (!uusNimi.trim() || valitudLaulud.length === 0) return
    setPlaylists(p => [...p, { id: Date.now().toString(), nimi: uusNimi.trim(), lauludIds: valitudLaulud }])
    setPlaylistModal(false)
  }

  function lisaPlaylistisse() {
    if (!lisaOlemasolevasse || valitudLaulud.length === 0) return
    setPlaylists(p => p.map(pl =>
      pl.id === lisaOlemasolevasse
        ? { ...pl, lauludIds: [...new Set([...pl.lauludIds, ...valitudLaulud])] }
        : pl
    ))
    setPlaylistModal(false)
  }

  function kustutaPlaylist(id) {
    setPlaylists(p => p.filter(pl => pl.id !== id))
    if (vaade === `playlist:${id}`) setVaade("kõik")
  }

  return (
    // PlayerProvider annab PlayerContext kõigile lastele
    // useReducer on sees PlayerContext.jsx-is
    <PlayerProvider laulud={laulud} nahtavadLaulud={nahtavadLaulud}>
      <div className="app">
        <Sidebar
          vaade={vaade}
          setVaade={setVaade}
          laulud={laulud}
          playlists={playlists}
          kustutaPlaylist={kustutaPlaylist}
        />

        <MainContent
          laulud={nahtavadLaulud}
          vaade={vaade}
          toggleLiked={toggleLiked}
          avaPlaylistModal={avaPlaylistModal}
        />

        <Player toggleLiked={toggleLiked} />

        {/* Playlist modal */}
        {playlistModal && (
          <div className="modal-overlay" onClick={() => setPlaylistModal(false)}>
            <div className="modal pl-modal" onClick={e => e.stopPropagation()}>
              <h2>Lisa playlistile</h2>
              <div className="pl-song-list">
                {laulud.map(l => (
                  <div
                    key={l.id}
                    className={`pl-song-row ${valitudLaulud.includes(l.id) ? "selected" : ""}`}
                    onClick={() => toggleValitud(l.id)}
                  >
                    <div className="pl-checkbox">{valitudLaulud.includes(l.id) ? "X" : ""}</div>
                    {l.pilt && <img src={l.pilt} alt="" className="pl-song-img" onError={e => e.target.style.display="none"} />}
                    <div>
                      <div className="pl-song-title">{l.pealkiri}</div>
                      <div className="pl-song-artist">{l.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pl-valitud-arv">{valitudLaulud.length} laulu valitud</div>
              <div className="pl-section-title">Loo uus playlist</div>
              <input
                className="pl-input" type="text" placeholder="Playlisti nimi"
                value={uusNimi} onChange={e => setUusNimi(e.target.value)}
                onKeyDown={e => e.key === "Enter" && looPlaylist()}
              />
              <button className="pl-btn-primary" onClick={looPlaylist}>Loo playlist</button>
              {playlists.length > 0 && (
                <>
                  <div className="pl-section-title" style={{ marginTop: 16 }}>Lisa olemasolevasse</div>
                  <div className="pl-existing">
                    {playlists.map(pl => (
                      <div
                        key={pl.id}
                        className={`pl-existing-item ${lisaOlemasolevasse === pl.id ? "selected" : ""}`}
                        onClick={() => setLisaOlemasolevasse(pl.id)}
                      >
                        {pl.nimi} ({pl.lauludIds.length})
                      </div>
                    ))}
                  </div>
                  <button className="pl-btn-secondary" onClick={lisaPlaylistisse}>Lisa valitusse</button>
                </>
              )}
              <button className="pl-btn-cancel" onClick={() => setPlaylistModal(false)}>Sulge</button>
            </div>
          </div>
        )}
      </div>
    </PlayerProvider>
  )
}

export default App