import { Chain, Network, Wallet } from "mintbase"
import { ReactNode } from "react"

export interface IWalletProvider {
    network?: Network
    chain?: Chain
    apiKey: string
    children?: ReactNode
}

export interface WalletDetails {
    accountId: string
    balance: string
    allowance: string
    contractName: string
}

export interface IWalletConsumer {
    wallet: Wallet | undefined
    isConnected: boolean
    details: WalletDetails
}
