import Link from 'next/link'
import React from 'react'
import { AiOutlineShopping } from 'react-icons/ai'
import Cart from './Cart'
import { useStateContext } from '../context/StateContext'

const Navbar = () => {
  const { showCart, setShowCart, totalQuantity } = useStateContext()
  return (
    <div className='navbar-container'>
      <p className="log">
        <Link href="/">
          JSM Headphones
        </Link>
      </p>
      <button type='button' className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">
          { totalQuantity }
        </span>
      </button>

      {showCart && <Cart />}
    </div>
  )
}

export default Navbar