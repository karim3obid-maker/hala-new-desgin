import {useEffect,useState} from 'react';
// HashRouter uses ordinary same-document anchors. Confirm before leaving unsaved edits.
export function useLandExit(dirty,busy){
  const [destination,setDestination]=useState(null);
  useEffect(()=>{
    const unload=event=>{if(dirty){event.preventDefault();event.returnValue=''}};
    const click=event=>{const anchor=event.target.closest?.('a[href]');if(!anchor||anchor.target==='_blank'||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const url=new URL(anchor.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash.startsWith('#/')||url.hash===location.hash)return;if(dirty||busy){event.preventDefault();event.stopPropagation();if(!busy)setDestination(url.hash.slice(1))}};
    window.addEventListener('beforeunload',unload);document.addEventListener('click',click,true);
    return ()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',click,true)};
  },[dirty,busy]);
  return {destination,setDestination};
}
