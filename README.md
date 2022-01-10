# Hotline Pacman

## Overview

A Hotline Miami themed implementation of Pac-Man, playable [here](https://rjriverac.github.io/SEI-project-1/). This was my first project as a GA student, created over 8 days, after 3 weeks in the course.

---

## Brief
Create a browser-based implementation of classic grid-based game using Vanilla JavaScript, HTML, and CSS.

---
## Technologies Used

* HTML5 as well as HTML5 audio
* CSS and animations
* JavaScript ES6
* Git
* GitHub
* External custom fonts

---

## Approach

### Development Process

Out of all the options we had for games, I chose Pac Man as I relished the challenge of creating the logic for the ‘ghosts’. I did not have a plan at the time of choosing Pac Man, and I knew it would be a big challenge to get to a MVP. I also set myself the objective of hitting some of the stretch goals such as a separate start page and audio.

After creating the start page, the player clicking on the start game link initiates the rest of the game. I went with a simple grid, which I unfortunately would later have to supplement in order to implement necessary features. 

```
const initiate = () => {
   startscreen.style.display = 'none'
   document.querySelector('.grid-wrapper').setAttribute('style','display: flex')
   height = 20
   width = 20
   document.querySelector('.game').style.display = 'flex'
   document.querySelector('.game').style.flexDirection = 'column'
   document.querySelector('body').style.backgroundColor = '#261447'
   createGrid(height * width)
   switchAudio()
 }
 const createGrid = (numCells) => {
   for (let i = 0; i < numCells; i++) {
     const cell = document.createElement('div')
     thegrid.appendChild(cell)
     cells.push(cell)
     cell.id = i
   }
   createLevel()
 }

```

My next challenge was to create the actual maze and place the characters. I planned to use .divs to determine whether the player or a ghost was on a given space, as well as to place the scoring pieces and powerups. For styling purposes I also wanted different divs for the border than for the interior walls of the maze, so all of the borders, scoring spaces, and interior walls were done in separate steps of the same function. I had to separate the initial placement of walls and scoring pieces into one map function and then remove them from spaces I was going to fill with either ghosts or powerups, as well as add all the spaces that would count for scoring when traversed to a separate array that would be iterated through the course of the game.
```
const createLevel = () => {
   cells.map((cell) => {
     if (cell.id < 20) {
       cell.classList.add('borderwall')
     } else if (cell.id % 20 === 0 && cell.id !== '180') {
       cell.classList.add('borderwall')
     } else if (cell.id !== '199' && cell.id % width === 19) {
       cell.classList.add('borderwall')
     } else if (parseFloat(cell.id) + width >= width * width - 1) {
       cell.classList.add('borderwall')
     } else if (levelOne.includes(parseFloat(cell.id))){
       cell.classList.add('wall')
     } else if (levelOne.map(item => cells.length - 1 - item).includes(parseFloat(cell.id))){
       cell.classList.add('wall')
     } else if ([189,190,209,210,201,202,203,216,217,218,212,213,214,205,206,207].includes(parseFloat(cell.id))) {
       cell.classList.add('wall')
     } else {
       cell.classList.add('notwall')
       cell.classList.add('food')
     }
   })
 
   cells.map((cell) => {
     const blanks = ['229','84','95','315','304','35','24','378','361']
     if (blanks.some((item) => cell.id === item)){
       cell.classList.remove('food')
     }
     if (blanks.slice(1,5).some((item) => cell.id === item)){
       cell.classList.add('powerup')
     }
     if (cell.classList.contains('food')) foodArray.push(cell)
   })
```

The next bit was how to handle all the movement, which I planned to do using 2 functions (a remove and place function) that would be called for each movement of any character on the board. 
```
const placechar = (which,position) => {
  
   if (currentState === ghostStates[1]){
     cells[position].classList.add('flashOn')
   } else {
     cells[position].classList.add('pulseOn')
   }
   cells[position].classList.add(which)
 }
 
 const removechar = (which,position) => {
  
   if (currentState === ghostStates[1]) {
     cells[position].classList.remove('flashOn')
   } else {
     cells[position].classList.remove('pulseOn')
   }
   cells[position].classList.remove(which)
 }
```

While I thought moving the player would be straightforward, I had to abandon my initial approach of having one move per key press and resort to a keypress setting a direction and then movement occurring based on an interval, as I could not effectively limit player speed and thus the game would be impossible to lose. This interval function would move the player to any valid space in its direction as well as call other functions, the most important of which were the function to move the ghosts and the function that checked the state of the game (if the ghosts were ‘panicked’ and able to be eaten by the player).

As I knew the ghosts could be eaten, I split my movement function for them into one that retrieved all currently active ghosts and then called my move function for each one. However, I quickly discovered that my grid was insufficient for this, as the references to cells were just numbers and in order to have logic that allowed for the ghosts to ‘hunt’ the player I needed a coordinate system. Rather than rewrite all my previous functions, I made a new array to hold the x,y information.
```
const createCoords = () => {
   for (let i = 0; i <= cells.length; i++) {
     const row = Math.floor(i / 20)
     const col = i % 20
     gridArray.push([row, col])
   }
 }
```

In the ghost move function which was passed the ghost to be moved and the current player position as a parameter, I stored the current position of the ghost and then defined all the spaces it would be technically possible to move, then filtered from those any that had a wall or border to return an array of valid cells that could be moved to. From here, I utilized Math.hypot and the x,y information to sort the moves by distance to the player, and then one of those moves would be picked based on the game state.
```
const nextMove = realMoves.reduce((acc,num) => {
     const x1 = gridArray[num][0]
     const x2 = gridArray[currentPlayerPosition][0]
     const y1 = gridArray[num][1]
     const y2 = gridArray[currentPlayerPosition][1]
     const distance = Math.hypot(x1 - x2,y1 - y2)
     acc.push([distance,num])
     return acc.sort((a,b) =>{
       if (a[0] === b[0]) {
         return 0
       } else {
         return (a[0] < b[0]) ? -1 : 1
       }
     })
   },[])
   let moveSelect
   if (nextMove.length < 1) {
     moveSelect = currentPosition
   } else {
     if (currentState === 'chase') {
       moveSelect = nextMove[0][1]
     } else if (currentState === 'panic') {
       moveSelect = nextMove[nextMove.length - 1][1]
     } else if (currentState === 'scatter') {
       moveSelect = nextMove[Math.floor(Math.random() * nextMove.length)][1]
     }
   }
```
With movement squared away, the remaining problem was handling both scoring and what happens when a player encounters a ghost, and as a result this check space function ended up becoming a catch all for everything that wasn’t movement related that needed to happen to make the game work. It was called every time the player moved, and would check if the space the player was moving into contained a ghost, powerup, score, and then perform some action based on those conditions. While initially this meant just increasing the score and removing the food div from a square, or losing the game if a player ran into the ghost, as I added powerups it also would call another interval to temporarily change the ghost behavior, as well as changing the music on running into a powerup, and even removing/replacing a ghost that was eaten during a powerup period. 

### Bugs

* Ghosts will occasionally stop being detected by the function to move them and will freeze.
* Ghosts will fail to respawn.

## Wins

* Reached my MVP.
* The logic surrounding movement of the ghosts and their behavior switching based on the powerup state of the game.

## Challenges

* Flexibility - I feel as though my initial plan was too rigid and when I later realized I had the wrong approach I had to add code that essentially duplicated functions in order to avoid breaking what I had written so far (such as my simple grid needing x,y coordinates later).

* Timing - While I cannot be entirely certain, I feel a fair amount of my issues were caused by having so many interval and timeout functions, in my game over condition I needed to clear 5 or 6 intervals.

## Key Takeaways

* Array Methods - I really had to get comfortable using array methods such as map, reduce, some, and sort to make this game work, which was helpful as I had previously struggled to understand some of them conceptually.

* ES6 syntax - I decided to write all of the JS using arrow functions rather than function declarations, and ended up preferring it.

## Future Features

* Responsive design.

* Additional levels that increase in difficulty (enemies move faster).

* Support for high score list rather than only one highest score.


