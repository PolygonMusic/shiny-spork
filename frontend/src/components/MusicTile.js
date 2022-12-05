import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom";

function MusicTile (data) {
    const newTo = {
        pathname:"/nftPage/"+data.data.tokenId
    }
    return (
        <Link to={newTo}>
        <div className="ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
            <img src={data.data.image} alt="image" className="w-72 h-80 rounded-lg object-cover" />
            <strong className="text-sm text-[#9747FF]">{data.data.songTitle}</strong>
            <p className="text-sm text-[#9747FF]">
                    {data.data.artistName}
                </p>
        </div>
        </Link>
    )
}

export default MusicTile;