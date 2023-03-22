class Coordinate {
  constructor(left, top) {
    this.top = top
    this.left = left
  }
  alert() {
    alert(`top: ${this.top}, left: ${this.left}`)
  }
  destructure() {
    return [this.left, this.top]
  }
}

class GameObject {
  constructor() {
    this.playarea = document.getElementById("playarea")
  }
}

class Body extends GameObject {
  constructor(radius, top= 0, left=0) {
    super()
    this.radius = radius
    this.diameter = radius*2
    this.domEle = document.createElement("div")
    this.domEle.setAttribute('class', 'body')
    this.domEle.style.width = `${this.diameter}px`
    this.domEle.style.height = `${this.diameter}px`
    this.playarea.appendChild(this.domEle)
    this.position = new Coordinate(left, top)
    this.domEle.style.top = top
    this.domEle.style.left = left
    this.center = this.getCenter()
    this.rotation = Math.PI/2
  }
  getCenter() {
    return new Coordinate(this.position.left+this.radius, this.position.top+this.radius)
  }
  getPosition() {
    return new Coordinate(this.center.left-this.radius, this.center.top-this.radius)
  }
  changeLocation(centerORposition, newCoordinate) {
    if (centerORposition==="center") {
      this.center = newCoordinate
      this.position = this.getPosition()
    } else if (centerORposition==="position") {
      this.position = newCoordinate
      this.center = this.getCenter()
      this.domEle.style.top = this.position.top
      this.domEle.style.left = this.position.left
    } else throw new Error("Give center or position arg")
  }
  render() {
    this.domEle.style.top = this.position.top
    this.domEle.style.left = this.position.left
  }
  findAngleBetweenTwoPoints(coord1, coord2) {
    let atan = Math.atan((coord1.top-coord2.top)/(coord2.left-coord1.left))
    return coord1.left-coord2.left<=0?atan: atan+Math.PI
  }
}

class Player extends Body {
  constructor(radius, top = 0, left = 0, moveSpeed) {
    super(radius, top, left)
    this.moveSpeed = moveSpeed
    this.leftHand = new LeftHand(this, 17, false)
    this.rightHand = new RightHand(this, 17, true)
    this.movement = {w: null, a: null, s: null, d: null}
    document.body.addEventListener("keydown", (event)=>{
      if (event.key==="w") this.movement.w = this.moveSpeed
      if (event.key==="a") this.movement.a = this.moveSpeed
      if (event.key==="d") this.movement.d = this.moveSpeed
      if (event.key==="s") this.movement.s = this.moveSpeed
    })
    document.body.addEventListener("keyup", (event)=>{
      if (event.key==="w") this.movement.w = null
      if (event.key==="a") this.movement.a = null
      if (event.key==="d") this.movement.d = null
      if (event.key==="s") this.movement.s = null
    })
  }
  render() {
    if (this.movement.w) this.moveUp(this.movement.w)
    if (this.movement.a) this.moveLeft(this.movement.a)
    if (this.movement.s) this.moveDown(this.movement.s)
    if (this.movement.d) this.moveRight(this.movement.d)
    super.render()
    this.leftHand.render()
    this.rightHand.render()
  }
  move(x, y) {
    this.changeLocation("center", new Coordinate(x,y))
  }
  moveRight(amt) {
    if (this.playarea.offsetWidth<this.center.left+this.radius) return
    let [x, y] = this.center.destructure()
    this.move(x+amt, y)
  }
  moveLeft(amt) {
    if (this.center.left-this.radius<0) return
    let [x, y] = this.center.destructure()
    this.move(x-amt, y)
  }
  moveUp(amt) {
    if (this.center.top-this.radius<0) return
    let [x, y] = this.center.destructure()
    this.move(x, y-amt)
  }
  moveDown(amt) {
    if (this.playarea.offsetHeight<this.center.top+this.radius) return
    let [x, y] = this.center.destructure()
    this.move(x, y+amt)
  }
  turnToMouse(mousePos) {
    this.rotation = super.findAngleBetweenTwoPoints(this.center, mousePos)
  }
}

class PlayerHand extends Body {
  constructor(bodyParent, radius) {
    super(radius)
    this.bodyParent = bodyParent
    this.theta = Math.PI/5
  }
  alignLeftWithCenter() {
    let newTop = Math.sin(this.bodyParent.rotation+this.theta)*this.bodyParent.radius
    let newLeft = Math.cos(this.bodyParent.rotation+this.theta)*this.bodyParent.radius
    let point = this.getAbsolutePointFromRelative(new Coordinate(newLeft, newTop))
    super.changeLocation("center", point)
  }
  alignRightWithCenter() {
    let newTop = Math.sin(this.bodyParent.rotation-this.theta)*this.bodyParent.radius
    let newLeft = Math.cos(this.bodyParent.rotation-this.theta)*this.bodyParent.radius
    let point = this.getAbsolutePointFromRelative(new Coordinate(newLeft, newTop))
    super.changeLocation("center", point)
  }
  getAbsolutePointFromRelative(coordinate) {
    let top = this.bodyParent.center.top - coordinate.top
    let left = this.bodyParent.center.left + coordinate.left
    return new Coordinate(left, top)
  }
}
class LeftHand extends PlayerHand {
  constructor(bodyParent, radius) {
    super(bodyParent, radius)
    super.alignLeftWithCenter()
  }
  render() {
    super.alignLeftWithCenter()
    super.render()
  }
}
class RightHand extends PlayerHand {
  constructor(bodyParent, radius) {
    super(bodyParent, radius)
    super.alignRightWithCenter()
  }
  render() {
    super.alignRightWithCenter()
    super.render()
  }
}


try {

const player = new Player(50, 0, 0, 10)

const gameLoop = setInterval(()=>{loadFrame()}, 20)

let mousePos = new Coordinate(0,0)

document.body.addEventListener("mousemove", (event)=>{
  mousePos.top = event.clientY
  mousePos.left = event.clientX
})


function loadFrame () {
  try{
  player.turnToMouse(mousePos)
  player.render()
  } catch(e) {
    alert(e)
  }
}




} catch (e) {
  
  alert(e.stack)
  
}