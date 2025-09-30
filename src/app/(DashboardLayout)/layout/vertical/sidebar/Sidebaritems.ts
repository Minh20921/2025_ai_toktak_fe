import { useSelector } from 'react-redux';

export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  avatar?: string;
  target?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  tag?: React.ReactNode;
}

import { uniqueId } from 'lodash';
import React from 'react';

const SidebarContent: MenuItem[] = [
  {
    // heading: "Dashboards",
    children: [
      {
        name: '시작',
        icon: 'material-symbols:home-rounded',
        id: 'home',
        url: '/',
      },
      {
        name: '내 콘텐츠',
        icon: 'solar:file-bold',
        id: 'history',
        url: '/history',
      },
      // {
      //   name: '플래너',
      //   icon: 'solar:calendar-minimalistic-bold',
      //   id: 'created',
      //   url: '/created',
      // },
      {
        name: '멀티링크',
        icon: 'octicon:link-16',
        id: 'profile-link',
        url: '/profile-link',
      },
    ],
  },
  // {
  //   children: [
  //     {
  //       name: "Setting Config",
  //       icon: "solar:password-minimalistic-outline",
  //       id: uniqueId(),
  //       url: "/ui/form",
  //     },
  //     {
  //       name: "TERMS OF SERVICE",
  //       icon: "solar:text-circle-outline",
  //       id: uniqueId(),
  //       url: "https://voda-play.com/terms",
  //     },
  //     {
  //       name: "PRIVACY POLICY",
  //       icon: "solar:password-minimalistic-outline",
  //       id: uniqueId(),
  //       url: "https://voda-play.com/policy",
  //     },
  //   ],
  // },
];

export const SidebarContentBottom: MenuItem[] = [
  {
    heading: '',
    children: [
      {
        name: '맞팔해요',
        icon: 'majesticons:chat-text-line',
        id: 'kakao',
        url: 'https://open.kakao.com/o/gowgniwh',
      },
      {
        name: '서비스 가이드북',
        icon: 'material-symbols:book-outline-rounded',
        id: 'guide',
        url: '/guide',
      },
      {
        name: '요금제',
        icon: 'fa6-regular:credit-card',
        id: 'rate-plan',
        url: '/rate-plan',
      },
      {
        name: '고객센터',
        icon: 'tabler:help',
        id: 'form',
        url: 'https://forms.gle/x9DUfxQM9eE17LZa7',
        target: '_blank',
      },
      {
        name: '알림',
        icon: 'lets-icons:bell-pin',
        id: 'notification',
        url: '/notification',
      },
    ],
  },
];

export default SidebarContent;
