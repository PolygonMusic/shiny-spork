import Navbar from "./Navbar";
import MusicTile from "./MusicTile";
import MusicLibraryJSON from "../components/MusicLibrary.json";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Alchemy's First NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    // {
    //     "name": "NFT#2",
    //     "description": "Alchemy's Second NFT",
    //     "website":"http://axieinfinity.io",
    //     "image":"https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
    //     "price":"0.03ETH",
    //     "currentlySelling":"True",
    //     "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    // },
    // {
    //     "name": "NFT#3",
    //     "description": "Alchemy's Third NFT",
    //     "website":"http://axieinfinity.io",
    //     "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
    //     "price":"0.03ETH",
    //     "currentlySelling":"True",
    //     "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    // },
];
const [data, updateData] = useState([]);
const [dataFetched, updateFetched] = useState(false);


async function getAllMusic() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MusicLibraryJSON.address, MusicLibraryJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllMusic()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        // console.log('see', meta)
        // let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            // price,
            tokenId: i.tokenId.toNumber(),
            creator: i.creator,
            owner: i.owner,
            image: meta.image,
            artistName: meta.artistName,
            copyRight: meta.copyRight,
            song: meta.song,
            genre: meta.genre,
            songTitle: meta.songTitle,

        }
        return item;
    }))

    updateFetched(true);
    updateData(items);  
}

if(!dataFetched)
    getAllMusic();
    console.log('see data', data);
return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                New Releases
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <MusicTile data={value} key={index}></MusicTile>;
                })}
            </div>
            
            <div>
            </div>
        </div>            
    </div>
);

}