const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/ABB-genix', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const auctionSchema = new mongoose.Schema({
    productName: String,
    productDescription: String,
    minimumBid: Number,
    currentBid: { type: Number, default: function() { return this.minimumBid; } }, // Add this line
    endTime: Date,
    image: String,
    // username: String,
    // email: String,
    // userId: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the User model
});
const Auction = mongoose.model('Auction', auctionSchema);

const bidSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    productName: String,
    username: String,
    email: String,
    amount: Number,
    auctioneerEmail: String,
    image: String,
    timestamp: { type: Date, default: Date.now }
});
const Bid = mongoose.model('Bid', bidSchema);

// Add a schema for reviews
const reviewSchema = new mongoose.Schema({
    username: String,
    productId: mongoose.Schema.Types.ObjectId,
    review: String
});
const Review = mongoose.model('Review', reviewSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.send('<script>alert("User already exists. Please log in."); window.location.href = "/login.html";</script>');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/signup-success.html');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.send('<script>alert("Incorrect email or password."); window.location.href = "/login.html";</script>');
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.send('<script>alert("Incorrect email or password."); window.location.href = "/login.html";</script>');
            return;
        }

        req.session.user = user;
        res.cookie('firstname', user.firstname, { httpOnly: true });
        res.redirect('/dashboard.html'); 
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/dashboard.html', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login.html');
        return;
    }

    try {
        const products = await Auction.find({});
        res.render('dashboard', { user: req.session.user, products }); // Use a template engine like EJS, Pug, etc.
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/home.html', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login.html');
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Route to fetch all auctions for the home and dashboard
app.get('/api/products', async (req, res) => {
    try {
        // Check if user is logged in and has a session ID
        const userId = req.session.user ? req.session.user._id : null;

        // Find products where the userId does not match the current session user ID
        const query = userId ? { userId: { $ne: userId } } : {}; // $ne operator excludes matching userId

        const products = await Auction.find(query);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// To display user's firstname in dashboard
app.get('/api/user-info', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        // Fetch the user with all fields
        const user = await User.findById(req.session.user._id);
        // console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/place-auction.html', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login.html');
        return;
    }
    res.sendFile(path.join(__dirname, 'public', 'place-auction.html'));
});

// To place an auction
app.post('/place-auction', async (req, res) => {
    const { productName, productDescription, minimumBid, endTime, imageUrl } = req.body;
    try {
        if (!imageUrl) {
            throw new Error('Image URL is required.');
        }

        const auction = new Auction({
            productName,
            productDescription,
            minimumBid,
            endTime,
            image: imageUrl,
            username: req.session.user.firstname,
            email: req.session.user.email,
            userId: req.session.user._id 
        });

        await auction.save();
        res.redirect('/auction-success.html');
    } catch (error) {
        console.error('Error placing auction:', error.message); // Log the error message
        res.status(500).send('Internal Server Error');
    }
});

app.get('/auction-success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auction-success.html'));
});

// Fetch product details and bids
app.get('/api/product-details', async (req, res) => {
    const { id } = req.query;
    try {
        const product = await Auction.findById(id);
        const bids = await Bid.find({ productId: id });
        const currentBid = bids.length ? Math.max(...bids.map(b => b.amount)) : product.minimumBid;
        res.json({ ...product.toObject(), currentBid, bids });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch auction details
app.get('/api/auction-details', async (req, res) => {
    const { id } = req.query;
    try {
        const auction = await Auction.findById(id);
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        console.error('Error fetching auction details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Place a new bid
app.post('/api/place-bid', async (req, res) => {
    const { productId, bidAmount } = req.body;
    const user = req.session.user;

    if (!user) {
        console.error('User not logged in');
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        const product = await Auction.findById(productId);
        if (!product) {
            console.error('Product not found for ID:', productId);
            return res.status(404).json({ error: 'Product not found' });
        }

        if (bidAmount <= product.currentBid) {
            return res.status(400).json({ error: 'Bid amount must be higher than the current bid' });
        }

        const newBid = new Bid({
            productId,
            productName: product.productName,
            username: user.firstname,
            email: user.email,
            amount: bidAmount,
            auctioneerEmail: product.email,
            image: product.image
        });

        await newBid.save();

        await Auction.findByIdAndUpdate(
            productId,
            { currentBid: bidAmount },
            { new: true }
        );

        console.log('Bid placed successfully for product ID:', productId);
        res.status(200).json({ message: 'Bid placed successfully' });
    } catch (error) {
        console.error('Error placing bid:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch reviews for a product
app.get('/api/product-reviews', async (req, res) => {
    const { productId } = req.query;
    try {
        const reviews = await Review.find({ productId });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to submit a new review
app.post('/api/submit-review', async (req, res) => {
    const { productId, review } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!productId || !review) {
        return res.status(400).json({ error: 'Product ID and review text are required' });
    }

    try {
        const newReview = new Review({
            username: user.firstname,
            productId,
            review
        });

        await newReview.save();
        res.status(200).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update user profile information
app.post('/api/update-user-info', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const { firstname, lastname } = req.body;
    
    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Old username
        const oldFirstname = user.firstname;

        // Update user information
        user.firstname = firstname;
        user.lastname = lastname;
        await user.save();

        // Update auctions and bids
        await Auction.updateMany({ userId: req.session.user._id }, { $set: { username: firstname, email: user.email } });
        await Bid.updateMany({ email: user.email }, { $set: { username: firstname, email: user.email } });
        await Review.updateMany(
            { username: oldFirstname },
            { $set: { username: firstname } }
        );
        

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch user auctions
app.get('/api/user-auctions', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'User not logged in' });
    }
  
    try {
      const auctions = await Auction.find({ userId: req.session.user._id });
      res.json(auctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete auction
app.delete('/api/delete-auction', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const { id } = req.query;

    try {
        await Auction.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting auction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/update-auction', async (req, res) => {
    try {
        const { auctionId, productName, description, startingPrice, endDate } = req.body;
        
        // Find the existing auction
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        // Update auction details
        auction.productName = productName;
        auction.productDescription = description;
        auction.minimumBid = startingPrice;
        auction.endTime = new Date(endDate);

        // Update the currentBid if the new minimumBid is higher than the currentBid
        if (startingPrice > auction.currentBid) {
            auction.currentBid = startingPrice;
        }

        await auction.save();
        res.json({ success: true, auction });
    } catch (error) {
        console.error('Error updating auction:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Fetch user biddings
app.get('/api/user-biddings', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        const biddings = await Bid.find({ email: req.session.user.email }); // Use email to fetch user's bids
        res.json(biddings);
    } catch (error) {
        console.error('Error fetching biddings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});