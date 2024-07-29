# Online Bidding System API Documentation

## Authentication

### Register User
- **URL:** `/signup`
- **Method:** `POST`
- **Request Body:** `{ "firstname": "string", "lastname": "string", "email": "string", "password": "string" }`
- Registers a new user with hashed password.

### Login
- **URL:** `/login`
- **Method:** `POST`
- **Request Body:** `{ "email": "string", "password": "string" }`
- Authenticates a user and sets session.

### Logout
- **URL:** `/logout`
- **Method:** `GET`
- Logs out the user and destroys the session.

## User Management

### Get User Info
- **URL:** `/api/user-info`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer {token}`
- Retrieves the authenticated user's details.

### Update User Info
- **URL:** `/api/update-user-info`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:** `{ "firstname": "string", "lastname": "string" }`
- Updates user's profile information and related auction data.

### Fetch User Auctions
- **URL:** `/api/user-auctions`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer {token}`
- Retrieves all auctions created by the authenticated user.

### Fetch User Biddings
- **URL:** `/api/user-biddings`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer {token}`
- Retrieves all bids placed by the authenticated user.

## Product Management

### List Products
- **URL:** `/api/products`
- **Method:** `GET`
- Retrieves all available auction products.

### Get Product Details
- **URL:** `/api/product-details`
- **Method:** `GET`
- **Query Parameters:** `id` (string)
- Retrieves details of a specific product including bids and current bid.

### Place Auction
- **URL:** `/place-auction`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:** `{ "productName": "string", "productDescription": "string", "minimumBid": "number", "endTime": "ISO8601 timestamp", "imageUrl": "string" }`
- Creates a new auction product.

### Update Auction
- **URL:** `/update-auction`
- **Method:** `POST`
- **Request Body:** `{ "auctionId": "string", "productName": "string", "description": "string", "startingPrice": "number", "endDate": "ISO8601 timestamp" }`
- Updates details of an existing auction.

### Delete Auction
- **URL:** `/api/delete-auction`
- **Method:** `DELETE`
- **Query Parameters:** `id` (string)
- Deletes a specific auction.

## Bidding

### Place Bid
- **URL:** `/api/place-bid`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:** `{ "productId": "string", "bidAmount": "number" }`
- Places a bid on a product.

## Reviews

### Submit Review
- **URL:** `/api/submit-review`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:** `{ "productId": "string", "review": "string" }`
- Submits a review for a product.

### Get Reviews
- **URL:** `/api/product-reviews`
- **Method:** `GET`
- **Query Parameters:** `productId` (string)
- Retrieves reviews for a specific product.
