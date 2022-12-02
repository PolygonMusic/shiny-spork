const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();
    const MusicLibrary = await hre.ethers.getContractFactory("AuxBlock");
    const musicLibrary = await MusicLibrary.deploy();

    await musicLibrary.deployed();

    const data = {
        address: musicLibrary.address,
        abi: JSON.parse(musicLibrary.interface.format('json'))
    }

    fs.writeFileSync('./MusicLibrary.json', JSON.stringify(data))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });