import './App.css';
import MusicFooter from './components/musicFooter'
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Upload from './components/upload';
import NFTPage from './components/Musicpage';
import Wallet from './components/wallet';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/nftPage" element={<NFTPage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/" element={<Marketplace />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/nftPage/:tokenId" element={<NFTPage />} />
        {/* <Route path="/wallet" element={<Wallet />} /> */}
      </Routes>
{/* <MusicFooter></MusicFooter> */}
    </BrowserRouter>
  );
}

export default App;