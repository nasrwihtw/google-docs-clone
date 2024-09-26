const mongoose = require("mongoose")
const Document = require("./modules/Document.js")
//TEmy4usIderES7we

mongoose.connect('mongodb://localhost/google-docs-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

const defaultValue = ""

io.on("connection", socket => {

  socket.on("get-document", async documentId =>{
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)
  
    socket.on("send-changes", delta => {
     socket.broadcast.to(documentId).emit("receive-changes", delta)
    })
    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, {data})
    })
  })
  console.log("connected")
})

async function findOrCreateDocument(id){
  if(id == null) return 

  const document = await Document.findById(id, null, { bufferTimeoutMS: 10000 });

  if(document) return document

  return await Document.create({_id: id, deta: defaultValue })


}


// how socket works
/*
it allows to make acoonection between a client and server but have that connection persist

 fetch,ajax ===> server ==> client

 => ex. a fetch request or some type of ajax you are asking the server for some information
 so youre goog to be pointing to server and then the server is going to that information back to 
 the client when you use something like fetch or ajax
 that's the end ot the request
 so you do fetch it gets to server gets to client and then the information closes off

 but if you need to make for example 10 different fetch request, you need to make 10 new requests to the server

 fetch,ajax ===> server ==> client
 fetch,ajax ===> server ==> client
 fetch,ajax ===> server ==> client
 .
 .
 .





 WebSocket ===> server ===> client
 Socket io is a bit different what you'r gonna be doing
  is going to be setting up something called a websocket
  => these web sockets are going to connect to the server
  but the connection stays open
  so if i make 10 requests to the server through my websocket
  i only ever make one connection to this server because that connction stays open

this is very usefull when you need to make a lot of requests
 especially if they're smaller requests because can just constantly with the server 
 without haing to worry about headache of setting up a connection and that tearing down the coneciton 
 because those do take time 

 When all you're doing communicating a lot small a lot to the server 
 that extra time of setting up the closing down that connection are gonna really add up 
 which is webSocket very useful

 Chat Application are very ideal for webSocket
*/ 