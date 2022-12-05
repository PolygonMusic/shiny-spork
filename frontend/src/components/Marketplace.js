import Navbar from "./Navbar";
import MusicTile from "./MusicTile";
import MusicLibraryJSON from "../components/MusicLibrary.json";
import axios from "axios";
import { useState, useEffect } from "react";
import MusicFooter from "./musicFooter";

export default function Marketplace() {

    const trend = [
        {
            "artistName": "Taylor Swift",
            "song": "https://gateway.pinata.cloud/ipfs/QmUyqMayqTN5KSXNR2Abc9snCNTeXmRSS9VzhVsE1qMBbj",
            "copyRight": "@ 2014 Taylor Swift",
            "songTitle":"1989",
            "image":"https://i.ibb.co/FgQcRhs/50-Taylor-Swift-1989-2014-album-art-billboard-1240.webp",
            "genre":"RnB",
            "owner":"Taylor",
            "creator":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "artistName": "Young Thug",
            "song": "https://gateway.pinata.cloud/ipfs/QmUyqMayqTN5KSXNR2Abc9snCNTeXmRSS9VzhVsE1qMBbj",
            "copyRight": "@ 2016",
            "songTitle":"Jeffery",
            "image":"https://i.ibb.co/4Ws9h3z/Young-Thug-Jeffery-2016-billboard-1240.webp",
            "genre":"Rap",
            "owner":"Young Thug",
            "creator":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "artistName": "Lady Gaga",
            "song": "https://gateway.pinata.cloud/ipfs/QmUyqMayqTN5KSXNR2Abc9snCNTeXmRSS9VzhVsE1qMBbj",
            "copyRight": "@ 2009 Lady Gaga",
            "songTitle":"The Fame Monster",
            "image":"https://i.ibb.co/vHNJG43/48-Lady-Gaga-The-Fame-Monster-2009-album-art-billboard-1240.webp",
            "genre":"RnB",
            "owner":"Lady Gaga",
            "creator":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "artistName": "Janet Jackson",
            "song": "https://gateway.pinata.cloud/ipfs/QmUyqMayqTN5KSXNR2Abc9snCNTeXmRSS9VzhVsE1qMBbj",
            "copyRight": "@ 1989 Janet Jacson",
            "songTitle":"Rhythm Nation",
            "image":"https://i.ibb.co/T80xSgc/47-Janet-Jackson-Rhythm-Nation-1814-1989-album-at-billboard-1240.jpg",
            "genre":"RnB",
            "owner":"Janet Jackson",
            "creator":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        
        {
            "artistName": "Fukadelic",
            "song": "https://gateway.pinata.cloud/ipfs/QmUyqMayqTN5KSXNR2Abc9snCNTeXmRSS9VzhVsE1qMBbj",
            "copyRight": "@ 1971 Funkadelic",
            "songTitle":"Maggot Brian",
            "image":"https://i.ibb.co/1ZH4ChH/46-Funkadelic-Maggot-Brain-1971-album-art-billboard-1240.webp",
            "genre":"RnB",
            "owner":"Funkadelic",
            "creator":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "artistName": "Cardi B",
            "song": "https://gateway.pinata.cloud/ipfs/QmUyqMayqTN5KSXNR2Abc9snCNTeXmRSS9VzhVsE1qMBbj",
            "copyRight": "@ 2018 Cardi B",
            "songTitle":"Invasion of Privacy",
            "image":"https://i.ibb.co/m02vVZj/cardi-b-invasion-of-privacy-album-art-2018-billboard-embed.webp",
            "genre":"RnB",
            "owner":"Cardi B",
            "creator":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
    ];    

const [data, updateData] = useState(trend);
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
        <div className="flex flex-col place-items-center bg-blueish" style={{backgroundImage: "url('https://i.ibb.co/09bQL63/galaxy-1.jpg'),linear-gradient(#0D0636)",opacity:"1"}}>
        <div className="md:text-9xl font-bold text-white items-start mt-10 font-Space">
               Decentralized music <br></br>
               streaming app.
            </div>
            <div className="flex place-items-end text-3xl font-bold text-white mt-10 font-Space">
               New releases
            </div>
            <div className="flex mt-5 justify-center flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <MusicTile data={value} key={index}></MusicTile>;
                })}
            </div>
            
            <div>
            </div>
        </div> 
        {/* <MusicFooter></MusicFooter>            */}
    </div>
);

}