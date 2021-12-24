import { darkColor500 } from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiChipTheme = (primaryColor) => ({
  MuiChip: {
    root: {
      borderRadius: 4,
      fontSize: 12,
      lineHeight: '140%',
    },
    colorPrimary: {
      backgroundColor: getBrandColors(primaryColor)[50],
      color: darkColor500,
    },
  },
});

export default MuiChipTheme;
