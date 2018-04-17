const redis = require('redis');
const { MatrixManager } = require('./MatrixManager.js')

var client = redis.createClient();
var teamID = 1

client.on('connect', function(){
	let Matrix = new MatrixManager(client, teamID)
	//Code here!
})