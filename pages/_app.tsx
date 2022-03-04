import type { AppProps } from 'next/app'
import { WalletProvider } from '../services/providers/MintbaseWalletContext'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../services/apolloClient'
import Header from '../components/Header'
import Footer from '../components/Footer'

import 'tailwindcss/tailwind.css'
//import './styles.css'
import '../public/styles.css'
import { Network } from 'mintbase'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return (
    <WalletProvider apiKey={process.env.NEXT_PUBLIC_MINTBASEJS_API_KEY || ''} network={Network[process.env.NETWORK as keyof typeof Network]}>
      <ApolloProvider client={apolloClient}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ApolloProvider>
    </WalletProvider>
  )
}
export default MyApp
