import {teams as teamModel} from '../teams.js'
import interact from 'interactjs'
import * as htmlToImage from 'html-to-image'
import { toPng, toBlob } from 'html-to-image'
import download from 'downloadjs'

const teams = teamModel().getByLeague('serie a')
const $body = document.querySelector('body')
const $teamsList = document.querySelector('#teams-list')
const $saveBtn = document.querySelector('#save-btn')
const $tableList = document.querySelector('#table-list')
const $imageWrapper = document.querySelector('#image-wrapper')

teams.forEach((team, i) => {
  const liEl1 = document.createElement("li")
  liEl1.innerHTML = `
      <div class="flex items-center justify-center draggable js-drag" id="drag${i + 1}" data-name="${team.name}" data-index="${i}">
        <img class="h-6 w-6 md:h-10 md:w-10" src="../logos/italy/${team.logo}" alt="logo ${team.name}">
      </div>
  `
  $teamsList.appendChild(liEl1)
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
      const childrenEl = event.target.querySelector('.js-drag')

      if (childrenEl) {
        const relatedParent = event.relatedTarget.closest('.js-drop')
        if (relatedParent) {          
          event.target.appendChild(relatedParent.querySelector('.js-drag'))
          relatedParent.appendChild(childrenEl)
        } else {
          const currentTeam = teams.find(record => record.name == childrenEl.dataset.name)
          childrenEl.innerHTML = `
            <img class="h-6 w-6 md:h-10 md:w-10" src="../logos/italy/${currentTeam.logo}" alt="logo">
          `;

          $teamsListItem[childrenEl.dataset.index].appendChild(childrenEl)

          addClass(event.relatedTarget, 'dropped')
          event.relatedTarget.style.left = '0px'
          event.relatedTarget.style.top = '0px'  
    
          event.relatedTarget.innerHTML = `
            <img class="w-4 h-4 md:w-8 md:h-8 mr-2" src="../logos/italy/${team.logo}" alt="logo">
            <span class="text-sm md:text-xl whitespace-nowrap">${team.name}</span>
          `;
          event.target.appendChild(event.relatedTarget); 
          
        }
      } else {

        addClass(event.target, 'occupied')
        addClass(event.relatedTarget, 'dropped')
        event.relatedTarget.style.left = '0px'
        event.relatedTarget.style.top = '0px'  
  
        event.relatedTarget.innerHTML = `
          <img class="w-4 h-4 md:w-8 md:h-8 mr-2" src="../logos/italy/${team.logo}" alt="logo">
          <span class="text-sm md:text-xl whitespace-nowrap">${team.name}</span>
        `;
        event.target.appendChild(event.relatedTarget)
      }

      checkIfAllItemsHaveBeenDropped();
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

function checkIfAllItemsHaveBeenDropped() {
  if ([...$teamsListItem].every(el => el.innerHTML.trim() === '')) {
    removeClass($saveBtn, 'hidden')
  }
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

$saveBtn.addEventListener('click', (e) => {
  addClass($body, 'overflow-hidden')
  $imageWrapper.style.display = 'flex'
  $imageWrapper.querySelector('#table-content').innerHTML = ''

  const newNode = $tableList.cloneNode(true)

  $imageWrapper.querySelector('#table-content').appendChild(newNode)

  htmlToImage.toPng($imageWrapper)
  .then(function (dataUrl) {
    download(dataUrl, 'seria_a_predictions_2023_2024.png')
    $imageWrapper.style.display = 'none'
    removeClass($body, 'overflow-hidden')

  })
  .catch(function (error) {
    console.error('oops, something went wrong!', error)
  });
})
