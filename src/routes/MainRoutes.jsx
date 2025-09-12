import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import { SimpleLayoutType } from 'config';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceUnderConstruction2 = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction2')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));

// render - dashboard page
const DashboardPage = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const ContactUS = Loadable(lazy(() => import('pages/contact-us')));

// render - product pages
const ProductsList = Loadable(lazy(() => import('pages/products')));
const ProductShow = Loadable(lazy(() => import('pages/products/show')));
const ProductCreate = Loadable(lazy(() => import('pages/products/create')));
const ProductEdit = Loadable(lazy(() => import('pages/products/edit')));

// render - product pages
const ProductCategoriesList = Loadable(lazy(() => import('pages/product-categories')));
const ProductCategoriesShow = Loadable(lazy(() => import('pages/product-categories/show')));
const ProductCategoriesCreate = Loadable(lazy(() => import('pages/product-categories/create')));
const ProductCategoriesEdit = Loadable(lazy(() => import('pages/product-categories/edit')));

// render - customer pages
const CustomersList = Loadable(lazy(() => import('pages/customers')));
const CustomerShow = Loadable(lazy(() => import('pages/customers/show')));
const CustomerCreate = Loadable(lazy(() => import('pages/customers/create')));

// render - order pages
const OrdersList = Loadable(lazy(() => import('pages/orders')));
const OrderShow = Loadable(lazy(() => import('pages/orders/show')));
const OrderCreate = Loadable(lazy(() => import('pages/orders/create')));

const PaymentMethodsList = Loadable(lazy(() => import('pages/payment-method')));
const PaymentMethodCreate = Loadable(lazy(() => import('pages/payment-method/create')));
const PaymentMethodShow = Loadable(lazy(() => import('pages/payment-method/show')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        {
          path: 'dashboard',
          element: <DashboardPage />
        },
        {
          path: 'products',
          element: <ProductsList />
        },
        {
          path: 'products/create',
          element: <ProductCreate />
        },
        {
          path: 'products/:id',
          element: <ProductShow />
        },
        {
          path: 'products/:id/edit',
          element: <ProductEdit />
        },
        {
          path: 'product-categories',
          element: <ProductCategoriesList />
        },
        {
          path: 'product-categories/create',
          element: <ProductCategoriesCreate />
        },
        {
          path: 'product-categories/:id',
          element: <ProductCategoriesShow />
        },
        {
          path: 'product-categories/:id/edit',
          element: <ProductCategoriesEdit />
        },
        {
          path: 'customers',
          element: <CustomersList />
        },
        {
          path: 'customers/create',
          element: <CustomerCreate />
        },
        {
          path: 'customers/:id',
          element: <CustomerShow />
        },
        {
          path: 'orders',
          element: <OrdersList />
        },
        {
          path: 'orders/create',
          element: <OrderCreate />
        },
        {
          path: 'orders/:id',
          element: <OrderShow />
        },
        {
          path: 'payment-methods',
          element: <PaymentMethodsList />
        },
        {
          path: 'payment-methods/create',
          element: <PaymentMethodCreate />
        },
        {
          path: 'payment-methods/:id',
          element: <PaymentMethodShow />
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: 'contact-us',
          element: <ContactUS />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'under-construction2',
          element: <MaintenanceUnderConstruction2 />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        },
        {
          path: 'coming-soon2',
          element: <MaintenanceComingSoon2 />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
