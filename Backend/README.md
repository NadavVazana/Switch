# Restaurant API

<img src="https://res.cloudinary.com/ds8xkm0ue/image/upload/v1673644270/icons8-restaurant-building-64_hvxhnu.png" />

# Getting Started:

Clone the project and run npm install on the terminal.
Run npm start to start the server. 

# Testing the API:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/22855452-650e3ca8-fd2e-4fa3-b4ad-7acf984fc91b?action=collection%2Ffork&collection-url=entityId%3D22855452-650e3ca8-fd2e-4fa3-b4ad-7acf984fc91b%26entityType%3Dcollection%26workspaceId%3D713d6f18-5ac9-462b-ad78-41d79a3a4f64)


# Base URL

> https://restaurants-api-cdhh.onrender.com/api/restaurant/

## Get all the restaurants:

To get all the restaurants, use the **GET** HTTP method and the base url. 

## Get a restaurant by id:

To get a specific restaurant, use the **GET** HTTP method and add the id of the restaurant to the base url. For example:

> https://restaurants-api-cdhh.onrender.com/api/restaurant/<restaurant's id>

## Register a restaurant:

To register a restaurant, use the **POST** HTTP method and add the restaurant to the body of the request.

## Delete a restaurant

To delete a restaurant, use the **DELETE** HTTP method and add the restaurant id to the base url.

> https://restaurants-api-cdhh.onrender.com/api/restaurant/<restaurant's id>

## Get restaurant's product list

To get the product list of a restaurant, use the **GET** HTTP method and first add the restaurant id, then the product id and then the word products. Example:

>https://restaurants-api-cdhh.onrender.com/api/restaurant/<restaurant's id>/products


## Delete a product from a specific restaurant:

To delete a product from a restaurant, use the **DELETE** HTTP method and and first add the restaurant's id and then the word products and then product id to the base url. Example:

> https://restaurants-api-cdhh.onrender.com/api/restaurant/<restaurant's id>/products/<product's id>

## Update restaurant details:

To update restaurant details use the **PATCH** HTTP method and add the updated restaurant to the body of the request.
Example:

>> https://restaurants-api-cdhh.onrender.com/api/restaurants/<restaurant's id>

## Update restaurant's product:

To update restaurant's product use the **PATCH** HTTP method, add the base url the restaurant's id then the word products and then the product id. (The product id should be the same so it could be updated):

> https://restaurants-api-cdhh.onrender.com/api/restaurants/<restaurant's id>/products/<product's id>

## Adding a product to a restaurant:

To add a product to a specific restaurant, use the **POST** HTTP method, add the restaurant's id to the base url and the the word products,
and add the new product to the body of the request:

> https://restaurants-api-cdhh.onrender.com/api/restaurants/<restaurant's id>/products/<product's id>

## Time format:

On every restaurant object there is a openingHours prop that will show all the days of the week, and inside of those props there are 2 props: open and close which in each one there is the time of it with the HH:mm format.


On every product object there is a saleInfo prop that behave the same as the restaurant but instead of open and close there are the start and end props that represents the hours of the sale (and again with the HH:mm format)


## Technologies:

 - Node js
 - Express
 - Rest API
 

