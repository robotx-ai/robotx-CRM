import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { defaultLayoutConfig } from '@/config/layouts';
import { getMenus } from '@/services';
import { JumboLayout, JumboLayoutProvider } from '@jumbo/components';
import { MenuItems } from '@jumbo/types';
import React from 'react';

interface CommonLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function CommonLayout(props: CommonLayoutProps) {
  const params = await props.params;

  const { lang } = params;

  const { children } = props;

  const menus: MenuItems = await getMenus(lang);
  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header />}
        footer={<Footer />}
        sidebar={<Sidebar menus={menus} />}
      >
        {children}
      </JumboLayout>
    </JumboLayoutProvider>
  );
}
