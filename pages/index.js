import Head from 'next/head'
import Image from 'next/image'
import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal' // connect to other wallets 
import styles from '../styles/Home.module.css'
import {nftaddress, nftmarketaddress} from '../config'

//when contracts are compiled, they create artifacts (ABI which have data for the contact to reference in client app
//ABI is a json version of smart contract which is located in artifacts 
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

let rpcEndpoint = null

export default function Home() {
  const [nfts,setNfts] = useState([]) //empty array of nfts 
  const [loadingState, setLoadingState] = useState('not-loaded') 

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
    const nftTokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
    // call token contract to get token URI
    const tokenUri = await nftTokenContract.tokenURI(i.tokenId)
    const metadata = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description
    }

    return item

    }))

    setNfts(items)
    setLoadingState('loaded')
  }


async function buyNft(nft) {
// allows user to connect to wallet. Will use Web3Modal 
// this function looks for an instance of the etherem in web browser

const web3Modal = new Web3Modal()
const connection = await web3Modal.connect()
const provider = new ethers.providers.Web3Provider(connection)

// create a sign and execute a transaction 
const signer = provider.getSigner()
const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

// get ref to price = comes in as an argument from nft
const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
  value: price
})

// a way to ensure the transaction has been executed.
// in this case we will reload the screen
await transaction.wait()
loadNFTS()

}



  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>
  )


  return (
    <div className="flex justify-center">

      <div className="px-4" style={{maxWidth: '1600px'}}>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">

              {nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                  <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
              ) )}

        </div>

      </div>
  
    </div>
  )
}
