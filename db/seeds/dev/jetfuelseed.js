let foldersData = [
  {
    "name": "recipes",
    "created_at": "2017-08-19T01:50:49.850Z",
    "updated_at": "2017-08-19T01:50:49.850Z",
    links: [
      {
        "name": "Baking Bread",
        "orig_url": "http://hugechallah.com/tasty/break",
        "short_url": "http://breakbread.com/ajIjdsif",
        "folder_id": 5,
        "created_at": "2017-08-19T16:12:24.370Z",
        "updated_at": "2017-08-19T16:12:24.370Z"
      }, {
        "name": "Make a cake",
        "orig_url": "http://hugecake.com/tasty/sweet",
        "short_url": "http://jetfuel.com/asljf",
        "folder_id": 5,
        "created_at": "2017-08-19T16:13:00.917Z",
        "updated_at": "2017-08-19T16:13:00.917Z"
      }
    ]
  }, {
    "name": "bands",
    "created_at": "2017-08-19T01:50:55.145Z",
    "updated_at": "2017-08-19T01:50:55.145Z",
    links: [
      {
        "id": 4,
        "name": "Blink 182",
        "orig_url": "http://blink182.com/youblinkedtoofast",
        "short_url": "http://jetfuel.com/pokerg",
        "folder_id": 6,
        "created_at": "2017-08-19T16:13:29.885Z",
        "updated_at": "2017-08-19T16:13:29.885Z"
      }, {
        "id": 5,
        "name": "Tycho",
        "orig_url": "http://tycho.com/comesinwaves",
        "short_url": "http://jetfuel.com/egirgir",
        "folder_id": 6,
        "created_at": "2017-08-19T16:14:04.925Z",
        "updated_at": "2017-08-19T16:14:04.925Z"
      }
    ]
  }, {
    "name": "bikes",
    "created_at": "2017-08-19T01:51:01.241Z",
    "updated_at": "2017-08-19T01:51:01.241Z",
    links: [
      {
        "id": 6,
        "name": "Cannondale",
        "orig_url": "http://cannondale.com/thisisexpensive",
        "short_url": "http://jetfuel.com/pokepwefa",
        "folder_id": 7,
        "created_at": "2017-08-19T16:14:41.441Z",
        "updated_at": "2017-08-19T16:14:41.441Z"
      }, {
        "id": 7,
        "name": "Schwinn",
        "orig_url": "http://schwinn.com/oldschoolbrand",
        "short_url": "http://jetfuel.com/sdffda",
        "folder_id": 7,
        "created_at": "2017-08-19T16:15:08.751Z",
        "updated_at": "2017-08-19T16:15:08.751Z"
      }
    ]
  }, {
    "name": "dogs",
    "created_at": "2017-08-19T01:51:06.026Z",
    "updated_at": "2017-08-19T01:51:06.026Z",
    links: [
      {
        "id": 8,
        "name": "Vizsla",
        "orig_url": "http://vizsla.com/velcofast",
        "short_url": "http://jetfuel.com/IJeifj",
        "folder_id": 8,
        "created_at": "2017-08-19T16:15:42.698Z",
        "updated_at": "2017-08-19T16:15:42.698Z"
      }, {
        "id": 9,
        "name": "Doge",
        "orig_url": "http://doge.com/coin",
        "short_url": "http://jetfuel.com/oiajsifjF",
        "folder_id": 8,
        "created_at": "2017-08-19T16:15:57.154Z",
        "updated_at": "2017-08-19T16:15:57.154Z"
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
