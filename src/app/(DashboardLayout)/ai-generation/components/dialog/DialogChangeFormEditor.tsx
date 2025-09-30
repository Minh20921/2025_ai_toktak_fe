import { Box, Dialog, DialogContent, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import ExploreModel from '../model/ExploreModel';
import UploadsModel from '../model/UploadsModel';
import iconClose from '@/../public/images/generation/close.png';
function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
interface IDialogChangeFormEditor {
  open: boolean;
  handleClose: () => void;
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  setFile: React.Dispatch<React.SetStateAction<File | null | string>>;
  setSelectedUpload: Dispatch<SetStateAction<number | null>>;
}
const DialogChangeFormEditor = ({
  open,
  handleClose,
  activeTab,
  handleTabChange,
  setFile,
  setSelectedUpload,
}: IDialogChangeFormEditor) => {
  const theme = useTheme();
  return (
    <Dialog
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        sx: {
          width: '735px',
          maxWidth: '735px',
        },
      }}
      className="hide-scrollbar"
    >
      <DialogContent className="hide-scrollbar" sx={{ padding: '24px !important' }}>
        <Box>
          <Box className="flex items-center justify-between mb-[24px]">
            <Typography variant="h4" component="h1" className="font-pretendard font-bold sm:block text-[24px]">
              미디어 가져오기
            </Typography>
            <Image className="cursor-pointer" onClick={() => setSelectedUpload(null)} src={iconClose} alt="iconClose" />
          </Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile editor tabs"
            variant="fullWidth"
            TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
            sx={{
              '& .MuiTab-root': {
                minHeight: '40px',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: '18px',
                minWidth: '195px',
                maxWidth: '195px',
              },
              '& .MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                height: '2px',
              },
              '& .MuiTabs-indicatorSpan': {
                maxWidth: '60%',
                width: '100%',
                height: '2px',
                backgroundColor: '#537EEF',
              },
            }}
          >
            <Tab icon={undefined} iconPosition="start" label="AI 콘텐츠" {...a11yProps(0)} />
            <Tab icon={undefined} iconPosition="start" label="업로드" {...a11yProps(1)} />
          </Tabs>
          <Box className="mt-[24px]">
            {activeTab === 0 && <ExploreModel setFile={setFile} onClose={() => setSelectedUpload(null)} />}
            {activeTab === 1 && <UploadsModel setFile={setFile} onClose={() => setSelectedUpload(null)} />}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DialogChangeFormEditor;
