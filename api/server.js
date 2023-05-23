const express = require("express");
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const usersCollection = require("./mongoDB/userSchema");
const Document = require("./mongoDB/Document");
const cors = require('cors');
const app = express();
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
app.use(cookieParser());

//mongo-connection

mongoose.connect("mongodb://127.0.0.1:27017/google-docs-clone", {
  // mongoose.connect("mongodb://127.0.0.1:27017/text-doc-editor", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
})
.then(() => {
  console.log("Database connected succesfully");
})
.catch((e) => {
  console.log("Database Connection failed", e);
})
//mongo connection end


  //soket connection
  const io = require("socket.io")(3001, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  })

  const defaultValue = ""

  io.on("connection", socket => {
    socket.on("get-document", async documentId => {
      const document = await findOrCreateDocument(documentId)
      // console.log(document.title);
      socket.join(documentId)
      socket.emit("load-document", document.data)

      socket.on("send-changes", delta => {
        socket.broadcast.to(documentId).emit("receive-changes", delta)
      })

      socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
      })
    })
  })

  async function findOrCreateDocument(id) {
    if (id == null) return


    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id,title : 'Untitled Document',owner_id : '64653298614f59ec73fb32dc',data: defaultValue })
    // return await Document.create({ _id: id,title : 'Untitled Document',owner_id : doc_id,data: defaultValue })

  }

  //soket connection end


  //delete
app.delete('/api/deletedocuments/:id', (req, res) => {
  const documentId = req.params.id;
console.log(documentId);
Document.findOneAndDelete({ _id: documentId })
.then(deletedDocument => {
  if (!deletedDocument) {
    return res.status(404).json({ message: 'Document not found' });
  }
  res.status(200).json({ message: 'Document deleted successfully' });
})
.catch(error => {
  console.error('Error deleting document:', error);
  res.status(500).json({ message: 'Internal server error' });
});
});
//delete end

  app.put(`/api/updateTitle/:id`, async (req, res) => {
    const { title } = req.body;
  //   console.log(req.headers);
  //   // console.log(req._id);
  //   // const yourToken = req.cookies.auth;

  //   // // const yourToken = req.header('authorization');
  //   // console.log(yourToken);

  //   // const decodedValue = jwt_decode(yourToken);
  //   // console.log(decodedValue);



    try {
      // Find the document you want to update
      console.log(req.params);
      const document = await Document.findOne({_id : req.params['id']});

      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }

      // Update the title
      document.title = title;

      // Save the updated document
      await document.save();

      res.json({ message: 'Title updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get("/api/getTitle", cors(),  async(req, res) => {
    // const param1 = req.body;
    const { param1} = req.query;
    // console.log(param1)
    try {
      const doc = Document.find({_id : param1})
      // console.log(doc);s
      res.send({title:doc.title});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching docs' });
    }




  });


app.get("/api/docs", cors(),  async(req, res) => {
  // console.log('Signed Cookies: ', req.signedCookies)
  // console.log(req.headers);
  // const token = req.headers.authorization?.split(' ')[1];
  // if (token) {
  //   const decodedToken = jwt.verify(token, secretKey);
  //   req.user = decodedToken;
  // }
  // console.log(req.user);

  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching docs' });
  }
});



app.get("/", cors(),  async(req, res) => {
  console.log("req.user");
});

app.post("/", async(req, res) => {

  const {email, password} = req.body ;
    const user = await usersCollection.findOne({email: email})
    if(user){
      if(await bcrypt.compare(password, user.password)) {
        const token = await jwt.sign({_id:user._id, email}, `${process.env.jwtsecret}`, { expiresIn: "2h"});
        user.token = token;
        user.password = undefined;
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true
        };

        res.status(201)
        // .json({ message: "Passwords matched", token: token})
        .cookie("token", token, options)
        .json({
           message: "Passwords matched", token: token
        });
      } else {
        res.send({ message: "Password didn't match"})
      }
    } else {
      res.send({message: "User not registered"})
    }
})

app.post("/signup", async(req, res) => {
  const {name, email, phoneNumber, password} = req.body ;

  try {
    const check = await usersCollection.findOne({email: email})
    console.log(check);
    if(check) {
      res.json("exist");
      console.log('exist');
    }
    else {
      const myEncPassword = await bcrypt.hash(password, 10);
      const userData = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: myEncPassword,
      }
      const user = await usersCollection.create([userData]);
      const token = await jwt.sign({_id:user._id, email}, `${process.env.jwtsecret}`, { expiresIn: "2h"});
      user.token = token;
      user.password = undefined;
      res.status(201).json(user);
        // console.log(token,'token');
        // const userVerify = await jwt.verify({ token, ""});
    }
  }
  catch(e) {
    res.json("notExist");
  }
})

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
