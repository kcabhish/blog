# BlogTopia
Auto blog generator using generative AI

## Setting Up Auth0

Step 1: Create an application in https://auth0.com/
Step 2: Navigate to the application's setting page to setup your .env file
```
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL= BasicInformation->Domain eg: http://dev-don*****.auth0.com
AUTH0_CLIENT_ID = BasicInformation -> ClientId
AUTH0_CLIENT_SECRET=BasicInformation -> Client Secret
AUTH0_SECRET= For this value you can add any random string but the recommended way is to generate a hex key.
you can use `openssl rand -hex 32` in the terminal to generate a key and use that value as the secret.
```
Step 3: Update the Applications URIs `Allowed Callback Urls` and `Allowed Logout Urls` section with the base url value. if you are using localhost:3000 the value will be `http://localhost:3000/api/auth/callback` and `http://localhost:3000` respectively.

**NOTE: In next.js, the authentication from Auth0 is automatically handled by `\api\auth\[...auth0].js` file.
