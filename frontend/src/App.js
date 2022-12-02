import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
// import Profile from './components/Profile';
import Upload from './components/upload';
import NFTPage from './components/Musicpage';
// import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="container">
        <Routes>
          <Route path="/" element={<Marketplace />}/>
           <Route path="/nftPage" element={<NFTPage />}/>        
         {/* <Route path="/profile" element={<Profile />}/> */}
          <Route path="/upload" element={<Upload />}/>              
        </Routes>
    </div>
  );
}

export default App;