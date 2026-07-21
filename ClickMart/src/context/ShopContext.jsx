import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = `€`;
  const delivery_free = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); // Kaluar lart që të jetë e pastër
  const navigate = useNavigate();

  // Marrja e produkteve nga Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      if (data) setProducts(data);
    } catch(error) {
      console.error("Gabim gjate marrjes se produkteve: ", error.message);
      toast.error("Nuk u mundesua ngarkimi i produkteve");
    }
  };

  // Kontrolli i sesionit të përdoruesit live
  useEffect(() => {
    fetchProducts();

    // Merr sesionin fillestar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Dëgjo nëse përdoruesi bën login/logout live
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe(); // Rregulluar shkrimi i unsubscribe
  }, []);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for(const item in cartItems[items]){
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for(const items in cartItems){
      let itemInfo = products.find((Product) => Product._id === items);
      if (!itemInfo) continue; // Mbrojtje nëse produkti nuk është ngarkuar ende
      for(const item in cartItems[items]){
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login'); // Rregulluar rruga e navigimit
  };

  // Tani përfshijmë 'user' dhe 'logout' në objektin value
  const value = {
    products,
    currency,
    delivery_free,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    user,   // SHTUAR
    logout, // SHTUAR
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;