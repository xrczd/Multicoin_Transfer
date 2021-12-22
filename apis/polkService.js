const WAValidator = require('multicoin-address-validator');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { 
    mnemonicGenerate, 
    mnemonicValidate 
} = require('@polkadot/util-crypto');
const balance = require('crypto-balances');

const keyring = new Keyring({type: 'sr25519'});

const connect = async () => {
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = new ApiPromise({ provider: wsProvider });
    return api.isReady;
};

const createAccount = (mnemonic) => {
    mnemonic = mnemonic && mnemonicValidate(mnemonic) 
        ? mnemonic 
        : mnemonicGenerate();
    const account = keyring.addFromMnemonic(mnemonic);
    return { account, mnemonic };
}

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        const { account: account, mnemonic } = createAccount();
        if (account) {
            resolve({
                success : true,
                address : account.address,
                mnemonic : mnemonic
            })
        } else {
            resolve({
                success : false,
                msg : "Polk Adot Server Error"
            })
        }
    })
}

const getBalance = (address) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'dot')) {
            connect().then(async (api) => {
                if (api.isConnected) {
                    await api.derive.balances.all(address).then(balance => {
                        resolve({
                            success : true,
                            balance : balance.availableBalance.negative
                        })
                    }).catch(err => {
                        resolve({
                            success : false,
                            msg : "Polk Adot Server Error"
                        })
                    });
                } else {
                    resolve({
                        success : false,
                        msg : "Polk Adot Server Error"
                    })
                }
            })
            .catch((err) => {
                resolve({
                    success : false,
                    msg : "Polk Adot Server Error"
                })
            })
        } else {
            resolve({
                success : false,
                msg : "Wallet Address Error"
            })
        }
    })
}

module.exports = {
    walletGeneration,
    getBalance,
}