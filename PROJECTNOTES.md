# Project Notes

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
