'use client';

import { Div } from '@jumbo/shared';
import { SxProps, Theme } from '@mui/material';
import Link from '@mui/material/Link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type LogoProps = {
  mini?: boolean;
  mode: 'light' | 'semi-dark' | 'dark';
  sx?: SxProps<Theme>;
};

const supportedLocales = ['en-US', 'ar-SA', 'es-ES', 'fr-FR', 'it-IT', 'zh-CN'];

const Logo = ({ mini = false, mode: _mode = 'light', sx }: LogoProps) => {
  const pathname = usePathname();
  const pathLocale = pathname?.split('/')[1];
  const lang =
    pathLocale && supportedLocales.includes(pathLocale) ? pathLocale : 'en-US';

  return (
    <Div sx={{ display: 'inline-flex', ...sx }}>
      <Link href={`/${lang}/welcome`}>
        {!mini ? (
          <Image
            src={`/assets/images/logos/robotx_logo.webp`}
            alt='Robotx CRM'
            width={110}
            height={35}
            style={{ verticalAlign: 'middle' }}
          />
        ) : (
          <Image
            src={`/assets/images/logos/robotx_logo.webp`}
            alt='Robotx CRM'
            width={35}
            height={35}
            style={{ verticalAlign: 'middle' }}
          />
        )}
      </Link>
    </Div>
  );
};

export { Logo };
