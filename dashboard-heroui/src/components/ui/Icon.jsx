import {Button} from '@heroui/react';
import {
  ArrowDownToLine,ArrowDownRight,ArrowUpRight,ArrowUturnCwRight,ArrowsExpand,Bars,Bell,
  CirclePlay,BookOpen,StarFill,Person,MapPin,ShieldCheck,Moon,Sun,Box,Calculator,Calendar,ChartColumn,ChevronUp,ChevronDown,CircleCheck,CircleDollar,
  CircleXmark,Clock,Copy,FileArrowDown,Gear,Gift,Globe,Headphones,LayoutCells,
  Link,Magnifier,Persons,ArrowUpRightFromSquare,ShoppingBag,ShoppingCart,Trolley,Wallet,Eye,Pencil,TrashBin,CircleInfo,TriangleExclamation,Plus,ArrowRotateLeft,ChevronLeft,ChevronRight,
} from '@gravity-ui/icons';

const icons={'circle-play':CirclePlay,'book-open':BookOpen,star:StarFill,person:Person,location:MapPin,shield:ShieldCheck,moon:Moon,sun:Sun,
  'arrow-down-right':ArrowDownRight,'arrow-up-right':ArrowUpRight,
  'arrow-forward-up':ArrowUturnCwRight,maximize:ArrowsExpand,'menu-2':Bars,
  bell:Bell,package:Box,'package-off':Box,calculator:Calculator,calendar:Calendar,
  'chart-bar':ChartColumn,'chevron-up':ChevronUp,'chevron-down':ChevronDown,'circle-check':CircleCheck,
  'currency-dollar':CircleDollar,'circle-x':CircleXmark,clock:Clock,copy:Copy,
  'file-import':FileArrowDown,settings:Gear,world:Globe,headset:Headphones,
  'layout-grid':LayoutCells,link:Link,search:Magnifier,'building-store':ShoppingBag,
  'shopping-cart':ShoppingCart,truck:Trolley,wallet:Wallet,
  users:Persons,share:ArrowUpRightFromSquare,gift:Gift,download:ArrowDownToLine,
  eye:Eye,edit:Pencil,trash:TrashBin,warning:TriangleExclamation,info:CircleInfo,plus:Plus,reset:ArrowRotateLeft,'chevron-left':ChevronLeft,'chevron-right':ChevronRight,
};
export const colors={purple:'#270A5E',green:'#13B857',red:'#F21E35',blue:'#0965F5',cyan:'#09B8D9',amber:'#E9B000',orange:'#FB8500'};
export function Icon({name,color,className=''}){
  if(name==='whatsapp')return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={'icon '+className} style={color?{color}:undefined}><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z"/><path d="m8.6 7.4 1.3 2.3-1 1.1a9.1 9.1 0 0 0 4.3 4.1l1-1.1 2.4 1.2c-.2 1.3-1.1 2-2.4 1.8-3.5-.6-7-4-7.6-7.3-.2-1.2.6-2.1 2-2.1Z"/></svg>;
  const Component=icons[name];
  return Component?<Component width={20} height={20} aria-hidden="true" focusable="false" className={'icon '+className} style={color?{color}:undefined}/>:null;
}
export function IconButton({icon,label,onPress,...props}){return <Button isIconOnly size="sm" variant="ghost" aria-label={label} onPress={onPress} {...props}><Icon name={icon}/></Button>}
