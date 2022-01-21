import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SHA256 } from 'crypto-js';
import {
  Grid,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core';
import { ConfirmColors } from './ConfirmColors';

type Inputs = {
  passwordOriginal: string;
  passwordConfirm: string;
};

const useStyles = makeStyles(() => ({
  title: {
    color: 'rgb(33 150 243)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const Password = () => {
  const classes = useStyles();
  const { register, watch } = useForm<Inputs>();
  const [Valid, setValid] = useState(false);
  const [confirm, setconfirm] = useState<ConfirmColors>(
    ConfirmColors.secondary
  );
  useEffect(() => {
    if (watch('passwordOriginal') === undefined) {
      setValid(false);
    }
    if (
      `${watch('passwordOriginal')}`.length > 5 &&
      watch('passwordOriginal') !== undefined &&
      watch('passwordOriginal') === watch('passwordConfirm')
    ) {
      localStorage.setItem(
        'hash',
        SHA256(watch('passwordOriginal')).toString()
      );
      setValid(true);
      setconfirm(ConfirmColors.primary);
    } else {
      setValid(false);
      setconfirm(ConfirmColors.secondary);
    }
  });
  return (
    <Card variant="outlined">
      <CardHeader
        className={classes.title}
        color="info.main"
        title="Wallet's password"
        subheader="Set a password for your wallet"
        titleTypographyProps={{ variant: 'h4', align: 'center' }}
      />
      <CardContent>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <form>
            <Grid item xs={12}>
              <TextField
                {...register('passwordOriginal')}
                type="password"
                label="Original"
                variant="outlined"
                InputProps={{ inputProps: { min: 6 } }}
                color={confirm}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('passwordConfirm')}
                type="password"
                label="Repeat"
                variant="outlined"
                style={{ marginTop: '20px' }}
                color={confirm}
              />
            </Grid>
          </form>
          <Grid item xs={12}>
            {Valid === true ? (
              <Link
                onClick={() => {
                  setValid(false);
                }}
                style={{ textDecoration: 'none' }}
                to="/wallet"
              >
                <Button
                  style={{ minWidth: '229px' }}
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
              </Link>
            ) : (
              <Button
                style={{ minWidth: '229px' }}
                variant="contained"
                color="primary"
                disabled
              >
                Confirm
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            <Link
              onClick={() => {
                setValid(false);
              }}
              style={{ textDecoration: 'none' }}
              to="/"
            >
              <Button
                style={{ minWidth: '229px' }}
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Password;
