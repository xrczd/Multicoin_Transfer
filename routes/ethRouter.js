const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance, tokenTransfer } = require('../apis/ethService');


// @route    GET api/eth/walletGeneration
// @desc     Generate new wallet for ethereum blockchain network
// @access   Public
router.get('/walletGeneration', async (req, res) => {
    try {
        walletGeneration()
        .then((data) =>{
            res.json(data);
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).send('Server Error');
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    GET api/eth/getbalance/:address/:coin
// @desc     Get balance of coin according to wallet addresss and coin name in ethereum blockchain network
// @access   Public
router.get('/getBalance/:address/:coin', async (req, res) => {
    try {
        if (req.params.address && req.params.coin) {
            getBalance(req.params.address, req.params.coin)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Parameter Error');    
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/eth/tokenTransfer
// @desc     Transfer token from sender address to receiver address
// @access   Private
router.post('/tokenTransfer', async (req, res) => {
    try {
        if (req.body.fromAddress && req.body.toAddress && req.body.coin && req.body.amount && req.body.privateKey) {
            tokenTransfer(req.body.fromAddress, req.body.toAddress, req.body.coin, req.body.amount, req.body.privateKey)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            res.status(500).send('Request Error');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
