import { darkColor300 } from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiIconButtonTheme = (currentPrimaryColor) => ({
  MuiIconButton: {
    root: {
      height: '40px',
      width: '40px',
      padding: '0px',
      borderRadius: '4px',
      color: darkColor300,
      '&:hover': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
        color: getBrandColors(currentPrimaryColor)[500],
        '& path': {
          stroke: getBrandColors(currentPrimaryColor)[500],
        },
      },
      '&.active': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
        color: getBrandColors(currentPrimaryColor)[500],
        '& path': {
          stroke: getBrandColors(currentPrimaryColor)[500],
        },
      },
      '&.primary-light': {
        'background-color': getBrandColors(currentPrimaryColor)[50],
        color: getBrandColors(currentPrimaryColor)[500],
        '& svg path': {
          stroke: getBrandColors(currentPrimaryColor)[500],
        },
        '&:hover': {
          backgroundColor: getBrandColors(currentPrimaryColor)[100],
        },
      },
    },
  },
});

export default MuiIconButtonTheme;
