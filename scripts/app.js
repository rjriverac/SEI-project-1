function init () {
  const thegrid = document.querySelector('#grid')
  let height = 0
  let width = 0
  const audio = document.querySelector('audio')
  // let numCells = height * width
  const cells = []
  let level = 0

  const startscreen = document.querySelector('.startpage')
  const startbutton = document.querySelector('#start p')
  


  const createGrid = (numCells) => {
    for (let i = 0; i < numCells; i++) {
      const cell = document.createElement('div')
      thegrid.appendChild(cell)
      cells.push(cell)
      cell.id = i
    }
    level++
    // console.log(cells[2].id)
    createLevel()
  }

  const createLevel = () => {
    cells.map((cell) => {
      if (cell.id < 20) {
        cell.classList.add('wall')
      } else if (cell.id % 20 === 0 && cell.id !== '180') {
        cell.classList.add('wall')
      } else if (cell.id !== '199' && cell.id % width === 19) {
        cell.classList.add('wall')
        console.log((cell.id))
      } else if (parseFloat(cell.id) + width >= width * width - 1) {
        cell.classList.add('wall')
      }
    })
    
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
  }


  startbutton.addEventListener('click',initiate)

}

window.addEventListener('DOMContentLoaded',init)