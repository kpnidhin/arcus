var restify = require('restify');
var builder = require('botbuilder');
var ThingspaceCloud = require('./vendor/thingspace-cloud-node.min.js');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'b8206fb2-24bf-4771-bbe2-5527f3e67c14',
    appPassword: '6foZqvxFkikRXdniqhBnbXs'
});

// Creat thingspace with hard coded token -update here with latest token
var cloud = new ThingspaceCloud({
	authToken: '42YVD32YEB24YSXGKDONGCVGXWSW4UZC2NFGFJHOUS6YVGPJARRT2HLJAENDXIYIZTANXXY3DOMOP3LATSM72X6OXF5BDUN2S2NOUABDL3SNUHM75TIPX5HF7G3WQYIRAVHRQ52BHP5S3HS642C7IJEQLCYKWAM72X46WP7CGPVWBPMRTLBLPPJRHLTH5X7OHQ5AWONS3YOVAWPHWJOETNQJSKHHUNATOR3RAU5ZN6BJTEYXG3B2YE5RQYXKQ73DRDFDGF4MJ6MX7QP2OVCPZLOGBRW3UOEQQWGHFETEWCKDO3U3H76BB4TGHZQBVI5V2KWVSKHPZ6AXERVFES6Y75TUR6J4XGFDGS2K46BJK2XYRKB5WZ7DASVPILJVPAKE',
	htmlEscape: false
}).cloud;

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {

	cloud.account({
		success: function(success) {
			var usagePercent =  success.body.usage.quotaUsed / success.body.usage.quota * 100;
			var used = formatBytes(success.body.usage.quotaUsed, 2);
			var max = formatBytes(success.body.usage.quota, 2);
		    session.send("You are using " + used + " of your " + max);
		},
		failure: function(failure) {
			session.send("Could not get account data");
		}
	})
    
});

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1024; // or 1000 for vendor sizing
   var dm = decimals || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

