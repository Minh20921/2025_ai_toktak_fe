import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

const ProfileTooltip = ({
  text = '',
  offset = [10, 8],
  align = 'center',
}: {
  text: string;
  offset?: Array<number>;
  align?: 'center' | 'left' | 'right';
}) => {
  return (
    <Box className="relative">
      <Tooltip
        title={
          <Typography
            sx={{
              fontSize: '10px',
              whiteSpace: 'pre-line',
              textAlign: align,
              fontWeight: 500,
              lineHeight: '14px',
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          ></Typography>
        }
        enterTouchDelay={0}
        placement="bottom"
        arrow
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: offset,
              },
            },
          ],
        }}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#FFFFFF',
              color: '#4776EF',
              border: '1px solid #4776EF',
              borderRadius: '999px',
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
              padding: '6px 13px',
              mt: '0px !important',
            },
          },
          arrow: {
            sx: {
              color: '#FFFFFF',
              '&::before': {
                border: '1px solid #4776EF',
              },
            },
          },
        }}
      >
        <IconButton sx={{ p: 0.5 }}>
          <Icon
            icon={'si:info-fill'}
            onClick={() => {}}
            className="cursor-pointer"
            width={13}
            height={13}
            color="#4776EF"
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default ProfileTooltip;
