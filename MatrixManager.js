const fetch = require('node-fetch');
const SERVER_URL = `URL_HERE`

class MatrixManager {
	constructor(client, id, size=1000){
		this.client = client
		this.size = size
		this.id = id
	}

	initialize(){
		for (let x=0; x<this.size; x++){
			for(let y=0; y<this.size; y++){
				this.client.set(`${x}-${y}`, "FFF")
			}
		}
	}

	clear(){
		for (let x=0; x<this.size; x++){
			for(let y=0; y<this.size; y++){
				this.client.del(`${x}-${y}`)
			}
		}
	}

	read(){
		let callback = arguments[1]
		try {
			if (typeof callback === "function") {
				let points = arguments[0]

				if (points && Array.isArray(points) && this.checkAllValid(points)){
					let remaining = points.length
					const collected = []

					points.forEach(point => {
							((x,y) => {
								this.client.get(`${x}-${y}`, function(err, reply){
									collected.push({x,y, value: reply})
									remaining--
									if (remaining === 0) {
										callback(collected)
									}
								})
							})(point.x, point.y)
					})
					

				} else if (this.checkValidPoint(points)){
					this.client.get(`${points.x}-${points.y}`, function(err,reply){
						callback({x: points.x, y: points.y, value: reply})
					})
				} else {
					throw new Error("Invalid point(s).")
				}
			} else {
				throw new Error("Expected callback function as second argument")
			}
		} catch(e){
			console.log(e)
		}
	}

	readRect(){
		let start = arguments[0]
		let end = arguments[1]
		const callback = arguments[2]

		try {
			if(this.checkValidPoint(start) && this.checkValidPoint(end) && this.checkValidRect(start,end)){
				let collected = []
				for (let x=start.x; x<=end.x; x++){
					for(let y=start.y; y<=end.y; y++){
						collected.push({x,y})
					}
				}

				this.read(collected, callback)

			} else {
				throw new Error("Invalid points for rectangle")
			}
		} catch(e){
			console.log(e)
		}
	}



	set(){
		let color = arguments[0]
		try {
			if (this.checkValidHex(color)) {
				let points = arguments[1]

				if (points && Array.isArray(points) && this.checkAllValid(points)){
					let totalPoints = points.length
					let index = 0

					let interval = setInterval(()=> {
						if (index < totalPoints){
							this.send(points[index].x, points[index].y, points[index].color || color)
							index++
						} else {
							clearInterval(interval)
						}
					}, 1000)
					
					

				} else if (this.checkValidPoint(points)){
					this.send(points.x, points.y, color)
				} else {
					throw new Error("Invalid point(s).")
				}
			} else {
				throw new Error("The first argument must be a valid hexidecimal string.")
			}
		} catch(e){
			console.log(e)
		}

	}

	setRect(){
		let start = arguments[0]
		let end = arguments[1]
		const color = arguments[2]

		try {
			if(this.checkValidPoint(start) && this.checkValidPoint(end) && this.checkValidRect(start,end)){
				let collected = []
				for (let x=start.x; x<=end.x; x++){
					for(let y=start.y; y<=end.y; y++){
						collected.push({x,y})
					}
				}

				this.set(color, collected)

			} else {
				throw new Error("Invalid points for rectangle")
			}
		} catch(e){
			console.log(e)
		}
	}

	send(x,y,color){
		fetch(SERVER_URL + `/setTile?x=${x}&y=${y}&c=${color}&id=${this.id}`)
	}


	localSet(){
		let color = arguments[0]
		try {
			if (this.checkValidHex(color)) {
				let points = arguments[1]

				if (points && Array.isArray(points) && this.checkAllValid(points)){         
					points.forEach(point => {
						this.client.set(`${point.x}-${point.y}`, color)
					})
				} else if (this.checkValidPoint(points)){
					this.client.set(`${points.x}-${points.y}`, color)
				} else {
					throw new Error("Invalid point(s).")
				}
			} else {
				throw new Error("The first argument must be a valid hexidecimal string.")
			}
		} catch(e){
			console.log(e)
		}
	}

	checkValidRect(start, end){
		return start.x <= end.x && start.y <= end.y
	}

	checkValidHex(color){
		return (
			typeof color === "string" &&
			(color.length === 3 || color.length === 6) &&
			!color.match(/([^a-fA-F0-9])/g)
		)
	}

	checkAllValid(points){
		let valid = true
		points.forEach(point => {
			if (!this.checkValidPoint(point)){
				valid = false
			}
		})
		return valid
	}

	checkValidPoint(point){
		return (
			typeof point === "object" &&
			point.x && 
			typeof point.x === "number" &&
			point.x >= 0 &&
			point.x < this.size &&
			point.y &&
			typeof point.y === "number" &&
			point.y >= 0 &&
			point.y < this.size
		)
	}
}


// let val;
// if (typeof arg2 === "object"){
//  let end = arg2
//  val = arg3

//  // if (start.x <= end.x && start.y <= end.y){
//  //  for (let x=start.x; x<=end.x; x++){
//  //    for(let y=start.y; y<=end.y; y++){
//  //      this.client.set(`${x}-${y}`, val)
//  //    }
//  //  }
//  // }



// } else if(typeof arg2 === "string") { //Sending single value
//  val = arg2
//  this.send(start.x, start.y, val)
//  // this.client.set(`${start.x}-${start.y}`, val)
// }



module.exports = { MatrixManager }