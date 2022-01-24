import { useEffect, useLayoutEffect, useState } from 'react'

import { useWallet } from '../services/providers/MintbaseWalletContext'

import { gql } from 'apollo-boost'

import { useQuery, useLazyQuery } from '@apollo/client'

import { MetadataField } from 'mintbase'

import Image from 'next/image'
import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react'

import { Player, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css';
import copy from 'fast-copy';


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

const FETCH_OWN_TOKENS = gql`
query FetchTokensByStoreId($ownerId: String!, $limit: Int, $offset: Int) {
  metadata(
    order_by: { thing_id: asc } 
    where: {thing: {tokens: {ownerId: {_eq: $ownerId}}}}
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
    }
  }
}
`

const NFT = ({ baseUri, metaId, url, anim_type, tokens }: { baseUri: string; metaId: string; url: string; anim_type: string, tokens: [Token] }) => {
  const [metadata, setMetadata] = useState<{ [key: string]: string } | null>(null)

  const fetchMetadata = async (url: string) => {
    const response = await fetch(url)
    const result = await response.json()
    if (!result) return
    setMetadata(result)
  }

  const aw = url != null ? url : "1";
  const anim_url = aw.split("https://arweave.net/").pop();
  const url2 = `https://coldcdn.com/api/cdn/bronil/${anim_url}`;

  useEffect(() => {
    fetchMetadata(`${baseUri}/${metaId}`)
  }, [])
  if (!metadata) return null

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 my-4 px-3">
      {/* <div className="h-80 lg:h-96"> */}
      <div>
        {!anim_type &&
          <div className="h-80 lg:h-96 bg-gray-300 py-2 relative items-center min-h-full">
            <Image
              //alt={metadata[MetadataField.Title]}
              src={metadata[MetadataField.Media]}
              //src={`https://coldcdn.com/api/cdn/bronil/${mediaHash}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
        }
        {anim_type &&
          <div className="bg-gray-300 py relative items-center min-h-full">
            <Player
              playsInline={false}
              aspectRatio="4:4"
              poster={metadata[MetadataField.Media]}
              src={url2}
              className="items-center"
            >
              <BigPlayButton position="center" />
            </Player>
          </div>
        }
      </div>
      <div className="mt-1 lg:mt-3 px-1 bg-gray-300 items-center">
        <p className="details">{metadata[MetadataField.Title]}</p>
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

const Collectibles = ({ ownerId }: { ownerId: string }) => {
  const { wallet, isConnected, details } = useWallet()
  //const { wallet } = useWallet()
  const [store, setStore] = useState<Store | null>(null)
  const [things1, setThings] = useState<any>([])

  // const [getStore, { loading: loadingStoreData, data: storeData }] =
  //   useLazyQuery(FETCH_STORE, {
  //     variables: {
  //       storeId: '',
  //       limit: 10,
  //       offset: 0,
  //     },
  //   })

  const [getTokens, { loading: loadingTokensData, data: tokensData }] =
    useLazyQuery(FETCH_OWN_TOKENS, {
      variables: {
        ownerId: '',
        limit: 10,
        offset: 0,
      },
    })


  useEffect(() => {
    getTokens({
      variables: {
        ownerId: ownerId, //{wallet?.activeAccount?.accountId},//"mintingmusic1.testnet",
        limit: 50,
        offset: 0,
      },
    })
  }, [])

  useEffect(() => {
    //if (!store || !tokensData) return
    if (!tokensData) return

    var things1 = tokensData.metadata.map((metadata: any) => metadata.thing)
    const url = tokensData.metadata.map((metadata: any) => metadata.animation_url)
    const anim_type = tokensData.metadata.map((metadata: any) => metadata.animation_type)

    things1 = copy(things1);

    for (let i = 0; i < things1.length; i++) {
      things1[i].url = url[i]
      things1[i].anim_type = anim_type[i]
    }

    setThings(things1)
  }, [tokensData])

  return (
    <div className="w-full px-6 py-10 bg-gray-100 border-t">
      <>
        <h1 className="text-xl text-center font-semibold tracking-widest uppercase text-gray-500 title-font md:text-4xl px-6 py-8">
          {wallet?.activeAccount?.accountId}, your tokens
        </h1>
        <div className="container max-w-8xl mx-auto pb-10 flex flex-wrap">
          {things1.map((thing: Thing) => (
            <>
              <NFT
                key={thing.metaId}
                baseUri={store?.baseUri || 'https://arweave.net'}
                metaId={thing.metaId}
                url={thing.url}
                anim_type={thing.anim_type}
                tokens={thing.tokens}
              />
            </>
          ))}
        </div>
      </>
    </div>
  )
}

export default Collectibles
