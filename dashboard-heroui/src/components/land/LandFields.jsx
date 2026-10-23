import {useEffect,useId,useState} from 'react';
import {Input,Label,TextField} from '@heroui/react';
import {Icon} from '../ui/Icon';
export function Field({label,value,onChange,error,multiline=false,children,icon,...props}){
  const id=useId(),errorId=id+'-error';
  return <div className={'land-field'+(icon?' land-field-with-icon':'')}>{icon?<span className="land-field-icon"><Icon name={icon}/></span>:null}{children||multiline?<><label htmlFor={id}>{label}</label>{children?<select id={id} value={value} onChange={e=>onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error?errorId:undefined} {...props}>{children}</select>:<textarea id={id} value={value} onChange={e=>onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error?errorId:undefined} {...props}/>}</>:<TextField value={String(value??'')} onChange={onChange} isInvalid={!!error}><Label>{label}</Label><Input aria-describedby={error?errorId:undefined} {...props}/></TextField>}{error?<small id={errorId} className="land-error" role="alert">{error}</small>:null}</div>;
}
export function Toggle({label,description,checked,onChange}){return <label className="land-toggle"><span><strong>{label}</strong>{description?<small>{description}</small>:null}</span><input type="checkbox" role="switch" checked={checked} onChange={e=>onChange(e.target.checked)}/></label>}
export function BlobImage({asset,alt='',...props}){const [url,setUrl]=useState('');useEffect(()=>{if(!asset?.blob){setUrl('');return}const next=URL.createObjectURL(asset.blob);setUrl(next);return ()=>URL.revokeObjectURL(next)},[asset?.blob]);return url?<img src={url} alt={alt} {...props}/>:null}
export function LandNotice({children}){return <p className="land-notice" role="note">{children}</p>}
