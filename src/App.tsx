import {
  Button,
  Card,
  CardHeader,
  Grid,
  makeStyles,
  CardContent,
  TextField,
} from '@material-ui/core';
import sha256 from 'crypto-js/sha256';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import CreateWallet from './components/Bip39seed';
import ImportWallet from './components/Importwallet';
import Password from './components/Password';
import Wallet from './components/wallets/filecoin';
// import Web3Storage from './components/web3storage';
// import SaveToken from './components/web3storage/saveToken';

type Input = {
  password: string;
};

const useStyles = makeStyles(() => ({
  title: {
    color: 'rgb(33 150 243)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

const Welcome = () => {
  const classes = useStyles();
  const { register, watch } = useForm<Input>();
  const [accountExist, setaccountExist] = useState(false);
  const [confirm, setconfirm] = useState('secondary');
  useEffect(() => {
    if (localStorage.getItem('hash')) {
      setaccountExist(true);
      const hash = localStorage.getItem('hash');
      if (hash === sha256(watch('password')).toString()) {
        setconfirm('primary');
      } else {
        setconfirm('secondary');
      }
    }
  });
  return (
    <Card>
      <CardHeader
        className={classes.title}
        color="info.main"
        title="Welcome to FilWallet"
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
            {accountExist === true ? (
    <><Grid item xs={12}>
              <TextField
                label="Wallet password"
                type="password"
                variant="filled"
                color={confirm}
                {...register('password')} />
            </Grid><Grid item xs={12}>
                {confirm === 'primary' ? (
                  <Link style={{ textDecoration: 'none' }} to="/wallets/filecoin">
                    <Button style={{ minWidth: '225px' }} variant="contained" size="large" color="primary">
                      confirm password
                    </Button>
                  </Link>
                ) : (
                  <Button style={{ minWidth: '225px' }} variant="contained" size="large" disabled>
                    confirm password
                  </Button>
                )}
              </Grid></>
              ):<div/>}


        <Grid item xs={12}>
          <Link style={{ textDecoration: 'none',minWidth:'225px' }} to="/ImportWallet">
          <Button style={{ minWidth:'225px' }} variant="contained" size="large" color="primary">
              Import wallet
          </Button>
        </Link>

</Grid>
<Grid item xs={12}>
        <Link  style={{ textDecoration: 'none' }} to="/CreateWallet">
          <Button style={{ minWidth:'225px' }} variant="outlined" size="large" color="primary">
            New wallet
          </Button>
        </Link>
</Grid>
</Grid>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <Router>
      <div style={{background: "linear-gradient(340deg, rgba(2,168,255,1) 0%, rgba(188,201,255,1) 100%)"}}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}
        >
          <Switch>
            <Route path="/password">
              <Password />
            </Route>
            <Route path="/createwallet">
              <CreateWallet />
            </Route>
            <Route path="/wallets/filecoin">
              <Wallet />
            </Route>
            <Route path="/importwallet">
              <ImportWallet />
            </Route>
            {/* <Route path="/web3storage/savetoken">
              <SaveToken />
            </Route>
            <Route path="/web3storage">
              <Web3Storage />
            </Route> */}
            <Route path="/">
              <Welcome />
            </Route>
          </Switch>
        </Grid>
      </div>
    </Router>
  );
}
