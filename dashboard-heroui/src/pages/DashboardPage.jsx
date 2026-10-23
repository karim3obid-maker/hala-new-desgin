import {TopProducts} from '../components/dashboard/TopProducts';
import {DashboardFilters} from '../components/dashboard/DashboardFilters';
import {PeriodBoundary} from '../components/dashboard/PeriodBoundary';
import {OrdersSummary,ShipmentsSummary,FinancialSummary} from '../components/dashboard/Summaries';

export default function DashboardPage(){return <><DashboardFilters/><PeriodBoundary><div id="sections"><OrdersSummary/><ShipmentsSummary/><TopProducts/><FinancialSummary/></div></PeriodBoundary></>}
