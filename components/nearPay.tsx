import { useState, useEffect } from 'react';

const NearPay = () => {

    const [signature, setSignature] = useState<string>('')

    const params = {
        "toCurrency": "NEAR",
        "toWallet": "market.mintspace1.testnet",
        "apiKey":"724daaf2-70b8-4fec-86a3-648e59637191",
        "contractCall":
                {
                    "method": "make_offer",
                    "args":
                        {
                            "token_key": ["7:naruto.mintspace2.testnet"],
                            "price": ["7000000000000000000000000"]
                        }
                },
    }

    const getSign = async ()=> {
        const res = await fetch('http://localhost:8000/membership/pay', {
            method: 'POST'
        });

        
        const sign = await res.text()
        
        setSignature(sign)
        return sign;
    }


    useEffect(()=> {
        getSign()
    } ,[])

    return (
        <>
        {signature}
            {!!signature &&<a className="bg-[#444] py-4 rounded-md text-white ml-2 mb-4 px-8 mx-auto inline-block my-auto" href={`https://stage-widget.nearpay.co/?apiKey=${params.apiKey}&toWallet=${params.toWallet}&toCurrency=NEAR&signature=${signature}&contractCall="%7B%22contractCall%22%3A%7B%22method%22%3A%22${params.contractCall.method}%22%2C%22args%22%3A%7B%22token_key%22%3A%5B%227%3A${params.contractCall.args.token_key}%22%5D%2C%22price%22%3A%5B%22${params.contractCall.args.price}%22%5D%7D%7D%7D"`}>continue with Nearpay</a>}
        </>
    )
    
}

export default NearPay;