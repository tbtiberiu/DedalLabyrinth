import React, { useState } from 'react';
import styles from './NewLabyrinthDialog.module.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  SlideProps,
  Slider,
  TextField,
  Typography,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewLabyrinthDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmitClicked: (
    rowCount: number,
    columnCount: number,
    density: number
  ) => void;
}> = ({ open, onClose, onSubmitClicked }) => {
  const marks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 20,
      label: '20%',
    },
    {
      value: 40,
      label: '40%',
    },
  ];

  function valuetext(value: number) {
    return `${value}%`;
  }

  const textFieldStyle = {
    // Root class for the input field
    '& .MuiOutlinedInput-root': {
      color: '#000',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      // Class for the border around the input field
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a1a1a',
        borderWidth: '2px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a1a1a',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFD700',
      },
    },
    // Class for the label of the input field
    '& .MuiInputLabel-outlined': {
      color: '#1a1a1a',
      fontWeight: 'bold',
    },
  };

  const sliderStyle = {
    color: '#1a1a1a',
    '& .MuiSlider-thumb': {
      border: '3px solid #FFD700',
    },
  };

  const [formData, setFormData] = useState({
    rowCount: '',
    columnCount: '',
  });
  const [density, setDensity] = React.useState(30);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setDensity(newValue as number);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitClicked(+formData.rowCount, +formData.columnCount, density);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="rowCount"
            label="Rows count:"
            type="number"
            value={formData.rowCount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={textFieldStyle}
          />
          <TextField
            name="columnCount"
            label="Column count:"
            type="number"
            value={formData.columnCount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={textFieldStyle}
          />
          <Typography id="input-slider" gutterBottom>
            Density:
          </Typography>
          <Slider
            aria-label="Density"
            value={typeof density === 'number' ? density : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            getAriaValueText={valuetext}
            marks={marks}
            valueLabelDisplay="on"
            min={0}
            max={40}
            sx={sliderStyle}
          />
          <DialogActions className={styles.DialogActions}>
            <Button className={styles.DialogButton} onClick={onClose}>
              Cancel
            </Button>
            <Button className={styles.DialogButton} type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLabyrinthDialog;
