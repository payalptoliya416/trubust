// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaUser } from "react-icons/fa6";
import { FaTicket } from "react-icons/fa6";
import { IoGitPullRequestSharp } from "react-icons/io5";
import { CgInternal } from "react-icons/cg";
import { PiWechatLogoFill } from "react-icons/pi";
// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  HiOutlineOfficeBuilding ,
  FaUser  ,
  FaTicket ,
  IoGitPullRequestSharp ,
  CgInternal ,
  PiWechatLogoFill
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
      icon: icons.HiOutlineOfficeBuilding
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.FaUser 
    },
    {
      id: 'support-ticket',
      title: 'Support Ticket',
      type: 'item',
      url: '/support-ticket',
      icon: icons.FaTicket
    },
    {
      id: 'external-request',
      title: 'External Request',
      type: 'item',
      url: '/external-request',
      icon: icons.IoGitPullRequestSharp 
    },
    {
      id: 'internal-request',
      title: 'Internal Request',
      type: 'item',
      url: '/internal-request',
      icon: icons.CgInternal
    },
    {
      id: 'secure-channel',
      title: 'Secure Channel',
      type: 'item',
      url: '/secure-channel',
      icon: icons.PiWechatLogoFill
    },

  ]
};

export default utilities;
