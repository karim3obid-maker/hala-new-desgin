import {useEffect,useState} from 'react';
import {products} from '../../data/products';
import {halaLandService} from '../../services/halaLand';
export function useLandData(){
  const [data,setData]=useState(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
  useEffect(()=>{let active=true;setError('');setData(null);halaLandService.addExamplePages(products).then(()=>halaLandService.addTrioOffers()).then(()=>Promise.all([halaLandService.getStore(),halaLandService.listPages()])).then(([store,pages])=>{if(active)setData({store,pages})}).catch(error=>{if(active)setError(error.message)});return ()=>{active=false}},[attempt]);
  return {data,setData,error,retry:()=>setAttempt(value=>value+1)};
}
