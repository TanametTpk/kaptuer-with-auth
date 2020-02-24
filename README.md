# What is this?

This package work with kaptuer for build authentication system faster.

# Installation

`npm i --save kaptuer-with-auth`

then import

```
let kap = require('./index')
const kaptuer = require('kaptuer-open-api')
const kaptuerDb = require('kaptuer-with-mongo')

let routes = {
    hello:{
        say: {
            path:"/",
            method:"get",
            controller:"hello",
            action:'say',
            middlewares:["needAuth","getAuthInfo"]
        }
    }
}

let services = {
    hello:{
        say: async (req) => {
            return req._userInfo
        }
    }
}

let extension = {
    model: {
        name: String,
        age: Number
    },
    options:{
        accessible:{
            get:["name","email","age"],
            update:["name"],
            store:["email","name","age"]
        },
    }
}

kaptuer.use(kap({type:"session",extension}))
kaptuer.use(kaptuerDb.connect([], {rewrite:"mongodb://localhost:27017/test"}, {dbVerbose:true}))

kaptuer.setup({
    routes:routes,
    services:services,
    port:<your port>
}).start() 

```

# Options

### type
- session
- jwt
- oauth

### extension
- model (model extension field as mongo syntax)
- options
    - accessible
        - get (attribute that allow to show)
        - update (attribute that allow to update)
        - store (attribute that allow to store in token or session)
        - secret (session option)
        - resave (session option)
        - saveUninitialized (session option)
    - model_name

### session and jwt url
- register
    - path /auth
    - method POST
    - body
        - email
        - password
        - <your extension model>
    - return
        - default is id only
        - attributes list in accessible get
- login or verify
    - path /auth/login
    - method POST
    - body
        - email
        - password
    - return
        - default is id only
        - attributes list in accessible get
        - (JWT) token

- logout
    - path /auth/logout
    - method POST
    - notes
        - (session) delete session on server
        - (jwt) do nothing, just drop token on your client

- reset-password
    - path /auth/reset-password
    - method POST
    - query
        - token
    - body
        - password

- request_reset
    - path /auth/forgot-password
    - method POST
    - body
        - email
    - note
        - this method is not finished
        - use request_reset_mid middleware to finish your request_reset method

### oauth url

- register
    - path /oauth/register
    - method POST
    - body
        - email
        - password
        - <your extension model>
    - return
        - default is id only
        - attributes list in accessible get

- grant
    - path /oauth/grant-type/:grant_type
    - method POST
    - body
        - (grant_type is password) email
        - (grant_type is password) password
        - (grant_type is refresh) refresh_token
    - return
        - access_token (expire in 1h)
        - refresh_token (expire in 2w)
        - token_type (alway be bearer)
        - expires_in (time that token will expire)
        - session_id (token id that can use for revoke token)
        - info: user attributes list in accessible get
    - notes
        - refresh grant will return new access_token and refresh_token then old access and refresh token will expire immediately

- check_token
    - path /oauth/check_token
    - method GET
    - query
        - token (access token)
    - return
        - user attributes list in accessible get

- revoke
    - path /oauth/revoke
    - method POST
    - body
        - (optional) user (user id)
        - (optional) _id (session_id)
        - (optional) refresh_token
        - (optional) access_token

- reset-password
    - path /oauth/reset-password
    - method POST
    - query
        - token
    - body
        - password

- request_reset
    - path /oauth/forgot-password
    - method POST
    - body
        - email
    - note
        - this method is not finished
        - use request_reset_mid middleware to finish your request_reset method

### user url

- get
    - path /user/:userId
    - method GET
    - return
        - attributes list in accessible get

- update
    - path /user/:userId
    - method PUT
    - body
        - attributes list in accessible update

- del
    - path /user/:userId
    - method DELETE

- me
    - path /user/me
    - method GET
    - require
        - login (session)
        - header with authorization (JWT)
        - query with token (access token)(oauth)

### Middlewares

- default
    - _getIdentity (save email to req._identity)
    - _getKey (save password to req._key)
    - register_mid (save user to db and save _id, email to req._payload)
    - request_reset_mid (create jwt token save in req._reset_key)
    - get_reset_publicKey (check reset token then decoded and save to req._resetInfo)
    - reset_key_mid (find user by req._resetInfo.email then get password from req.body and save to db)

- session
    - getAuthInfo (save user info from session to req._userInfo)
    - verify_mid (check email and password then save userInfo to session and save validate status to req._verify)
    - logout_mid (destroy session)
    - needAuth (is have session)
    - _authentication (session setup)

- jwt
    - getAuthInfo (save user info from token to req._userInfo)
    - verify_mid (check email and password then save userInfo and token to req._payload and save validate status to req._verify)
    - logout_mid (do nothing)
    - needAuth (verify token and save userInfo to req._userInfo)
    - _authentication (do nothing)

- oauth
    - getAuthInfo (save user info from token to req._userInfo)
    - grant_password_mid (check email and password then save userInfo and all token to req._payload and db then save validate status to req._verify)
    - grant_refresh_token_mid (find refresh token from body and get userInfo then create new tokens and save to req._payload finally update db)
    - grant_mid (check grant_type from params to redirect method [password, refresh])
    - check_token_mid (save req._userInfo to req._payload)
    - revoke_mid (delete token from database by user, refresh_token, access_token, _id)
    - needAuth (verify access token from query and save userInfo to req._userInfo)
    - _authentication (do nothing)

- user
    - _user_get_mid (find by userId params and save to req._payload)
    - _user_update_mid (update by userId params and body then save to req._payload)
    - _user_del_mid (delete by userId params and save to req._payload)
    - _user_me_mid (find by req._userInfo)