const redis = require('redis');
const { MatrixManager } = require('./MatrixManager.js')


var client = redis.createClient();

client.on('connect', function(){
	let Matrix = new MatrixManager(client)
	// Matrix.localSet("92394f", [{x: 20, y: 35}, {x: 22, y: 35}])
	// Matrix.initialize()

	// Matrix.readRect({x:15,y:34}, {x:26, y:40}, (points) => {

	// 	let newPoints = points.filter(point => {
	// 		return point.value === 'FFF'
	// 	})

	// 	let secondPoints = points.filter(point =>{
	// 		return point.value === 'ACF'
	// 	})

	// 	Matrix.localSet("FFF", newPoints)
	// 	Matrix.localSet("000", secondPoints)
	// })
	Matrix.readRect({x:15,y:34}, {x:26, y:40}, console.log)

	// Matrix.setRect({x:15,y:34}, {x:26, y:40}, "CCC")

	// function changeWhiteToX(point){
	//  array.forEach(point => {
	// 	 if (point.value)
	// 	 Matrix.set({x: point.x, y: point.y}, "000")
	//  })
	// }

})





// function cb(point, newColor='000') {
//  if (point.value === 'FFF')
//    Matrix.set({x: point.x, y: point.y}, newColor)
// }

// function whitesToBlacks() {
//  for (let row = 0; row < ROW_LIMIT; row++) {
//    for (let col = 0; col < COL_LIMIT; col++) {
//      Matrix.get(row, col), cb)
//    }
//  }
// }


// m[x][y]

// if (m.get(x, y) === '000') {
//  m.set(x, y, 'fff')
// }



