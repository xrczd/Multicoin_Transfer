const express = require('express');
const router = express.Router();
const { walletGeneration, getBalance } = require('../apis/polkService');


// @route    GET api/polk/walletGeneration
// @desc     Generate new wallet for Polk Adot blockchain network
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

// @route    GET api/polk/getBalance/
// @desc     Get balance of coin according to wallet addresss in Polk Adot blockchain network
// @access   Public
router.get('/getBalance/:address', async (req, res) => {
    try {
        if(req.params.address) {
            getBalance(req.params.address)
            .then((data) =>{
                res.json(data);
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).send('Server Error');
            });
        } else {
            resolve({
                success : false,
                msg : "Request Error"
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;
