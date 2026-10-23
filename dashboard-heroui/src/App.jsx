import {I18nProvider} from '@heroui/react';
import {HashRouter,Navigate,Route,Routes} from 'react-router';
import {AdminLayout} from './components/layout/AdminLayout';
import {OrdersPreviewProvider} from './context/OrdersPreviewContext';
import DraftEditPage,{NewOrderPage} from './pages/DraftEditPage';
import {DashboardProvider} from './context/DashboardContext';
import DashboardPage from './pages/DashboardPage';
import DashboardTwoPage from './pages/DashboardTwoPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AffiliatePage from './pages/AffiliatePage';
import ShipmentsPage from './pages/ShipmentsPage';
import ShipmentDetailsPage from './pages/ShipmentDetailsPage';
import WalletPage from './pages/WalletPage';
import OffersPage from './pages/OffersPage';
import CalculatorPage from './pages/CalculatorPage';
import IntegrationsPage from './pages/IntegrationsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogArticlePage from './pages/BlogArticlePage';
import AuthPage from './pages/AuthPage';
import ImportOrdersPage from './pages/ImportOrdersPage';
import ImportOrderDetailsPage from './pages/ImportOrderDetailsPage';
import {ImportOrdersProvider} from './context/ImportOrdersContext';

export default function App(){
  return <I18nProvider locale="ar-EG"><HashRouter><DashboardProvider><OrdersPreviewProvider><ImportOrdersProvider>
    <Routes><Route path="home" element={<HomePage/>}/><Route path="blog" element={<BlogPage/>}/><Route path="blog/:slug" element={<BlogArticlePage/>}/><Route path="auth/login" element={<AuthPage key="login"/>}/><Route path="auth/register" element={<AuthPage key="register" register/>}/><Route path="auth/signup" element={<Navigate to="/auth/register" replace/>}/><Route element={<AdminLayout/>}>
      <Route index element={<DashboardPage/>}/>
      <Route path="dashboard-2" element={<DashboardTwoPage/>}/>
      <Route path="overview" element={<Navigate to="/" replace/>}/>
      <Route path="products/*" element={<ProductsPage/>}/>
      <Route path="affiliate" element={<AffiliatePage/>}/>
      <Route path="orders" element={<OrdersPage key="orders"/>}/>
      <Route path="orders/new" element={<NewOrderPage/>}/>
      <Route path="orders/drafts" element={<OrdersPage key="drafts" draft/>}/>
      <Route path="orders/drafts/:orderId/edit" element={<DraftEditPage/>}/>
      <Route path="orders/:orderId" element={<OrderDetailsPage/>}/>
      <Route path="shipments" element={<ShipmentsPage/>}/>
      <Route path="shipments/:shipmentId" element={<ShipmentDetailsPage/>}/>
      <Route path="wallet" element={<WalletPage/>}/>
      <Route path="offers" element={<OffersPage/>}/>
      <Route path="offers/:offerId" element={<OffersPage/>}/>
      <Route path="settings/*" element={<SettingsPage/>}/>
      <Route path="calculator" element={<CalculatorPage/>}/>
      <Route path="integrations" element={<IntegrationsPage/>}/>
      <Route path="import-orders" element={<ImportOrdersPage/>}/>
      <Route path="import-orders/:importId" element={<ImportOrderDetailsPage/>}/>
      <Route path="financial" element={<Navigate to="/wallet" replace/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route></Routes>
  </ImportOrdersProvider></OrdersPreviewProvider></DashboardProvider></HashRouter></I18nProvider>;
}
