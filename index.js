import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose';
// import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import kenoRoute from "./routes/keno.Route.js"
import compression from 'compression';
import config from './config/index.js';






const app = express();
mongoose.set("strictQuery", false);


const connect = async () =>{
	try{
		
		await mongoose.connect(config.mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
		
		
	}
	catch(err){
		console.log(err);
	}
};
 
mongoose.connection.on("disconnected", ()=> {
	console.log("mongo is disconnected!")
})

mongoose.connection.on("connected", ()=> {
	console.log("mongo is connected!")
})

console.log(config.allowedDomains)
// app.use(cookieParser());

app.use(express.json());
//app.use(cors({origin:config.allowedDomains}))
app.use(cors())
app.use(helmet())
app.use(compression())

app.use('/api/playkeno', kenoRoute)

const server = http.createServer(app);

server.listen(config.port, () => {
	connect();
	console.log("I'm connected to the backend!");
	
});