import { Chain, Network, Wallet } from 'mintbase'
import {
  createContext,
  useEffect,
  useState,
  useContext,
} from 'react'
import { IWalletConsumer, IWalletProvider, WalletDetails } from '../../interfaces/wallet.interface'


// @ts-ignore
export const WalletContext = createContext<IWalletConsumer>({
  wallet: undefined,
  details: {
    accountId: '',
    balance: '',
    allowance: '',
    contractName: '',
  },
  isConnected: false,
})

export const WalletProvider = (props: IWalletProvider) => {
  const { network, chain, apiKey, children } = props
  const [wallet, setWallet] = useState<Wallet | undefined>()
  const [details, setDetails] = useState<WalletDetails>({
    accountId: '',
    balance: '',
    allowance: '',
    contractName: '',
  })
  const [connected, setConnected] = useState(false)

  const initWallet = async () => {
    const { data: walletData, error } = await new Wallet().init({
      networkName: network ?? Network.testnet,
      //networkName: Network.testnet,
      chain: chain ?? Chain.near,
      //chain: Chain.near,
      apiKey: apiKey,
      //apiKey: "3367ca4d-cf4f-45ca-b206-03768a24bf17",
    })

    if (error) {
      console.error(error)
      return
    }

    const { wallet, isConnected } = walletData
    setWallet(wallet)
    if (isConnected) {
      try {
        const { data: details } = await wallet.details()
        setDetails(details)
        setConnected(true)
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    initWallet()
  }, [network])

  return (
    <WalletContext.Provider value={{wallet, details, isConnected: connected }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext<IWalletConsumer>(WalletContext)
