import Head from 'next/head'
import dynamic from 'next/dynamic';
import client from '../public/data/client.json'

const Hero= dynamic(()=> import("../components/Hero"));
const BasicTabs= dynamic(()=> import("../components/BasicTabs"));

const Home = () => {
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
