import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import { users, posts } from './data/main.js'
import User from './models/User.js';
import Post from './models/Posts.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use("/assets", express.static(path.join(__dirname, '/public/assets')))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
// hrushikeshvibhute
// 1RtwCyrvsGFnuRJw
const upload = multer({ storage: storage })



const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB")

        // User.insertMany(users)
        // Post.insertMany(posts)

    })
    .catch((err) => {
        console.log(err)
    })

app.get('/', (req, res) => {
    res.send("Server running")
});

app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)


app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);


app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));