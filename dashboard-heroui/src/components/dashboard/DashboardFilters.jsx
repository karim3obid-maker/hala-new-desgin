import {Button,Card,Label,ListBox,Select} from '@heroui/react';
import {useDashboard} from '../../context/DashboardContext';
import {Icon} from '../ui/Icon';

export function AggregateSelect({label,value,icon}){return <Select className="filter-select" defaultValue="all" variant="secondary"><Label>{label}</Label><Select.Trigger><Icon name={icon} color="#626B82"/><Select.Value/><Select.Indicator/></Select.Trigger><Select.Popover><ListBox><ListBox.Item id="all" textValue={value}><Label>{value}</Label><ListBox.ItemIndicator/></ListBox.Item></ListBox></Select.Popover></Select>}

export function DashboardFilters(){
  const {period,setDateOpen}=useDashboard();
  return <Card className="filter-card">
    <div className="period-field">
      <Label id="period-label">اختر الفترة</Label>
      <Button variant="tertiary" className="date-trigger" onPress={()=>setDateOpen(true)} aria-labelledby="period-label period-value">
        <Icon name="calendar" color="#626B82"/>
        <bdi dir="ltr" id="period-value">{period.start.replaceAll('-','/')} – {period.end.replaceAll('-','/')}</bdi>
        <Icon name="chevron-down"/>
      </Button>
    </div>
    <AggregateSelect label="الدولة" value="كل الدول" icon="world"/>
    <AggregateSelect label="المنتج" value="كل المنتجات" icon="package"/>
    <AggregateSelect label="المتجر" value="كل المتاجر" icon="building-store"/>
  </Card>;
}
