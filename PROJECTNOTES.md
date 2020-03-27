# Project Notes

## Dbeaver

## Discord.js

    There are a lot of comments in the Discord code that explain what is happening, but our system at a high level is essentially to watch for when users join a learning path, and if the amount of users following a learning path is === to some value, we will send a message to the Didact server from a webhook and parse the message into a new channel and potentially a new category (or what Discord calls, a category, essentially just a topical folder name that channels go under)

## Search Functionality

    Again, a lot of the code is commented on, but at a high level we have filter functions set up on all base resource endpoints ("/" endpoints) for courses, learning paths, tools, articles, external articles, and sources. The endpoints have a chain of if / else if statements that detect what request.headers are being sent from the client i.e the type of filter being used (tag, title, creator) and the actual query string (what the client wants to see)

    Many of these functions use something called "Posix" which is very similar to Regex (to my understanding, perhaps is even built with it) that check if fields equal a certain value. IMPORTANT NOTE: Knex Whereraw() functions require that you use specific syntax to avoid SQL insertions from attackers.

    Use syntax like: whereRaw(`LOWER(paths.${filter}) ~ ?`, [queryTweak])
    where your query checks if paths.(..some field, could be id, title, etc) INCLUDES (~) queryTweak. The question mark represents queryTweak or any other variable you are checking equality for. This is very similar to the string.includes() method in vanilla javascript.

# Multer.js / Image Uploading

    Multer is a middleware that enables an application to accept form-data which allows us to upload files(images) to the server.dataUri is used to parse the file into something readable by node. Cloudinary is a third party app that hosts images/videos.

    You will have to create your own cloudinary account.

    You will need the accounts Cloud name, API key and API secret in the app's configuration to be able to upload your data to cloudinary. We store this data in the .env file of the app for security.

    The way it works is the file is uploaded through multer, the datauri parses the filedata then this image file is sent to be stored in the cloudinary website. Cloudinary sends us back a URL for the photo and we insert that url string onto the image property for the relevant resource (user, tool, etc)

## [DBeaver (click me!)](https://dbeaver.io/)

    Dbeaver is a free database management tool. It lets you connect to your postgreSQL database and view your tables. If you want to see a breakdown of the tables similar to DB Design, open up DBeaver and open your database connection. [Once you expand your connection and have access to your tables folder](https://imgur.com/mQPLS9f), right click it and you should see a ER Diagram pop up. Click that window and you'll see the table break down.

## PostgreSQL

    If you have no experience with PostgreSQL don't panic. In very layman terms, conceptually it is just running a local server that holds your database. Unlike sqlite3 there is no .db file that holds your data. To connect to your PostgreSQL database, you will need to insert a URL that points at the port holding it. In your Knexfile under "connection" you will set your DATABASE_URL environment variable with this structure:

    postgres://postgres:password@localhost:5432/databasename

    Where "password" is the password you use to login to your SQL Shell (which you should initially set upon installing postgreSQL) and databasename is the name of the database you create inside of your SQL shell using the command "\c yourdbname" the port after localhost is whatever port your postgres is hosted on.

    5432 is the default for PostgreSQL (iirc)  Once you have this connection established, you can run your migrations/seeds and operate your server normally just like with sqlite3. If you want more specific information check out [this youtube tutorial](https://youtu.be/qw--VYLpxG4) which includes very helpful timestamps. The important bits are roughly around 15-30 minutes.
