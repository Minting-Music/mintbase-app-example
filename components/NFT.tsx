import Link from 'next/link'
import React from 'react'
import 'video-react/dist/video-react.css';
import { Token } from '../interfaces/thing.interface';
import Player from './Player'
import Gavel from '@material-ui/icons/Gavel';
import { IconButton, Tooltip } from '@material-ui/core';

var _nearApiJs = require("near-api-js");

const NFT = ({ thing_id, media, title, animation_url, animation_type, tokens }: { thing_id: string; media: string; title: string; animation_url: string; animation_type: string, tokens: Token[] }) => {

    const tokenPriceNumber = Number(tokens[0].list.price);
    // Number.toLocaleString() rounds after 16 decimal places, so be careful
    const price = _nearApiJs.utils.format.formatNearAmount((tokenPriceNumber).toLocaleString('fullwide', { useGrouping: false }), 2);
  
  
    var currentBid
    if (tokens[0].list.offer == null) {
      currentBid = '0'
    }
    else {
      currentBid = _nearApiJs.utils.format.formatNearAmount((Number(tokens[0].list.offer.price)).toLocaleString('fullwide', { useGrouping: false }), 5)
    }
  
    // CDN the url, it will be faster
    return (
  
      <div className="mb-6 mx-auto cursor-pointer w-full p-4">
        <Link
          href={{
            pathname: '/thing/[thing_id]',
            query: {
              thing_id: thing_id
            },
          }}
          as={`thing/${thing_id}`}
        >
          <div className="transition ease-in-out hover:scale-105 w-full rounded hover:shadow-2xl px-2 shadow-lg h-full  pb-2">
            <div>
  
              {!animation_type &&
                <img className="max-h-64 object-contain mx-auto"
                  //src="https://coldcdn.com/api/cdn/bronil/HM9kQpGaqbzqugnArmkC0Dej5U5yKYT4RPvw6r1SELQ"//{media}
                  src={media}//"https://arweave.net/HM9kQpGaqbzqugnArmkC0Dej5U5yKYT4RPvw6r1SELQ"//{media}
                  alt={title} />
              }
  
              {animation_type &&
                <div className="max-h-64 mx-auto">
                  <Player src={animation_url} thumbnail={media} size={'small'}></Player>
                </div>
              }
  
              <div className="px-30 mt-4 pt-2 text-center justify-between my-auto">
                <div className="font-black text-lg">{title}</div>
                <>
                  {tokens[0].list.autotransfer &&
                    <div className="font-thin text-base my-2 flex items-center justify-center">{price}  <img src="../images/near.png" alt="here" className='w-4 mx-2'/> </div>
                  }
                  {/* Put a small auction symbol here */}
                  {!tokens[0].list.autotransfer &&
                    <div className="font-thin text-base my-2 px-2 ">
                      <Tooltip title="BID">
                        <IconButton>
                          <Gavel className='mx-2'/> 
                        </IconButton>
                      </Tooltip>
                    </div>
                  }
                </>
              </div>
            </div>
          </div>
        </Link>
      </div >
    )
  }

  export default NFT
  