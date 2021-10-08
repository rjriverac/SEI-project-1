function init () {
  const thegrid = document.querySelector('#grid')
  let height = 0
  let width = 0

  // let numCells = height * width
  const cells = []

  const startscreen = document.querySelector('.startpage')
  const startbutton = document.querySelector('#start p')
  


  const createGrid = (numCells) => {
    for (let i = 0; i < numCells; i++) {
      const cell = document.createElement('div')
      thegrid.appendChild(cell)
      cells.push(cell)
      cell.id = i
      cell.innerText = i
    }
  }

  const initiate = () => {
    startscreen.style.display = 'none'
    document.querySelector('.grid-wrapper').setAttribute('style','display: flex')
    height = 20
    width = 20
    document.querySelector('.game').style.display = 'block'
    document.querySelector('body').style.backgroundColor = '#261447'
    createGrid(height * width)
  }


  startbutton.addEventListener('click',initiate)

}

window.addEventListener('DOMContentLoaded',init)