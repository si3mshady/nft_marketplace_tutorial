const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket deployed to:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

  // npx hardhat node  (will start up a dev blockchain node you can deploy contracts to!)
  // npx hardhat run scripts/deploy.js --network localhost  (this will deploy smart contracts )

  // get contract address for NFTmarket and NFT put those into config.js 


  // temp values 
  // nftMarket deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// nft deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

// Polygon Test network details 
// https://docs.polygon.technology/docs/develop/network-details/network