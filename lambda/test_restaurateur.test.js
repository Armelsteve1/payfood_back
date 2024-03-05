const { handler } = require('./restaurant_lambda');

test('GET /restaurant should return restaurant details', async () => {
  const event = {
    routeKey: "GET /restaurant",
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

test('PUT /restaurant should update restaurant details', async () => {
  const event = {
    routeKey: "PUT /restaurant",
    body: JSON.stringify({
      id: "rest08",
      name: "Updated Restaurant Name",
      price: "20€",
      rating: 4.7,
    })
  };
  const context = {};
  const response = await handler(event, context);
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain("Updated restaurant rest08");
});

// test('DELETE /restaurant should delete restaurant', async () => {
//   const event = {
//     routeKey: "DELETE /restaurant",
//     pathParameters: { id: "rest08" }
//   };

//   const context = {};

//   const response = await handler(event, context);
//   expect(response.statusCode).toBe(200);
//   expect(response.body).toContain("Restaurant deleted");
// });
