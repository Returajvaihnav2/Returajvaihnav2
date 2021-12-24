import { darkColor500, lightColor300, lightColor50 } from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiButtonTheme = (currentPrimaryColor) => ({
  MuiButton: {
    root: {
      minHeight: '40px',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.4px',
    },
    contained: {
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
    },
    containedPrimary: {
      '&:hover': {
        backgroundColor: getBrandColors(currentPrimaryColor)[400],
      },
      '&.Mui-disabled': {
        backgroundColor: lightColor300,
        color: lightColor50,
      },
    },
    textPrimary: {
      color: darkColor500,
      '&:hover': {
        color: `${getBrandColors(currentPrimaryColor)[500]}!important`,
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
        '& path': {
          fill: getBrandColors(currentPrimaryColor)[500],
        },
      },
    },
    outlinedPrimary: {
      borderColor: getBrandColors(currentPrimaryColor)[500],
      '&:hover': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
      },
    },
    iconSizeLarge: {
      '& > *:first-child': {
        fontSize: '24px',
      },
    },
    containedSecondary: {
      color: `${getBrandColors(currentPrimaryColor)[500]}!important`,
      backgroundColor: getBrandColors(currentPrimaryColor)[50],
      '&:hover': {
        color: `${getBrandColors(currentPrimaryColor)[400]}!important`,
        backgroundColor: getBrandColors(currentPrimaryColor)[100],
      },
    },
  },
});

export default MuiButtonTheme;
