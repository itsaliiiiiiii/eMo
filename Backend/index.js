import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/eMo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mail: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
});

const { Types } = mongoose;
const { ObjectId } = Types;
const productSchema = new mongoose.Schema({
    nameProduct: { type: String, required: true, unique: true },
    originProduct: { type: String, required: false },
    priceProduct: { type: Number, required: true },
    descriptionProduct: { type: String, required: false },
    stockProduct: { type: Number, required: true },
    imageProduct: { type: Buffer, required: true }, // Store the image as binary data
    seller_id: { type: ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema, 'users');
const Product = mongoose.model('Product', productSchema, 'products');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, mail, password, username, countryCode, phone, role } = req.body;

        if (!firstname || !lastname || !mail || !password || !username || !countryCode || !phone || !role) {
            return res.status(400).send('All fields are required');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstname,
            lastname,
            mail,
            password: hashedPassword,
            username,
            countryCode,
            phone,
            role,
        });

        await user.save();
        console.log('User registered:', user);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access token not found');
    }

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};

app.get('/protected-endpoint', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ mail: req.body.mail });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Password incorrect');
        }

        const accessToken = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1d' });
        res.json({ accessToken: accessToken });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

app.get('/check-email', async (req, res) => {
    try {
        const { mail } = req.query;
        if (!mail) {
            return res.status(400).send('Email is required');
        }

        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(200).send({ exists: true });
        } else {
            return res.status(200).send({ exists: false });
        }

    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).send('Error checking email');
    }
});

app.get('/check-user', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).send('username is required');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(200).send({ exists: true });
        } else {
            return res.status(200).send({ exists: false });
        }

    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).send('Error checking username');
    }
});

app.get('/check-SellerOrClient', verifyToken, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).send({ role: user.role });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
});

app.post('/add-product', verifyToken, upload.single('imageProduct'), async (req, res) => {
    try {
        const { nameProduct, originProduct, priceProduct, descriptionProduct, stockProduct } = req.body;

        if (!nameProduct || !priceProduct || !stockProduct) {
            return res.status(400).send('All required fields must be provided');
        }

        const userId = req.user.id;

        const product = new Product({
            nameProduct,
            originProduct,
            priceProduct: Number(priceProduct),
            descriptionProduct,
            stockProduct: Number(stockProduct),
            seller_id: new mongoose.Types.ObjectId(userId),
            imageProduct: req.file.buffer
        });

        await product.save();
        console.log('Product registered:', product);
        res.status(201).send('Product registered successfully');
    } catch (error) {
        console.error('Error registering product:', error);
        res.status(500).send('Error registering product');
    }
});
app.get('/get-product', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const products = await Product.find({ seller_id: userId });

        if (products.length === 0) {
            return res.status(404).send('No products found for this user');
        }
        
        const productsWithBase64Image = products.map(product => ({
            ...product.toObject(),
            imageProduct: product.imageProduct.toString('base64')
        }));

        res.status(200).json(productsWithBase64Image);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
