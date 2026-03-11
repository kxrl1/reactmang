import { createContext, useContext, useReducer, useRef, useEffect, useState } from "react"

// ═══════════════════════════════════════════════
// useContext — globaalne player olek
// Kõik komponendid saavad seda kasutada ilma
// props-e läbi mitme kihi edastamata
// ═══════════════════════════════════════════════

export const PlayerContext = createContext(null)

// ═══════════════════════════════════════════════
// useReducer — player olekute haldus
// Kõik player-iga seotud state muutused käivad
// läbi ühe reducer funktsiooni
// ═══════════════════════════════════════════════

const algOlek = {
  praeguneId: 1,
  maabib: false,
}

function playerReducer(olek, tegevus) {
  switch (tegevus.tüüp) {
    case "VALI_LAUL":
      // Kui sama laul — toggle play/pause, muidu vaheta laul ja käivita
      if (tegevus.id === olek.praeguneId) {
        return { ...olek, maabib: !olek.maabib }
      }
      return { praeguneId: tegevus.id, maabib: true }

    case "TOGGLE_PLAY":
      return { ...olek, maabib: !olek.maabib }

    case "JÄRGMINE":
      return { praeguneId: tegevus.id, maabib: true }

    case "EELMINE":
      return { praeguneId: tegevus.id, maabib: true }

    case "LAUL_LÕPPES":
      return { praeguneId: tegevus.id, maabib: true }

    default:
      return olek
  }
}

// ═══════════════════════════════════════════════
// Provider — mässib kogu rakenduse sisse
// ═══════════════════════════════════════════════

export function PlayerProvider({ children, laulud, nahtavadLaulud }) {
  const [playerOlek, dispatch] = useReducer(playerReducer, algOlek)
  const audioRef = useRef(new Audio())

  const praeguneIndex = nahtavadLaulud.findIndex(l => l.id === playerOlek.praeguneId)
  const praegune = laulud.find(l => l.id === playerOlek.praeguneId)

  // Audio src muutus
  useEffect(() => {
    if (!praegune) return
    const audio = audioRef.current
    audio.src = praegune.audioUrl
    audio.load()
    if (playerOlek.maabib) audio.play().catch(() => {})
  }, [playerOlek.praeguneId])

  // Play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (playerOlek.maabib) audio.play().catch(() => {})
    else audio.pause()
  }, [playerOlek.maabib])

  // Laul lõppes — automaatselt järgmine
  useEffect(() => {
    const audio = audioRef.current
    function handleEnded() {
      if (!nahtavadLaulud.length) return
      const next = nahtavadLaulud[(praeguneIndex + 1) % nahtavadLaulud.length]
      dispatch({ tüüp: "LAUL_LÕPPES", id: next.id })
    }
    audio.addEventListener("ended", handleEnded)
    return () => audio.removeEventListener("ended", handleEnded)
  }, [praeguneIndex, nahtavadLaulud])

  // Dokumendi pealkiri
  useEffect(() => {
    if (praegune) document.title = `${praegune.pealkiri} — ${praegune.artist}`
  }, [praegune])

  function valiLaul(id) {
    dispatch({ tüüp: "VALI_LAUL", id })
  }

  function togglePlay() {
    dispatch({ tüüp: "TOGGLE_PLAY" })
  }

  function jargmine() {
    if (!nahtavadLaulud.length) return
    const next = nahtavadLaulud[(praeguneIndex + 1) % nahtavadLaulud.length]
    dispatch({ tüüp: "JÄRGMINE", id: next.id })
  }

  function eelmine() {
    if (!nahtavadLaulud.length) return
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
    } else {
      const prev = nahtavadLaulud[(praeguneIndex - 1 + nahtavadLaulud.length) % nahtavadLaulud.length]
      dispatch({ tüüp: "EELMINE", id: prev.id })
    }
  }

  return (
    <PlayerContext.Provider value={{
      praeguneId: playerOlek.praeguneId,
      maabib: playerOlek.maabib,
      praegune,
      audioRef,
      valiLaul,
      togglePlay,
      jargmine,
      eelmine,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

// Mugav hook — komponendid kasutavad seda PlayerContext asemel otse
export function usePlayer() {
  return useContext(PlayerContext)
}