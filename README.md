# API Documentation

#### Backend delpoyed at [Heroku](https://dashboard.heroku.com/apps/didactlms) <br>

## Getting started

To get the server running locally:

- Clone this repo
- **yarn install** to install all required dependencies
- **yarn server** to start the local server
- **yarn test** to start server using testing environment
- **yarn docs** to create/update the apidoc page

### Express

-    We knew how to use it
-    It's lightweight
-    Works with nodejs
-    Many useful packages

## [Back-End API Docs](https://didactlms.herokuapp.com/api/docs/)

# Data Model


#### USERS

---

```
{
  id: INTEGER
  first_name: STRING
  last_name: STRING
  email: STRING
  password: STRING
  facebookID: STRING
  googleID: STRING
  slackID: STRING
  photo: STRING
}
```

#### COURSES

---

```
{
  id: INTEGER
  name: STRING
  link: STRING
  description: STRING
  category: STRING
  creator_id: INTEGER
  foreign_rating: STRING
  foreign_instructors: STRING
}
```

#### COURSE_SECTIONS

---

```
{
  id: INTEGER
  name: STRING
  course_id: INTEGER
  description: STRING
  link: STRING
  order: INTEGER
}
```

#### SECTION_DETAILS

---

```
{
  id: INTEGER
  name: STRING
  course_sections_id: INTEGER
  description: STRING
  link: STRING
  type: STRING
  order: INTEGER
}
```

#### PATHS

---

```
{
  id: INTEGER
  name: STRING
  description: STRING
  category: STRING
  creator_id: INTEGER
  font_awesome_name: STRING
}
```

#### PATH_ITEMS

---

```
{
  id: INTEGER
  path_id: INTEGER
  name: STRING
  description: STRING
  link: STRING
  type: STRING
  path_order: INTEGER
}
```

#### TAGS

---

```
{
  id: INTEGER
  name: STRING
}
```

#### TAGS_COURSES

---

```
{
  tag_id: INTEGER
  course_id: INTEGER
}
```

#### TAGS_PATHS

---

```
{
  tag_id: INTEGER
  path_id: INTEGER
}
```

#### PATHS_COURSES

---

```
{
  path_id: INTEGER
  course_id: INTEGER
  path_order: INTEGER
}
```

#### USERS_PATHS

---

```
{
  user_id: INTEGER
  path_id: INTEGER
  created: BOOLEAN
  rating: INTEGER
  user_path_order: INTEGER
  manually_completed: BOOLEAN
  automatically_completed: BOOLEAN
}
```

#### USERS_PATH_ITEMS

---

```
{
  user_id: INTEGER
  path_item_id: INTEGER
  manually_completed: BOOLEAN
  automatically_completed: BOOLEAN
}
```

#### USERS_COURSES

---

```
{
  user_id: INTEGER
  course_id: INTEGER
  manually_completed: BOOLEAN
  automatically_completed: BOOLEAN
}
```

#### USERS_SECTIONS

---

```
{
  user_id: INTEGER
  section_id: INTEGER
  manually_completed: BOOLEAN
  automatically_completed: BOOLEAN
}
```

#### USERS_SECTION_DETAILS

---

```
{
  user_id: INTEGER
  section_detail_id: INTEGER
  manually_completed: BOOLEAN
  automatically_completed: BOOLEAN
}
```

#### EMAIL_LIST

---

```
{
  id: INTEGER
  email: STRING
}
```

##  Actions

Function names are such that for most, you know what they do.

#### USERS

  `add(user)` -> adds a user to the database

  `findBy(filter)` -> finds users by filter

  `findById(id)` -> finds user by id

  `findAll()` -> finds all users

  `FBfindOrCreate(userObj)` -> finds or creates a user from facebook userObj

  `GGLfindOrCreate(userObj)` -> finds or creates a user from google userObj

  `addToEmailList(email)` -> adds email to list

  `getEmailList()` -> gets email list

  `checkEmailListForEmail(email)` -> checks email list for email


<br>
<br>
<br>

#### COURSES

  `find()` -> finds courses

  `findById(id)` -> finds course by id

  `add(userId, courseObj)` -> adds course to db

  `updateCourseById(userId, courseId, changes)` -> 

  `deleteCourseById(userId, courseId)` -> 

  `addCourseTag(userId, courseId, tag)` -> 

  `deleteCourseTag(userId, courseId, tag)` -> 

  `getTagsForCourse(courseId)` -> 

  `findCourseSectionsByCourseId(id)` -> 

  `findSectionDetailsByCourseSectionsId(id)` -> 

  `addCourseSection(userId, courseId, section)` -> 

  `updateCourseSection(userId, courseId, sectionId, changes)` -> 

  `deleteCourseSection(userId, courseId, sectionId)` -> 

  `addSectionDetails(userId, courseId, details)` -> 

  `updateSectionDetails(userId, courseId, sectionId, detailId, changes)` -> 

  `deleteSectionDetails(userId, courseId, sectionId, detailId)` -> 

  `manualLessonCompleteToggle(userId, courseId, sectionId, sectionDetailId)` -> 

  `manualSectionCompleteToggle(userId, courseId, sectionId)` -> 

  `manualCourseCompleteToggle(userId, courseId)` -> 

  `getLessonsWithUserCompletion(userId, sectionId)` -> 

  `findYourCourseSectionsByCourseId(userId, courseId)` -> 

  `findYoursById(userId, courseId)` -> 

  `autoCourseCompleteToggle(userId, courseId, isPathCompleted)` -> 

  `itemCascadeUp(userId, contentId)` -> checks if learning path is complete when completing an item

  `cascadeUp(userId, contentId, contentType)` -> checks for general upwards completion when completing something

  `generateUdemyCourse(userId, link, results, details)` -> 

  `findAllCoursesForUser(userId)` -> 

  `checkDbForCourseUrl(link)` -> 


  
<br>
<br>
<br>

#### TAGS

`find()` -> finds all tags

<br>
<br>
<br>

#### LEARNING PATHS

`getUsernameByUserId(userId)` -> 

`find() ` -> 

`findForUserId(userId)` -> 

`findForOwner(userId)` -> 

`findForNotUserId(userId)` -> 

`findById(id)` -> 

`findYourPathById(userId, pathId)` -> 

`getTagsForPath(pathId) ` -> 

`getCreatorIdForPath(pathId)` -> 

`findCoursesForPath(pathId)` -> 

`findPathItemsForPath(pathId)` -> 

`findYourPathItemsForPath(userId, pathId)` -> 

`addPathItem(userId, pathId, item)` -> 

`updatePathItem(userId, pathId, itemId, changes)` -> 

`togglePathItemCompletion(userId, pathId, itemId)` -> 

`deletePathItem(userId, pathId, itemId)` -> 

`add(userId, path, order)` -> 

`updatePathById(userId, pathId, changes)` -> 

`togglePathCompletion(userId, pathId)` -> 

`deletePathById(userId, pathId)` -> 

`joinLearningPath(userId, pathId, order)` -> 

`addUserPathItem(userId, pathItemId)` -> 

`addUserCourse(userId, courseId)` -> 

`addUserSection(userId, sectionId)` -> 

`addUserSectionDetail(userId, sectionDetailId)` -> 

`quitLearningPath(userId, pathId)` -> 

`checkForTag(tagName)` -> 

`addPathTag(userId, pathId, tag)` -> 

`deletePathTag(userId, pathId, tag)` -> 

`findCourseById(id)` -> 

`addPathCourse(userId, pathId, courseId, path_order)` -> 

`removePathCourse(userId, pathId, courseId)` -> 

`updateCourseOrder(userId, pathId, courseId, path_order)` -> 

`updateContentOrder(userId, pathId, content)` -> 

`updatePathOrder(userId, pathOrderArray)` -> 

`updateUsersCoursesOnCourseAdd(courseId, pathId)` -> 

`updateUsersPathItemsOnItemAdd(itemId, pathId)` -> 

<br>
<br>
<br>

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

    
   * DB_ENV - production, development, testing, staging
   * JWT_SECRET - a secret for signing json web tokens
   * FACEBOOK_APP_ID - facebook id for our app
   * FACEBOOK_APP_SECRET - facebook secret for auth
   * GOOGLE_APP_ID - google id for our app
   * GOOGLE_APP_SECRET - google secret for auth
   * YOUR_CLIENT_ID - app id for udemy
   * YOUR_CLIENT_SECRET - app secret for udemy
   * Authorization - authorization for udemy
   * REDIRECT_URL - whether we're hitting front-end staging or master deploy
   * EMAIL - our app email
   * EMAIL_PASSWORD - our app password
   * SENDGRID_API_KEY - our app sendgrid api key
   * SENDGRID_BASE64_CONVERSION - our app sendgrid api key converted to base64
    
## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

 **If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**
 - Check first to see if your issue has already been reported.
 - Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
 - Create a live example of the problem.
 - Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes,  where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/didact-fe/blob/master/README.md) for details on the fronend of our project.
