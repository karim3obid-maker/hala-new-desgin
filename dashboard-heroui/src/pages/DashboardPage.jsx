import {TopProducts} from '../components/dashboard/TopProducts';
import {TodayTasks} from '../components/dashboard/TodayTasks';
import {DashboardFilters} from '../components/dashboard/DashboardFilters';
import {PeriodBoundary} from '../components/dashboard/PeriodBoundary';
import {OrdersSummary,ShipmentsSummary,FinancialSummary} from '../components/dashboard/Summaries';

export default function DashboardPage(){return <><DashboardFilters/><TodayTasks/><PeriodBoundary><div id="sections"><OrdersSummary/><ShipmentsSummary/><TopProducts/><FinancialSummary/></div></PeriodBoundary></>}
