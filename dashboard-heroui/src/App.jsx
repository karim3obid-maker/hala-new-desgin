import {I18nProvider} from '@heroui/react';
import {HashRouter,Navigate,Route,Routes} from 'react-router';
import {AdminLayout} from './components/layout/AdminLayout';
import {OrdersPreviewProvider} from './context/OrdersPreviewContext';
import DraftEditPage from './pages/DraftEditPage';
import {DashboardProvider} from './context/DashboardContext';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AffiliatePage from './pages/AffiliatePage';
import ShipmentsPage from './pages/ShipmentsPage';
import ShipmentDetailsPage from './pages/ShipmentDetailsPage';
import WalletPage from './pages/WalletPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App(){
  return <I18nProvider locale="ar-EG"><HashRouter><DashboardProvider><OrdersPreviewProvider>
    <Routes><Route element={<AdminLayout/>}>
      <Route index element={<DashboardPage/>}/>
      <Route path="overview" element={<Navigate to="/" replace/>}/>
      <Route path="products/*" element={<ProductsPage/>}/>
      <Route path="affiliate" element={<AffiliatePage/>}/>
      <Route path="orders" element={<OrdersPage key="orders"/>}/>
      <Route path="orders/drafts" element={<OrdersPage key="drafts" draft/>}/>
      <Route path="orders/drafts/:orderId/edit" element={<DraftEditPage/>}/>
      <Route path="orders/:orderId" element={<OrderDetailsPage/>}/>
      <Route path="shipments" element={<ShipmentsPage/>}/>
      <Route path="shipments/:shipmentId" element={<ShipmentDetailsPage/>}/>
      <Route path="wallet" element={<WalletPage/>}/>
      <Route path="financial" element={<Navigate to="/wallet" replace/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route></Routes>
  </OrdersPreviewProvider></DashboardProvider></HashRouter></I18nProvider>;
}
