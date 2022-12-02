//SPDX-License-Identifier: MIT

pragma solidity  0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract AuxBlock is ERC721URIStorage {

    address owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsAddedToLibrary;

    struct MusicListed {
        uint256 tokenId;
        address owner;
        address creator; // Artist
        bool onLibrary;
    }

      event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address creator,
        bool onLibrary
    );

    mapping(uint256 => MusicListed) private idToMusicListed;

     constructor() ERC721("AuxBlock", "AUX") {
        owner = (msg.sender);
    }

    function getLatestIdToMusicListed() public view returns (MusicListed memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToMusicListed[currentTokenId];
    }

    function getMusicMusicListedId(uint256 tokenId) public view returns (MusicListed memory) {
        return idToMusicListed[tokenId];
    }

    function getCurrentToken() public view returns (uint256){
        return _tokenIds.current();
    }


    
// change create token to something more music like later
    function uploadMusic(string memory tokenURI) public payable returns (uint) {
        _tokenIds.increment();
        uint256 currentTokenId = _tokenIds.current();
        _safeMint(msg.sender,  currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);
        createMusicList(currentTokenId);
        return currentTokenId;
    }

    function createMusicList(uint256 tokenId) private {
        idToMusicListed[tokenId] = MusicListed(
            tokenId,
            address(this), //not sure..
            msg.sender, // not sure..
            true
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    function getAllMusic() public view returns (MusicListed[] memory) {
        uint nftCount = _tokenIds.current();
        MusicListed[] memory tokens = new MusicListed[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        
        for(uint i=0;i<nftCount;i++)
        {
            currentId = i + 1;
            MusicListed storage currentItem = idToMusicListed[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }

        return tokens;
    }

    // Add to library and get my music functions will be from ipfs :)
}
