import {
  inputBorderColor,
  inputTextColor,
  darkColor300,
  darkColor500,
  darkColor200,
} from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiOutlinedInputTheme = (currentPrimaryColor) => ({
  MuiOutlinedInput: {
    root: {
      fontSize: '14px',
      fontWeight: '400',
      borderColor: inputBorderColor,
      backgroundColor: 'white!important',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: inputBorderColor,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: getBrandColors(currentPrimaryColor)[500],
      },
      '&.Mui-focused .MuiInputAdornment-root': {
        color: getBrandColors(currentPrimaryColor)[500],
      },
    },
    input: {
      position: 'relative',
      order: '1',
      height: '40px',
      width: 'calc(100% - 26px)',
      boxSizing: 'border-box',
      paddingTop: '0',
      paddingBottom: '0',
      color: `${darkColor500}!important`,
      '&:-internal-autofill-selected': {
        color: `${inputTextColor}!important`,
      },
    },
    inputAdornedStart: {
      paddingLeft: '8px',
    },
  },
  MuiInputAdornment: {
    root: {
      position: 'relative',
      left: '10px',
      color: darkColor300,
    },
  },
  MuiInputLabel: {
    outlined: {
      color: darkColor200,
      transform: 'translate(40px, 12px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.85) !important',
      },
      '&[for="combo-box-demo"]': {
        transform: 'translate(12px, 12px) scale(1)',
      },
    },
    root: {
      '&.Mui-focused': {
        color: darkColor300,
      },
    },
  },
  MuiFormControlLabel: {
    label: {
      fontSize: '14px',
    },
  },
});

export default MuiOutlinedInputTheme;
