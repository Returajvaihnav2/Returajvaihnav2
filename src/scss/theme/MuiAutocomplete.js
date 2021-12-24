import { lightColor100, popupShadow } from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiAutocompleteTheme = (currentPrimaryColor) => ({
  MuiAutocomplete: {
    option: {
      height: '40px',
      '&[data-focus="true"]': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
      },
      '&:active': {
        backgroundColor: lightColor100,
      },
    },
    inputRoot: {
      '&[class*="MuiOutlinedInput-root"]': {
        padding: 0,
        '& .MuiAutocomplete-input:first-child': {
          paddingLeft: '12px',
        },
      },
    },
    popper: {
      filter: `drop-shadow(${popupShadow})`,
    },
    paper: {
      margin: 0,
    },
    listbox: {
      padding: 0,
    },
  },
});

export default MuiAutocompleteTheme;
