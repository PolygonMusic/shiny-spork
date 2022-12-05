import './style.css';
// import fullLogo from '../full_logo.png';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Button } from '@chakra-ui/react';
import Logo from '../image/auxblock.svg';


function Navbar() {

  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
    toggleConnect(true)
  }
const ethers = require("ethers");
console.log('huh',currAddress)


// console.log('addy',addy )
  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x13881') {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      })
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname)
      });
  }
  
  // useEffect(() => {
  //   const val = window.ethereum.isConnected();
  //   if (val) {
  //     console.log("here");
  //     getAddress();
  //     toggleConnect(val);
  //     updateButton();
  //   }

  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     window.location.replace(location.pathname)
  //   })
  // });
  useEffect(() =>{
    getAddress()
  })

  return (
    <div className="flex justify-between items-center bg-blueish  p-4 w-full border-b-4 border-purple sticky top-0 z-50" >
      <nav className="">
        <ul className='flex gap-2 items-center'>
          <li className=''>
            <Link to="/">
              <div className='text-xl font-bold text-white ml-8'>
                <img src={Logo}/>
              </div>
            </Link>
          </li>
          <li className=''>
            <ul className='flex gap-2 items-center ml-20'>
              {/* {location.pathname === "/" ?
                <li className=''>
                  <Link to="/">Home</Link>
                </li>
                :
                <li className=''>
                  <Link to="/">Marketplace</Link>
                </li>
              } */}
              {location.pathname === "/sellNFT" ?
                <li className=''>
                  <Button>
                    <Link to="/upload">Upload Music</Link>
                  </Button>
                </li>
                :
                <li className='text-white'>
                  <Button variant={"outline"}>
                    <Link to="/upload">Upload Music</Link>
                  </Button>
                </li>
              }
              <li>
                <Button colorScheme={"purple"} className="enableEthereumButton" onClick={connectWebsite}>{connected ? "Connected" : "Connect Wallet"}</Button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='mr-9 text-m text-white font-bold font-Space '>
      {/* {currAddress} */}
        {currAddress !== "0x" ? "GM Chief" : "Not Connected. Please connect wallet"} {currAddress !== "0x" ? (currAddress.substring(0, 15) + '...') : ""}
      </div>
    </div>
  );
}

export default Navbar;