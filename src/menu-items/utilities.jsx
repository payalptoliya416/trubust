// assets
import { useEffect, useState } from 'react';
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
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineError } from "react-icons/md";
import { FaCogs } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";

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
  PiWechatLogoFill,
  GrUserAdmin ,
  MdOutlineError ,
  RiAdminLine ,
  FaCogs
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [

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
    {
      id: 'admin-users',
      title: 'Admin Users',
      type: 'collapse', 
      icon: icons.GrUserAdmin,
      children: [
        {
          id: 'admin',
          title: 'Admin',
          type: 'item',
          url: '/admin',
          icon: icons.RiAdminLine 
        },
        {
          id: 'role-permission',
          title: 'Role & Permission',
          type: 'item',
          url: '/role-permission',
          icon: icons.FaCogs
        }
      ]
    },
    {
      id: 'logs',
      title: 'Logs',
      type: 'item',
      url: '/logs',
      icon: icons.MdOutlineError 
    },
  ]
};

export default utilities;
