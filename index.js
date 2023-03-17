const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const solanaWeb3 = require('@solana/web3.js');
const bs58 = require("bs58");


// Setup essential routes 
// router.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));
//     //__dirname : It will resolve to your project folder. 
// });
// router.get('/about', function (req, res) {
//     res.sendFile(path.join(__dirname + '/about.html'));
// });
router.get('/', async function (req, res) {

    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    console.log("connected");
    // const secretKey = '52a5hTMBWU4BpE7YEFVy5BEXdvn6vU1RUzzL22huFEQJyrZRu5vtXAhMzzDyvGydTAfWLWARVaWJQwuXqZwmPd3V' as Number [];
    const fromWallet = solanaWeb3.Keypair.fromSecretKey(bs58.decode('52a5hTMBWU4BpE7YEFVy5BEXdvn6vU1RUzzL22huFEQJyrZRu5vtXAhMzzDyvGydTAfWLWARVaWJQwuXqZwmPd3V'));
    const toWallet = new solanaWeb3.PublicKey('8MdXvWgNou9jRVturbfnt3egf1aP9p1AjL8wiJavti7F');
    console.log("sending transctions");
    const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: fromWallet.publicKey,
            toPubkey: toWallet,
            lamports: solanaWeb3.LAMPORTS_PER_SOL/ 1000000,
        })
    );
    console.log("transcation is ready");
    transaction.feePayer = fromWallet.publicKey;
    console.log("Feepayer is defined");
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.sign(fromWallet);
    console.log("sign");
    const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction,[fromWallet]);
    console.log('SIGNATURE', signature);
    res.send({"SIGNATURE": signature});


});
//add the router 
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');

