module.exports = [

  {//Get User
    request: {
      path: '/testendpoint/testtable/',
      method: 'GET'
    },
    response: {
      status: 200,
      data:  [
        {
          "firstname": "Les",
          "lastname": "Brown",
          "updatedAt": "2016-07-12T08:47:59.824Z",
          "id": "577b90eb1392b597cdcc68ea"
        }
      ]
    }
  },
  {//Update User
    request: {
      path: '/testendpoint/577b90eb1392b597cdcc68ea/',
      method: 'PUT',
      data: {
        "firstname": "Zig",
        "lastname": "Zigler",
        "id": "577b90eb1392b597cdcc68ea"
      }
    },
    response: {
      status: 200,
      data:  [
        {
          "firstname": "Zig",
          "lastname": "Zigler",
          "updatedAt": "2016-07-12T08:47:59.824Z",
          "id": "577b90eb1392b597cdcc68ea"
        }
      ]
    }
  }

];
