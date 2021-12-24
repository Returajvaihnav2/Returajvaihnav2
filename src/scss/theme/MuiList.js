import {
  lightColor100,
  darkColor500,
} from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiListTheme = (currentPrimaryColor) => ({
  MuiList: {
    padding: {
      paddingTop: '0',
      paddingBottom: '0',
    },
  },
  MuiListItem: {
    root: {
      color: darkColor500,
      '&.Mui-selected': {
        backgroundColor: lightColor100,
      },
      '&.Mui-selected:hover': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
      },
    },
    button: {
      '&:hover': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
      },
    },
  },
});

export default MuiListTheme;
