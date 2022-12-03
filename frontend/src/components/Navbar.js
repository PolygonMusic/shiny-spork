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
  }

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
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
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

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.replace(location.pathname)
    })
  });

  return (
    <div className="flex justify-between items-center bg-blue-300  p-2 w-full">
      <nav className="">
        <ul className='flex gap-2 items-center'>
          <li className=''>
            <Link to="/">
              <div className='text-xl font-bold'>
                AuxBlock
              </div>
            </Link>
          </li>
          <li className=''>
            <ul className='flex mx-auto gap-2 items-center'>
              {location.pathname === "/" ?
                <li className=''>
                  <Link to="/">Home</Link>
                </li>
                :
                <li className=''>
                  <Link to="/">Marketplace</Link>
                </li>
              }
              {location.pathname === "/sellNFT" ?
                <li className=''>
                  <Button>
                    <Link to="/upload">Upload Music</Link>
                  </Button>
                </li>
                :
                <li className=''>
                  <Button variant={"outline"}>
                    <Link to="/upload">Upload Music</Link>
                  </Button>
                </li>
              }
              <li>
                <Button colorScheme={"purple"} className="" onClick={connectWebsite}>{connected ? "Connected" : "Connect Wallet"}</Button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='ml-2 text-sm'>
        {currAddress !== "0x" ? "Connected to" : "Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0, 15) + '...') : ""}
      </div>
    </div>
  );
}

export default Navbar;