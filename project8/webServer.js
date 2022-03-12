/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

var async = require("async");

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

const fs = require("fs");

var express = require("express");
var app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require("./schema/user.js");
var Photo = require("./schema/photo.js");
var SchemaInfo = require("./schema/schemaInfo.js");
const { makePasswordEntry, doesPasswordMatch } = require("./cs142password.js");
app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
app.use(bodyParser.json());
// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect("mongodb://localhost/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params objects.
  console.log("/test called with param1 = ", request.params.p1);

  var param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error("Doing /user/info error:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object - This
        // is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an async
    // call to each collections. That is tricky to do so we use the async package
    // do the work.  We put the collections into array and use async.each to
    // do each .count() query.
    var collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          var obj = {};
          for (var i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400) status.
    response.status(400).send("Bad param " + param);
  }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get("/user/list", function (request, response) {
  if (request.session.login_name && request.session.user_id) {
    User.find({}, function (err, users) {
      if (err) {
        console.error("Doing /user/list error:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (users.length === 0) {
        response.status(500).send("Missing UserList");
        return;
      }
      let userList = [];
      for (let i = 0; i < users.length; i++) {
        let { _id, first_name, last_name } = users[i];
        let newUser = { _id, first_name, last_name };
        userList.push(newUser);
      }
      response.status(200).send(userList);
    });
  } else {
    response.status(401).send("Not Logged In");
  }
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get("/user/:id", function (request, response) {
  if (request.session.login_name && request.session.user_id) {
    var id = request.params.id;
    User.findOne({ _id: id }, function (err, user) {
      if (err) {
        console.error("Doing /user/:id error", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      if (user === null || user === undefined) {
        console.log("User with _id:" + id + " not found.");
        response.status(400).send("Not found");
        return;
      }
      let { _id, first_name, last_name, location, description, occupation } =
        user;
      let newUser = {
        _id,
        first_name,
        last_name,
        location,
        description,
        occupation,
      };
      response.status(200).send(newUser);
    });
  } else {
    response.status(401).send("Not Logged In");
  }
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get("/photosOfUser/:id", function (request, response) {
  if (request.session.login_name && request.session.user_id) {
    var id = request.params.id;
    Photo.find({ user_id: id }, "-__v", function (err, photos) {
      if (err) {
        console.error("Doing /photosOfUser/:id error", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      photos = JSON.parse(JSON.stringify(photos));
      photos = photos.filter(
        (photo) =>
          photo.permitted_users.includes(request.session.user_id) ||
          photo.permitted_users.length === 0
      );

      async.each(
        photos,
        function (currPhoto, callbackPhoto) {
          async.each(
            currPhoto.comments,
            function (currComment, callbackComment) {
              let comment_id = currComment.user_id;
              delete currComment.user_id;
              User.findOne({ _id: comment_id }, "first_name last_name _id")
                .then((user) => {
                  currComment.user = user;
                  callbackComment();
                })
                .catch((err1) => {
                  callbackComment(err1);
                  console.log("commentcallback: ", err1);
                });
            },
            (err2) => {
              if (err2) {
                response.status(400).send("Not found");
              } else {
                callbackPhoto();
              }
            }
          );
        },
        (err3) => {
          if (err3) {
            response.status(400).send(JSON.stringify(err3));
          } else {
            response.status(200).send(photos);
          }
        }
      );
    });
  } else {
    response.status(401).send("Not Logged In");
  }
});

// Log in - project 7

app.post("/user", function (request, response) {
  let {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  User.findOne({ login_name: login_name }, async function (err, info) {
    if (err) {
      console.error("Verifying username error: ", err);
      return;
    }
    if (info) {
      response.status(400).send("Username already exists.");
      return;
    }
    if (
      login_name.length === 0 ||
      password.length === 0 ||
      first_name.length === 0 ||
      last_name.length === 0
    ) {
      response.status(400).send("User information not valid.");
      return;
    }
    const { salt, hash } = await makePasswordEntry(password);

    let newUser = {
      first_name: first_name,
      last_name: last_name,
      location: location,
      description: description,
      occupation: occupation,
      login_name: login_name,
      password: password,
      salt: salt,
      password_digest: hash,
    };
    User.create(newUser, function (error, user) {
      if (error) {
        console.error("Registering user error: ", error);
        response.status(400).send(JSON.stringify(error));
        return;
      }
      request.session.login_name = login_name;
      request.session.user_id = user._id;

      response.status(200).send(user);
    });
  });
});

app.post("/admin/login", function (request, response) {
  let login_name = request.body.login_name;
  let password_entered = request.body.password;
  User.findOne({ login_name: login_name }, async function (err, user) {
    if (err) {
      console.error("Doing /admin/login", err);
      response.status(400).send(JSON.stringify(err));
      return;
    }
    if (!user) {
      console.log(login_name + " is not a valid account.");
      response.status(400).send("login name not found");
      return;
    }
    const pwd_match = await doesPasswordMatch(
      user.password_digest,
      user.salt,
      password_entered
    );
    if (!pwd_match) {
      response.status(400).send("Incorrect password, please try again.");
      return;
    }

    request.session.login_name = login_name;
    request.session.user_id = user._id;

    response.status(200).send(user);
  });
});

app.post("/admin/logout", function (request, response) {
  if (request.session.login_name && request.session.user_id) {
    request.session.destroy(function (err) {
      console.log(err);
    });
    response.status(200).send("Successfully logged out.");
  } else {
    response.status(400).send("The user is not currently logged in.");
  }
});

app.post("/commentsOfPhoto/:photo_id", function (request, response) {
  if (!(request.session.login_name && request.session.user_id)) {
    response.status(400).send("Not logged in :(");
    return;
  }

  if (request.body.comment === "") {
    response.status(400).send("empty commnet");
    return;
  }

  const photo_id = request.params.photo_id;

  Photo.findOne({ _id: photo_id }, function (err, photo) {
    if (err) {
      response.status(400).send("Photo not found.");
      return;
    }

    const currComments = photo.comments;

    if (!currComments) {
      photo.comments = [];
    }
    photo.comments.push({
      comment: request.body.comment,
      user_id: request.session.user_id,
    });

    photo
      .save()
      .then(() => {
        response.status(200).send();
      })
      .catch((err1) => {
        console.error(err1);
        response.status(500).send("Cant add comments");
      });
  });
});

app.get("/admin/isLoggedIn", function (request, response) {
  if (!request.session.user_id) {
    response.status(200).send(null);
    return;
  }
  const user_id = request.session.user_id;
  User.findOne({ _id: user_id }, function (err, user) {
    if (err) {
      response.status(200).send(null);
      return;
    }

    response.status(200).send(user);
  });
});

const processFormBody = multer({ storage: multer.memoryStorage() }).single(
  "uploadedphoto"
);
app.post("/photos/new", (request, res) => {
  processFormBody(request, res, (err) => {
    if (err || !request.file) {
      res.status(400).send(err);
    }
    // request.file has the following properties of interest
    //      fieldname      - Should be 'uploadedphoto' since that is what we sent
    //      originalname:  - The name of the file the user uploaded
    //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
    //      buffer:        - A node Buffer containing the contents of the file
    //      size:          - The size of the file in bytes

    // XXX - Do some validation here.
    // We need to create the file in the directory "images" under an unique name. We make
    // the original file name unique by adding a unique prefix with a timestamp.
    const timestamp = new Date().valueOf();
    const filename = "U" + String(timestamp) + request.file.originalname;
    const user_id = request.session.user_id;
    let userPermission = JSON.parse(request.body.selectedUsers);
    console.log("userPermission", userPermission);
    fs.writeFile("./images/" + filename, request.file.buffer, function (err1) {
      // XXX - Once you have the file written into your images directory under the name
      // filename you can create the Photo object in the database
      if (err1) {
        console.log(err1);
        res.status(400).send("can't upload photos");
        return;
      }

      Photo.create(
        {
          file_name: filename,
          date_time: timestamp,
          user_id: request.session.user_id,
          comments: [],
          tags: [],
          permitted_users: userPermission,
        },
        function (err2) {
          if (err2) {
            res.status(500).send("create failed");
            return err2;
          }
          return null;
        }
      );
    });
    res.status(200).send("Photo uploaded");
  });
});

app.get("/photo/:photoId/tags", (request, response) => {
  const { photoId } = request.params;

  Photo.findOne({ _id: photoId }, (err, photo) => {
    if (err) {
      response.status(400).send("Photo not found");
      return;
    }

    const tags = photo.tags;

    response.status(200).send(tags);
  });
});

app.post("/photo/:photoId/tag/create", (request, response) => {
  const tagObj = request.body.tag;
  const id = request.params.photoId;
  if (!tagObj) {
    response.status(400).send("No object passed in");
    return;
  }

  Photo.findById({ _id: id }, (err, photo) => {
    if (err) {
      response.status(400).send("photo not found");
      return;
    }

    const newTags = [...photo.tags, tagObj];
    photo.tags = newTags;

    photo
      .save()
      .then((res) => response.status(200).send(res.tags))
      .catch(() => response.status(500).send("Can't add tag"));
  });
});

app.post("/photo/:photoId/tag/remove", (request, response) => {
  const tagObj = request.body.tag;
  const id = request.params.photoId;
  if (!tagObj) {
    response.status(400).send("No object passed in");
    return;
  }

  Photo.findById({ _id: id }, (err, photo) => {
    if (err) {
      response.status(400).send("photo not found");
      return;
    }
    const newTags = (photo.tags || []).filter(
      (tag) => tag._id.toString() !== tagObj._id
    );
    photo.tags = [...newTags];

    photo
      .save()
      .then((res) => response.status(200).send(res.tags))
      .catch(() => response.status(500).send("Can't remove tag"));
  });
});

app.get(`/favorites`, function (request, response) {
  if (!(request.session.login_name && request.session.user_id)) {
    response.status(400).send("Not logged in :(");
    return;
  }
  const user_id = request.session.user_id;
  const photoId = request.body.photoId;
  User.findOne({ _id: user_id }, function (err, user) {
    if (err) {
      console.error("Doing /favorites error", err);
      response.status(400).send(JSON.stringify(err));
      return;
    }
    let currFavorites = user.favorites;
    let favoritesInfo = [];

    async.each(
      currFavorites,
      function (photoId, callbackFavorites) {
        Photo.findOne({ _id: photoId }, function (err, photo) {
          if (err) {
            response.status(400).send("photo not found");
            return;
          }
          favoritesInfo.push({
            file_name: photo.file_name,
            date_time: photo.date_time,
            _id: photo._id,
          });
          callbackFavorites();
        });
      },
      (err1) => {
        if (err1) {
          response.status(400).send(JSON.stringify(err1));
          console.log("were not able to get all favorites");
        } else {
          response.status(200).send(favoritesInfo);
        }
      }
    );
  });
});

app.post(`/addFavorites/:photoId`, function (request, response) {
  if (request.session.login_name && request.session.user_id) {
    const user_id = request.session.user_id;
    const photoId = request.params.photoId;
    User.findOne({ _id: user_id }, function (err, user) {
      if (err) {
        console.error("Doing /addFavorites error", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      if (!user) {
        console.log("User with _id:" + id + " not found.");
        response.status(400).send("Not found");
        return;
      }
      if (!user.favorites.includes(photoId)) {
        user.favorites.push(photoId);
        user.save();
      }
      response.status(200).send("Favorite photo added.");
    });
  } else {
    response.status(400).send("Not logged in :(");
  }
});

app.get(`/deleteFavorites/:photoId`, function (request, response) {
  if (request.session.login_name && request.session.user_id) {
    const user_id = request.session.user_id;
    const photoId = request.params.photoId;
    User.findOne({ _id: user_id }, function (err, user) {
      if (err) {
        console.error("Doing /deleteFavorites error", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      if (!user) {
        console.log("User with _id:" + id + " not found.");
        response.status(400).send("Not found");
        return;
      }
      const indexOfPhoto = user.favorites.indexOf(photoId);
      user.favorites.splice(indexOfPhoto, 1);
      user.save();
      response.status(200).send("Favorite photo deleted.");
    });
  } else {
    response.status(400).send("Not logged in :(");
  }
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
