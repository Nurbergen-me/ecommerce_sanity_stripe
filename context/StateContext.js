import { toast } from "react-hot-toast";

const { createContext, useState, useContext } = require("react");


const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)

        setCartItems(cartItems.filter((item) => item._id !== foundProduct._id))
        setTotalPrice((prevTotalPrice) => prevTotalPrice - Number(foundProduct.price) * foundProduct.quantity)
        setTotalQuantity((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity)
    }

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)
        setTotalQuantity((prevTotalQuantities) => prevTotalQuantities + quantity)

        if (checkProductInCart) {
            const updateCartItems = cartItems.map((cardProduct) => {
                let newCardProduct;

                if(cardProduct._id === product._id) {
                    newCardProduct = {
                        ...cardProduct,
                        quantity: cardProduct.quantity + quantity
                    }
                } else {
                    newCardProduct = cardProduct
                }
                return newCardProduct
            })

            setCartItems(updateCartItems)

        } else {
            product.quantity = quantity
            setCartItems([...cartItems,{ ...product}])
        }

        toast.success(`${qty} ${product.name} addet to the cart.`)
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((item) => item._id === id)

        let newCartItems = cartItems.filter((item) => item._id !== id)

        if(value === 'inc') {
            setCartItems(prevCartItems => {
                const products = prevCartItems.map(product => {
                  if (product._id === id) {
                    return { ...product, quantity: product.quantity +1 };
                  }
                  return product;
                });
                return products
            })
            setTotalPrice((prevTotalPrice) => prevTotalPrice + Number(foundProduct.price))
            setTotalQuantity((prevTotalQuantities) => prevTotalQuantities + 1)

        } else if(value === 'dec') {
            if(foundProduct.quantity > 1) {
                setCartItems(prevCartItems => {
                    const products = prevCartItems.map(product => {
                      if (product._id === id) {
                        return { ...product, quantity: product.quantity - 1 };
                      }
                      return product;
                    });
                    return products
                })
                setTotalPrice((prevTotalPrice) => prevTotalPrice - Number(foundProduct.price))
                setTotalQuantity((prevTotalQuantities) => prevTotalQuantities - 1)
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            return prevQty - 1;
        })
    }

    return (
        <Context.Provider
        value={{
            showCart,
            setShowCart,
            setCartItems,
            setTotalPrice,
            setTotalQuantity,
            cartItems,
            totalPrice,
            totalQuantity,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);