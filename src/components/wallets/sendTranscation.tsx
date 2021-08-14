import { ethers } from 'ethers';
import {
  HttpJsonRpcConnector,
  LotusClient,
  MnemonicWalletProvider,
} from 'filecoin.js';
import BigNumber from 'bignumber.js';

const endpoint = 'https://calibration.node.glif.io';

type Inputs = {
  to: string;
  amount: string;
};
export default async function sendTranscation(payload: Inputs) {
  const httpConnector = new HttpJsonRpcConnector({ url: endpoint });
  const lotusClient = new LotusClient(httpConnector);
  const mnemonicWalletProvider = new MnemonicWalletProvider(
    lotusClient,
    `${localStorage.getItem('seed')}`,
    ''
  );
  const account = await mnemonicWalletProvider.getDefaultAddress();
  const message = await mnemonicWalletProvider.createMessage({
    From: account,
    To: payload.to,
    Value: new BigNumber(ethers.utils.parseEther(payload.amount).toString()),
  });
  const signedMessage = await mnemonicWalletProvider.signMessage(message);
  const msgCid = await mnemonicWalletProvider.sendSignedMessage(signedMessage);
  return msgCid;
}
