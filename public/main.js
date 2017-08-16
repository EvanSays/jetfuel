

$('#add').click(() => {
  let urlVal = $('#url').val()
  let folderVal = $('#add-folder').val()
  $('#url').val("URL")

  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'id': '1' , 'name': 'EVAN' })
  }).then(res => console.log(res))

})

$('#add-folder').click((e) => {
  $(e.target).val('')
})

$('#url').click((e) => {
  $(e.target).val('')
})
