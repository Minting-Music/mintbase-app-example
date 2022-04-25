import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useWallet } from '../../services/providers/MintbaseWalletContext';
// import { Player, BigPlayButton } from 'video-react';
import { Thing } from '../../interfaces/thing.interface';
import Player from '../../components/Player';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import Loader from '../../components/Loader';
import Gavel from '@material-ui/icons/Gavel';
import DescriptionIcon from '@material-ui/icons/Description';
var _nearApiJs = require("near-api-js");

const FETCH_TOKEN = gql`
query MyQuery ($thing_id: String!) {
    thing(where: {id: {_eq: $thing_id}}) {
      id
      tokens(distinct_on: id, where: {list: {removedAt: {_is_null: true}}}) {
        id
        lists (order_by: {createdAt: desc}, limit: 1){
          price
          autotransfer
          offer {
            price
          }
        }
        txId
      }
      allTokens: tokens(distinct_on: id) {
        id
      }
      storeId
      store{
        name
        }   
      metadata {
        animation_type
        animation_url
        media
        title
        description
        tags
        external_url
        category
      }
    }
  }`



const Product = ({ thing_id }: { thing_id: string }) => {
    const [things, setThing] = useState<Thing[]>([])
    const { wallet, isConnected } = useWallet();
    const [bid, setBid] = useState('0')
    const [hide, setHide] = useState(false)


    const [getTokens, { loading: loadingTokensData, data: tokensData, fetchMore }] =
        useLazyQuery(FETCH_TOKEN, {
            variables: {
                thing_id: ''
            },
        })
    useEffect(() => {

        getTokens({
            variables: {
                thing_id
            },
        })
    }, [])
    useEffect(() => {
        if (!tokensData) return;
        setThing(tokensData.thing)
    }, [tokensData])

    var tokenPriceNumber
    var price, tokenPrice: string
    things.map((thing: Thing) => {
        tokenPriceNumber = Number(thing.tokens[0].lists[0].price)
        //format keep on giving error without the map implementation, why?
        price = _nearApiJs.utils.format.formatNearAmount((tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false }), 2)
        tokenPrice = (tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false })

    })
    //var tokenPriceNumber = Number(things[0].tokens[0].list.price)
    // var price = _nearApiJs.utils.format.formatNearAmount((tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false }), 2)
    // const tokenPrice = (tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false })

    var buy = () => {
        if (things[0]?.tokens[0].lists[0].autotransfer) {
            wallet?.makeOffer(things[0]?.tokens[0].id, tokenPrice, { marketAddress: process.env.marketAddress })
        }
        else {
            wallet?.makeOffer(things[0]?.tokens[0].id, _nearApiJs.utils.format.parseNearAmount(bid), { marketAddress: process.env.marketAddress })
        }
    }
    var currentBid;
    if (things[0]?.tokens[0].lists[0].offer == null) {
        currentBid = '0'
    }
    else {
        currentBid = _nearApiJs.utils.format.formatNearAmount((Number(things[0]?.tokens[0].lists[0].offer.price)).toLocaleString('fullwide', { useGrouping: false }), 5)
    }
    const play = () => {
        setHide(!hide)
    }

    return (
        <div className='min-h-screen'>
            {loadingTokensData && <Loader />}

            {!loadingTokensData &&
                <main className="h-full py-24 mt-4">
                    <div className="container mx-auto md:px-6">
                        <div className="lg:grid lg:grid-cols-2 justify-center w-full">
                            <div className="rounded-md lg:col-span-1 border my-auto p-2 box-border shadow-2xl bg-gray-50 mx-auto">

                                <>
                                    {/* {!things[0]?.metadata.animation_type &&
                                        

                                    } */}

                                    {(things[0]?.metadata.animation_type === 'video/mp4' || things[0]?.metadata.animation_type =='audio/mpeg') ?
                                        (<div id="responsiveVideoWrapper" className="rounded-md my-auto">
                                            <Player src={things[0]?.metadata.animation_url!} thumbnail={things[0]?.metadata.media} size={"big"}></Player>
                                        </div>):
                                        (
                                            <div className="py-2">
                                                <img className=" object-contain mx-auto w-full my-auto"
                                                    src={things[0]?.metadata.media}
                                                    alt={things[0]?.metadata.title} />
                                            </div>
                                        )

                                    }
                                </>


                            </div>
                            <div className="priceTag content-center mx-4 col-span-1">

                                <div className='' id='container'>
                                    <div className='app-border mb-2'>
                                        <h3 className="text-gray-700 uppercase text-lg font-bold">{things[0]?.metadata.title}</h3>
                                        <p className='text-gray-400 py-2'>Owned by: <span className='storeID uppercase'>{things[0]?.store.name}</span> </p>
                                    </div>
                                    <div className='app-border'>
                                        <DescriptionIcon />
                                        <span className='text-gray-700 text-[18px] pt-2 '>Description</span>
                                        <p className={hide ? 'pt-2 h-24 overflow-y-scroll ' : 'pt-2 h-16 overflow-y-scroll truncate'}>
                                            <span className='storeID'>{things[0]?.metadata.description}</span>
                                        </p>
                                        <span id='span' onClick={play} className='cursor-pointer text-blue-400 p-2'>{!hide ? 'see more' : 'see less'}</span>
                                    </div>
                                </div>


                                <div className='text-gray-500 mt-2 text-sm app-border'>
                                    <p className=' p-2'>Store: {things[0]?.storeId} </p>

                                    <p >
                                        <a className='text-blue-400 p-2' target="_blank" href={`https://explorer.${process.env.NETWORK === 'testnet' ? 'testnet' : ''}near.org/transactions/${things[0]?.tokens[0].txId}`} rel="noreferrer" >
                                            Near
                                            <img src="../images/near.png" alt="here" className='w-4 h-3 text-black-300 pr-1 inline mx-2' />
                                        </a>
                                    </p>

                                    <p>
                                        <a className='text-blue-400 p-2' href={`https://viewblock.io/arweave/tx/${thing_id.split(":")[0]}`} target="_blank" rel="noreferrer">

                                            Arweave
                                            <img src="../images/ARWEAVE.png" alt="here" className='w-5 h-4 text-black-300 pr-1 inline mx-2' />
                                        </a>
                                    </p>

                                    <p className=' p-2'>Tokens: {things[0]?.tokens.length}/{things[0]?.allTokens.length}</p>

                                    <p><a className='text-blue-400 p-2' href={things[0]?.metadata.external_url} target="_blank" rel="noreferrer">Project Website</a> </p>

                                    {things[0]?.tokens[0].lists[0].autotransfer &&
                                        <div className='flex max-w-md'>
                                            <span className='text-gray-500 my-auto text-sm mx-2'>Price</span> <br />
                                            <span className=" text-xl flex m-5 justify-start">
                                                <span className='px-1'>{price}</span>
                                                <img src="../images/near.png" alt="here" className='w-4 h-4 my-auto' />
                                            </span>
                                        </div>
                                    }
                                    {isConnected && things[0]?.tokens[0].lists[0].autotransfer &&
                                        <>

                                            <div className="flex items-center pt-2 border-solid  border-t-2 border-full border-gray-200">
                                                <button className="fontFamily buyButton" onClick={buy}>
                                                    <AccountBalanceWalletIcon className='mr-4' />
                                                    Buy
                                                </button>
                                            </div>
                                        </>
                                    }
                                    {!things[0]?.tokens[0].lists[0].autotransfer &&
                                        <div className='flex max-w-md'>
                                            <span className='text-gray-500 my-auto text-sm mx-2'>Current Bid</span> <br />
                                            <span className=" text-xl flex m-5 justify-start">
                                                <span className='px-1'>{currentBid} </span>
                                                <img src="../images/near.png" alt="here" className='w-4 h-4 my-auto' />
                                            </span>
                                        </div>
                                    }
                                    {
                                        isConnected && !things[0]?.tokens[0].lists[0].autotransfer &&
                                        <>
                                            <div>
                                                <input value={bid} type="number" onChange={e => setBid(e.target.value)} min="0" className=" ml-2 pl-4 rounded-full focus:outline-none border text-gray-700 py-2" />
                                            </div>
                                            <div className="flex items-center mt-3">
                                                <button className="buyButton" onClick={buy}>
                                                    <Gavel className='mr-2' />
                                                    Bid</button>
                                            </div>
                                        </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            }
        </div>
    )
}


export const getServerSideProps = (params: any) => {
    const thing_id = params.query.thing_id
    return {
        props: {
            thing_id
        }
    }
}

export default Product