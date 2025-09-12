// assets
import { CardPos } from 'iconsax-reactjs';

// icons
const icons = {
  orders: CardPos
};

// ==============================|| MENU ITEMS - PAYMENT METHODS ||============================== //

const paymentMethods = {
  id: 'payment-methods',
  title: 'payment-methods',
  type: 'group',
  children: [
    {
      id: 'payment-methods-list',
      title: 'payment-methods',
      type: 'item',
      url: '/payment-methods',
      icon: icons.orders
    },
    {
      id: 'payment-methods-create',
      title: 'add-payment-method',
      type: 'item',
      url: '/payment-methods/create',
      icon: icons.orders
    }
  ]
};

export default paymentMethods;
