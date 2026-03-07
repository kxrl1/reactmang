import { useState, useEffect, useRef } from "react"

function Player({ laul, maabib, togglePlay, jargmine, eelmine, toggleLiked, audioRef }) {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [kestus, setKestus] = useState("0:00")
  const [volume, setVolume] = useState(80)
  const [popup, setPopup] = useState(false)
  const timerRef = useRef(null)
  const eelmineId = useRef(undefined) // undefined = pole veel ühtegi laulu näidatud

  // useEffect — audio progress
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

  // useEffect — laul vahetus, näita popup-i
  // Töötab KA esimesel laulul sest eelmineId algab undefined-ina
  useEffect(() => {
    if (!laul) return
    if (eelmineId.current !== laul.id) {
      eelmineId.current = laul.id

      // Tühista eelmine timer kui on
      clearTimeout(timerRef.current)

      // Näita popup-i
      setPopup(true)

      // Peida 3 sekundi pärast
      timerRef.current = setTimeout(() => setPopup(false), 3000)
    }

    return () => clearTimeout(timerRef.current)
  }, [laul])

  function handleProgressClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const protsent = (e.clientX - rect.left) / rect.width
    const audio = audioRef.current
    if (audio.duration) {
      audio.currentTime = protsent * audio.duration
    }
  }

  function handleVolume(e) {
    const val = Number(e.target.value)
    setVolume(val)
    audioRef.current.volume = val / 100
  }

  if (!laul) return null

  return (
    <footer className="player">

      {/* Vasak */}
      <div className="player-left">
        {laul.pilt ? (
          <img
            className="player-thumb"
            src={laul.pilt}
            alt={laul.pealkiri}
            onError={(e) => { e.target.style.display = "none" }}
          />
        ) : (
          <div className="player-thumb-placeholder">
            {laul.pealkiri.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div className="player-song-title">{laul.pealkiri}</div>
          <div className="player-song-artist">{laul.artist}</div>
        </div>
        <button
          className={`player-heart ${laul.liked ? "liked" : ""}`}
          onClick={() => toggleLiked(laul.id)}
        >
          {laul.liked ? "+" : "o"}
        </button>
      </div>

      {/* Kesk */}
      <div className="player-center">

        {/* Popup — ilmub play nupu kohale */}
        <div className={`song-popup ${popup ? "visible" : ""}`}>
          {laul.pilt && (
            <img
              className="song-popup-img"
              src={laul.pilt}
              alt={laul.pealkiri}
              onError={(e) => { e.target.style.display = "none" }}
            />
          )}
          <div className="song-popup-info">
            <div className="song-popup-now">Praegu mängib</div>
            <div className="song-popup-title">{laul.pealkiri}</div>
            <div className="song-popup-artist">{laul.artist}</div>
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
          <input
            type="range"
            className="volume-slider"
            min="0" max="100"
            value={volume}
            onChange={handleVolume}
          />
        </div>
      </div>

    </footer>
  )
}

export default Player