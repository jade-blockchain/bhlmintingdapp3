import { useEffect, useState } from 'react';
import React from "react";
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Card, Text, Button } from '@nextui-org/react';
import { nftContract, displayAmount, baseURL } from './settings';



export default function NftPuller(wallet) {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const ownerAddr = wallet.wallet;
  const fetchURL = `${baseURL}?owner=${ownerAddr}`;



  const options = {
    method: 'GET',
    url: fetchURL,
    params: {omitMetadata: 'false', contractAddresses: [nftContract]},
    headers: {accept: 'application/json'}
  };
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
          let imageURL = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
          metadata.image = imageURL;
          itemArray.push(metadata)
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    await new Promise(r => setTimeout(r, 5000));
    console.log("itemArray", itemArray)
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
