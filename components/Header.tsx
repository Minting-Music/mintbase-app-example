import Link from 'next/link'
import { useWallet } from '../services/providers/MintbaseWalletContext'
import Image from 'next/image'
import logo from '../public/images/logo.png'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';

const Header = () => {
  let [navState, SetNavState] = useState(true)
  const hidden = () => {
    SetNavState(!navState)
    let show = document.querySelector('.navScreen')
    if (navState == true) {
      return show?.classList.remove('hidden')
    }
    return show?.classList.add('hidden')
  }
  const { wallet, isConnected } = useWallet()
  return (
    <header className="fontFamily fixedHeader relative">
      <div className="flex container mx-auto max-w-8xl sm:flex sm:justify-between md:flex xl:px-5 lg:px-6 justify-between items-center ">
        <Link href="/" passHref>
          <a className="text-lg py-6  text-center font-semibold md:text-left md:w-auto no-underline flex justify-center items-center">
            <Image src={logo} alt="cover" />
          </a>
        </Link>

        <div className=" md:mb-0 text-center md:text-right  ">
          <span className='md:hidden p-8 cursor-pointer' onClick={hidden}>
            {navState ? <MenuIcon className='text-white' /> : <CloseIcon className='text-white' />}
          </span>
          <div className="navScreen navMobile hidden navMobile">
            {isConnected && (
              <p className="text-lg py-2 px-8 font-semibold text-white">
                {wallet?.activeAccount?.accountId}
              </p>
            )}
            <button
              className="headerBtn py-2"
              onClick={
                isConnected
                  ? () => {
                    wallet?.disconnect()
                    window.location.reload()
                  }
                  : () => {
                    wallet?.connect({ requestSignIn: true })
                  }
              }
            >
              <AccountBalanceWalletIcon className='mr-4' />
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
