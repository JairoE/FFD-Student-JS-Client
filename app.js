const redis = require('redis');
const { MatrixManager } = require('./MatrixManager.js')

var client = redis.createClient();
var teamID = 1

client.on('connect', function(){
	let Matrix = new MatrixManager(client, teamID)  

	Matrix.setRect({x:0, y:0}, {x:100, y:100}, "B33")
	//Code here!
})