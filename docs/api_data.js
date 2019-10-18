define({ "api": [
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "Post User Login",
    "name": "PostLogin",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the existant user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password of the existant user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"doctest@example.com\",\n  \"password\": \"blahblahblah\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>An object with the user id and username and token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"User Created\",\n  \"email\": \"doctest@example.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The username or password is missing.</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "internal-server-error",
            "description": "<p>The user couldn't be logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400-Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"missing email or password\"\n}",
          "type": "json"
        },
        {
          "title": "500-Error-Response:",
          "content": "HTTP/1.1 500 Internal-Server-Error\n{\n \"message\": \"Couldn't connect to login service\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/authRouter.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/auth/register",
    "title": "Post User Registration",
    "name": "PostUser",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The email of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "first_name",
            "description": "<p>The first_name of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "last_name",
            "description": "<p>The last_name of the new user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"doctest@example.com\",\n  \"password\": \"blahblahblah\",\n  \"first_name\": \"Doc\",\n  \"last_name\": \"Test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>An object with the user id, email and token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"token\": \"fkjhfbedof84g3ygf89fgy3qf0897yguf942u7fg84gf\",\n  \"id\": 3,\n  \"email\": \"doctest@example.com\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The username or password is missing.</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "type": "Object",
            "optional": false,
            "field": "duplicate-email-error",
            "description": "<p>The email is already registered</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "internal-server-error",
            "description": "<p>The user couldn't be registered</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400-Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"email, password, first_name, and last_name are required\"\n}",
          "type": "json"
        },
        {
          "title": "409-Error-Response:",
          "content": "HTTP/1.1 409 Conflict\n{\n \"message\": \"A user with that email already exists\"\n}",
          "type": "json"
        },
        {
          "title": "500-Error-Response:",
          "content": "HTTP/1.1 500 Internal-Server-Error\n{\n \"message\": \"Error connecting with server\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./auth/authRouter.js",
    "groupTitle": "Authentication"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./docs/main.js",
    "group": "C__Users_jonat_000_Documents_lambdaschool_Didact_didact_be_docs_main_js",
    "groupTitle": "C__Users_jonat_000_Documents_lambdaschool_Didact_didact_be_docs_main_js",
    "name": ""
  },
  {
    "type": "delete",
    "url": "/api/courses/:id",
    "title": "delete Course",
    "name": "DeleteCourse",
    "group": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Success",
            "description": "<p>A message that the course was deleted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n    \"message\": \"course deleted\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The user is not authorized to delete this course</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>The course with id sent was not found in database</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-User-Error",
            "description": "<p>Could not find user to delete course for</p>"
          },
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Delete-Course-Error",
            "description": "<p>Could not delete course</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "403-Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n \"message\": \"User is not permitted to change this course\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"No course found with that ID\"\n}",
          "type": "json"
        },
        {
          "title": "500-User-Not-Found:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not find user to delete course for\"\n}",
          "type": "json"
        },
        {
          "title": "500-Course-Delete-Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not delete course\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Courses"
  },
  {
    "type": "put",
    "url": "/api/courses/:id",
    "title": "Edit Course",
    "name": "EditCourse",
    "group": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Success",
            "description": "<p>A message that the course was updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n    \"message\": \"course updated\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "Missing-Course-Data",
            "description": "<p>The course data is absent</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The user is not authorized to edit this course</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>The course with id sent was not found in database</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-User-Error",
            "description": "<p>Could not find user to edit course for</p>"
          },
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Edit-Course-Error",
            "description": "<p>Could not edit course</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400-Course-Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"Missing course data\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "403-Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n \"message\": \"User is not permitted to change this course\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"No course found with that ID\"\n}",
          "type": "json"
        },
        {
          "title": "500-User-Not-Found:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not find user to edit course for\"\n}",
          "type": "json"
        },
        {
          "title": "500-Course-Edit-Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not edit course\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Courses"
  },
  {
    "type": "get",
    "url": "/api/courses/:id",
    "title": "Get Course by ID",
    "name": "GetCourseByID",
    "group": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "object",
            "optional": false,
            "field": "Course",
            "description": "<p>An object of the course matching the id param</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n    \"id\": 1,\n    \"name\": \"Learning How to Learn: Powerful mental tools to help you master tough subjects\",\n    \"link\": \"https://www.coursera.org/learn/learning-how-to-learn\",\n    \"description\": \"This course gives you easy access to the invaluable learning techniques used by experts in art, music, literature, math, science, sports, and many other disciplines. We’ll learn about the how the brain uses two very different learning modes and how it encapsulates (“chunks”) information. We’ll also cover illusions of learning, memory techniques, dealing with procrastination, and best practices shown by research to be most effective in helping you master tough subjects.\\n\\nUsing these approaches, no matter what your skill levels in topics you would like to master, you can change your thinking and change your life. If you’re already an expert, this peep under the mental hood will give you ideas for: turbocharging successful learning, including counter-intuitive test-taking tips and insights that will help you make the best use of your time on homework and problem sets. If you’re struggling, you’ll see a structured treasure trove of practical techniques that walk you through what you need to do to get on track. If you’ve ever wanted to become better at anything, this course will help serve as your guide.\",\n    \"category\": null,\n    \"creator_id\": 1,\n    \"foreign_rating\": \"4.8 stars\",\n    \"foreign_instructors\": \"Dr. Barbara Oakley, Dr. Terrence Sejnowski\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "Course-Not-Found",
            "description": "<p>The course isn't in the database</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "internal-server-error",
            "description": "<p>Could not retrieve course</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Course Not Found\n{\n \"message\": \"No course found with that ID\"\n}",
          "type": "json"
        },
        {
          "title": "500-Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Error connecting with server\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Courses"
  },
  {
    "type": "get",
    "url": "/api/courses",
    "title": "Get Courses",
    "name": "GetCourses",
    "group": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>The link of the course you want to find (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tag",
            "description": "<p>An tag to filter the courses you want to find (optional)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Get Course By URL",
          "content": "{\n\t\"url\": \"https://www.coursera.org/learn/learning-how-to-learn\"\n}",
          "type": "json"
        },
        {
          "title": "Get Courses By Tag",
          "content": "{\n\t\"tag\": \"Something else\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Array",
            "optional": false,
            "field": "Courses",
            "description": "<p>An array of the courses on the website, optionally filtered by url sent in body</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n [\n     {\n         \"id\": 1,\n         \"name\": \"Learning How to Learn: Powerful mental tools to help you master tough subjects\",\n         \"link\": \"https://www.coursera.org/learn/learning-how-to-learn\",\n         \"description\": \"This course gives you easy access to the invaluable learning techniques used by experts in art, music, literature, math, science, sports, and many other disciplines. We’ll learn about the how the brain uses two very different learning modes and how it encapsulates (“chunks”) information. We’ll also cover illusions of learning, memory techniques, dealing with procrastination, and best practices shown by research to be most effective in helping you master tough subjects.\\n\\nUsing these approaches, no matter what your skill levels in topics you would like to master, you can change your thinking and change your life. If you’re already an expert, this peep under the mental hood will give you ideas for: turbocharging successful learning, including counter-intuitive test-taking tips and insights that will help you make the best use of your time on homework and problem sets. If you’re struggling, you’ll see a structured treasure trove of practical techniques that walk you through what you need to do to get on track. If you’ve ever wanted to become better at anything, this course will help serve as your guide.\",\n         \"category\": null,\n         \"creator_id\": 1,\n         \"foreign_rating\": \"4.8 stars\",\n         \"foreign_instructors\": \"Dr. Barbara Oakley, Dr. Terrence Sejnowski\"\n       }\n ]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "internal-server-error",
            "description": "<p>Could not retrieve courses</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "500-Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Error connecting with server\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/api/courses",
    "title": "Post Course",
    "name": "PostCourse",
    "group": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the course you want to create</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>The description of the course you want to create</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "link",
            "description": "<p>The link of the course you want to create</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Course-Post-Example:",
          "content": "{ \n\t \"name\": \"Learn How to Write Docs\",\n\t \"description\": \"In this course, you will learn the tedium of writing docs.\",\n\t \"link\": \"http://apidocjs.com/\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "object",
            "optional": false,
            "field": "Course",
            "description": "<p>An object of the course that the user posted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n {\n    \"id\": 2\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "Missing-Course-Data",
            "description": "<p>The course data is absent</p>"
          },
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "Missing-Course-Name",
            "description": "<p>The course name is absent</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-User-Error",
            "description": "<p>Could not find user to add course for</p>"
          },
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Add-Course-Error",
            "description": "<p>Could not add course</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400-Course-Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"Missing course data\"\n}",
          "type": "json"
        },
        {
          "title": "400-Name-Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"Course name is required\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "500-User-Not-Found:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not find user to add course for\"\n}",
          "type": "json"
        },
        {
          "title": "500-Course-Add-Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not add course\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Courses"
  },
  {
    "type": "post",
    "url": "/api/courses/:id/tags",
    "title": "Post Tags To Course",
    "name": "PostTagsToCourse",
    "group": "Courses",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>The names of the tags you want to create/add for the course</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Tags Post Example:",
          "content": "{ \n        tags: ['Learning', 'self teaching', 'something else']\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "string",
            "optional": false,
            "field": "Message",
            "description": "<p>A message that the tags were added</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n {\n    message: 'tags added to course'\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "Missing-Tags-Data",
            "description": "<p>The tags data is absent</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The user is not authorized to add tags to this course</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>The course with id sent was not found in database</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-User-Error",
            "description": "<p>Could not find user to add course for</p>"
          },
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Add-Course-Error",
            "description": "<p>Could not add course</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400 Tags Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"Missing tags data\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "403-Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n \"message\": \"User is not permitted to change this course\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"No course found with that ID\"\n}",
          "type": "json"
        },
        {
          "title": "500-User-Not-Found:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Could not find user to add course for\"\n}",
          "type": "json"
        },
        {
          "title": "500-Tag-Add-Error:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n \"message\": \"Internal error: could not add tags to course\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Courses"
  },
  {
    "type": "delete",
    "url": "/api/courses/:id/sections/:section_id/details/:detail_id",
    "title": "Delete Course Section Details",
    "name": "DeleteCourseSectionDetails",
    "group": "Details",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Updated",
            "description": "<p>message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 \n{\n    \"message\": \"Detail has been deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>could not find a detail with the passed in id</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not delete detail from section</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"Detail 2 not found in Section 4\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Details"
  },
  {
    "type": "get",
    "url": "/api/courses/:id/sections/:s_id",
    "title": "Get Section Details",
    "name": "GetSectionDetails",
    "group": "Details",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Array",
            "optional": false,
            "field": "Sections",
            "description": "<p>an array of the course sections</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \n  {\n      \"courseSection\": [\n          {\n              \"id\": 59,\n              \"name\": \"How to Become a Better Learner\",\n              \"course_sections_id\": 4,\n              \"description\": \"\",\n              \"link\": \"https://www.coursera.org/learn/learning-how-to-learn/lecture/f839b/how-to-become-a-better-learner\",\n              \"type\": \"video\",\n              \"order\": 1\n          },\n          {\n              \"id\": 60,\n              \"name\": \"Introduction to Renaissance Learning and Unlocking Your Potential\",\n              \"course_sections_id\": 4,\n              \"description\": \"\",\n              \"link\": \"https://www.coursera.org/learn/learning-how-to-learn/lecture/SIck3/introduction-to-renaissance-learning-and-unlocking-your-potential\",\n              \"type\": \"video\",\n              \"order\": 2\n          }\n      ]\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>could not find a detail with the passed in id</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not find detail to get course for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"could not find a detail with an id of 4\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Details"
  },
  {
    "type": "post",
    "url": "/api/courses/:id/sections/:s_id",
    "title": "Post Section Details",
    "name": "PostSectionDetails",
    "group": "Details",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Object",
            "optional": false,
            "field": "Created",
            "description": "<p>message with id returned</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n    \"message\": \"Detail has been added with an id of 7\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not post Detail to section</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Details"
  },
  {
    "type": "put",
    "url": "/api/courses/:id/sections/:section_id/details/:detail_id",
    "title": "Put Section Details",
    "name": "PutSectionDetails",
    "group": "Details",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Updated",
            "description": "<p>message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Updated\n{\n    \"message\": \"Detail has been updated\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "Missing-Section-Changes",
            "description": "<p>The section changes are absent</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>could not find a Detail with the passed in id</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not update detail from section</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400-Section-Changes-Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"Could not find changes in body\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"Detail 5 not found in Section 3\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Details"
  },
  {
    "type": "delete",
    "url": "/api/courses/:id/sections",
    "title": "Delete Course Sections",
    "name": "DeleteCourseSections",
    "group": "Sections",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Updated",
            "description": "<p>message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n    \"message\": \"Section has been deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>could not find a section with the passed in id</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not find section to get course for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"Section not found with id of 4\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Sections"
  },
  {
    "type": "get",
    "url": "/api/courses/:id/sections",
    "title": "Get Course Sections",
    "name": "GetCourseSections",
    "group": "Sections",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Array",
            "optional": false,
            "field": "Sections",
            "description": "<p>an array of the course sections</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"sections\": [\n        {\n            \"id\": 1,\n            \"name\": \"What is Learning number 24?\",\n            \"course_id\": 1,\n            \"description\": \"Although living brains are very complex, this module uses metaphor and analogy to help simplify matters. You will discover several fundamentally different modes of thinking, and how you can use these modes to improve your learning. You will also be introduced to a tool for tackling procrastination, be given some practical information about memory, and discover surprisingly useful insights about learning and sleep. <br><br>(Please note that this module should only take about an hour--the extra time quoted relates to purely optional activities.)\",\n            \"link\": \"https://www.coursera.org/learn/learning-how-to-learn/home/week/2\",\n            \"order\": 2\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>could not find a course with the passed in id</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not find section to get course for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"could not find a course with an id of 4\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Sections"
  },
  {
    "type": "post",
    "url": "/api/courses/:id/sections",
    "title": "Post Course Sections",
    "name": "PostCourseSections",
    "group": "Sections",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "201": [
          {
            "group": "201",
            "type": "Object",
            "optional": false,
            "field": "Created",
            "description": "<p>message with id returned</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n    \"message\": \"Section has been added with an id of 7\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not find section to get course for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Sections"
  },
  {
    "type": "put",
    "url": "/api/courses/:id/sections",
    "title": "Put Course Sections",
    "name": "PutCourseSections",
    "group": "Sections",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>the type of content being sent</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>User's token for authorization</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n \"Content-Type\": \"application/json\",\n \"authorization\": \"sjvbhoi8uh87hfv8ogbo8iugy387gfofebcvudfbvouydyhf8377fg\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object",
            "optional": false,
            "field": "Updated",
            "description": "<p>message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Updated\n{\n    \"message\": \"Section has been updated\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "Object",
            "optional": false,
            "field": "Missing-Section-Changes",
            "description": "<p>The section changes are absent</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "type": "Object",
            "optional": false,
            "field": "bad-request-error",
            "description": "<p>The authorization header is absent</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "type": "Object",
            "optional": false,
            "field": "not-found-error",
            "description": "<p>could not find a section with the passed in id</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "Find-Section-Error",
            "description": "<p>Could not find section to get course for</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "400-Section-Changes-Missing:",
          "content": "HTTP/1.1 400 Bad Request\n{\n \"message\": \"Could not find changes in body\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Forbidden Access!\"\n}",
          "type": "json"
        },
        {
          "title": "401-Error-Response:",
          "content": "HTTP/1.1 401 Bad Request\n{\n \"message\": \"Invalid Credentials\"\n}",
          "type": "json"
        },
        {
          "title": "404-Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n \"message\": \"Section not found with id of 4\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./courses/coursesRouter.js",
    "groupTitle": "Sections"
  }
] });
