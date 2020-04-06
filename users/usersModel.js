const db = require("../database/dbConfig");
const learningPath = require("../learning-paths/learningPathsModel");

module.exports = {
  find,
  updateUser,
  updateProfile,
  add,
  addProfile,
  addInitProfile,
  remove,
  editImage,
  findBy,
  findProfileById,
  findAllProfile,
  findById,
  findAll,
  FBfindOrCreate,
  GGLfindOrCreate,
  addToEmailList,
  getEmailList,
  checkEmailListForEmail
};

function find() {
  return db("users")
    .join("user_profile as up", "up.user_id", "=", "users.id")
    .select("users.*", "up.image");
}

function updateUser(id, changes) {
  console.log("IT GOT HERERRRRRRRREEEEEEEE", changes);
  return db("users")
    .where({ id })
    .update(changes);
}

function updateProfile(id, changes) {
  return db("user_profile")
    .where("user_id", id)
    .update(changes);
}

function remove(id) {
  return db("user_profile")
    .where("id", id)
    .del();
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

async function add(user) {
  let userId = await db("users").insert(user, "id");
  await learningPath.joinLearningPath(userId[0], 1, 1);
  return userId;
}

async function addProfile(userId, profile) {
  profile.user_id = userId;
  let ids = await db("user_profile").insert(profile, "id");
  let profileId = ids[0];
  return ids;
}

async function addInitProfile(user) {
  const user_id = user.id;
  const image =
    "https://res.cloudinary.com/klawd/image/upload/v1584550569/wq3oxtstbdkg8s9jxuhb.png";
  let ids = await db("user_profile").insert({ image: image, user_id: user_id });
  return ids;
}

function editImage(imageData, userId) {
  return db("user_profile")
    .where("user_id", "=", userId)
    .update({ image: imageData })
    .then(success => {
      return findProfileById(userId);
    })
    .catch(err => {
      console.log("Something went wrong", err);
    });
}

function findById(id) {
  return db("users")
    .select(
      "id",
      "email",
      "first_name",
      "last_name",
      "owner",
      "admin",
      "moderator"
    )
    .where({ id })
    .first();
}

function findProfileById(id) {
  return db("user_profile")
    .select("*")
    .where("user_id", id)
    .first();
}

function findAllProfile() {
  return db("user_profile").select("*");
}

function findAll() {
  return db("users").select("*");
}

async function FBfindOrCreate(userObj) {
  let user = await db("users").where({ email: userObj.email });
  if (user.length > 0) {
    if (!user.facebookID) {
      let newUser = await db("users").update(
        { facebookID: userObj.facebookID },
        "id"
      );
      return db("users")
        .where({ id: newUser[0] })
        .first();
    } else {
      return user[0];
    }
  }

  user = await db("users").where({ facebookID: userObj.facebookID });
  if (user.length === 0) {
    let newUser = await db("users").insert(
      {
        email: userObj.email,
        first_name: userObj.first_name,
        last_name: userObj.last_name,
        facebookID: userObj.facebookID,
        photo: userObj.photo
      },
      "id"
    );
    await learningPath.joinLearningPath(newUser[0], 1, 1);
    return db("users")
      .where({ id: newUser[0] })
      .first();
  } else {
    return user[0];
  }
}

async function GGLfindOrCreate(userObj) {
  let user = await db("users").where({ email: userObj.email });
  if (user.length > 0) {
    if (!user.googleID) {
      let newUser = await db("users").update(
        { googleID: userObj.googleID },
        "id"
      );
      return db("users")
        .where({ id: newUser[0] })
        .first();
    } else {
      return user[0];
    }
  }

  user = await db("users").where({ googleID: userObj.googleID });
  if (user.length === 0) {
    let newUser = await db("users").insert(
      {
        email: userObj.email,
        first_name: userObj.first_name,
        last_name: userObj.last_name,
        googleID: userObj.googleID,
        photo: userObj.photo
      },
      "id"
    );
    await learningPath.joinLearningPath(newUser[0], 1, 1);
    return db("users")
      .where({ id: newUser[0] })
      .first();
  } else {
    return user[0];
  }
}

function addToEmailList(email) {
  return db("email_list").insert({ email });
}

function getEmailList() {
  return db("email_list");
}

function checkEmailListForEmail(email) {
  return db("email_list")
    .where({ email })
    .first();
}
