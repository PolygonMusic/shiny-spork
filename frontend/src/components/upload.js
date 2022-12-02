import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS, sendFileToIPFS } from "./pinata";
import MusicLibrary from '../components/MusicLibrary.json';
import { useLocation } from "react-router";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({ artistName: '', genre:'', songTitle:'', copyRight:''});
    const [fileURL, setFileURL] = useState(null);
    const [songFileURl, setSongFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }
     //This function uploads the song to IPFS
     async function OnChangeSongFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded song to Pinata: ", response.pinataURL)
                setSongFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {artistName, genre, songTitle, copyRight} = formParams;
        //Make sure that none of the fields are empty
        if( !artistName || !genre || !songTitle || !copyRight || !fileURL || !songFileURl)
            return;

        const nftJSON = {
            artistName, genre, songTitle, copyRight, image: fileURL, song: songFileURl
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(MusicLibrary.address, MusicLibrary.abi, signer)

            //massage the params to be sent to the create NFT request
            // const price = ethers.utils.parseUnits(formParams.price, 'ether')
            // let listingPrice = await contract.getListPrice()
            // listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.uploadMusic(metadataURL)
            await transaction.wait()

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ artistName: '', genre:'', songTitle:'', copyRight:''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    console.log("Working", process.env);
    return (
        <div className="">
        <Navbar></Navbar>
        <div className="" id="">
            <form className="">
            <h3 className="">Upload your song to AuxBlock</h3>
                <div className="">
                    <label className="" htmlFor="Artist">Artist</label>
                    <input className="" id="" type="text" placeholder="Arists" 
                    onChange={e => updateFormParams({...formParams, artistName: e.target.value})} value={formParams.artistName}></input>
                </div>
                <div className="">
                    <label className="">Song title</label>
                    <input className="" id="" type="text" placeholder="Song Title" 
                    onChange={e => updateFormParams({...formParams, songTitle: e.target.value})} value={formParams.songTitle}></input>
                </div>
                <div className="">
                    <label className="">Genre</label>
                    <input className="" id="" type="text" placeholder="Genre" 
                    onChange={e => updateFormParams({...formParams, genre: e.target.value})} value={formParams.genre}></input>
                </div>
                <div className="mb-6">
                    <label className="">Copy Right Text</label>
                    <textarea className="" cols="40" rows="5" id="" type="text" placeholder="copy right" 
                    value={formParams.description} 
                    onChange={e => updateFormParams({...formParams, copyRight: e.target.value})}>       
                    </textarea>
                </div>
                {/* <div className="mb-6">
                    <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                </div> */}
                <div>
                    <label className="">Upload Image</label>
                    <input type={"file"} onChange={OnChangeFile}></input>
                </div>
                <div>
                    <label className="" >Upload Song</label>
                    <input type={"file"} onChange={OnChangeSongFile}></input>
                </div>
                <br></br>
                <div className="tr">{message}</div>
                <button onClick={listNFT} className="">
                    Upload Music
                </button>
            </form>
        </div>
        </div>
    )
}



// Fields to add :
//title
// Artiste name 
// Genre ://
// Copy right

// file mp3 file
//and img file