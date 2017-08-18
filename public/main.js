$(function() {
  fetchFolders();
  fetchLinks();
  // fetchFolderId();
  // fetchFolderLinks();
  // postFolder();
  // postLink();
})

$('#add-folder').click(() => {
  $('.folder-select').append('<input id="folder-input" type="text" />')

  // postFolder()
})

$('#add').click(() => {
    console.log($('.folder-input').val());
  $(".dropdown-content").toggleClass("show")
  const addSelected = $( "#add-select option:selected" )
  const addSelect = $( "#add-select" )
  const select = $( "#select" )

  const folderId = addSelected[0].dataset.id
  const urlVal = $('#url').val()

  if(!folderId) {
    return
  } else  {
    postLink(1, urlVal)
    fetchFolderLinks(folderId)


    addSelect.find('option:selected').prop('selected', false)
    select.find('option:selected').prop('selected', false)
    // console.log(addSelect.find('option:selected'),select.find('option:selected') );
    // console.log(addSelected);
    // console.log(addSelect.children(), select.children());
    //select dropdown and change
  }
})

$('#add-folder').click((e) => {
  $(e.target).val('')
})

$('#url').click((e) => {
  $(e.target).val('')
})

$('#newbtn').click(() => {
  $(".dropdown-content").toggleClass("show")
})

$('select').change(() => {
  const selection = $( "#select option:selected" )
  const folderData = selection[0].dataset
  !folderData.id ? fetchLinks() : fetchFolderLinks(folderData.id)
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

const postLink = (folderId, url) => {
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ 'name': 'name',
                           'orig_url': url,
                           'short_url': 'http://blink182.com/iAighG',
                           'folder_id': folderId
                         })
  })
  .then(res => console.log(res))
}

/*=======================================
>>>>>>>>  Set  <<<<<<<<
========================================*/

const setFolders = (array) => {
  // console.log('setting folders');
  array.forEach(folder => {
    $('#select, #add-select').append(`
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
        id="cardsss"
        class="card"
        data-id=${link.id}
        data-created-at=${link.created_at}
        data-folder-id=${link.folder_id}
        data-orig-url=${link.orig_url}
        data-short-url=${link.short_url}>
        <h2>${link.name}</h2>
      </div>
    `)
  })
}




$(".cards").on('click', '.card', (e) =>  {
  console.log(e.target);
})
