$(function() {
  fetchFolders();
  fetchLinks();
  // fetchFolderId();
  // fetchFolderLinks();
  // postFolder();
  // postLink();
  // console.log(shortid.generate())
})

$('#add-folder').click(() => {})

$('#select1').change((e)=> {
  const addSelected = $("#select2 option:selected")
  console.log(addSelected);
})

$('#add').click(() => {
  const url = $("#url")
  const dropdown = $("#select1 option:selected")
  const name = $("#name")

  const urlDefualt = "Paste a link to shorten it"
  const nameDefault = "Name"
  const dropdownDefault = "select a folder"
  const createFolderDefault = "Create a folder"
  const dropdownDefaultData = $("#select1 option:selected")[0].innerText

  const folderId = dropdown[0].getAttribute('data-id')


  if (url.val() != urlDefualt &&
      name.val() != nameDefault &&
      url.val() != '' &&
      name.val() != '' &&
      dropdownDefaultData != dropdownDefault ) {

  postLink(name.val(), url.val(), folderId)
  $(".dropdown-content").toggleClass("show")

  }
})

$('#name').click((e) => {
  $(e.target).val('')
})

$('#url').click((e) => {
  $(e.target).val('')

})

$('#newbtn').click(() => {
  $(".dropdown-content").toggleClass("show")
})

$('#dropdown2').click((e) => {
  e.preventDefault()
  $(".dropdown-content2").toggleClass("show")
})

$('#select2').change(() => {
  const selection = $("#select2 option:selected")
  const folderData = selection[0].dataset
  !folderData.id ? fetchLinks() : fetchFolderLinks(folderData.id)
})

$('#sort').change((e) => {
  const folderSelect = $("#select2 option:selected")[0]
  if(!folderSelect.dataset.id) {
    e.target.value == 'false' ?
    fetchLinks('false') :
    fetchLinks('true')

  } else {
    e.target.value == 'false' ?
    fetchFolderLinks(folderSelect.dataset.id, 'false') :
    fetchFolderLinks(folderSelect.dataset.id, 'true')
  }
})

$(".cards").on('click', '.card', (e) => {
  console.log(e.target);
})

$(".folder-select").on('click', 'li', (e) => {
  $(".dropdown-content2").text(e.target.getAttribute('data-id'))
  $("#dropdown2").attr("data-id", e.target.getAttribute('data-id'))
  $("#dropdown2").text(e.target.getAttribute('data-name'))
  // fetchFolders();
})


/*=======================================
>>>>>>>>  Fetch  <<<<<<<<
========================================*/

const fetchFolders = () => {
  fetch('/api/v1/folders')
  .then(res => res.json())
  .then(folders => setFolders(folders)).
  catch(error => console.log(error))
}

const fetchLinks = (str) => {
  fetch('/api/v1/links')
  .then(res => res.json())
  .then(links => setLinks(links, str))
  .catch(error => console.log(error))
}

const fetchFolderId = () => {
  fetch('/api/v1/folders/1')
  .then(res => res.json())
  .then(folder => console.log('folder', folder))
  .catch(error => console.log(error))
}

const fetchFolderLinks = (id, str) => {
  fetch(`/api/v1/folders/${id}/links`)
  .then(res => res.json())
  .then(folderLinks => setLinks(folderLinks, str))
  .catch(error => console.log(error))
}

const fetchLinkRedirect = () => {
  fetch('/api/v1/links/1')
  .then(res => res.json())
  .then(data => console.log(data))
}

/*=======================================
>>>>>>>>  Post  <<<<<<<<
========================================*/

const postFolder = () => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'name': 'Bands'})
  }).then(res => console.log(res))
}

const postLink = (name, url, folderId) => {
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'name': name, 'orig_url': url, 'folder_id': folderId})
  }).then(res => console.log(res))
}

/*=======================================
>>>>>>>>  Set  <<<<<<<<
========================================*/

const setFolders = (array) => {

  $('#select1').empty();
  $('#select2').empty()

  $('#select1').prepend `
  <option>select a folder</option>
  <option>create a folder</option>
  `

  $('#select2').prepend `
  <option>select a folder</option>
  <option>all</option>
  `
  array.forEach(folder => {
    $('#select2, #select1').append(`
      <option
        data-id="${folder.id}"
        data-name="${folder.name}"
        data-created-at="${folder.created_at}">
        ${folder.name}
      </option>
    `)
  })
}

const setLinks = (array, str='true') => {

  const sorted = array.sort((a, b) => {
    if (a.updated_at > b.updated_at) {
      return 1
    }
  })

  const cards = $('.cards')
  cards.empty()
  sorted.forEach(link => {
    if (str === 'true') {

      cards.append(`
        <div
          id="card"
          class="card"
          data-id=${link.id}
          data-created-at=${link.created_at}
          data-folder-id=${link.folder_id}
          data-orig-url=${link.orig_url}
          data-short-url=${link.short_url}>
          <div class="info">
            <h2>${link.name}</h2>
            <a href='/api/v1/links/${link.id}'>${link.short_url}</a>
            <p>Added:${moment(link.created_at)}<p>
            </div>
          </div>
          `)
    } else {
      cards.prepend(`
        <div
          id="card"
          class="card"
          data-id=${link.id}
          data-created-at=${link.created_at}
          data-folder-id=${link.folder_id}
          data-orig-url=${link.orig_url}
          data-short-url=${link.short_url}>
          <div class="info">
            <h2>${link.name}</h2>
            <a href='/api/v1/links/${link.id}'>${link.short_url}</a>
            <p>Added:${moment(link.created_at)}<p>
            </div>
          </div>
          `)
    }
  })
}

const shortUrl = (url) => {
  return (url).toString(36)
}
