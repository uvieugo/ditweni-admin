// assets
import { Profile2User } from 'iconsax-reactjs';

// icons
const icons = {
  customers: Profile2User
};

// ==============================|| MENU ITEMS - CUSTOMERS ||============================== //

const customers = {
  id: 'customers',
  title: 'customers',
  type: 'group',
  children: [
    {
      id: 'customers-list',
      title: 'customers',
      type: 'item',
      url: '/customers',
      icon: icons.customers
    },
    {
      id: 'customers-create',
      title: 'add-customer',
      type: 'item',
      url: '/customers/create',
      icon: icons.customers
    }
  ]
};

export default customers;
