let foldersData = [
  {
    "id": 1,
    "name": "recipes",
    "created_at": "2017-08-19T01:50:49.850Z",
    "updated_at": "2017-08-19T01:50:49.850Z",
    links: [
      {
        "id": 1,
        "name": "Baking Bread",
        "orig_url": "http://hugechallah.com/tasty/break",
        "short_url": "http://breakbread.com/ajIjdsif",
        "folder_id": 1,
        "created_at": "2017-08-19T16:12:24.370Z",
        "updated_at": "2017-08-19T16:12:24.370Z"
      }, {
        "id": 2,
        "name": "Make a cake",
        "orig_url": "http://hugecake.com/tasty/sweet",
        "short_url": "http://jetfuel.com/asljf",
        "folder_id": 1,
        "created_at": "2017-08-19T16:13:00.917Z",
        "updated_at": "2017-08-19T16:13:00.917Z"
      }
    ]
  }
];

const createFolder = (knex, folder) => {
  return knex('folders').insert({
    name: folder.name,
  }, 'id')
  .then(folderId => {
    let linkPromises = [];
    folder.links.forEach(link => {
      console.log('link', link);
      linkPromises.push(
        createLink(knex, {
          name: link.name,
          orig_url: link.orig_url,
          short_url:link.short_url,
          folder_id: folderId[0]
        })
      )
    })
    return Promise.all(linkPromises)
  })
}

const createLink = (knex, link) => {
  return knex('links').insert(link);
}

exports.seed = (knex, Promise) => {
  return knex('links').del() // Delete all links first
    .then(() => knex('folders').del()) // Delete all folders
    .then(() => {
      let folderPromises = [];

      foldersData.forEach(folder => {
        folderPromises.push(createFolder(knex, folder));
      })
      // Inserts seed entries
      return Promise.all(folderPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
