import {Icon} from '../ui/Icon';
import {importOrigins,importDestinationCountries} from '../../data/importOrders';

export function CountryLabel({code,name}){
  const country=importOrigins.find(item=>item.id===code)||importDestinationCountries.find(item=>item.name===name);
  return <span className="import-country-label">{country?<span className="import-country-flag" aria-hidden="true">{country.flag}</span>:null}<span>{name||country?.name||'لم يتم الاختيار'}</span></span>;
}

export function ImportCountryCards({value,onSelect,selection=false,error}){
  return <div className="import-country-cards" role={selection?'radiogroup':undefined} aria-label={selection?'بلد المصدر':undefined} aria-invalid={selection?!!error:undefined} aria-describedby={selection?('import-origin-hint'+(error?' import-error-origin':'')):undefined}>
    {importOrigins.map((country,index)=><button key={country.id} id={selection&&index===0?'import-field-origin':undefined} type="button" tabIndex={selection?(value===country.id||(!value&&index===0)?0:-1):undefined} className={'import-country-card '+(value===country.id?'is-selected':'')} role={selection?'radio':undefined} aria-checked={selection?value===country.id:undefined} aria-label={'الاستيراد من '+country.name} onClick={()=>onSelect(country.id)} onKeyDown={event=>{
      if(!selection||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();
      const offset=['ArrowLeft','ArrowDown'].includes(event.key)?1:-1;
      const next=(index+offset+importOrigins.length)%importOrigins.length;
      onSelect(importOrigins[next].id);
      event.currentTarget.parentElement.children[next].focus();
    }}>
      <span className="import-country-card-top"><span className="import-country-flag" aria-hidden="true">{country.flag}</span><span><small>الاستيراد من</small><strong>{country.name}</strong></span>{selection?<span className="import-country-check" aria-hidden="true">{value===country.id?<Icon name="circle-check"/>:null}</span>:<Icon name="chevron-left"/>}</span>
      <span className="import-country-routes">{country.routes.map(route=><span key={route.id}><span>{route.label}</span><bdi>{route.duration}</bdi></span>)}</span>
    </button>)}
  </div>;
}
