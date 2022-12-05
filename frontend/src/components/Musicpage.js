import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MusicLibrary from "./MusicLibrary.json";
import axios from "axios";
import { useState } from "react";
import MusicFooter from "./musicFooter";

export default function NFTPage (props) {

const [data, updateData] = useState({});
const [dataFetched, updateDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MusicLibrary.address, MusicLibrary.abi, signer)
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getMusicMusicListedId(tokenId);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
            tokenId: tokenId,
            creator: listedToken.creator,
            owner: listedToken.owner,
            image: meta.image,
            artistName: meta.artistName,
            copyRight: meta.copyRight,
            song: meta.song,
            genre: meta.genre,
            songTitle: meta.songTitle,
    }
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MusicLibrary.address, MusicLibrary.abi, signer);
        const salePrice = ethers.utils.parseUnits(data.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);
       console.log('show',data)
    return(
        <div className="bg-blueish"
       //  style={{"min-height":"100vh"}}
         >
            <Navbar></Navbar>
            <div className="flex mt-20 flex-col items-center bg-blueish ">
            <div className=" mt-10 flex h-96 w-96  items-center">
            <img src={data.image} alt="image" className="w-96 h-96 rounded-lg object-cover" />
            </div>
                <div className="mt-20 mr-30">
                    <div className="text-xl mt-0 text-white font-Space font-bold">
                     {data.artistName} -- {data.songTitle}
                    </div>
                    <div className="text-base mt-0 text-white font-Space font-bold">
                      {data.genre}
                    </div>
                    <div className="text-xs mt-0 text-white font-Space font-bold">
                       {data.copyRight}
                    </div>
                    <div>
                    {/* { currAddress == data.owner || currAddress == data.creator ?
                        <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                        : <div className="text-emerald-700">You are the owner of this NFT</div>
                    } */}
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
            <MusicFooter data={data.song}></MusicFooter>   
        </div>
    )
}