const Web3 = require("web3");
const Constant = require('../config/Constant');
const WAValidator = require('multicoin-address-validator');
const { create, all } = require('mathjs');
const config = {
  number: 'BigNumber',
  precision: 20
}
const math = create(all, config)
const Web3Client = new Web3(new Web3.providers.HttpProvider(Constant.BSC.PUBLIC_RPC));

const minABI = [
    // balanceOf
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
    //transfer
    {
        constant: false,
        inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
        name: "transfer",
        outputs: [{ name: '', type: "bool"}],
        type: "function"
    }
];

// Generate new wallet
const walletGeneration = () => {
    return new Promise((resolve, reject) => {
        var newWallet = Web3Client.eth.accounts.create();
        if (newWallet && newWallet.address !='' && newWallet.privateKey != '') {
            resolve({success : true, address : newWallet.address, privateKey : newWallet.privateKey})
        } else {
            resolve({success : false, msg : "Binance Server Error"});
        }
    })
}

// Get the balance according to coin name from address
const getBalance = (address, coin) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(address, 'eth')) {
            let tokenAddress = "";

            if (coin.toUpperCase() == "SAFEMOON") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.SAFEMOON;
            } else if (coin.toUpperCase() == "INJ") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.INJECTIVEPROTOCAL_INJ;
            } else if (coin.toUpperCase() == "CAKE") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.PANCAKESWAP_CAKE;
            } else if (coin.toUpperCase() == "ETC") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.ETHEREUMCLASSIC_ETC;
            } else if (coin.toUpperCase() == "WIN") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.WINKLINK;
            }
            
            if (tokenAddress != "") {
                const walletAddress = address;
            
                const contract = new Web3Client.eth.Contract(minABI, tokenAddress);

                async function getBalance() {
                    const result = await contract.methods.balanceOf(walletAddress).call();
                    
                    const format = Web3Client.utils.fromWei(result);
                    resolve({success : true, balance : format});
                }
                
                getBalance();
            } else {
                resolve({success : false, msg : "Coin Name Error"});
            }
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    });
};

// Transfer token from one to another wallet
const tokenTransfer = (fromAddress, toAddress, coin, amount, privateKey) => {
    return new Promise((resolve, reject) => {
        if (WAValidator.validate(fromAddress, 'eth') && WAValidator.validate(toAddress, 'eth')) {
            let tokenAddress = "";

            if (coin.toUpperCase() == "SAFEMOON") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.SAFEMOON;
            } else if (coin.toUpperCase() == "INJ") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.INJECTIVEPROTOCAL_INJ;
            } else if (coin.toUpperCase() == "CAKE") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.PANCAKESWAP_CAKE;
            } else if (coin.toUpperCase() == "ETC") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.ETHEREUMCLASSIC_ETC;
            } else if (coin.toUpperCase() == "WIN") {
                tokenAddress = Constant.BSC.TOKEN_ADDRESSES.WINKLINK;
            }
            
            if (tokenAddress != "") {
                (async () => {
                    try {

                        let contract = new Web3Client.eth.Contract(minABI, tokenAddress, {from: fromAddress});
                        var volume = math.multiply(math.bignumber(amount), math.bignumber('1000000000000000000'));
                        var formattedAmount = math.format(volume, {notation: 'fixed'}).toString();
                        Web3Client.eth.accounts.wallet.add(privateKey);

                        await contract.methods.transfer(toAddress, formattedAmount).send({ 
                            from: fromAddress,
                            gasPrice : Web3Client.utils.toHex(20 * 1e9),
                            gasLimit : Web3Client.utils.toHex(210000)
                        }).then((data) =>{
                            resolve({success : true, transactionHash : data.events[0].transactionHash});
                        })
                        .catch(err => {
                            resolve({success : false, msg : "Your balance is not enough"});
                        });
                    } catch (e) {
                    resolve({success : false, msg : "Binance Server Error"});
                    }
                })()
            } else {
                resolve({success : false, msg : "Coin Name Error"});
            }
        } else {
            resolve({success : false, msg : "Wallet Address Error"});
        }
    })
}

module.exports = {
    walletGeneration,
    getBalance,
    tokenTransfer,
}