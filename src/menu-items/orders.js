// assets
import { ShoppingCart } from 'iconsax-reactjs';

// icons
const icons = {
  orders: ShoppingCart
};

// ==============================|| MENU ITEMS - ORDERS ||============================== //

const orders = {
  id: 'orders',
  title: 'orders',
  type: 'group',
  children: [
    {
      id: 'orders-list',
      title: 'orders',
      type: 'item',
      url: '/orders',
      icon: icons.orders
    },
    {
      id: 'orders-create',
      title: 'add-order',
      type: 'item',
      url: '/orders/create',
      icon: icons.orders
    }
  ]
};

export default orders;
