function init () {

  const thegrid = document.querySelector('#grid')
  let height = 0
  let width = 0
  const audio1 = document.getElementById('song1')
  const audio2 = document.getElementById('song2')
  const audio3 = document.getElementById('song3')
  // let numCells = height * width
  const cells = []
  const levelOne = [42,43,62,63,47,46,67,66,56,57,76,77,52,53,72,73,45,65,54,74,29,30,49,50,69,70,102,103,141,161,142,143,162,163,105,125,145,165,117,116,114,134,154,174,156,157,158,176,177,178,107,108,109,110,111,112,129,130,149,150,146,147,166,167,152,153,172,173]
  const startscreen = document.querySelector('.startpage')
  const startbutton = document.querySelector('#start p')
  let score = 0
  let currentPlayerPosition = 229
  const gridArray = []
  let playerDirection = 230
  let myInterval
  let powerUpInterval
  let powerCounter
  let gameOn = true
  const ghostStates = ['chase','panic','scatter']
  let currentState = ghostStates[0]
  let delayFactor = 400
  const foodArray = []
  let stateSwap
  let replaceInterval
  let stateCounter = 0
  const reserveGhosts = ['marty','willem','rasmus','clyde'] 
  const activeGhosts = reserveGhosts.slice()
  const removedGhosts = []
  const highscoreElement = document.querySelector('span')
  let storedScore = sessionStorage.getItem('highscore')



  const stateHandler = () => {
    stateCounter = 0
    const choices = ghostStates.filter(item => item !== 'panic')
    stateSwap = setInterval(() => {
      if (stateCounter < 7) {
        stateCounter++
      } else if (currentState !== ghostStates[1]) {
        currentState = choices[Math.floor(Math.random() * choices.length)]
        stateCounter = 0
      }
    },1000)
  }



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

    createCoords(thegrid)
    placechar('hasMainChar',currentPlayerPosition)
    setTimeout(()=> placechar('marty', 24),1000) 
    setTimeout(()=> placechar('willem', 35),1000) 
    setTimeout(()=> placechar('clyde', 378),1000) 
    setTimeout(()=> placechar('rasmus', 361),1000) 


    window.addEventListener('keydown',setDirection)
    setTimeout(moveInterval,5000)
  }


  let animationInterval
  const animationLoop = () => {
    const checkCells = cells.slice()
    ghostErrorCorrection()
    animationInterval = setInterval(() => {
      checkCells.map((cell) => {
        if (activeGhosts.some((ghost) => !cell.classList.contains(ghost) || !cell.classList.contains('hasMainChar')) && cell.classList.contains('pulseOn')) {
          cell.classList.remove('pulseOn')
        } else if (activeGhosts.some((ghost) => !cell.classList.contains(ghost) || !cell.classList.contains('hasMainChar')) && cell.classList.contains('flashOn')) {
          cell.classList.remove('flashOn')
        }
      })
    },500)
  }
  let ghostCountInterval
  const ghostErrorCorrection = () => {
    const boardGhosts = reserveGhosts.slice()
    ghostCountInterval = setInterval(() => {
      const currentGhosts = activeGhosts.concat(removedGhosts)
      if (currentGhosts.length !== boardGhosts.length) {
        const missing = boardGhosts.filter((ghost) => !currentGhosts.includes(ghost))
        placechar(missing.join(''),168)
        activeGhosts.push(missing.join(''))
      }
    }, 500)
  }

  const createCoords = () => {
    for (let i = 0; i <= cells.length; i++) {
      const row = Math.floor(i / 20)
      const col = i % 20
      gridArray.push([row, col])
    }
  }


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

  const setDirection = (e) => {
    const key = e.keyCode
    switch (key) {
      case 39:
        playerDirection = 'right'
        break
      case 37:
        playerDirection = 'left'
        break
      case 38:
        playerDirection = 'up'
        break
      case 40:
        playerDirection = 'down'
        break
    }
  }

  const moveInterval = ()=> {
    myInterval = setInterval(()=> {
      if (currentPlayerPosition === 199 && playerDirection === 'right') {
        removechar('hasMainChar',currentPlayerPosition)
        currentPlayerPosition -= 19
        placechar('hasMainChar',currentPlayerPosition)
        checkSpace(document.getElementById(currentPlayerPosition))
      } else if (currentPlayerPosition === 180 && playerDirection === 'left') {
        removechar('hasMainChar',currentPlayerPosition)
        currentPlayerPosition += 19
        placechar('hasMainChar',currentPlayerPosition)
        checkSpace(document.getElementById(currentPlayerPosition))
      } else {
        removechar('hasMainChar',currentPlayerPosition)
        switch (playerDirection) {
          case 'right':
            if (document.getElementById(currentPlayerPosition + 1).classList.contains('notwall')) currentPlayerPosition++
            break
          case 'left':
            if (document.getElementById(currentPlayerPosition - 1).classList.contains('notwall')) currentPlayerPosition--
            break
          case 'up':
            if (document.getElementById(currentPlayerPosition - 20).classList.contains('notwall')) currentPlayerPosition -= 20
            break
          case 'down':
            if (document.getElementById(currentPlayerPosition + 20).classList.contains('notwall')) currentPlayerPosition += 20
            break
        }
        placechar('hasMainChar',currentPlayerPosition)
        checkSpace(document.getElementById(currentPlayerPosition))
      }
      
    },400)
    stateHandler()
    getAndMoveGhosts()
    animationLoop()
  }
  let ghostMoveInterval
  const getAndMoveGhosts = () => {
    let counter = 0
    ghostMoveInterval = setInterval(() => {
      const ghostNames = activeGhosts.slice()
      if (counter < 10) {
        counter++
      } else {
        counter = 0
        ghostNames.forEach((name) => ghostMove(name,currentPlayerPosition))
      }
    },(delayFactor / 10))
  }

  
  const replaceGhost = () => {
    let counter = 0
    replaceInterval = setInterval(() => {
      if (counter < 20) {
        counter ++
      } else {
        counter = 0
        if (removedGhosts.length > 0) {
          const currGhost = removedGhosts[0]
          placechar(currGhost,168)
          activeGhosts.push(removedGhosts.shift())
        } else clearInterval(replaceInterval)
      }
    },500)
  }
  

  const checkSpace = (inputSpace) => {
    const ghostNames = activeGhosts.slice()
    if (inputSpace.classList.contains('powerup')){
      powerUpHandler()
      inputSpace.classList.remove('powerup')
      if (playing === 1) switchAudio()
      delayFactor = 450
      score += 100
    } else if (ghostNames.some(ghostname => inputSpace.classList.contains(ghostname))) {
      if (currentState === ghostStates[1]) {
        const thisGhost = ghostNames.filter(name => inputSpace.classList.contains(name)).join('')
        activeGhosts.splice(activeGhosts.findIndex((i) => i === thisGhost),1)
        removedGhosts.push(thisGhost)
        removechar(thisGhost,currentPlayerPosition)
        replaceGhost()
        score += 500
      } else {
        playing = 2
        if (storedScore < score) {
          storedScore = score
          localStorage.setItem('highscore', storedScore)
        }
        highscoreElement.innerText = storedScore
        switchAudio()
        clearInterval(myInterval)
        clearInterval(ghostMoveInterval)
        clearInterval(animationInterval)
        clearInterval(ghostCountInterval)
        removechar('hasMainChar',currentPlayerPosition)
        gameOn = !window.confirm(`Game over: score ${score} \n Play again?`)
        while (!gameOn) {
          gameOn = true
          currentPlayerPosition = 229
          while (thegrid.firstChild) {
            thegrid.removeChild(thegrid.lastChild)
          }
          clearInterval(ghostMoveInterval)
          gridArray.splice(0,gridArray.length)
          cells.length = 0
          foodArray.length = 0
          score = 0
          createGrid(height * width)
          switchAudio()
        }
      }
    } else if (inputSpace.classList.contains('food') && (foodArray.length > 0)) {
      inputSpace.classList.remove('food')
      foodArray.splice(foodArray.indexOf(inputSpace),1)
      score += 100
    } else if (foodArray.length === 0){
      playing = 2
      if (storedScore < score) {
        storedScore = score
        localStorage.setItem('highscore', storedScore)
      }
      highscoreElement.innerText = storedScore
      switchAudio()
      clearInterval(myInterval)
      clearInterval(ghostMoveInterval)
      clearInterval(animationInterval)
      clearInterval(ghostCountInterval)
      gameOn = !window.confirm('You win! \n Play again?')
      while (!gameOn) {
        
        gameOn = true
        currentPlayerPosition = 229
        while (thegrid.firstChild) {
          thegrid.removeChild(thegrid.lastChild)
        }
        clearInterval(ghostMoveInterval)
        gridArray.splice(0,gridArray.length)
        cells.length = 0
        foodArray.length = 0
        score = 0
        createGrid(height * width)
        switchAudio()
      }
    }
  }

  const ghostMove = (nameOfGhost,currentPlayerPosition) => {
    const currentPosition = document.querySelector('.' + nameOfGhost)
    removechar(nameOfGhost,currentPosition.id)
    const possibleMoves = [parseFloat(currentPosition.id) - 20, parseFloat(currentPosition.id) + 1,parseFloat(currentPosition.id) - 1, parseFloat(currentPosition.id) + 20].sort()
    const realMoves = possibleMoves.filter((item) => {
      return document.getElementById(item).classList.contains('notwall') && !['marty','willem','clyde','rasmus'].some(thing => document.getElementById(item).classList.contains(thing))
    })
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
    placechar(nameOfGhost,moveSelect)
  
  }

  const powerUpHandler = () => {
    currentState = ghostStates[1]
    clearInterval(powerUpInterval)
    clearInterval(stateSwap)
    powerCounter = 0
    powerUpInterval = setInterval(() => {
      if (powerCounter < 12) {
        powerCounter++
      } else {
        powerCounter = 0
        clearInterval(powerUpInterval)
        currentState = ghostStates[0]
        if (playing === 3) switchAudio()
        delayFactor = 400
        stateHandler()
      }
    },1000)
  }
  

  startbutton.addEventListener('click',initiate)

  let playing = 0

  const switchAudio = () => {
    if (playing === 0) {
      audio1.play()
      audio2.pause()
      audio3.pause()
      playing = 1
    } else if (playing === 1) {
      audio1.pause()
      audio3.play()
      audio2.pause()
      playing = 3
    } else if (playing === 3) {
      audio3.pause()
      audio1.play()
      playing = 1
    } else if (playing === 2) {
      audio1.pause()
      audio2.play()
      playing = 0
    }
  }
}

window.addEventListener('DOMContentLoaded',init)