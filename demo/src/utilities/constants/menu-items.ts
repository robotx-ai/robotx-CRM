export async function getMenus(locale: string) {
  const base = `/${locale}`;
  const isZh = locale === 'zh-CN';

  if (!isZh) {
    return [
      {
        label: 'Customer Center',
        icon: 'team',
        collapsible: true,
        children: [
          {
            path: `${base}/customerCenter/storeManagement`,
            label: 'Store Management',
          },
          {
            path: `${base}/customerCenter/agents`,
            label: 'Subordinate Agent Management',
          },
        ],
      },
      {
        label: 'Product Center',
        icon: 'listing',
        collapsible: true,
        children: [
          {
            path: `${base}/productcenter/machine-product-library`,
            label: 'Machine Product Library',
          },
          {
            path: `${base}/productcenter/accessories-management`,
            label: 'Accessories Management',
          },
        ],
      },
      {
        path: `${base}/customerCenter/salesLeads`,
        label: 'Sales Leads Management',
        icon: 'crm',
      },
      {
        label: 'Learning Center',
        icon: 'about-us',
        collapsible: true,
        children: [
          {
            path: `${base}/extra-pages/about-us`,
            label: 'Product Training',
          },
          {
            path: `${base}/extra-pages/contact-us`,
            label: 'Support & Enablement',
          },
          {
            path: `${base}/extra-pages/pricing-plan`,
            label: 'Plans & Billing',
          },
        ],
      },
      {
        path: 'https://roi.robotxtech.com/',
        label: 'ROI Calculator',
        icon: 'listing',
      },
    ];
  }

  return [
    {
      label: '客户中心',
      icon: 'team',
      collapsible: true,
      children: [
        {
          path: `${base}/customerCenter/storeManagement`,
          label: '门店管理',
        },
        {
          path: `${base}/customerCenter/agents`,
          label: '下级代理管理',
        },
      ],
    },
    {
      label: '产品中心',
      icon: 'listing',
      collapsible: true,
      children: [
        {
          path: `${base}/productcenter/machine-product-library`,
          label: '机器产品库',
        },
        {
          path: `${base}/productcenter/accessories-management`,
          label: '配件管理',
        },
      ],
    },
    {
      path: `${base}/customerCenter/salesLeads`,
      label: '销售线索管理',
      icon: 'crm',
    },
    {
      label: '学习中心',
      icon: 'about-us',
      collapsible: true,
      children: [
        {
          path: `${base}/extra-pages/about-us`,
          label: '产品培训',
        },
        {
          path: `${base}/extra-pages/contact-us`,
          label: '支持与赋能',
        },
        {
          path: `${base}/extra-pages/pricing-plan`,
          label: '方案与计费',
        },
      ],
    },
    {
      path: 'https://roi.robotxtech.com/',
      label: 'ROI 计算器',
      icon: 'listing',
    },
  ];
}
