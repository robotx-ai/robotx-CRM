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
        label: 'Data Center',
        icon: 'metric',
        collapsible: true,
        children: [
          {
            path: `${base}/metrics`,
            label: 'Performance Metrics',
          },
          {
            path: `${base}/dashboards/news`,
            label: 'Insights Feed',
          },
          {
            path: `${base}/modules/charts/area`,
            label: 'Analytics Charts',
          },
        ],
      },
      {
        path: `${base}/apps/chat`,
        label: 'App Center',
        icon: 'chat',
      },
      {
        label: 'Log Center',
        icon: 'news',
        collapsible: true,
        children: [
          {
            path: `${base}/dashboards/news`,
            label: 'Activity Logs',
          },
          {
            path: `${base}/metrics`,
            label: 'System Metrics',
          },
          {
            path: `${base}/widgets`,
            label: 'Monitoring Widgets',
          },
        ],
      },
      {
        label: 'File Center',
        icon: 'dropzone',
        collapsible: true,
        children: [
          {
            path: `${base}/apps/mail/inbox`,
            label: 'Documents',
          },
          {
            path: `${base}/apps/invoice`,
            label: 'Invoices',
          },
          {
            path: `${base}/extra-pages/call-outs`,
            label: 'File Requests',
          },
        ],
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
        label: 'System Management',
        icon: 'settings-outlined',
        collapsible: true,
        children: [
          {
            path: `${base}/user/settings/public-profile`,
            label: 'Account Settings',
          },
          {
            path: `${base}/user/settings/security`,
            label: 'Security & Access',
          },
          {
            path: `${base}/user/settings/billing`,
            label: 'Billing Controls',
          },
        ],
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
      label: '数据中心',
      icon: 'metric',
      collapsible: true,
      children: [
        {
          path: `${base}/metrics`,
          label: '绩效指标',
        },
        {
          path: `${base}/dashboards/news`,
          label: '洞察资讯',
        },
        {
          path: `${base}/modules/charts/area`,
          label: '分析图表',
        },
      ],
    },
    {
      path: `${base}/apps/chat`,
      label: '应用中心',
      icon: 'chat',
    },
    {
      label: '日志中心',
      icon: 'news',
      collapsible: true,
      children: [
        {
          path: `${base}/dashboards/news`,
          label: '活动日志',
        },
        {
          path: `${base}/metrics`,
          label: '系统指标',
        },
        {
          path: `${base}/widgets`,
          label: '监控组件',
        },
      ],
    },
    {
      label: '文件中心',
      icon: 'dropzone',
      collapsible: true,
      children: [
        {
          path: `${base}/apps/mail/inbox`,
          label: '文档',
        },
        {
          path: `${base}/apps/invoice`,
          label: '发票',
        },
        {
          path: `${base}/extra-pages/call-outs`,
          label: '文件请求',
        },
      ],
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
      label: '系统管理',
      icon: 'settings-outlined',
      collapsible: true,
      children: [
        {
          path: `${base}/user/settings/public-profile`,
          label: '账号设置',
        },
        {
          path: `${base}/user/settings/security`,
          label: '安全与权限',
        },
        {
          path: `${base}/user/settings/billing`,
          label: '账单管理',
        },
      ],
    },
  ];
}
