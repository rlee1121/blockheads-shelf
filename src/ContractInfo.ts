export const address =
  window.location.hostname === "shelf.blockheads.family"
    ? "0x28812EC6E46C3e5093DE25E954a026ff99a57D53"
    : "0x5562738f84fe3cbb242d83159905379eab180619";

export const ABI = [
  "function nextTokenId() public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function getBgData(uint256 tokenId) public view returns (bytes memory)",
  "function getBodyData(uint256 tokenId) public view returns (bytes memory)",
  "function getArmsData(uint256 tokenId) public view returns (bytes memory)",
  "function getHeadData(uint256 tokenId) public view returns (bytes memory)",
  "function getFaceData(uint256 tokenId) public view returns (bytes memory)",
  "function getHeadwearData(uint256 tokenId) public view returns (bytes memory)",
  "function getBgLabel(uint256 tokenId) public view returns (string memory)",
  "function getBodyLabel(uint256 tokenId) public view returns (string memory)",
  "function getArmsLabel(uint256 tokenId) public view returns (string memory)",
  "function getHeadLabel(uint256 tokenId) public view returns (string memory)",
  "function getFaceLabel(uint256 tokenId) public view returns (string memory)",
  "function getHeadwearLabel(uint256 tokenId) public view returns (string memory)",
  "function swapParts(uint256 token1, uint256 token2, bool background, bool body, bool arms, bool heads, bool faces, bool headwear)",
];
