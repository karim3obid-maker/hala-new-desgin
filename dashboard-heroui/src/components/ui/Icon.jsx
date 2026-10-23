import {Button} from '@heroui/react';
import {
  ArrowDownToLine,ArrowDownRight,ArrowUpRight,ArrowUturnCwRight,ArrowsExpand,Bars,Bell,
  Box,Calculator,Calendar,ChartColumn,ChevronDown,CircleCheck,CircleDollar,
  CircleXmark,Clock,Copy,FileArrowDown,Gear,Gift,Globe,Headphones,LayoutCells,
  Link,Magnifier,Persons,ArrowUpRightFromSquare,ShoppingBag,ShoppingCart,Trolley,Wallet,Eye,Pencil,TrashBin,CircleInfo,TriangleExclamation,Plus,ArrowRotateLeft,ChevronLeft,ChevronRight,
} from '@gravity-ui/icons';

const icons={
  'arrow-down-right':ArrowDownRight,'arrow-up-right':ArrowUpRight,
  'arrow-forward-up':ArrowUturnCwRight,maximize:ArrowsExpand,'menu-2':Bars,
  bell:Bell,package:Box,'package-off':Box,calculator:Calculator,calendar:Calendar,
  'chart-bar':ChartColumn,'chevron-down':ChevronDown,'circle-check':CircleCheck,
  'currency-dollar':CircleDollar,'circle-x':CircleXmark,clock:Clock,copy:Copy,
  'file-import':FileArrowDown,settings:Gear,world:Globe,headset:Headphones,
  'layout-grid':LayoutCells,link:Link,search:Magnifier,'building-store':ShoppingBag,
  'shopping-cart':ShoppingCart,truck:Trolley,wallet:Wallet,
  users:Persons,share:ArrowUpRightFromSquare,gift:Gift,download:ArrowDownToLine,
  eye:Eye,edit:Pencil,trash:TrashBin,warning:TriangleExclamation,info:CircleInfo,plus:Plus,reset:ArrowRotateLeft,'chevron-left':ChevronLeft,'chevron-right':ChevronRight,
};
export const colors={purple:'#270A5E',green:'#13B857',red:'#F21E35',blue:'#0965F5',cyan:'#09B8D9',amber:'#E9B000',orange:'#FB8500'};
export function Icon({name,color,className=''}){
  const Component=icons[name];
  return Component?<Component width={20} height={20} aria-hidden="true" focusable="false" className={'icon '+className} style={color?{color}:undefined}/>:null;
}
export function IconButton({icon,label,onPress,...props}){return <Button isIconOnly size="sm" variant="ghost" aria-label={label} onPress={onPress} {...props}><Icon name={icon}/></Button>}
