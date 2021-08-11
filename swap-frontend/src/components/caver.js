import Caver from 'caver-js'
import {keystore, password} from "../personal";

export const klaytn = window.klaytn;

export const caver = new Caver(klaytn)
// export const caver = new Caver(window['klaytn']);
const keyring = caver.wallet.keyring.decrypt(keystore,password);
//add keyring to wallet
caver.wallet.add(keyring)
