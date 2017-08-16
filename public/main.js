$(function() {
  //fetchLinks();
  fetchFolders();
  // fetchFolderId();
  // fetchFolderLinks();
  // postFolder();
  // postLink();
})

const fetchFolders = () => {
  fetch('/api/v1/folders')
  .then(res => res.json())
  .then(folders => setFolders(folders))
  .catch(error => console.log(error))
}

const setFolders = (array) => {
  array.forEach(folder => {
    // console.log(folder)
    $('#select').append(`<option value="${folder.id}" >${folder.name}</option>`)
  })
}

const fetchLinks = () => {
  fetch('/api/v1/links')
  .then(res => res.json())
  .then(links => console.log('links', links))
  .catch(error => console.log(error))
}

const fetchFolderId = () => {
  fetch('/api/v1/folders/1')
  .then(res => res.json())
  .then(folder => console.log('folder', folder))
  .catch(error => console.log(error))
}

const fetchFolderLinks = () => {
  fetch('/api/v1/folders/1/links')
  .then(res => res.json())
  .then(folderLinks => console.log('folderLinks', folderLinks))
  .catch(error => console.log(error))
}

const postFolder = () => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({'name': 'Bands'})
  })
  .then(res => console.log(res))
}

const postLink = () => {
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ 'name': 'Blink 182',
                           'orig_url': 'http://blinkliveshere.com/tom/aliens',
                           'short_url': 'http://blink182.com/iAighG',
                           'folder_id': 2
                         })
  })
  .then(res => console.log(res))
}

$('#add').click(() => {
  let urlVal = $('#url').val()
  let folderVal = $('#add-folder').val()
  $('#url').val("URL")
})

$('#add-folder').click((e) => {
  $(e.target).val('')
})

$('#url').click((e) => {
  $(e.target).val('')
})
