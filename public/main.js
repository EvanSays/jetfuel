$(function() {
  fetchFolders();
  fetchLinks();
  // fetchFolderId();
  // fetchFolderLinks();
  // postFolder();
  // postLink();
  // console.log(shortid.generate())
})

$('#add-folder').click(() => {

})

$('#add').click(() => {
  const addSelected = $( "#add-select option:selected" )
  const url = $( "#url" )
  const dropdown = $( "#dropdown2" )
  const name = $( "#name" )

  const dropdownInner = dropdown[0].innerText

  const urlDefualt = "Paste a link to shorten it"
  const nameDefault = "Name"
  const dropdownDefault = "Select A Folder"

  const id = dropdown[0].getAttribute('data-id')

  if(url.val() != urlDefualt &&
    name.val() != nameDefault &&
    dropdownInner != dropdownDefault &&
    url.val() != '' &&
    name.val() != '' ){

    console.log(url.val(), name.val(), 'dropdown', dropdown[0].getAttribute('data-id'));

    postLink(name.val(), url.val(), id)
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

$('select').change(() => {
  const selection = $( "#select option:selected" )
  const folderData = selection[0].dataset
  !folderData.id ? fetchLinks() : fetchFolderLinks(folderData.id)
})

$(".cards").on('click', '.card', (e) =>  {
  console.log(e.target);
})

$(".folder-select").on('click', 'li', (e) =>  {
  $(".dropdown-content2").text(e.target.getAttribute('data-id'))
  $("#dropdown2").attr("data-id", e.target.getAttribute('data-id') )
  $("#dropdown2").text(e.target.getAttribute('data-name'))
  // fetchFolders();
})

/*=======================================
>>>>>>>>  Fetch  <<<<<<<<
========================================*/

const fetchFolders = () => {
  fetch('/api/v1/folders')
  .then(res => res.json())
  .then(folders => setFolders(folders))
  .catch(error => console.log(error))
}

const fetchLinks = () => {
  fetch('/api/v1/links')
  .then(res => res.json())
  .then(links => setLinks(links))
  .catch(error => console.log(error))
}

const fetchFolderId = () => {
  fetch('/api/v1/folders/1')
  .then(res => res.json())
  .then(folder => console.log('folder', folder))
  .catch(error => console.log(error))
}

const fetchFolderLinks = (id) => {
  fetch(`/api/v1/folders/${id}/links`)
  .then(res => res.json())
  .then(folderLinks => setLinks(folderLinks))
  .catch(error => console.log(error))
}

/*=======================================
>>>>>>>>  Post  <<<<<<<<
========================================*/

const postFolder = () => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'name': 'Bands'})
  })
  .then(res => console.log(res))
}

const postLink = (name, url, folderId) => {
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ 'name': name,
                           'orig_url': url,
                           'folder_id': folderId
                         })
  })
  .then(res => console.log(res))
}

/*=======================================
>>>>>>>>  Set  <<<<<<<<
========================================*/

const setFolders = (array) => {

  $('#dropdown2').prepend(`
    <ul class="dropdown-content2">
      <li>Create Folder</li>
    </ul>
  `)

  array.forEach(folder => {
    $('.dropdown-content2').prepend(`
      <li
        data-id="${folder.id}"
        data-name="${folder.name}"
        data-created-at="${folder.created_at}">
        ${folder.name}
      </li>
    `),
    $('#select').append(`
      <option
        data-id="${folder.id}"
        data-name="${folder.name}"
        data-created-at="${folder.created_at}">
        ${folder.name}
      </option>
    `)
  })
}

const setLinks = (array) => {
  const cards = $('.cards')
  cards.empty()
  array.forEach(link => {
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
          <h3>${link.short_url}</h3>
          <h4>${moment(link.created_at)}</h4>
        </div>
      </div>
    `)
  })
}

const shortUrl = (url) => {
  return (url).toString(36)
}
