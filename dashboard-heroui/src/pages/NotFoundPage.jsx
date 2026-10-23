import {Card} from '@heroui/react';
import {Link} from 'react-router';
export default function NotFoundPage(){return <Card className="empty-state"><h2>الصفحة غير موجودة</h2><Link className="platform-link" to="/">العودة إلى لوحة التحكم</Link></Card>}
