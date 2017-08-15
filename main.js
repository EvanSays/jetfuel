

$('#add').click(() => {
  let urlVal = $('#url').val()
  $('#url').val("URL")
})

$('#url').click((e) => {
  $(e.target).val('')
})
