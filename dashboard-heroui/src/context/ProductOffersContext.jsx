import {createContext,useContext,useState} from 'react';
import {createSavedPreviewOffers} from '../data/products';
const Context=createContext(null);
export function ProductOffersProvider({children}){const [offersByProduct,setOffersByProduct]=useState(createSavedPreviewOffers);return <Context.Provider value={{offersByProduct,setOffersByProduct}}>{children}</Context.Provider>}
export const useProductOffers=()=>useContext(Context);
