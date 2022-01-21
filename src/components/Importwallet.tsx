import * as bip39 from 'bip39';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Card,
  makeStyles,
  CardHeader,
  TextField,
  FormControl,
  Grid,
  Button,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import saveAddress from './saveAddress';

type Input = {
  seed: string;
};

const useStyles = makeStyles(() => ({
  title: {
    color: 'rgb(33 150 243)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const Importwallet = () => {
  const classes = useStyles();
  const { register, watch } = useForm<Input>();
  const [Valid, setValid] = useState(false);

  useEffect(() => {
    if (watch('seed')) {
      console.log(watch('seed'))
      if (bip39.validateMnemonic(watch('seed').replace(/\n/g, ' '))) {
        setValid(true);
      }
    }
  });
  const storageSeed = () => {
    localStorage.setItem('seed', watch('seed'));
    saveAddress();
  };
  return (
    <Card variant="outlined">
      <CardHeader
        className={classes.title}
        title="Wallet Recovery"
        subheader="Enter your Mnemonic Phrase"
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
      <FormControl fullWidth variant="outlined">
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={12}
          variant="outlined"
          {...register('seed')}
        />
      </FormControl>
      <Grid
        container
        direction="row-reverse"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {Valid === true ? (
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
        ) : null}
      </Grid>
    </Card>
  );
};

export default Importwallet;
