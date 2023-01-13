import { useEffect, useState } from 'react';
import React from "react";
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Card, Text, Button } from '@nextui-org/react';
import { nftContract, displayAmount } from './settings';

const apiKey = "Eu4bs9pBYo1aUL244GHr31NEVHvZz0w1"
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
const ownerAddr = "0x4c16b1A11B51E218673e9dF375AEC72DC63742bD";
const fetchURL = `${baseURL}?owner=${ownerAddr}`;

const options = {
  method: 'GET',
  url: fetchURL,
  params: {omitMetadata: 'false', contractAddresses: [nftContract]},
  headers: {accept: 'application/json'}
};

export default function NftPuller() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    generateNft();
    }, [setNfts])
    
  async function generateNft() {
    const itemArray = [];
    axios
      .request(options)
      .then(function (response) {
        for (let i = 0; i < displayAmount; i++) {
          const metadata = response.data.ownedNfts[i].metadata;
          console.log("image", metadata.image);
          let imageURL = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
          metadata.image = imageURL;
          console.log(metadata)
          itemArray.push(metadata)
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    await new Promise(r => setTimeout(r, 5000));
    setNfts(itemArray)
    setLoadingState('loaded');
  }

if (loadingState === 'loaded' && !nfts.length)

    return (
      <div >
        {
        nfts.map((nft, i) => {
          <div>
          <Card.Image src={nft.image} key={i}/>
        <h2>No Collections Retrieved</h2>
        </div>
})}
      </div>
    )
    return (
      <>
        <Carousel>
          {nfts.map((nft, i) => {
              return (
                  <div>
                    <Card isHoverable key={i} css={{ width: "100%", marginRight: '$1', boxShadow:'0px 2px 12px #000000' }} variant="bordered">
                      <Card.Image src={nft.image}/>
                      <Card.Body md css={{background:"#0c90bf"}}>
                      <Text css={{color:'$black'}} h6>{nft.name}</Text>
                      </Card.Body>
                    </Card>
                  </div>
              )
            })}
        </Carousel>
        <Button css={{marginLeft: '$10'}}>Select NFT</Button>
      </>
    )
}
