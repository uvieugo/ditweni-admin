/*** This is example of menu item without group for horizontal layout. There will be no children. ***/

// assets
import { DocumentCode2 } from 'iconsax-reactjs';

// icons
const icons = {
  dashboard: DocumentCode2
};

// ==============================|| MENU ITEMS - DASHBOARD PAGE ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  url: '/dashboard',
  icon: icons.dashboard
};

export default dashboard;
