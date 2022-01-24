import { useEffect, useLayoutEffect, useState } from 'react'
import { useWallet } from '../services/providers/MintbaseWalletContext'
import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery } from '@apollo/client'
import { MetadataField } from 'mintbase'
import Image from 'next/image'
import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react'
import client from '../public/data/client.json'

import { Player, BigPlayButton, ControlBar } from 'video-react';
import 'video-react/dist/video-react.css';
import copy from 'fast-copy';
import { InView, useInView } from 'react-intersection-observer';

var _nearApiJs = require("near-api-js");

// const FETCH_STORE = gql`
//   query FetchStore($storeId: String!, $limit: Int = 20, $offset: Int = 0) {
//     store(where: { id: { _eq: $storeId } }) {
//       id
//       name
//       symbol
//       baseUri
//       owner
//       minters {
//         account
//         enabled
//       }
//       things(limit: $limit, offset: $offset) {
//         id
//         memo
//         metaId
//         tokens_aggregate {
//           aggregate {
//             count
//           }
//         }
//         tokens(limit: 1, offset: 0) {
//           id
//           minter
//           royaltys {
//             account
//             percent
//           }
//           splits {
//             account
//             percent
//           }
//         }
//       }
//     }
//   }
// `

// const FETCH_TOKENS = gql`
//   query FetchTokensByStoreId($storeId: String!, $limit: Int, $offset: Int) {
//     metadata(
//       order_by: { thing_id: asc } 
//       where: {thing: {storeId: {_eq: $storeId}, tokens: {list: {removedAt: {_is_null: true}}}}}
//       limit: $limit
//       offset: $offset
//       distinct_on: thing_id
//     ) {
//       id
//       media
//       animation_url
//       title
//       thing_id
//       animation_type
//       thing {
//         id
//         metaId
//         memo
//         tokens(distinct_on: id, where: {list: {removedAt: {_is_null: true}}}) {
//                  id
//                  list {
//                    price
//                    autotransfer
//                    offer {
//                     price
//                   }
//                  }
//              }
//       }
//     }
//   }
// `

const FETCH_TOKENS = gql`
query FetchTokensByStoreId($storeId: String!, $limit: Int, $offset: Int) {
metadata(order_by: {thing: {createdAt: desc}}, where: {thing: 
  {storeId: {_eq: $storeId}, tokens: {list: {removedAt: {_is_null: true}}}}}, 
  limit: $limit, offset: $offset) {
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
}`

// const useBuy = (tokenID: string, tokenPrice: string) => {
//   const { wallet } = useWallet();
//   //console.log(tokenPrice);
//   const tokenPriceNumber = Number(tokenPrice) ;
//   // Number.toLocaleString() rounds after 16 decimal places, so be careful
//   tokenPrice = (tokenPriceNumber).toLocaleString('fullwide', {useGrouping:false})
//   const buy = () => {
//     //wallet?.makeOffer(tokenID,tokenPrice,{ marketAddress: "market.mintspace2.testnet"})
//     wallet?.makeOffer(tokenID,tokenPrice,{ marketAddress: process.env.marketAddress})
//   }
//   return buy;
// }

const NFT = ({ baseUri, metaId, url, anim_type, tokens }: { baseUri: string; metaId: string; url: string; anim_type: string, tokens: [Token] }) => {
  const [metadata, setMetadata] = useState<{ [key: string]: string } | null>(null)
  const { wallet, isConnected, details } = useWallet();
  const [bid, setBid] = useState('0')

  const fetchMetadata = async (url: string) => {
    const response = await fetch(url)
    const result = await response.json()
    if (!result) return
    setMetadata(result)
  }

  //Put some better logic to get the url
  const aw = url != null ? url : "1";
  const anim_url = aw.split("https://arweave.net/").pop();
  const url2 = `https://coldcdn.com/api/cdn/bronil/${anim_url}`;


  const tokenPriceNumber = Number(tokens[0].list.price);
  // Number.toLocaleString() rounds after 16 decimal places, so be careful
  const price = _nearApiJs.utils.format.formatNearAmount((tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false }), 2);


  useEffect(() => {
    fetchMetadata(`${baseUri}/${metaId}`)
  }, [])
  if (!metadata) return null

  const tokenPrice = (tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false })

  const buy = () => {
    if (tokens[0].list.autotransfer) {
      wallet?.makeOffer(tokens[0].id, tokenPrice, { marketAddress: process.env.marketAddress })
    }
    else {
      wallet?.makeOffer(tokens[0].id, _nearApiJs.utils.format.parseNearAmount(bid), { marketAddress: process.env.marketAddress })
    }
  }

  var currentBid
  if (tokens[0].list.offer == null) {
    currentBid = '0'
  }
  else {
    currentBid = _nearApiJs.utils.format.formatNearAmount((Number(tokens[0].list.offer.price)).toLocaleString('fullwide', { useGrouping: false }), 5)
  }


  return (
    <div className="w-full md:w-1/2 lg:w-1/3 my-4 px-3">
      <div>
        {!anim_type &&
          <div className="h-80 lg:h-96 bg-gray-300 py-2 relative items-center min-h-full">
            <Image
              //alt={metadata[MetadataField.Title]}
              src={metadata[MetadataField.Media]}
              //src={`https://coldcdn.com/api/cdn/bronil/${metaId}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
        }
        {anim_type &&
          <div className="bg-gray-300 py relative items-center min-h-full">
            <Player
              playsInline={false}
              //fluid={false}
              aspectRatio="4:4"
              poster={metadata[MetadataField.Media]}
              src={url2}
              className="items-center"
            >
              <BigPlayButton position="center" />
            </Player>
          </div>
        }
        {/* </div> */}
      </div>
      <div className="mt-1 lg:mt-3 px-1 bg-gray-300 items-center">
        <p className="details">{metadata[MetadataField.Title]}</p>
      </div>
      {isConnected && tokens[0].list.autotransfer &&
        <>
          <div className="px-1 bg-gray-300 items-center">
            <p className="details">Price: {price}N</p>
          </div>
          <button className="playbutton" onClick={buy}>Buy</button>
        </>
      }
      {
        isConnected && !tokens[0].list.autotransfer &&
        <>
          <div className="px-1 bg-gray-300 items-center">
            <p className="details">Current bid: {currentBid}N</p>
            <label className="details">Your Bid: </label>
            <input value={bid} type="number" onChange={e => setBid(e.target.value)} />
          </div>
          <button className="playbutton" onClick={buy}>Bid</button>
        </>
      }
    </div>
  )
}


// type Store = {
//   id: string
//   name: string
//   symbol: string
//   baseUri: string
//   owner: string
//   minters: {
//     account: string
//     enabled: string
//   }[]
// }

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
  const [things, setThings] = useState<any>([])

  // const [getTokens, { loading: loadingTokensData, data: tokensData, fetchMore }] =
  //   useLazyQuery(FETCH_TOKENS, {
  //     variables: {
  //       storeId: '',
  //       limit: 15,
  //       offset: 0,
  //     },
  //   })

  const { loading: loadingData, data: tokensData, fetchMore } =
    useQuery(FETCH_TOKENS, {
      variables: {
        storeId: storeId,
        limit: 12,
        offset: 0,
      },
    })

  // useEffect(() => {

  //   getTokens({
  //     variables: {
  //       storeId: storeId,
  //       limit: 6,
  //       offset: 0,
  //     },
  //   })
  // }, [])

  useEffect(() => {
    if (!tokensData) return

    //const things = tokensData.token.map((token: any) => token.thing)
    var things = tokensData.metadata.map((metadata: any) => metadata.thing)
    const url = tokensData.metadata.map((metadata: any) => metadata.animation_url)
    const anim_type = tokensData.metadata.map((metadata: any) => metadata.animation_type)

    things = copy(things);

    for (let i = 0; i < things.length; i++) {
      things[i].url = url[i]
      things[i].anim_type = anim_type[i]
    }

    setThings(things)
  }, [tokensData])
  //things = things.reverse()


  return (
    <>
      <div id="test" className="w-full px-6 py-10 bg-gray-100 border-t">
        {/* {!loadingStoreData && ( */}
        <>
          <h1 className="text-xl text-center font-semibold tracking-widest uppercase text-gray-500 title-font md:text-4xl px-6 py-8">
            {client.Title} Near Store
          </h1>
          <div className="container max-w-8xl mx-auto pb-10 flex flex-wrap">
            {things.map((thing: Thing) => (

              <NFT
                key={thing.metaId}
                baseUri={'https://arweave.net'}
                metaId={thing.metaId}
                url={thing.url}
                anim_type={thing.anim_type}
                tokens={thing.tokens}
              />
            ))}
            <InView
              onChange={(inView, entry) => {
                if (inView) {
                  fetchMore!({
                    variables: {
                      offset: tokensData?.metadata.length,
                      limit: 6,
                    }
                  });
                }
              }}
              threshold={0.25}
            />
          </div>

        </>
        {/* <InView

          onChange={inView => {
            if (inView) {
              fetchMore!({
                variables: {
                  offset: tokensData?.metadata.length,
                  limit: 3,
                }
              });
            }
          }}
          threshold={0.50}
        /> */}
      </div>
    </>
  )
}

export default Products



