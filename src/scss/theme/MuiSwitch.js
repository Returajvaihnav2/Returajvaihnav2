import { lightColor300 } from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiSwitchTheme = (primaryColor) => ({
  MuiSwitch: {
    track: {
      backgroundColor: lightColor300,
      opacity: '1!important',
    },
    thumb: {
      color: 'white',
      boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24)',
    },
    colorPrimary: {
      '&.Mui-checked + .MuiSwitch-track': {
        backgroundColor: getBrandColors(primaryColor)[100],
      },
      '&.Mui-checked .MuiSwitch-thumb': {
        color: getBrandColors(primaryColor)[500],
      },
    },
  },
});

export default MuiSwitchTheme;
