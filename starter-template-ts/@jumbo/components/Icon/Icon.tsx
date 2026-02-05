import { SvgIconProps } from '@mui/material';
import React from 'react';
import { APP_ICONS } from '../../../src/utilities/constants/icons';

type CustomIconProps = SvgIconProps & {
  name?: string;
};

function Icon({ name, ...props }: CustomIconProps): React.ReactNode {
  if (!name) return '';

  const appIcon = APP_ICONS.find((icon) => {
    return icon.name === name;
  });

  if (!appIcon) {
    return name ?? '';
  }

  const { Component } = appIcon;

  return <Component {...props} />;
}
export { Icon };
