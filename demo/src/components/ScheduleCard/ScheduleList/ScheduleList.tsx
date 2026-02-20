import Timeline from '@mui/lab/Timeline';
import { Typography } from '@mui/material';
import React from 'react';
import { defaultScheduleData, type ScheduleDataObject } from '../data';
import { ScheduleItem } from '../ScheduleItem';

type ScheduleListProps = {
  heading?: string;
  emptyText?: string;
  items?: ScheduleDataObject[];
};

const ScheduleList = ({
  heading = "Today's schedule",
  emptyText = 'No items',
  items = defaultScheduleData,
}: ScheduleListProps) => {
  return (
    <React.Fragment>
      <Typography variant={'h5'} color={'text.secondary'} mb={2}>
        {heading}
      </Typography>
      <Timeline
        sx={{
          m: 0,
          p: 0,
        }}
      >
        {items.length > 0 ? (
          items.map((schedule) => {
            return <ScheduleItem item={schedule} key={schedule.id} />;
          })
        ) : (
          <Typography variant={'body2'} color={'text.secondary'}>
            {emptyText}
          </Typography>
        )}
      </Timeline>
    </React.Fragment>
  );
};

export { ScheduleList };
