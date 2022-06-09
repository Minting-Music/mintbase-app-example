import { useState, useEffect } from 'react';

const NearPay = () => {

    const [signature, setSignature] = useState<string>('')

    const params = {
        // toCurrency: "NEAR",
        // toWallet: "codeslayer.testnet",
        apiKey: "8f8ff7be-fa0c-4754-8e81-5e97e5931376",
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
            {!!signature &&<a className="bg-[#444] py-4 rounded-md text-white ml-2 mb-4 px-8 mx-auto inline-block my-auto" href={`https://stage-widget.nearpay.co/?apiKey=${params.apiKey}&signature=${signature}`}>continue with pay</a>}
        </>
    )
    
}

export default NearPay;