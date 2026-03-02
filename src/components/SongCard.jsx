// SongCard — üks muusika kaart
// onAktiivne = see laul mängib praegu

function SongCard({ laul, onAktiivne, maabib, onKlõps, onLiked }) {
  return (
    <div
      className={`music-card ${onAktiivne ? "aktiivne" : ""}`}
      onClick={onKlõps}
    >
      <div className="card-img-wrap">
        {laul.pilt ? (
          <img
            className="card-img"
            src={laul.pilt}
            alt={laul.pealkiri}
            onError={(e) => { e.target.style.display = "none" }}
          />
        ) : (
          <div className="card-img-placeholder">
            {laul.pealkiri.slice(0, 2).toUpperCase()}
          </div>
        )}

        {/* Lemmiku nupp */}
        <button
          className={`card-liked ${laul.liked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            onLiked()
          }}
        >
          {laul.liked ? "+" : "o"}
        </button>

        {/* Play/pause nupp — tingimuslik renderdamine */}
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