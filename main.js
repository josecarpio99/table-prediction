import './main.css'
import teams from './teams.json'
import interact from 'interactjs'

const $teamsList = document.querySelector('#teams-list')
const $tableList = document.querySelector('#table-list')

teams.forEach((team, i) => {
  const liEl1 = document.createElement("li")
  liEl1.innerHTML = `
      <div class="flex items-center draggable js-drag" id="drag${i + 1}" data-name="${team.name}" data-index="${i}">
        <img class="h-10 w-10" src="./logos/italy/${team.logo}" alt="logo ${team.name}">
      </div>
  `
  $teamsList.appendChild(liEl1)

  // const liEl2 = document.createElement("li")
  // liEl2.classList.add('flex', 'border-2', 'border-t-0', 'border-white', 'items-center', 'w-64')
  
  // liEl2.innerHTML = `
  //   <div class="basis-1/5 text-2xl">
  //     <span class="font-semibold">
  //       ${(i) % 2 == 0 ? i - 1 : i + 2}
  //     </span>
  //   </div>
  //   <div class="basis-4/5 h-12 border-l-2 border-white p-2 dropzone js-drop">
  //   </div>
  // `
  // $tableList.appendChild(liEl2)
})

const $teamsListItem = document.querySelectorAll('#teams-list li')
let transformProp
const dragPositions = teams.reduce((acc, n, i) => {
  acc[`drag${i + 1}`] = { x: 0, y: 0 }
  return acc
}, {})

interact.maxInteractions(Infinity)

interact('.js-drag').draggable({
  listeners: {
    start (event) {
      if (hasClass(event.target, 'dropped')) {
        removeClass(event.target, 'dropped')
      }
      const position = dragPositions[event.target.id]
      position.x = parseInt(event.target.getAttribute('data-x'), 10) || 0
      position.y = parseInt(event.target.getAttribute('data-y'), 10) || 0
    },
    move (event) {
      const position = dragPositions[event.target.id]
      position.x += event.dx
      position.y += event.dy
     
      event.target.style.left = position.x + 'px'
      event.target.style.top = position.y + 'px'
    },
    end (event) {
      const position = dragPositions[event.target.id]
          
      event.target.style.left = '0px'
      event.target.style.top = '0px'  
      event.target.setAttribute('data-x', 0)
      event.target.setAttribute('data-y', 0)
    }    
  },
})

setupDropzone('.js-drop', '.js-drag')

/**
 * Setup a given element as a dropzone.
 *
 * @param {HTMLElement|String} target
 * @param {String} accept
 */
function setupDropzone (target, accept) {
  interact(target)
    .dropzone({
      accept: accept,
      ondropactivate: function (event) {
        addClass(event.relatedTarget, '-drop-possible')
      },
      ondropdeactivate: function (event) {
        removeClass(event.relatedTarget, '-drop-possible')
      },
    })   
    .on('drop', (event) => {
      const team = teams.find(record => record.name == event.relatedTarget.dataset.name)

      if (hasClass(event.target, 'occupied')) {
        const relatedParent = event.relatedTarget.closest('.js-drop')
        const childrenEl = event.target.querySelector('.js-drag')
        if (relatedParent) {          
          event.target.appendChild(relatedParent.querySelector('.js-drag'))
          relatedParent.appendChild(childrenEl)
        } else {
          const currentTeam = teams.find(record => record.name == childrenEl.dataset.name)
          childrenEl.innerHTML = `
            <img class="h-10 w-10" src="./logos/italy/${currentTeam.logo}" alt="logo">
          `;

          $teamsListItem[childrenEl.dataset.index].appendChild(childrenEl)

          addClass(event.relatedTarget, 'dropped')
          event.relatedTarget.style.left = '0px'
          event.relatedTarget.style.top = '0px'  
    
          event.relatedTarget.innerHTML = `
            <img class="w-8 h-8 mr-2" src="./logos/italy/${team.logo}" alt="logo">
            <span class="text-xl whitespace-nowrap">${team.name}</span>
          `;
          event.target.appendChild(event.relatedTarget); 
          
        }
      } else {

        addClass(event.target, 'occupied')
        addClass(event.relatedTarget, 'dropped')
        event.relatedTarget.style.left = '0px'
        event.relatedTarget.style.top = '0px'  
  
        event.relatedTarget.innerHTML = `
          <img class="w-8 h-8 mr-2" src="./logos/italy/${team.logo}" alt="logo">
          <span class="text-xl whitespace-nowrap">${team.name}</span>
        `;
        event.target.appendChild(event.relatedTarget)
      }

    })
}

function addClass (element, className) {
  if (element.classList) {
    return element.classList.add(className)
  } else {
    element.className += ' ' + className
  }
}

function removeClass (element, className) {
  if (element.classList) {
    return element.classList.remove(className)
  } else {
    element.className = element.className.replace(new RegExp(className + ' *', 'g'), '')
  }
}

function hasClass (element, className) {
  return element.classList.contains(className)
}

/* eslint-disable multiline-ternary */
interact(document).on('ready', () => {
  transformProp =
    'transform' in document.body.style
      ? 'transform'
      : 'webkitTransform' in document.body.style
        ? 'webkitTransform'
        : 'mozTransform' in document.body.style
          ? 'mozTransform'
          : 'oTransform' in document.body.style
            ? 'oTransform'
            : 'msTransform' in document.body.style
              ? 'msTransform'
              : null
})
/* eslint-enable multiline-ternary */
