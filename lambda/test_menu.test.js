const { handler } = require('./menu_lambda');

test('GET /items should return items list', async () => {
  const event = {
    routeKey: "GET /items",
    pathParameters: { id: "rest01" },
    body: JSON.stringify({
      id: "rest01",
      categories: ["Cafe", "Bar"],
      coordinates: { latitude: 37.759958, longitude: -122.435089 },
      image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1100&q=80",
      menu_id: "menu01",
      name: "Au Chat Noir",
      price: "15€",
      rating: 4.5,
      reviews: 1244,
      review_count: 400,
      time: "10 - 20"
    })
  };

  const context = {};

  const response = await handler(event, context);
  expect(response.statusCode).toBe(200);
  expect(response.body).toBeDefined();
});

test('PUT /items should put item', async () => {
  const event = {
    routeKey: "PUT /items",
    body: JSON.stringify({
      id_rest: "rest08",
      id_menu: "menu08",
      price: "20€",
      name: "Test Item",
    })
  };

  const context = {};

  const response = await handler(event, context);
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain("Put item rest08/menu08");
});

// test('DELETE /items should delete item', async () => {
//   const event = {
//     routeKey: "DELETE /items/rest01/menu01",
//     pathParameters: {
//       id_rest: "rest09",
//       id_menu: "menu09",
//     }
//   };

//   const context = {};

//   const response = await handler(event, context);
//   expect(response.statusCode).toBe(200);
//   expect(response.body).toContain("Deleted item rest09/menu09");
// });
