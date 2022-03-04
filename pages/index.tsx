import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
//import Products from '../components/Products'
import BasicTabs from '../components/BasicTabs'
//import Collectibles from '../components/Collectibles'
import { useWallet } from '../services/providers/MintbaseWalletContext'
//import Access from '../components/access'
import client from '../public/data/client.json'
const Home = () => {
  //const { wallet, isConnected, details } = useWallet()
  return (
    <>
      <Head>
        <title>{client.Title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <BasicTabs />
    </>
  )
}

export default Home
