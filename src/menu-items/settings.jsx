/*** This is example of menu item without group for horizontal layout. There will be no children. ***/

// assets
import { DocumentCode2 } from 'iconsax-reactjs';

// icons
const icons = {
  dashboard: DocumentCode2
};

// ==============================|| MENU ITEMS - DASHBOARD PAGE ||============================== //

const settings = {
  id: 'settings',
  title: 'Settings',
  type: 'group',
  url: '/settings',
  icon: icons.dashboard
};

export default settings;
