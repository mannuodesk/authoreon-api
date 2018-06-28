var express = require('express');
var router = express.Router();
var config = require('./../config');
var asyncLoop = require('node-async-loop');
var fs = require('fs')
var Client = require('node-rest-client').Client;

var abi = require('./../handler/abi');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(
  new web3.providers.HttpProvider('https://mainnet.infura.io/HXqhYu4Qf8kqVi0GcVBj ')
); //change as per project

var client = new Client();

const abiDecoder = require('abi-decoder');
abiDecoder.addABI(abi);

var moment = require('moment');
var api_base_url = `${config.APIBaseURL}${config.SmartContractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=174R4XP41AEZ9EJX2RIM8NVM3NX2DBEVNW`;



/* GET users listing. */
router.get('/', function (req, res) {
  var current_date = moment().format("MM/DD/YYYY");
  var last24HoursCapacity = 0;
  var last24HoursDate = moment(current_date).subtract(24, 'hour').valueOf();
  var last7DaysCapacity = 0;
  var last7DaysDate = moment(current_date).subtract(7, 'day').valueOf();
  var last14DaysCapacity = 0;
  var last14DaysDate = moment(current_date).subtract(14, 'day').valueOf();

  var last1MonthsDate = moment(current_date).subtract(1, 'month').valueOf();
  var last1MonthCapacity = 0;
  var last1YearDate = moment(current_date).subtract(1, 'year').valueOf();
  var last1YearCapacity = 0;
  fs.readFile("transactions.json", function (err, file_transactions) {
    if (err) {
      console.log(err);
    }
    else {
      var transactions = JSON.parse(file_transactions);
      // Last 24 Hour

      var last24HourTransactions = transactions.filter(function (a) {
        return last24HoursDate <= parseFloat(a.timestamp * 1000);
      });
      for (var i = 0; i < last24HourTransactions.length; i++) {
        last24HoursCapacity += parseFloat(last24HourTransactions[i].tokenValue);
      }
      // Last 7 Days
      var last7DaysTransactions = transactions.filter(function (a) {
        return last7DaysDate <= parseFloat(a.timestamp * 1000);
      });
      for (var i = 0; i < last7DaysTransactions.length; i++) {
        last7DaysCapacity += parseFloat(last7DaysTransactions[i].tokenValue);
      }
      // Last 14 Days
      var last14DaysTransactions = transactions.filter(function (a) {
        return last14DaysDate <= parseFloat(a.timestamp * 1000);
      });
      for (var i = 0; i < last14DaysTransactions.length; i++) {
        last14DaysCapacity += parseFloat(last14DaysTransactions[i].tokenValue);
      }
      // Last 1 Month
      var last1MonthTransactions = transactions.filter(function (a) {
        return last1MonthsDate <= parseFloat(a.timestamp * 1000);
      });
      for (var i = 0; i < last1MonthTransactions.length; i++) {
        last1MonthCapacity += parseFloat(last1MonthTransactions[i].tokenValue);
      }
      // Last 1 Year
      var last1YearTransactions = transactions.filter(function (a) {
        return last1YearDate <= parseFloat(a.timestamp * 1000);
      });
      for (var i = 0; i < last1YearTransactions.length; i++) {
        last1YearCapacity += parseFloat(last1YearTransactions[i].tokenValue);
      }
      res.json({
        last24HoursCirculation: last24HoursCapacity / Math.pow(10, 18),
        last7DaysCirculation: last7DaysCapacity / Math.pow(10, 18),
        last14DaysCirculation: last14DaysCapacity / Math.pow(10, 18),
        last1MonthCirculation: last1MonthCapacity / Math.pow(10, 18),
        last1YearCirculation: last1YearCapacity / Math.pow(10, 18)
      })
    }
  });
});

module.exports = router;