import { useState, useRef, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import Player from "./components/Player"
import "./App.css"

// Kõik laulud — mp3 failid peavad olema public/audio/ kaustas
// Kuidas lisada uus laul:
//   1. Pane mp3 fail public/audio/ kausta, nt public/audio/minu-laul.mp3
//   2. Kopeeri üks objekt altpoolt ja muuda andmed
//   3. audioUrl peab olema "/audio/failinimi.mp3" — täpselt sama mis faili nimi kaustas
const LAULUD = [
  {
    id: 1,
    pealkiri: "Skeletrix Island 3",
    artist: "Edward Skeletrix",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/Skeletrix_Island_3.jpg",
    audioUrl: "/audio/skeletrix-island-3.mp3",
  },
  {
    id: 2,
    pealkiri: "Love U",
    artist: "Edward Skeletrix",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/Love_U.jpg",
    audioUrl: "/audio/love-u.mp3",
  },
  {
    id: 3,
    pealkiri: "G6 Anthem",
    artist: "Lucy Bedroque",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/G6_Anthem.jpg",
    audioUrl: "/audio/g6-anthem.mp3",
  },
  {
    id: 4,
    pealkiri: "2010 Justin Bieber",
    artist: "Lucy Bedroque",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/2010_Justin_Bieber.jpg",
    audioUrl: "/audio/2010-justin-bieber.mp3",
  },
  {
    id: 5,
    pealkiri: "Set In Stone",
    artist: "slayr",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/Set_In_Stone.jpg",
    audioUrl: "/audio/set-in-stone.mp3",
  },
  {
    id: 6,
    pealkiri: "Holding",
    artist: "slayr",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/Holding.jpg",
    audioUrl: "/audio/holding.mp3",
  },
  {
    id: 7,
    pealkiri: "all 2s",
    artist: "2hollis",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/all_2s.jpg",
    audioUrl: "/audio/all-2s.mp3",
  },
  {
    id: 8,
    pealkiri: "two bad",
    artist: "2hollis",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/two_bad.jpg",
    audioUrl: "/audio/two-bad.mp3",
  },
  {
    id: 9,
    pealkiri: "Sides",
    artist: "prettifun",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/Sides.jpg",
    audioUrl: "/audio/sides.mp3",
  },
  {
    id: 10,
    pealkiri: "Digital Love",
    artist: "prettifun",
    žanr: "hiphop",
    liked: false,
    pilt: "/images/Digital_Love.jpg",
    audioUrl: "/audio/digital-love.mp3",
  },
]

function App() {
  const [laulud, setLaulud] = useState(LAULUD)
  const [praeguneId, setPraeguneId] = useState(LAULUD[0].id)
  const [maabib, setMaabib] = useState(false)
  const [vaade, setVaade] = useState("kõik") // "kõik" | "lemmikud" | "hiphop" | "pop" | "alternative"

  const audioRef = useRef(new Audio())

  // Mis laulud on praegu nähtaval (filtri järgi)
  const nahtavadLaulud = laulud.filter(l => {
    if (vaade === "lemmikud") return l.liked
    if (vaade === "kõik") return true
    return l.artist === vaade
  })

  // Leia praeguse laulu indeks nähtavate laulude seas
  const praeguneIndex = nahtavadLaulud.findIndex(l => l.id === praeguneId)
  const praegune = laulud.find(l => l.id === praeguneId)

  // useEffect — laul vahetus, laadi uus audio
  useEffect(() => {
    if (!praegune) return
    const audio = audioRef.current
    audio.src = praegune.audioUrl
    audio.load()
    if (maabib) {
      audio.play().catch(() => {})
    }
  }, [praeguneId])

  // useEffect — play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (maabib) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [maabib])

  // useEffect — laul lõppes, järgmine
  useEffect(() => {
    const audio = audioRef.current
    function handleEnded() {
      const nextIndex = (praeguneIndex + 1) % nahtavadLaulud.length
      setPraeguneId(nahtavadLaulud[nextIndex].id)
      setMaabib(true)
    }
    audio.addEventListener("ended", handleEnded)
    return () => audio.removeEventListener("ended", handleEnded)
  }, [praeguneIndex, nahtavadLaulud])

  // useEffect — lehe pealkiri
  useEffect(() => {
    if (praegune) {
      document.title = `${praegune.pealkiri} — ${praegune.artist}`
    }
  }, [praegune])

  function valiLaul(id) {
    if (id === praeguneId) {
      setMaabib(prev => !prev)
    } else {
      setPraeguneId(id)
      setMaabib(true)
    }
  }

  function togglePlay() {
    setMaabib(prev => !prev)
  }

  function jargmine() {
    if (nahtavadLaulud.length === 0) return
    const next = (praeguneIndex + 1) % nahtavadLaulud.length
    setPraeguneId(nahtavadLaulud[next].id)
    setMaabib(true)
  }

  function eelmine() {
    if (nahtavadLaulud.length === 0) return
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
    } else {
      const prev = (praeguneIndex - 1 + nahtavadLaulud.length) % nahtavadLaulud.length
      setPraeguneId(nahtavadLaulud[prev].id)
    }
    setMaabib(true)
  }

  function toggleLiked(id) {
    setLaulud(prev =>
      prev.map(l => l.id === id ? { ...l, liked: !l.liked } : l)
    )
  }

  return (
    <div className="app">
      <Sidebar vaade={vaade} setVaade={setVaade} laulud={laulud} />

      <MainContent
        laulud={nahtavadLaulud}
        praeguneId={praeguneId}
        maabib={maabib}
        valiLaul={valiLaul}
        toggleLiked={toggleLiked}
        vaade={vaade}
      />

      <Player
        laul={praegune}
        maabib={maabib}
        togglePlay={togglePlay}
        jargmine={jargmine}
        eelmine={eelmine}
        toggleLiked={toggleLiked}
        audioRef={audioRef}
      />
    </div>
  )
}

export default App