// assets
import { Shop } from 'iconsax-reactjs';

// icons
const icons = {
  products: Shop
};

// ==============================|| MENU ITEMS - PRODUCTS ||============================== //

const products = {
  id: 'products',
  title: 'products',
  type: 'group',
  children: [
    {
      id: 'products-list',
      title: 'all-products',
      type: 'item',
      url: '/products',
      icon: icons.products
    },
    {
      id: 'product-categories-list',
      title: 'all-categories',
      type: 'item',
      url: '/product-categories',
      icon: icons.products
    }
    // {
    //   id: 'products-create',
    //   title: 'add-product',
    //   type: 'item',
    //   url: '/products/create',
    //   icon: icons.products
    // }
  ]
};

export default products;
