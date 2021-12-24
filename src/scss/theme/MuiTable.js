import { darkColor500, lightColor100, borderColor } from '../styles/variables.module.scss';
import getBrandColors from './getBrandColors';

const MuiTableTheme = (currentPrimaryColor) => ({
  MuiTable: {
    root: {
      color: darkColor500,
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
    },
  },
  MuiTableRow: {
    root: {
      '&:hover': {
        backgroundColor: getBrandColors(currentPrimaryColor)[50],
      },
    },
  },
  MuiTableCell: {
    head: {
      paddingTop: '14px',
      paddingBottom: '14px',
      fontWeight: '700',
      color: darkColor500,
      backgroundColor: `${lightColor100}!important`,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: borderColor,
    },
    root: {
      paddingLeft: '8px',
      paddingRight: '14px',
      paddingTop: '8px',
      paddingBottom: '8px',
      borderBottomColor: borderColor,
      '&:first-child': {
        borderLeftWidth: '1px',
        borderLeftStyle: 'solid',
        borderLeftColor: borderColor,
      },
      '&:last-child': {
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: borderColor,
      },
    },
  },
});

export default MuiTableTheme;
