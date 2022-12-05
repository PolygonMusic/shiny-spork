import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS, sendFileToIPFS } from "./pinata";
import MusicLibrary from '../components/MusicLibrary.json';
import { useLocation } from "react-router";
import {
    Heading, Button, FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    VStack,
    Input,
    Textarea
} from "@chakra-ui/react";

export default function SellNFT() {
    const [formParams, updateFormParams] = useState({ artistName: '', genre: '', songTitle: '', copyRight: '' });
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
            if (response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch (e) {
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
            if (response.success === true) {
                console.log("Uploaded song to Pinata: ", response.pinataURL)
                setSongFileURL(response.pinataURL);
            }
        }
        catch (e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { artistName, genre, songTitle, copyRight } = formParams;
        //Make sure that none of the fields are empty
        if (!artistName || !genre || !songTitle || !copyRight || !fileURL || !songFileURl)
            return;

        const nftJSON = {
            artistName, genre, songTitle, copyRight, image: fileURL, song: songFileURl
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listMusic(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (might take a while)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(MusicLibrary.address, MusicLibrary.abi, signer)

            //massage the params to be sent to the create NFT request
            // const price = ethers.utils.parseUnits(formParams.price, 'ether')
            // let listingPrice = await contract.getListPrice()
            // listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.uploadMusic(metadataURL)
            await transaction.wait()

            alert("Successfully listed your Song!");
            updateMessage("");
            updateFormParams({ artistName: '', genre: '', songTitle: '', copyRight: '' });
            window.location.replace("").refresh();
        }
        catch (e) {
            alert("Upload error" + e)
        }
    }

    console.log("Working", process.env);
    return (
        <div className="">
            <Navbar />
            <div className="flex bg-white shadow-md w-fit mx-auto my-4" id="">
                <form className="flex flex-col p-4">
                    <Heading>Upload your song to AuxBlock</Heading>
                    <VStack>
                        <FormControl isRequired>
                            <FormLabel htmlFor="Artist">Artist</FormLabel>
                            <Input className="" id="" type="text" placeholder="Arists"
                                onChange={e => updateFormParams({ ...formParams, artistName: e.target.value })} value={formParams.artistName} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Song Title</FormLabel>
                            <Input className="" id="" type="text" placeholder="Song Title"
                                onChange={e => updateFormParams({ ...formParams, songTitle: e.target.value })} value={formParams.songTitle} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Genre</FormLabel>
                            <Input className="" id="" type="text" placeholder="Genre"
                                onChange={e => updateFormParams({ ...formParams, genre: e.target.value })} value={formParams.genre} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Copy Right Text</FormLabel>
                            <Textarea className="" id="" type="text" row="8" placeholder="copy right"
                                value={formParams.description}
                                onChange={e => updateFormParams({ ...formParams, copyRight: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Upload Music Cover</FormLabel>
                            <Input type={"file"} onChange={OnChangeFile} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Upload Song</FormLabel>
                            <Input type={"file"} onChange={OnChangeSongFile} />
                        </FormControl>
                    </VStack>

                    <div className="tr">{message}</div>
                    <Button className="my-4" colorScheme={"purple"} onClick={listMusic}>
                        Upload Music
                    </Button>
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