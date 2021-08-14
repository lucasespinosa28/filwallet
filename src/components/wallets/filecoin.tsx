/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  Card,
  CardHeader,
  makeStyles,
  Tabs,
  Tab,
  TextField,
  CardContent,
  FormControl,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import SendIcon from '@material-ui/icons/Send';
import getBalance from './Balance';
import sendTranscation from './sendTranscation';

const useStyles = makeStyles(() => ({
  title: {
    color: 'rgb(33 150 243)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  root: {
    flexGrow: 1,
  },
  marginInput: {
    margin: '8px',
  },
}));

type Inputs = {
  to: string;
  amount: string;
};

/* <li>
{localStorage.getItem('web3token') === null ? (
  <Link to="/web3storage/savetoken">Web3Storage</Link>
) : (
  <Link to="/web3storage">Web3Storage</Link>
)}
</li>  */

const Index = () => {
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const handleChange = (_event: React.ChangeEvent<unknown>, _Value: number) => {
    setValue(_Value);
    if (_Value === 1) {
      if (localStorage.getItem('web3token') === null) {
        history.push('/web3storage/savetoken');
      }
      history.push('/web3storage');
    }
  };
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [transcationData, settranscationData] = useState<Inputs>({
    to: '',
    amount: '',
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [lastTranscation, setlastTranscation] = useState('');
  const sendTrascation = async () => {
    setOpen(false);
    const tx = await sendTranscation(transcationData);
    setlastTranscation(
      `https://calibration.filscout.com/en/message/${tx['/']}`
    );
  };
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    settranscationData(data);
    // AlertDialog();
  };

  const [balance, setBalance] = useState('');
  const [address, setAddress] = useState('');
  const [explorer, setExplorer] = useState('');
  useEffect(() => {
    setAddress(`${localStorage.getItem('address')}`);
    setExplorer(`https://calibration.filscout.com/en/account/${address}`);
    getBalance()
      .then((data) => setBalance(data))
      .catch((err) => setBalance(err));
    setInterval(async () => {
      getBalance()
        .then((data) => setBalance(data))
        .catch((err) => setBalance(err));
    }, 1000 * 5);
  }, [address]);
  return (
    <Card variant="outlined">
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="Filecoin wallet" />
          <Tab label="Web3storage" />
        </Tabs>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you want to send ⨎{transcationData.amount} to {transcationData.to}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            No
          </Button>
          <Button onClick={sendTrascation} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        spacing={3}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Paper style={{ margin: '8px', width: '540px' }} elevation={3}>
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
              Address: {address}
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              color="primary"
              style={{
                marginLeft: '8px',
              }}
            >
              Balance:⨎{balance}
            </Typography>
            <a
              href={explorer}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                marginLeft: '8px',
              }}
            >
              <Button
                variant="contained"
                style={{
                  textDecoration: 'none',
                  marginTop: '40px',
                  marginBottom: '8px',
                }}
              >
                See all the transactions
              </Button>
            </a>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} direction="column">
            <Paper
              style={{ margin: '8px', width: '540px', marginBottom: '25px' }}
              elevation={3}
            >
              <Card variant="outlined">
                <CardHeader
                  className={classes.title}
                  color="info.main"
                  title="Send  transcation"
                  titleTypographyProps={{ variant: 'h4', align: 'center' }}
                />
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="To"
                        variant="outlined"
                        {...register('to', {
                          required: true,
                          pattern: /[t][0-9a-zA-Z]{40,}/i,
                        })}
                        className={classes.marginInput}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        id="outlined-basic"
                        label="Amount"
                        variant="outlined"
                        {...register('amount', { required: true })}
                        className={classes.marginInput}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      onClick={handleClickOpen}
                      variant="contained"
                      color="primary"
                      className={classes.marginInput}
                    >
                      <SendIcon />
                      Send
                    </Button>
                    {lastTranscation && (
                      <a
                        href={lastTranscation}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                        }}
                      >
                        <Button variant="contained">
                          Open last transcation
                        </Button>
                      </a>
                    )}
                  </form>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Index;
