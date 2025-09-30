import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Typography } from '@mui/material';
import { getCroppedImg } from '@/utils/helper/getCroppedImg';

type Props = {
  open: boolean;
  imageSrc: string;
  aspect: number;
  type: 'avatar' | 'background';
  onClose: () => void;
  onCropDone: (data: { base64: string; file: File }) => void;
};

const CropDialog = ({ open, imageSrc, aspect, type, onClose, onCropDone }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    const { base64, file } = await getCroppedImg(imageSrc, croppedAreaPixels, type);
    onCropDone({ base64, file });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 18, pb: 1 }}>이미지 자르기</DialogTitle>

      <DialogContent
        sx={{
          position: 'relative',
          height: 400,
          backgroundColor: '#f8f8f8',
          borderRadius: 1,
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            줌
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, z) => setZoom(z as number)}
            sx={{
              color: '#1976d2',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 100,
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleCrop}
          variant="contained"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            minWidth: 100,
            bgcolor: '#1976d2',
            '&:hover': {
              bgcolor: '#115293',
            },
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropDialog;
