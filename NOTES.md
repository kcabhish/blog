### Blog

Start Date: 12/13/2023

command to create project: npx create-next-app blog-standard -e https://github.com/tomphill/nextjs-openai-starter

### Dynamic Route

when you create a file with [someFilename].js then this will be created as a dynamic route.
Example in this project is in "pages\post\[postId].js"

### Authentication and Authorization with Auth0

https://auth0.com/
From the dashboard create new app registration and used the domian, client id and client secret in the app.

We will also need to generate the auth0 secret, for that run the following command in the terminal
openssl rand -hex 32 6749e32b86d245aace0e50a2cfebc13886f071a86e8bf0918ade92f5071ca0b1
this will generate a random string (use git bash if it does not work with windows)

After this, make sure to setup the applications URIs in Auth0.
Application Login URI and Allowed Callback URLs


