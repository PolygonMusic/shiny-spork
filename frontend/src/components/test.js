import React , { useState , useEffect , Fragment } from 'react';
import {Link} from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel  } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CardModal from '../CardModal';
import MarketplaceJSON from "../../../Marketplace.json";
import axios from "axios";

const TodayPicks = () => {
    const [dataTab] = useState(
        [
            {
                id: 1,
                title: "All",
            },
        ]
    )

    const [visible , setVisible] = useState(8);
    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    }

    const [modalShow, setModalShow] = useState(false);
    const [data, updateData] = useState();
    const [dataFetched, updateFetched] = useState(false);

    async function getAllNFTs() {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getAllNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);
    }

    if(!dataFetched)
        getAllNFTs();
        console.log(data);

    return (
        <Fragment>
            <div className="tf-section sc-explore-2">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="seclect-box style3">
                                <div id="artworks" className="dropdown">
                                    <Link to="#" className="btn-selector nolink">All Artworks</Link>
                                    <ul>
                                        <li><span>Abstraction</span></li>
                                        <li className="active"><span>Skecthify</span></li>
                                        <li><span>Patternlicious</span></li>
                                        <li><span>Virtuland</span></li>
                                        <li><span>Papercut</span></li>
                                    </ul>
                                </div>
                                <div id="sort-by" className="dropdown style-2">
                                    <Link to="#" className="btn-selector nolink">Sort by</Link>
                                    <ul>
                                        <li><span>Top rate</span></li>
                                        <li className="active"><span>Mid rate</span></li>
                                        <li><span>Low rate</span></li>
                                    </ul>
                                </div>    
                            </div>
                            <div className="flat-tabs explore-tab">
                                <Tabs >
                                    <TabList>
                                        {
                                            dataTab.map(data=> (
                                                <Tab key={data.id} >{data.title}</Tab>
                                            ))
                                        }
                                    </TabList>
                                    {
                                        data.map(data =>(
                                            <TabPanel key={data.tokenId}>
                                                {
                                                    <div key={data.tokenId} className={`sc-card-product explode style2 mg-bt ${item.feature ? 'comingsoon' : '' } `}>                               
                                                        <div className="card-media">data
                                                            <Link to="/item-details-01"><img src={item.img} alt="Axies" /></Link>
                                                            <div className="button-place-bid">
                                                                <button onClick={() => setModalShow(true)} className="sc-button style-place-bid style bag fl-button pri-3"><span>Place Bid</span></button>
                                                            </div>
                                                            <Link to="/login" className="wishlist-button heart"><span className="number-like">{item.wishlist}</span></Link>
                                                            <div className="coming-soon">{data.feature}</div>
                                                        </div>
                                                        <div className="card-title">
                                                            <h5><Link to="/item-details-01">"{data.title}"</Link></h5>
                                                            
                                                        </div>
                                                        <div className="meta-info">
                                                            <div className="author">
                                                                <div className="avatar">
                                                                    <img src={data.imgAuthor} alt="Axies" />
                                                                </div>
                                                                <div className="info">
                                                                    <span>Creator</span>
                                                                    <h6> <Link to="/authors-02">{data.nameAuthor}</Link> </h6>
                                                                </div>
                                                            </div>
                                                            <div className="tags">{data.tags}</div>
                                                        </div>
                                                        <div className="card-bottom style-explode">
                                                            <div className="price">
                                                                <span>Current Bid</span>
                                                                <div className="price-details">
                                                                    <h5>{data.price}</h5>
                                                                    <span>= {data.priceChange}</span>
                                                                </div>
                                                            </div>
                                                            <Link to="/activity-01" className="view-history reload">View History</Link>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    visible < data.length && 
                                                    <div className="col-md-12 wrap-inner load-more text-center"> 
                                                        <Link to="#" id="load-more" className="sc-button loadmore fl-button pri-3" onClick={showMoreItems}><span>Load More</span></Link>
                                                    </div>
                                                }
                                            </TabPanel>
                                        ))
                                    }
                                </Tabs>
                            </div> 
                        </div>   
                    </div>
                </div>
            </div>
            <CardModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Fragment>
    );
}

export default TodayPicks;