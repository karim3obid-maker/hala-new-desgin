import {Avatar} from '@heroui/react';
import {sellerAccount} from '../../config/account';
import {Icon,IconButton} from '../ui/Icon';

export function Account({onCopy,onFullscreen}){
  return <div className="account">
    <Avatar size="sm" className="account-avatar"><Avatar.Fallback>{sellerAccount.initials}</Avatar.Fallback></Avatar>
    <span className="account-name">{sellerAccount.name}</span>
    <div className="seller-id" aria-label={`معرّف البائع ${sellerAccount.sellerId}`}>
      <span className="seller-id-label">Seller ID</span>
      <bdi dir="ltr">{sellerAccount.sellerId}</bdi>
      <IconButton icon="copy" label="نسخ معرّف البائع" title="نسخ معرّف البائع" onPress={onCopy}/>
    </div>
    <div className="account-actions">
      <span className="notification" title="الإشعارات"><Icon name="bell"/></span>
      <IconButton icon="maximize" label="ملء الشاشة" onPress={onFullscreen}/>
    </div>
  </div>;
}
