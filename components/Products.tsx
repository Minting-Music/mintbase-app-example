import { useEffect, useLayoutEffect, useState } from 'react'

import { useWallet } from '../services/providers/MintbaseWalletContext'

import { gql } from 'apollo-boost'

import { useQuery, useLazyQuery } from '@apollo/client'

import { MetadataField } from 'mintbase'

import Image from 'next/image'
import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react'
//import * from 'react'

import {Player, BigPlayButton, ControlBar} from 'video-react';
import 'video-react/dist/video-react.css';
import { storeKeyNameFromField } from '@apollo/client/utilities'
//import Video from 'react-native-video';

//import utils from 'near-api-js';
var _nearApiJs = require("near-api-js");

const FETCH_STORE = gql`
  query FetchStore($storeId: String!, $limit: Int = 20, $offset: Int = 0) {
    store(where: { id: { _eq: $storeId } }) {
      id
      name
      symbol
      baseUri
      owner
      minters {
        account
        enabled
      }
      things(limit: $limit, offset: $offset) {
        id
        memo
        metaId
        tokens_aggregate {
          aggregate {
            count
          }
        }
        tokens(limit: 1, offset: 0) {
          id
          minter
          royaltys {
            account
            percent
          }
          splits {
            account
            percent
          }
        }
      }
    }
  }
`

const FETCH_TOKENS = gql`
  query FetchTokensByStoreId($storeId: String!, $limit: Int, $offset: Int) {
    metadata(
      order_by: { thing_id: asc } 
      where: {thing: {storeId: {_eq: $storeId}, tokens: {list: {removedAt: {_is_null: true}}}}}
      limit: $limit
      offset: $offset
      distinct_on: thing_id
    ) {
      id
      media
      animation_url
      title
      thing_id
      animation_type
      thing {
        id
        metaId
        memo
        tokens(distinct_on: id, where: {list: {removedAt: {_is_null: true}}}) {
                 id
                 list {
                   price
                   autotransfer
                   offer {
                    price
                  }
                 }
             }
      }
    }
  }
`


const useAudio = (url: string) => {
  const audio = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio(url) : undefined
  );
  
  
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    setPlaying(!playing);
  }


  useLayoutEffect(() => {
      playing ? audio.current?.play() : audio.current?.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.current?.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.current?.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle] as const;

};

const useBuy = (tokenID: string, tokenPrice: string) => {
  const { wallet } = useWallet();
  //console.log(tokenPrice);
  const tokenPriceNumber = Number(tokenPrice) ;
  // Number.toLocaleString() rounds after 16 decimal places, so be careful
  tokenPrice = (tokenPriceNumber).toLocaleString('fullwide', {useGrouping:false})
  const buy = () => {
    //wallet?.makeOffer(tokenID,tokenPrice,{ marketAddress: "market.mintspace2.testnet"})
    wallet?.makeOffer(tokenID,tokenPrice,{ marketAddress: process.env.marketAddress})
  }
  return buy;
}


const NFT = ({ baseUri, metaId, url, anim_type, tokens}: { baseUri: string; metaId: string; url: string; anim_type: string, tokens: [Token]}) => {
  const [metadata, setMetadata] = useState<{[key: string]: string} | null>(null)
  const { wallet, isConnected, details } = useWallet();
  const [bid, setBid] = useState('')
  const fetchMetadata = async (url: string) => {
    const response = await fetch(url)

    const result = await response.json()

    if (!result) return

    setMetadata(result)
  }

  //this position of useAudio is important cause of too many renders in previous call
  
  
  //This line is an expensive line, I don't want it be executed if url is null
  
  const aw = url!=null ? url : "1";
  const anim_url = aw.split("https://arweave.net/").pop();
  //const [playing, toggle] = useAudio(`https://coldcdn.com/api/cdn/bronil/${anim_url}`);
  const url2 = `https://coldcdn.com/api/cdn/bronil/${anim_url}` ;
  
  

  // change these too. Put NEAR js funcs --- DONE
  const tokenPriceNumber = Number(tokens[0].list.price) ;
  // Number.toLocaleString() rounds after 16 decimal places, so be careful
  const price = _nearApiJs.utils.format.formatNearAmount((tokenPriceNumber).toLocaleString('fullwide', {useGrouping:false}),2);
  

  useEffect(() => {
    fetchMetadata(`${baseUri}/${metaId}`)
  }, [])
  if (!metadata) return null

    return (
    <div className="w-full md:w-1/2 lg:w-1/3 my-4 px-3">
      <div className="h-80 lg:h-96">
        <div className="bg-gray-300 relative items-center min-h-full">
        {/* <div className="py-10 lg:py-20"> */}
        {!anim_type &&
          <a href="#">
            <Image
              alt={metadata[MetadataField.Title]}
              src={metadata[MetadataField.Media]}
              //src={`https://coldcdn.com/api/cdn/bronil/${mediaHash}`}
              layout="fill"
              objectFit="contain"
            />
          </a>
        }
        { anim_type &&
          <Player
              playsInline={false}
              poster={metadata[MetadataField.Media]}
              src={url2}
              //fluid={false}
              //height={}
          >
            <BigPlayButton position="center" />
          </Player>
        }
        {/* </div> */}
        </div>
      </div>
      <div className="mt-1 lg:mt-6 px-1 bg-gray-300 items-center">
         <p className="details">{metadata[MetadataField.Title]}</p>
      </div>   
         { isConnected && tokens[0].list.autotransfer &&
           <>
           <div className="px-1 bg-gray-300 items-center">
           <p className="details">Price: {price}N</p>
           </div>
           <button className="playbutton" onClick={useBuy(tokens[0].id,tokens[0].list.price)}>Buy</button>
           </>
         }
         {
           isConnected && !tokens[0].list.autotransfer && 
          <>
           <div className="px-1 bg-gray-300 items-center">
           <p className="details">Current bid: {_nearApiJs.utils.format.formatNearAmount((Number(tokens[0].list.offer.price)).toLocaleString('fullwide', {useGrouping:false}),2)}N</p>
            <label className="details">Your Bid: </label>
            <input value={bid} type="number" onChange={e => setBid(e.target.value)}/>
           </div>
           <button className="playbutton" onClick={useBuy(tokens[0].id,_nearApiJs.utils.format.parseNearAmount(bid))}>Bid</button>
          </>
         }
    </div>
  )
}

const Pagination = () => {
  return (
    <div className="container max-w-4xl mx-auto pb-10 flex justify-between items-center px-3">
      <div className="text-xs">
        <a
          href="#"
          className="bg-gray-500 text-white no-underline py-1 px-2 rounded-lg mr-2"
        >
          Previous
        </a>
        <div className="hidden md:inline">
          <a href="#" className="text-sm px-1 text-gray-900 no-underline">
            1
          </a>
          <a href="#" className="text-sm px-1 text-gray-900 no-underline">
            2
          </a>
          <a href="#" className="text-sm px-1 text-gray-900 no-underline">
            3
          </a>
          <span className="px-2 text-gray">...</span>
          <a href="#" className="text-sm px-1 text-gray-900 no-underline">
            42
          </a>
        </div>
        <a
          href="#"
          className="bg-black text-white no-underline py-1 px-2 rounded-lg ml-2"
        >
          Next
        </a>
      </div>

      <div className="text-sm text-gray-600">
        Per page:
        <select className="bg-white border rounded-lg w-24 h-8 ml-1">
          <option>24</option>
          <option>48</option>
          <option>All</option>
        </select>
      </div>
    </div>
  )
}

type Store = {
  id: string
  name: string
  symbol: string
  baseUri: string
  owner: string
  minters: {
    account: string
    enabled: string
  }[]
}

type Thing = {
  id: string
  metaId: string
  memo: string
  url: string
  anim_type: string
  tokens: [Token]
}

type Token = {
  id: string
  list: {
    price: string
    autotransfer: boolean
    offer: {
      price: string
    }
  }
}


const Products = ({ storeId }: { storeId: string }) => {
  //const { wallet } = useWallet()
  const [store, setStore] = useState<Store | null>(null)
  const [things, setThings] = useState<any>([])

  const [getStore, { loading: loadingStoreData, data: storeData }] =
    useLazyQuery(FETCH_STORE, {
      variables: {
        storeId: '',
        limit: 10,
        offset: 0,
      },
    })

  const [getTokens, { loading: loadingTokensData, data: tokensData }] =
    useLazyQuery(FETCH_TOKENS, {
      variables: {
        storeId: '',
        limit: 10,
        offset: 0,
      },
    })

  useEffect(() => {
    getStore({
      variables: {
        storeId: storeId,
        limit: 10,
        offset: 0,
      },
    })
  }, [])

  useEffect(() => {
    if (!storeData) return

    if (storeData?.store.length === 0) return

    setStore({
      ...storeData.store[0],
    })

    getTokens({
      variables: {
        storeId: storeData.store[0].id,
        limit: 10,
        offset: 0,
      },
    })
  }, [storeData])

  useEffect(() => {
    if (!store || !tokensData) return

    //const things = tokensData.token.map((token: any) => token.thing)
    const things = tokensData.metadata.map((metadata: any) => metadata.thing)
    const url = tokensData.metadata.map((metadata: any) => metadata.animation_url)
    const anim_type = tokensData.metadata.map((metadata: any) => metadata.animation_type)
  
    for (let i = 0; i < things.length; i++) {
      things[i].url = url[i]
      things[i].anim_type = anim_type[i]
    }

    setThings(things)
  }, [tokensData])

  return (
    <>
    <div className="w-full px-6 py-10 bg-gray-100 border-t">
      {!loadingStoreData && (
        <>
          <h1 className="text-xl text-center font-semibold tracking-widest uppercase text-gray-500 title-font md:text-4xl px-6 py-8">
            {store?.name} Near Store
          </h1>
          <div className="container max-w-8xl mx-auto pb-10 flex flex-wrap">
            {things.map((thing: Thing) => (
              
              <NFT
                key={thing.metaId}
                baseUri={store?.baseUri || 'https://arweave.net'}
                metaId={thing.metaId}
                url={thing.url}
                anim_type={thing.anim_type}
                tokens={thing.tokens}
              />
            ))}
          </div>
        </>
      )}
    </div>
    </>
  )
}

export default Products



