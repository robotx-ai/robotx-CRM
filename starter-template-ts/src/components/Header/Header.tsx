'use client';
import { useSidebarState } from '@jumbo/components/JumboLayout/hooks';
import { useJumboHeaderTheme } from '@jumbo/components/JumboTheme/hooks';
import { AuthUserPopover } from '../AuthUserPopover';
import { MessagesPopover } from '../MessagesPopover';
import { NotificationsPopover } from '../NotificationsPopover';

import { SIDEBAR_STYLES } from '@jumbo/utilities/constants';

import { Stack } from '@mui/material';
import React from 'react';
import { Logo } from '../Logo';
import { SidebarToggleButton } from '../SidebarToggleButton';
import { TranslationPopover } from '../TranslationPopover';
import { Search } from './Search';
import { SearchIconButtonOnSmallScreen } from './SearchIconButtonOnSmallScreen';
import { ThemeModeOption } from './ThemeModeOptions';

function Header() {
  const { isSidebarStyle } = useSidebarState();

  const [searchVisibility, setSearchVisibility] = React.useState(false);
  const { headerTheme } = useJumboHeaderTheme();

  const handleSearchVisibility = React.useCallback((value: boolean) => {
    setSearchVisibility(value);
  }, []);

  return (
    <React.Fragment>
      <SidebarToggleButton />
      {isSidebarStyle(SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) && (
        <Logo sx={{ mr: 3 }} mode={headerTheme.type ?? 'light'} />
      )}
      <Search show={searchVisibility} onClose={handleSearchVisibility} />
      <Stack direction='row' alignItems='center' gap={1.25} sx={{ ml: 'auto' }}>
        <ThemeModeOption />
        <TranslationPopover />
        <SearchIconButtonOnSmallScreen onClick={handleSearchVisibility} />
        <MessagesPopover />
        <NotificationsPopover />
        <AuthUserPopover />
      </Stack>
    </React.Fragment>
  );
}

export { Header };
