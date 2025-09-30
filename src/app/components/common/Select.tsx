import { Select, MenuItem } from '@mui/material';

interface SelectModel {
  value?: string;
  label?: string;
}

const SelectCustom = ({
  value = '',
  options = [],
  handleChange = () => {},
}: {
  value?: string | number;
  options?: SelectModel[];
  thumbnail?: string;
  handleChange?: () => void;
}) => {
  return (
    <>
      <Select
        labelId="select-custom"
        id="select-custom"
        value={value}
        size="small"
        onChange={handleChange}
        className="border-none"
      >
        {options.map((option: SelectModel, index: number) => (
          <MenuItem key={`select_option_${index}`} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default SelectCustom;
