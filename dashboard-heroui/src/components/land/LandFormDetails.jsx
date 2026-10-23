import {halaLandPolicies} from '../../config/halaLandPolicies';
import {Icon} from '../ui/Icon';
export function LandCustomerHeading(){return <h2 className="land-customer-heading"><Icon name="person"/>يرجى إدخال معلوماتك لإكمال الطلب</h2>}
export function LandFormDetails({page,store,offer}){
  return <div className="land-form-details"><div className="land-form-assurances">{store.cod?<span><Icon name="wallet"/>الدفع عند الاستلام</span>:null}{halaLandPolicies.freeShipping||page.settings.freeShipping||offer?.freeShipping?<span><Icon name="truck"/>شحن مجاني لكل المنتجات</span>:<span><Icon name="location"/>توصيل داخل السعودية</span>}{page.content.warranty?<span><Icon name="shield"/>تفاصيل الضمان موضّحة بالصفحة</span>:<span><Icon name="reset"/>إرجاع مجاني خلال ١٤ يومًا</span>}</div><div className="land-form-hala"><span><Icon name="building-store"/><strong>هلا لاند</strong></span><small>السعودية · الأسعار بالريال السعودي</small></div><p className="land-form-local-note">معاينة هلا: بيانات الطلب تُحفظ محليًا للتجربة فقط، دون إرسال أو تحصيل فعلي.</p></div>
}
