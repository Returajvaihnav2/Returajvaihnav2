import {
  inputBorderColor,
} from '../styles/variables.module.scss';

const MuiCheckboxTheme = {
  MuiCheckbox: {
    root: {
      '& .MuiIconButton-label': {
        width: '31px',
        height: '31px',
      },
      '& .MuiSvgIcon-root': {
        width: '100%',
        height: '100%',
      },
      '& .MuiCheckbox-icon': {
        borderRadius: 2,
        width: 'calc(100% - 7px)',
        height: 'calc(100% - 7px)',
        padding: 0,
        backgroundColor: 'white',
        border: `1px solid ${inputBorderColor}`,
      },
    },
  },
};

export default MuiCheckboxTheme;
