import data from '../../data/dashboard.json';
import {MetricRows,Section} from './Metrics';
import {Ratios,ShippingCharts,RevenueChart} from './Charts';

export function OrdersSummary(){return <Section id="orders" title="الطلبات" icon="shopping-cart"><MetricRows items={data.orders} group="orders"/><Ratios/></Section>}
export function ShipmentsSummary(){return <Section id="shipments" title="الشحنات" icon="truck"><MetricRows items={data.shipments} group="shipments"/><ShippingCharts/></Section>}
export function FinancialSummary(){return <Section id="financial" title="المالية" icon="wallet"><MetricRows items={data.financial} group="financial"/><RevenueChart/></Section>}
