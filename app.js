var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
io.on('connection', () => {
    console.log("Connection successful");
});



var dbUrl = "mongodb+srv://user1:qkdSwg4C0UCdcGwM@cluster0-7va9o.mongodb.net/test?retryWrites=true";

var server = app.listen(3000, () => {
    console.log("App is running on port",server.address().port);
});
mongoose.connect(dbUrl, {useNewUrlParser: true} , (err) => {
    console.log("mongodb connected", err);
});
var Message = mongoose.model('Message',{ name: String, message: String});
app.get('/messages',(req,res) => {
    Message.find({},(err,messages) => {
        res.send(messages);
    });
});
app.post('/messages',(req,res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err)
            sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
});


