import { useState, useEffect, useRef } from "react"
import { usePlayer } from "../context/PlayerContext"

function Player({ toggleLiked }) {
  const { praegune, maabib, togglePlay, jargmine, eelmine, audioRef } = usePlayer()

  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [kestus, setKestus] = useState("0:00")
  const [volume, setVolume] = useState(80)
  const [popup, setPopup] = useState(false)
  const timerRef = useRef(null)
  const eelmineId = useRef(undefined)

  // ═══════════════════════════════════════════════
  // MusicBrainz HTTP päring — albumi nimi + aasta
  // Käivitub automaatselt kui laul vahetub
  // ═══════════════════════════════════════════════
  const [albumiInfo, setAlbumiInfo] = useState(null)   // { album, aasta }
  const [albumiLaadib, setAlbumiLaadib] = useState(false)

  useEffect(() => {
    if (!praegune) return

    // Lähtesta eelmine info
    setAlbumiInfo(null)

    const controller = new AbortController() // abort kui laul vahetub enne vastust

    async function fetchAlbumInfo() {
      setAlbumiLaadib(true)
      try {
        // HTTP GET päring MusicBrainz API-le
        // Otsib artisti nime + laulu pealkirja järgi
        const url = `https://musicbrainz.org/ws/2/recording/?query=recording:"${encodeURIComponent(praegune.pealkiri)}" AND artist:"${encodeURIComponent(praegune.artist)}"&fmt=json&limit=1`

        const vastus = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "SoundPlayer/1.0 (school project)" }
        })

        if (!vastus.ok) throw new Error("MusicBrainz päring ebaõnnestus")
        const andmed = await vastus.json()

        const kirje = andmed.recordings?.[0]
        if (kirje) {
          const album = kirje.releases?.[0]?.title ?? null
          const aasta = kirje.releases?.[0]?.date?.slice(0, 4) ?? null
          setAlbumiInfo({ album, aasta })
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          setAlbumiInfo(null)
        }
      } finally {
        setAlbumiLaadib(false)
      }
    }

    fetchAlbumInfo()

    // Cleanup — tühista päring kui laul vahetub
    return () => controller.abort()
  }, [praegune?.id])

  // Audio progress
  useEffect(() => {
    const audio = audioRef.current

    function handleTimeUpdate() {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100)
        const m = Math.floor(audio.currentTime / 60)
        const s = String(Math.floor(audio.currentTime % 60)).padStart(2, "0")
        setCurrentTime(`${m}:${s}`)
      }
    }

    function handleLoadedMetadata() {
      const m = Math.floor(audio.duration / 60)
      const s = String(Math.floor(audio.duration % 60)).padStart(2, "0")
      setKestus(`${m}:${s}`)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  // Popup — ilmub kui laul vahetub
  useEffect(() => {
    if (!praegune) return
    if (eelmineId.current !== praegune.id) {
      eelmineId.current = praegune.id
      clearTimeout(timerRef.current)
      setPopup(true)
      timerRef.current = setTimeout(() => setPopup(false), 3000)
    }
    return () => clearTimeout(timerRef.current)
  }, [praegune])

  function handleProgressClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const protsent = (e.clientX - rect.left) / rect.width
    const audio = audioRef.current
    if (audio.duration) audio.currentTime = protsent * audio.duration
  }

  function handleVolume(e) {
    const val = Number(e.target.value)
    setVolume(val)
    audioRef.current.volume = val / 100
  }

  if (!praegune) return null

  return (
    <footer className="player">
      {/* Vasak — laulu info + MusicBrainz andmed */}
      <div className="player-left">
        {praegune.pilt ? (
          <img className="player-thumb" src={praegune.pilt} alt={praegune.pealkiri}
            onError={e => { e.target.style.display = "none" }} />
        ) : (
          <div className="player-thumb-placeholder">
            {praegune.pealkiri.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div className="player-song-title">{praegune.pealkiri}</div>
          <div className="player-song-artist">{praegune.artist}</div>
          {/* Tingimuslik renderdamine — näita albumi infot kui on */}
          {albumiLaadib && (
            <div className="player-album-info loading">...</div>
          )}
          {!albumiLaadib && albumiInfo && (albumiInfo.album || albumiInfo.aasta) && (
            <div className="player-album-info">
              {albumiInfo.album && <span>{albumiInfo.album}</span>}
              {albumiInfo.album && albumiInfo.aasta && <span className="album-sep"> · </span>}
              {albumiInfo.aasta && <span>{albumiInfo.aasta}</span>}
            </div>
          )}
        </div>
        <button
          className={`player-heart ${praegune.liked ? "liked" : ""}`}
          onClick={() => toggleLiked(praegune.id)}
        >
          {praegune.liked ? "+" : "o"}
        </button>
      </div>

      {/* Kesk */}
      <div className="player-center">
        <div className={`song-popup ${popup ? "visible" : ""}`}>
          {praegune.pilt && (
            <img className="song-popup-img" src={praegune.pilt} alt={praegune.pealkiri}
              onError={e => { e.target.style.display = "none" }} />
          )}
          <div className="song-popup-info">
            <div className="song-popup-now">Praegu mängib</div>
            <div className="song-popup-title">{praegune.pealkiri}</div>
            <div className="song-popup-artist">{praegune.artist}</div>
          </div>
        </div>

        <div className="player-controls">
          <button className="ctrl-btn" onClick={eelmine}>&lt;&lt;</button>
          <button className="play-pause-btn" onClick={togglePlay}>
            {maabib ? "||" : ">"}
          </button>
          <button className="ctrl-btn" onClick={jargmine}>&gt;&gt;</button>
        </div>

        <div className="progress-row">
          <span className="progress-time">{currentTime}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-time">{kestus}</span>
        </div>
      </div>

      {/* Parem */}
      <div className="player-right">
        <div className="volume-wrap">
          <span className="volume-icon">VOL</span>
          <input type="range" className="volume-slider"
            min="0" max="100" value={volume} onChange={handleVolume} />
        </div>
      </div>
    </footer>
  )
}

export default Player