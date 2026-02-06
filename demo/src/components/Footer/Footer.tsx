import { currentYear } from '@/utilities/constants/data';
import { Div } from '@jumbo/shared';
import { Typography } from '@mui/material';

const Footer = async ({ lang: _lang }: { lang: string }) => {
  return (
    <Div
      sx={{
        py: 2,
        px: { lg: 6, sm: 4, xs: 2.5 },
        borderTop: 2,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Div
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant={'body1'} color={'text.primary'}>
          {`Copyright Company Name © ${currentYear}`}
        </Typography>
      </Div>
    </Div>
  );
};

export { Footer };
