var cron = require('node-cron');
var Client = require('node-rest-client').Client;
var fs = require('fs')
var config = require('./../config');
var asyncLoop = require('node-async-loop');
const abiDecoder = require('abi-decoder');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(
    new web3.providers.HttpProvider('https://mainnet.infura.io/HXqhYu4Qf8kqVi0GcVBj ')
); //change as per project

var client = new Client();

var abi = require('./abi');
abiDecoder.addABI(abi);

var count = 0;
var running = false;

cron.schedule('0 */1 * * * *', function () {
    if (running === true) {
        return;
    }
    running = true;
    fs.readFile("transactions.json", function (err, file_transactions) {
        if (err) {
            console.log(err);
        }
        else {
            file_transactions = JSON.parse(file_transactions);
            var blockNumber = file_transactions[file_transactions.length - 1].blockNumber;
            var api_base_url = `${config.APIBaseURL}${config.SmartContractAddress}&startblock=${blockNumber + 1}&endblock=99999999&sort=asc&apikey=174R4XP41AEZ9EJX2RIM8NVM3NX2DBEVNW`;
            client.get(api_base_url, function (data, response) {
                var transactions = data.result;
                if (transactions.length > 0) {
                    asyncLoop(transactions, function (item, next) {
                        web3
                            .eth
                            .getTransactionReceipt(item.hash)
                            .then(function (data) {

                                const decodedLogs = abiDecoder.decodeLogs(data.logs);
                                console.log(decodedLogs);
                                var tokenAmount = parseFloat(
                                    (decodedLogs[0].events[2].value)
                                );
                                var transaction_obj = {
                                    from: decodedLogs[0].events[0].value,
                                    to: decodedLogs[0].events[1].value,
                                    tokenValue: decodedLogs[0].events[2].value,
                                    timestamp: item.timeStamp,
                                    blockNumber: item.blockNumber
                                }
                                console.log(transaction_obj);
                                count += 1;
                                console.log(count);
                                file_transactions.push(transaction_obj);
                                next();
                            })
                            .then('error', function (err) {
                                console.log(err);
                                next();
                            });

                    }, function (err) {
                        fs.writeFile("transactions.json", JSON.stringify(file_transactions), function (err, data) {
                            console.log(err);
                            console.log(data);
                        });
                        running = false;
                    });
                }
            });
        }
    })
});
