'use client';
import { JumboDdMenu } from '@jumbo/components/JumboDdMenu';
import Avatar from '@mui/material/Avatar';
import { FeaturedCard3 } from '../FeaturedCard3';
import { defaultScheduleData, type ScheduleDataObject } from './data';
import { ScheduleList } from './ScheduleList';

type ScheduleCardProps = {
  title?: string;
  subheader?: string;
  avatarLabel?: string | number;
  listHeading?: string;
  emptyText?: string;
  items?: ScheduleDataObject[];
};

function ScheduleCard({
  title = 'Monday',
  subheader = 'December 2023',
  avatarLabel = 28,
  listHeading = "Today's schedule",
  emptyText = 'No items',
  items = defaultScheduleData,
}: ScheduleCardProps) {
  return (
    <FeaturedCard3
      bgcolor={['#843CF6', '#38B8F2']}
      textColor='common.white'
      action={
        <JumboDdMenu
          menuItems={[{ title: 'Setup a call' }, { title: 'Schedule a task' }]}
        />
      }
      avatar={
        <Avatar
          sx={{
            bgcolor: 'common.white',
            height: 90,
            width: 90,
            fontSize: 28,
            color: '#475259',
            boxShadow: 2,
            margin: '0 auto 16px',
          }}
        >
          {avatarLabel}
        </Avatar>
      }
      title={title}
      subheader={subheader}
      headerSx={{ pt: 0, mt: -0.5 }}
      contentSx={{
        textAlign: 'left',
        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      <ScheduleList heading={listHeading} emptyText={emptyText} items={items} />
    </FeaturedCard3>
  );
}

export { ScheduleCard };
