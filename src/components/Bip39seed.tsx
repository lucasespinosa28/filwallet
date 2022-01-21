import * as bip39 from 'bip39';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardHeader,
  makeStyles,
  Button,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import saveAddress from './saveAddress';

const useStyles = makeStyles(() => ({
  title: {
    color: 'rgb(33 150 243)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const Bip39seed = () => {
  const classes = useStyles();
  const [Mnemonic, setMnemonic] = useState('test test test test test test test test test test test test test test test test test test test test test test test test');
  useEffect(() => {
    setMnemonic(bip39.generateMnemonic(256));
  }, []);
  const storageSeed = () => {
    localStorage.setItem('seed', Mnemonic);
    saveAddress();
  };
  return (
    <Card variant="outlined">
      <CardHeader
        className={classes.title}
        title="New Mnemonic"
        titleTypographyProps={{ variant: 'h4', align: 'center' }}
      />
      <Link
        style={{
          textDecoration: 'none',
          marginLeft: '8px',
        }}
        to="/"
      >
        <ArrowBackIcon />
      </Link>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={0}
        style={{ marginTop: '10px', marginBottom: '10px' }}
      >
        {Mnemonic.split(' ').map((sentence) => (
          <Paper elevation={3} style={{ margin: '2px', padding: '3px' }}>
            <Typography key={sentence} variant="h6" gutterBottom>
              {sentence}
            </Typography>
          </Paper>
        ))}
      </Grid>
      <Grid
        container
        direction="row-reverse"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Link
          style={{
            textDecoration: 'none',
            textAlign: 'right',
            marginRight: '8px',
          }}
          to="/password"
        >
          <Button
            style={{ marginTop: '10px', marginBottom: '10px' }}
            variant="contained"
            size="small"
            color="primary"
            onClick={storageSeed}
          >
            Confirm Seed
          </Button>
        </Link>
        {/* <Link to="/password" onClick={storageSeed}>
        Confirm seed
      </Link> */}
      </Grid>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        Your phrase is the key to your wallet. Please make sure to write it down
        and save it in a secure location. We CAN NOT retrieve or reset your
        phrase if you lose it.
      </Alert>
      {/* </Grid>
        </Grid> */}
      {/* </Paper> */}
    </Card>
  );
};

export default Bip39seed;
