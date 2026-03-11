import { usePlayer } from "../context/PlayerContext"

// SongCard loeb player oleku usePlayer() hookist (useContext)
// praeguneId ja maabib ei tule enam propsina

function SongCard({ laul, onLiked }) {
  const { praeguneId, maabib, valiLaul } = usePlayer()
  const onAktiivne = laul.id === praeguneId

  return (
    <div
      className={`music-card ${onAktiivne ? "aktiivne" : ""}`}
      onClick={() => valiLaul(laul.id)}
    >
      <div className="card-img-wrap">
        {laul.pilt ? (
          <img className="card-img" src={laul.pilt} alt={laul.pealkiri}
            onError={e => { e.target.style.display = "none" }} />
        ) : (
          <div className="card-img-placeholder">
            {laul.pealkiri.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="card-genre">{laul.žanr}</div>

        <button
          className={`card-liked ${laul.liked ? "liked" : ""}`}
          onClick={e => { e.stopPropagation(); onLiked() }}
        >
          {laul.liked ? "+" : "o"}
        </button>

        <button className="card-play-btn">
          {onAktiivne && maabib ? "||" : ">"}
        </button>
      </div>

      <div className="card-info">
        <div className="card-title">{laul.pealkiri}</div>
        <div className="card-artist">{laul.artist}</div>
      </div>
    </div>
  )
}

export default SongCard