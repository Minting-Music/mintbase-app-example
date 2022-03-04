import { useEffect, useState } from 'react'
import { useWallet } from '../services/providers/MintbaseWalletContext'
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/client'
import React from 'react'
import 'video-react/dist/video-react.css';
import Player from './Player'
import Loader from './Loader'


const FETCH_TOKENS = gql`
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

const NFT = ({ media, title, animation_url, animation_type }: { media: string; title: string; animation_url: string; animation_type: string }) => {

  return (
    <div className="mb-6 mx-auto cursor-pointer w-full p-4">
      <div className="transition ease-in-out hover:scale-105 w-full rounded hover:shadow-2xl px-2 shadow-lg h-full  pb-2">
        <div>

          {!animation_type &&
            <img className="max-h-64 object-contain mx-auto"
              src={media}
              alt={title} />
          }

          {animation_type &&
            <div className="max-h-64 mx-auto">
              <Player src={animation_url} thumbnail={media} size={'small'}></Player>
            </div>
          }

          <div className="px-30 py-2">
            <div className="text-center font-bold text-lg">{title}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


type MetaData = {
  id: string
  media: string
  animation_url: string
  title: string
  animation_type: string
  thing_id: string
}

const Collectibles = ({ ownerId }: { ownerId: string }) => {
  const { wallet, isConnected, details } = useWallet()
  const [metaData, setMetaData] = useState<any>([])

  const [getTokens, { loading: loadingTokensData, data: tokensData }] =
    useLazyQuery(FETCH_TOKENS, {
      variables: {
        ownerId: '',
        limit: 10,
        offset: 0,
      },
    })


  useEffect(() => {
    getTokens({
      variables: {
        ownerId: ownerId,
        limit: 50,
        offset: 0,
      },
    })
  }, [])

  useEffect(() => {
    if (!tokensData) return;
    
    setMetaData(tokensData.metadata)
  }, [tokensData])

  return (
    <div className="bg-fixed bg-gradient-to-r from-slate-50 to-slate-100 w-full px-6 py-10 bg-gray-100 border-t">

      {loadingTokensData && <Loader/>}
      {!loadingTokensData && (
        <>
        <h1 className="drop-shadow-lg text-xl text-center font-semibold tracking-widest uppercase text-gray-500 title-font md:text-4xl px-6 py-8">
          {wallet?.activeAccount?.accountId}, your tokens
        </h1>
        <div className="pb-24 w-full mx-auto bg-gray-100">
          <div className="grid sm:grid-cols-2 gap-0 md:grid-cols-3">
            {metaData.map((meta: MetaData) => (
              <>
                <NFT
                key={meta.id}
                  media={meta.media}
                  title={meta.title}
                  animation_url={meta.animation_url}
                  animation_type={meta.animation_type}
                />
              </>
            ))}
          </div>
        </div>
      </>
      )}
      
    </div>
  )
}

export default Collectibles
