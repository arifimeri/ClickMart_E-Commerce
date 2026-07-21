import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency, delivery_free, getCartAmount} = useContext(ShopContext);

    const cartAmount = getCartAmount();

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title  text1={'Cart '} text2={'Totals'}/>
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency}{cartAmount}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Free</p>
                <p>{currency} {delivery_free}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {cartAmount === 0 ? 0 : cartAmount + delivery_free}.00</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal