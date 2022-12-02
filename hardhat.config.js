require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "mumbai",
    solidity: '0.8.17',
    networks: {
        hardhat: {},
        mumbai: {
            url: 'https://rpc-mumbai.maticvigil.com',
            accounts: [''],
        },
    },
};