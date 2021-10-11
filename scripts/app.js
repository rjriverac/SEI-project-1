function init () {
  let gameOn = true
  // class sprite {
  //   constructor(type, image) {
  //     this.type = type
  //     this.image = image
  //   }
  // }

  // class ghost {
  //   constructor(startpos,image) {
  //     this.startpos = startpos
  //     this.image = image
  //   }
  // }


  const thegrid = document.querySelector('#grid')
  let height = 0
  let width = 0
  const audio = document.querySelector('audio')
  // let numCells = height * width
  const cells = []
  // let level = 0
  const levelOne = [42,43,62,63,47,46,67,66,56,57,76,77,52,53,72,73,45,65,54,74,29,30,49,50,69,70,102,103,141,161,142,143,162,163,105,125,145,165,117,116,114,134,154,174,156,157,158,176,177,178,107,108,109,110,111,112,129,130,149,150,146,147,166,167,152,153,172,173]
  const startscreen = document.querySelector('.startpage')
  const startbutton = document.querySelector('#start p')
  let score = 0
  let currentPlayerPosition = 229
  const gridArray = []


  const initiate = () => {
    startscreen.style.display = 'none'
    document.querySelector('.grid-wrapper').setAttribute('style','display: flex')
    height = 20
    width = 20
    document.querySelector('.game').style.display = 'flex'
    document.querySelector('.game').style.flexDirection = 'column'
    document.querySelector('body').style.backgroundColor = '#261447'
    createGrid(height * width)
    playAudio('./assets/sounds/hydrogen.mp3')
  }
  const createGrid = (numCells) => {
    for (let i = 0; i < numCells; i++) {
      const cell = document.createElement('div')
      thegrid.appendChild(cell)
      cells.push(cell)
      cell.id = i
    }
    // level++
    createLevel()
  }

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
      const blanks = ['229','84','95','315','304']
      if (blanks.some((item) => cell.id === item)){
        cell.classList.remove('food')
      }
    })

    createCoords(thegrid)
    placechar('hasMainChar',currentPlayerPosition)
    placechar('marty', 170)
    window.addEventListener('keydown',keyHandler)
  }


  const createCoords = () => {
    for (let i = 0; i <= cells.length; i++) {
      const row = Math.floor(i / 20)
      const col = i % 20
      gridArray.push([row, col])
    }
  }


  const placechar = (which,position) => {
    cells[position].classList.add(which)
  }

  const removechar = (which,position) => {
    cells[position].classList.remove(which)
  }

  const keyHandler = (e) => {
    // store time each keypress occurred, run an if/statement comparing to current time to limit speed of this function

    //! maybe run movement on an interval and change direction using keys
    removechar('hasMainChar',currentPlayerPosition)
    const key = e.keyCode
    if (key === 39 && document.getElementById(currentPlayerPosition + 1).classList.contains('notwall')) {
      currentPlayerPosition++
    } else if (key === 37 && document.getElementById(currentPlayerPosition - 1).classList.contains('notwall')) {
      currentPlayerPosition--
    } else if (key === 38 && document.getElementById(currentPlayerPosition - 20).classList.contains('notwall')) {
      currentPlayerPosition -= 20
    } else if (key === 40 && document.getElementById(currentPlayerPosition + 20).classList.contains('notwall')) {
      currentPlayerPosition += 20
    }
    placechar('hasMainChar',currentPlayerPosition)
    
    checkSpace(document.getElementById(currentPlayerPosition))
  }

  const checkSpace = (inputSpace) => {
    const ghostNames = ['marty', 'willem', 'clyde', 'oscar']
    if (ghostNames.some(ghostname => inputSpace.classList.contains(ghostname))) {
      gameOn = window.confirm(`Game over: score ${score} \n Play again?`)
    } else if (inputSpace.classList.contains('food')) {
      inputSpace.classList.remove('food')
      score += 100
      console.log(score)
    }
  }



  startbutton.addEventListener('click',initiate)

  const playAudio = (inputsrc) => {
    // audio.src = inputsrc
    audio.play()
  }  
  // document.querySelector('.startpage').addEventListener('mouseenter',playAudio('./assets/sounds/Miami.mp3'))
}

window.addEventListener('DOMContentLoaded',init)