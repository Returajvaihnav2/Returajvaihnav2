// eslint-disable-next-line camelcase
import { createMuiTheme, unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import { primaryFontFamily } from '../styles/variables.module.scss';
import MuiButtonTheme from './MuiButton';
import MuiOutlinedInputTheme from './MuiOutlinedInput';
import MuiCheckboxTheme from './MuiCheckbox';
import MuiTypographyTheme from './MuiTypography';
import MuiPaperTheme from './MuiPaper';
import MuiLinkTheme from './MuiLink';
import MuiSwitchTheme from './MuiSwitch';
import MuiTableTheme from './MuiTable';
import MuiTooltipTheme from './MuiTooltip';
import MuiSelectTheme from './MuiSelect';
import MuiListTheme from './MuiList';
import MuiAutocompleteTheme from './MuiAutocomplete';
import MuiIconButtonTheme from './MuiIconButton';
import MuiChipTheme from './MuiChipTheme';

const isDevelopment = process.env.NODE_ENV === 'development';
// eslint-disable-next-line camelcase
const createTheme = isDevelopment ? unstable_createMuiStrictModeTheme : createMuiTheme;

const theme = (primaryColor, secondaryColor) => createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  typography: {
    fontFamily: [
      primaryFontFamily,
    ],
    fontSize: 12,
  },
  spacing: 4,
  overrides: {
    ...MuiButtonTheme(primaryColor),
    ...MuiOutlinedInputTheme(primaryColor),
    ...MuiCheckboxTheme,
    ...MuiTypographyTheme,
    ...MuiPaperTheme,
    ...MuiLinkTheme(primaryColor),
    ...MuiSwitchTheme(primaryColor),
    ...MuiTableTheme(primaryColor),
    ...MuiTooltipTheme,
    ...MuiSelectTheme,
    ...MuiListTheme(primaryColor),
    ...MuiAutocompleteTheme(primaryColor),
    ...MuiIconButtonTheme(primaryColor),
    ...MuiChipTheme(primaryColor),
  },
});

export default theme;
