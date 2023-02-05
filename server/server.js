require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { join } = require("path");
const { authMiddleware } = require("./utils/auth.js");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config");
// const Chat = require('./config/Chat')

const PORT = process.env.PORT || 3001;
const app = express();

// Socket.io setup
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static(join(__dirname, "..", "client", "build")));
}

app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "client", "build", "index.html"));
});

let messageArr = [];
io.on("connection", (socket) => {
	console.log(`Client is connected with ID: ${socket.id}`);

	socket.on("joinRoom", (data) => {
		socket.join(data);
	});

	socket.on("sendMessage", (message) => {
		messageArr.push({ message: message.message });
		console.log(messageArr);

		io.to(message.room).emit("receiveMessage", messageArr);
	});

	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} disconnected`);
	});
});

const startApolloServer = async (typeDefs, resolvers) => {
	await apolloServer.start();
	apolloServer.applyMiddleware({ app });
	db.once("open", () => {
		server.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}`);
			console.log(
				`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`
			);
		});
	});
};

startApolloServer(typeDefs, resolvers);
