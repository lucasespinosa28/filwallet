import { ethers } from 'ethers';
import {
  HttpJsonRpcConnector,
  LotusClient,
  MnemonicWalletProvider,
} from 'filecoin.js';

export default async function getBalance() {
  const Mnemonic = localStorage.getItem('seed');
  const address = localStorage.getItem('address');
  const httpConnector = new HttpJsonRpcConnector(
    'https://calibration.node.glif.io'
  );
  const lotusClient = new LotusClient(httpConnector);
  const mnemonicWalletProvider = new MnemonicWalletProvider(
    lotusClient,
    `${Mnemonic}`,
    ''
  );
  const balance = await mnemonicWalletProvider.getBalance(`${address}`);
  return ethers.utils.formatEther(balance).toString();
}
