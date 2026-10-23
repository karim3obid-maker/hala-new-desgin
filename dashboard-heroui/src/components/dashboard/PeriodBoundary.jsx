import {Button,Card} from '@heroui/react';
import {useDashboard} from '../../context/DashboardContext';

export function PeriodBoundary({children}){
  const {available,restore}=useDashboard();
  return available?children:<Card className="empty-state" id="empty-state" role="status"><h2>لا تتوفر بيانات لهذه الفترة</h2><p>البيانات المتاحة من 1 إلى 22 أكتوبر 2026.</p><Button onPress={restore}>عرض الفترة المتاحة</Button></Card>;
}
