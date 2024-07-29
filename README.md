# Online Bidding System

## Overview

This is a full-stack web application that enables users to participate in online auctions. It provides functionalities for user authentication, auction item management, bidding, and a user-friendly interface.

## Features

- **User Authentication**
  - Users can sign up with a username, email, and password.
  - Users can log in with their email and password.

- **Auction Management**
  - Users can create auction items with a product image, name, description, minimum bid, end date and end time.
  - Users can view all the items up for auction.
  - Users can update and delete their auction items.

- **Bidding Functionality**
  - Users can place bids on auction items before the end date and time.
  - Users can view current highest bids and bid history for each auction item.

- **User Interface**
  - **Home Page**: Displays a list of auction items with current highest bids.
  - **Auction Item Page**: Shows detailed information about the item, bid history, and user reviews. Provides a form for placing bids.
  - **Profile Page**: Allows users to manage their information and view their auction activities, including items they placed for auction and items they placed bids on.

## Technical Considerations

### Front-End

- **Technologies**: HTML, CSS, JavaScript
- **Features**:
  - Responsive and user-friendly UI
  - Form validation for user inputs

### Back-End

- **Technologies**: Node.js with Express
- **Features**:
  - RESTful API for user registration, login, auction item management, and bidding functionality

### Database

- **Technologies**: MongoDB
- **Features**:
  - Appropriate schemas/models for users, auctions, bids, and user reviews
  - Database operations performed using Mongoose
  - User Schema
    - Collection Name: `users`  
    - Fields: `firstname`, `lastname`, `email`, `password`
  - Auction Schema
    - Collection Name: `auctions`  
    - Fields: `productName`, `productDescription`, `minimumBid`, `currentBid`, `endTime`, 
      `image`, `userId`
  - Bid Schema
    - Collection Name: `bids`  
    - Fields: `productId`, `productName`, `username`, `email`, `amount`, `auctioneerEmail`, 
     `image`, `timestamp`
  - Review Schema
    - Collection Name: `reviews` 
    - Fields: `username`, `productId`, `review`

### Security

- **Features**:
  - Password hashing using bcrypt

## Setup Instructions

### Prerequisites

1. **Install Node.js and npm**:
   Ensure Node.js and npm are installed. Download from [nodejs.org](https://nodejs.org/).

2. **Install MongoDB**:
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community).
   - Install MongoDB Compass from [mongodb.com](https://www.mongodb.com/products/compass) to manage your MongoDB database.

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Manvitha72/online-bidding-system.git
   cd online-bidding-system
   ```
2. **Install Dependencies**:
   - In the project directory, run:
   ```bash
   npm install
   ```
3. Start MongoDB:
   - Open MongoDB Compass and connect to your MongoDB instance. 
   - Ensure the MongoDB server is running on mongodb://localhost:27017. If not, start it 
     with:
   ```bash
   mongod
   ```
4. Run the Server:
   - Start the server with nodemon:
   ```bash
   nodemon index.js
   ```
5. Access the Application:
   - Open your browser and navigate to:
   ```bash
   http://localhost:3000/
   ```
#
