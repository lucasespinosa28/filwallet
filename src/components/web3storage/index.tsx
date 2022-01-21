import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Card,
    Tabs,
    Tab,
    Paper,
    TableContainer,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
  } from '@material-ui/core';
  import React, { useEffect, useState } from 'react';
  import { SubmitHandler, useForm } from 'react-hook-form';
  import { CIDString, Web3Storage } from 'web3.storage';
  import { Deal, Pin } from 'web3.storage/dist/src/lib/interface';
  import { v4 as uuidv4 } from 'uuid';
  import moment from 'moment';
  import { useHistory } from 'react-router-dom';
  
  function makeStorageClient(AccessToken: string) {
    return new Web3Storage({ token: AccessToken });
  }
  
  const client = (): Web3Storage => {
    return makeStorageClient(`${localStorage.getItem('web3token')}`);
  };
  
  const uploadFIle = async (file: any): Promise<CIDString> => {
    const cid = await client().put(file);
    return cid;
  };
  
  type Inputs = {
    uploadFIle: FileList[];
  };
  
  interface IUploads {
    cid: string;
    created: string;
    dagSize: number;
    deals: Deal[];
    name: string;
    pins: Pin[];
  }
  const loadUploads = async () => {
    const uploads: IUploads[] = [];
    for await (const upload of client().list()) {
      uploads.push({
        cid: upload.cid,
        created: upload.created,
        dagSize: upload.dagSize,
        deals: upload.deals,
        name: upload.name,
        pins: upload.pins,
      });
      // console.log((upload.cid,upload.created,upload.dagSize,upload.deals,upload.name,upload.pins));
    }
    return uploads;
  };
  
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
  
  const Index = () => {
    const [value, setValue] = React.useState(1);
    const history = useHistory();
    const handleChange = (_event: React.ChangeEvent<unknown>, _Value: number) => {
      setValue(_Value);
      if (_Value === 0) {
        history.push('/wallets/filecoin');
      }
    };
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const { register, handleSubmit } = useForm<Inputs>();
    const [uploads, setUploads] = useState<IUploads[]>();
    const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
      uploadFIle(data.uploadFIle)
        .then(() =>
          loadUploads()
            .then((listUploads) => setUploads(listUploads))
            .catch((err) => alert(err))
        )
        .catch((err) => alert(err));
      setOpen(false);
    };
    useEffect(() => {
      if (!localStorage.getItem('web3token')) {
        history.push('/web3storage/savetoken');
      }
    });
    useEffect(() => {
      (async () => {
        loadUploads()
          .then((data) => setUploads(data))
          .catch((err) => alert(err));
      })();
    }, [uploads]);
    const deleteFIle = async (file: CIDString) => {
      client()
        .delete(file)
        .then((result) => alert(result))
        .catch((err) => alert(err));
      loadUploads()
        .then((listUploads) => setUploads(listUploads))
        .catch((err) => alert(err));
    };
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
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Upload file</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent>
                <input {...register('uploadFIle')} type="file" />
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  onClick={handleClose}
                  color="primary"
                  variant="contained"
                >
                  upload
                </Button>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="primary"
            onClick={handleClickOpen}
          >
            File Upload
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Cid</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Pin Status</TableCell>
                <TableCell>Storage Providers</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {uploads &&
                uploads.map((i) => (
                  <TableRow key={uuidv4()}>
                    <TableCell key={uuidv4()}>
                      {moment(Date.parse(i.created)).format('DD-MM-YYYY h:mm:ss')}
                    </TableCell>
                    <TableCell key={uuidv4()}>{i.name}</TableCell>
                    <TableCell key={uuidv4()}>
                      <a
                        href={`https://${i.cid}.ipfs.dweb.link/`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: 'none',
                        }}
                      >
                        {i.cid.substring(0, 4)}...{i.cid.slice(-4)}
                      </a>
                    </TableCell>
                    <TableCell style={{ width: '100px' }} key={uuidv4()}>
                      {formatBytes(i.dagSize)}
                    </TableCell>
                    {i.pins.length > 0 ? (
                      <TableCell key={uuidv4()}>{i.pins[0].status}</TableCell>
                    ) : (
                      <TableCell key={uuidv4()}>Queuing</TableCell>
                    )}
                    {/* <TableCell key={uuidv4()}>{i.pins[0].status}</TableCell> */}
                    {i.deals.length > 0 ? (
                      <TableCell key={uuidv4()}>{i.deals[0].status}</TableCell>
                    ) : (
                      <TableCell key={uuidv4()}>Queuing</TableCell>
                    )}
                    <TableCell key={uuidv4()}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => deleteFIle(i.cid)}
                      >
                        delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  };
  
  export default Index;
  