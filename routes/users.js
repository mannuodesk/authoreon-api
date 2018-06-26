var express = require('express');
var router = express.Router();
var config = require('./../config');
var asyncLoop = require('node-async-loop');
var Client = require('node-rest-client').Client;

var client = new Client();

var moment = require('moment');

var api_base_url = `${config.APIBaseURL}getTokenHistory/${config.SmartContractAddress}?apiKey=${config.APIKey}&type=transfer&limit=25`;

/* GET users listing. */
router.get('/', function (req, res) {
  var current_date = moment().format("MM/DD/YYYY");
  var last24HoursCapacity = 0;
  var last24HoursDate = moment(current_date).subtract(24, 'hour');
  var last7DaysCapacity = 0;
  var last7DaysDate = moment(current_date).subtract(7, 'day');
  var last14DaysCapacity = 0;
  var last14DaysDate = moment(current_date).subtract(14, 'day');
  
  var last1MonthsDate = moment(current_date).subtract(1, 'month');
  var last1MonthCapacity = 0;
  var last1YearDate = moment(current_date).subtract(1, 'year');
  var last1YearCapacity = 0;
  client.get(api_base_url, function (data, response) {
    var transactions = data.operations;
    // Last 24 Hour
    var last24HourTransactions = transactions.filter(function (a) {
      var moment_date = moment(a.timestamp * 1000);
      return last24HoursDate.date() <= moment_date.date();
    });
    for (var i = 0; i < last24HourTransactions.length; i++) {
      last24HoursCapacity += parseFloat(last24HourTransactions[i].value);
    }
    // Last 7 Days
    var last7DaysTransactions = transactions.filter(function (a) {
      var moment_date = moment(a.timestamp * 1000);
      return last7DaysDate.date() <= moment_date.date();
    });
    for (var i = 0; i < last7DaysTransactions.length; i++) {
      last7DaysCapacity += parseFloat(last7DaysTransactions[i].value);
    }
    // Last 14 Days
    var last14DaysTransactions = transactions.filter(function (a) {
      var moment_date = moment(a.timestamp * 1000);
      return last14DaysDate.date() <= moment_date.date();
    });
    for (var i = 0; i < last14DaysTransactions.length; i++) {
      last14DaysCapacity += parseFloat(last14DaysTransactions[i].value);
    }
    // Last 1 Month
    var last1MonthTransactions = transactions.filter(function (a) {
      var moment_date = moment(a.timestamp * 1000);
      return last1MonthsDate.date() <= moment_date.date();
    });
    for (var i = 0; i < last1MonthTransactions.length; i++) {
      last1MonthCapacity += parseFloat(last1MonthTransactions[i].value);
    }
    // Last 1 Year
    var last1YearTransactions = transactions.filter(function (a) {
      var moment_date = moment(a.timestamp * 1000);
      return last1YearDate.date() <= moment_date.date();
    });
    for (var i = 0; i < last1YearTransactions.length; i++) {
      last1YearCapacity += parseFloat(last1YearTransactions[i].value);
    }
    res.json({
      last24HoursCapacity: last24HoursCapacity / Math.pow(10, 18),
      last7DaysCapacity: last7DaysCapacity / Math.pow(10, 18),
      last14DaysCapacity: last14DaysCapacity / Math.pow(10, 18),
      last1MonthCapacity: last1MonthCapacity / Math.pow(10, 18),
      last1YearCapacity: last1YearCapacity / Math.pow(10, 18)
    })
  });
});

module.exports = router;
