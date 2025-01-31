
import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/img/logo.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    <>
      <img
        src={logo}
        alt='logo'
        loading="lazy"
        height='60px'
        style={{marginTop: '10px'}}
      />
    </>
  );
};

export default Logo;
