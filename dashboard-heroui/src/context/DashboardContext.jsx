import {createContext,useContext,useState} from 'react';
import {Button,Input,Label,TextField} from '@heroui/react';
import data from '../data/dashboard.json';
import {AppModal} from '../components/ui/AppModal';

const DashboardContext=createContext(null);
export function useDashboard(){
  const context=useContext(DashboardContext);
  if(!context)throw new Error('DashboardProvider is required');
  return context;
}
export function DashboardProvider({children}){
  const [period,setPeriod]=useState(data.period);
  const [dateOpen,setDateOpen]=useState(false);
  const [start,setStart]=useState(data.period.start);
  const [end,setEnd]=useState(data.period.end);
  const [invalid,setInvalid]=useState(false);
  const available=period.start===data.period.start&&period.end===data.period.end;
  function restore(){setStart(data.period.start);setEnd(data.period.end);setPeriod(data.period);setInvalid(false)}
  function applyPeriod(event){
    event.preventDefault();
    if(start>end){setInvalid(true);return}
    setInvalid(false);setPeriod({start,end});setDateOpen(false);
  }
  return <DashboardContext.Provider value={{period,available,setDateOpen,restore}}>
    {children}
    <AppModal open={dateOpen} setOpen={setDateOpen} title="اختر الفترة">
      <form onSubmit={applyPeriod}>
        <div className="date-fields">
          <TextField isRequired value={start} onChange={setStart}><Label>من تاريخ</Label><Input type="date" required/></TextField>
          <TextField isRequired value={end} onChange={setEnd}><Label>إلى تاريخ</Label><Input type="date" required/></TextField>
        </div>
        {invalid?<p className="form-error" role="alert">تاريخ البداية يجب أن يسبق تاريخ النهاية.</p>:null}
        <div className="dialog-actions"><Button type="submit">تطبيق الفترة</Button><Button variant="secondary" onPress={()=>setDateOpen(false)}>إلغاء</Button></div>
      </form>
    </AppModal>
  </DashboardContext.Provider>;
}
