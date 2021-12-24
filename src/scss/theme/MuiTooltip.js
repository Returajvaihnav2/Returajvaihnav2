import { darkColor300, smallMobileWidth } from '../styles/variables.module.scss';

const mediaMinWidthSmallMobile = `@media (min-width: ${smallMobileWidth})`;

const MuiTooltipTheme = {
  MuiTooltip: {
    tooltip: {
      fontSize: '12px',
      lineHeight: '140%',
      paddingTop: '8px',
      paddingRight: '12px',
      paddingBottom: '8px',
      paddingLeft: '12px',
      backgroundColor: darkColor300,
    },
    arrow: {
      color: darkColor300,
    },
    tooltipPlacementTop: {
      marginTop: '16px',
      [mediaMinWidthSmallMobile]: {
        marginTop: '16px',
      },
    },
  },
};

export default MuiTooltipTheme;
