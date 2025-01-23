// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'shadow',
      type: 'item',
      url: '/shadow',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'company',
      title: 'Company',
      type: 'item',
      url: '/company',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'support-ticket',
      title: 'Support Ticket',
      type: 'item',
      url: '/support-ticket',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'external-request',
      title: 'External Request',
      type: 'item',
      url: '/external-request',
      icon: icons.BarcodeOutlined
    },

  ]
};

export default utilities;
