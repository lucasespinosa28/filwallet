/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Card,
  CardHeader,
  makeStyles,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

type Inputs = {
  token: string;
};

const useStyles = makeStyles(() => ({
  title: {
    color: 'rgb(33 150 243)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const Index = () => {
  const classes = useStyles();
  const { control, handleSubmit } = useForm<Inputs>();
  const history = useHistory();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    localStorage.setItem('web3token', data.token);
    if (data.token !== '') {
      history.push('/web3storage');
    }
  };

  return (
    <Card variant="outlined">
      <CardHeader
        className={classes.title}
        title="Web3storage token"
        titleTypographyProps={{ variant: 'h4', align: 'center' }}
      />
      <Link
        style={{
          textDecoration: 'none',
          marginLeft: '8px',
        }}
        to="/wallets/filecoin"
      >
        <ArrowBackIcon />
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          fullWidth
          variant="outlined"
          style={{ margin: '8px', width: '540px' }}
        >
          <Controller
            name="token"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <OutlinedInput multiline rows={12} {...field} />
            )}
          />
        </FormControl>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Button
            style={{ marginTop: '10px', marginBottom: '10px' }}
            variant="contained"
            size="small"
            color="primary"
            type="submit"
          >
            Save token
          </Button>
        </Grid>
      </form>
      <a href="https://web3.storage/account/" target="_blank" rel="noreferrer">
        <Typography
          variant="h6"
          component="h1"
          color="primary"
          style={{
            marginTop: '8px',
            marginLeft: '8px',
            marginRight: '8px',
          }}
        >
          Find your token at web3.storage
        </Typography>
      </a>
    </Card>
  );
};

export default Index;
