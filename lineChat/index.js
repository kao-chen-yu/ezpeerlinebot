

var linebot = require('linebot');
var express = require('express');
const uuid = require('uuid/v1');
var apiai = require('apiai');
var app1 = apiai('df450cef4ea7467a8543a9c0ee587e2e');

var bot = linebot({
	channelId : '1547763729',
	channelSecret : '9e852ad5d789e81c1af1a51f6666d7c5',
	channelAccessToken : 'i9WIA5CANkd5E9XjHYgRfq3DbPS1klBRTvBQRGKahHjZUrvunsYfibJRgnXisONeMXfZRqdYAg20GgQUDf6WB6l+XRTFUrSkpZ94cf3dcG7br0qX6vXihJ7gNFK0yt/aEGWfetUB9mTDTqv0Zrp/SwdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
  if (event.message.type = 'text') {
    var msg = event.message.text;
	var request = app1.textRequest( msg,{
			sessionId: uuid()
	});
	var context='';
	request.on('response',function(response){
		    event.reply(response.result.fulfillment.speech).then(function(data) {
      // success 
			console.log(response);
			context=response.result.contexts[0];
			
			if(response.result.metadata.intentName='find_singer'){
			console.log('find_singer!');
				bot.on('message', function(event) {
					if (event.message.type = 'text') {
						var msg1 = event.message.text;
						console.log('contexts :' + context.parameters.singer);
						var options = {
							sessionId: '321',
							contexts: {
									name: context.name,
									parameters: {
										'singer': context.parameters.singer,
										'singer.original' : context.parameters.singer.original
											}
								}
						};
						console.log('id'+options.sessionId);
						console.log('name'+options.contexts[0].name);
						console.log('para'+options.contexts[0].parameters.singer);
						var request = app1.textRequest( msg1,{
							sessionId: uuid(),
							contexts: [
								{
									name: context.name,
								parameters: {
									'singer': context.parameters.singer,
									 'singer.original' : context.parameters.singer.original
											}
								}
								]
						});
						
					}
					request.on('response',function(response){
						event.reply(response.result.fulfillment.speech).then(function(data) {
							console.log(response);
						});
					});
				});//bot
			}
			}).catch(function(error) {
      // error 
			console.log('error');
			});
	});
	
	request.on('error',function(error){
		console.log(error);
	});
	request.end();
  }
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});