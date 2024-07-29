# Database Documentation

## 1. User Schema
- **Collection Name:** `users`
- **Fields:**
  - `firstname` (String): User's first name.
  - `lastname` (String): User's last name.
  - `email` (String): Unique email address.
  - `password` (String): Hashed password using bcrypt.
- **Design Decisions:** Email is used as a unique identifier, and passwords are securely hashed.

## 2. Auction Schema
- **Collection Name:** `auctions`
- **Fields:**
  - `productName` (String): Name of the product.
  - `productDescription` (String): Description of the product.
  - `minimumBid` (Number): Starting bid amount.
  - `currentBid` (Number): Highest bid amount (default to minimumBid).
  - `endTime` (Date): Auction end time.
  - `image` (String): Product image URL.
  - `userId` (ObjectId): Reference to the user who created the auction.
- **Design Decisions:** CurrentBid defaults to minimumBid; userId links the auction to its creator.

## 3. Bid Schema
- **Collection Name:** `bids`
- **Fields:**
  - `productId` (ObjectId): ID of the auction item.
  - `productName` (String): Name of the product.
  - `username` (String): Bidder's username.
  - `email` (String): Bidder's email.
  - `amount` (Number): Bid amount.
  - `auctioneerEmail` (String): Email of the auction creator.
  - `image` (String): Product image URL.
  - `timestamp` (Date): Bid submission time.
- **Design Decisions:** Captures bid details and associates bids with users and products.

## 4. Review Schema
- **Collection Name:** `reviews`
- **Fields:**
  - `username` (String): Reviewer's username.
  - `productId` (ObjectId): ID of the reviewed product.
  - `review` (String): Review text.
- **Design Decisions:** Links reviews to products and allows users to provide feedback.
