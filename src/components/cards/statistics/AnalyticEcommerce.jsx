import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss ,icon , bgcolor}) {
  return (
    <MainCard contentSX={{ p: 2 }}>
      <Stack spacing={1}>
        <Grid container alignItems="center" gap={2} >
        <Grid>
        <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "24%",
              backgroundColor: `${bgcolor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
              {icon}
          </Box>
          </Grid>
          <Grid item>
          
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" color="#000">
          {title}
        </Typography>
        <Grid container alignItems="center">
          {percentage && (
            <Grid item>
              <Chip
                variant="combined"
                color={color}
                label={`${percentage}`}
                size="small"
              />
            </Grid>
          )}
          {isLoss ? <Typography variant="h6" color="text.secondary" ml={1}>
            than last week
            </Typography>:""}
        </Grid>
      </Stack>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string
};
