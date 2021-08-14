import {
  HttpJsonRpcConnector,
  LotusClient,
  MnemonicWalletProvider,
} from 'filecoin.js';

export default async function saveAddress() {
  const Mnemonic = localStorage.getItem('seed');
  // console.log(Mnemonic);
  const httpConnector = new HttpJsonRpcConnector(
    'https://calibration.node.glif.io'
  );
  const lotusClient = new LotusClient(httpConnector);
  const mnemonicWalletProvider = new MnemonicWalletProvider(
    lotusClient,
    `${Mnemonic}`,
    ''
  );
  const mnemonicAddress = await mnemonicWalletProvider.getDefaultAddress();
  localStorage.setItem('address', mnemonicAddress);
}
