module.exports = {
    
    register:{
        path: "/",
        method: "post",
        middlewares: ["_getIdentity", "_getKey" , "register_mid"],
        controller: "auth",
        action: "register"
    },

    verify:{
        path: "/login",
        method: "post",
        middlewares: ["_getIdentity", "_getKey" , "verify_mid"],
        controller: "auth",
        action: "verify"
    },

    logout:{

        path: "/logout",
        method: "post",
        middlewares: ["getAuthInfo", "logout_mid"],
        controller: "auth",
        action: "logout"

    },

    reset_key:{
        path: "/reset-password",
        method: "post",
        middlewares: ["_getIdentity", "_getKey" , "reset_key_mid"],
        controller: "auth",
        action: "reset_key"
    },

    request_reset:{
        path: "/forgot-password",
        method: "post",
        middlewares: ["_getIdentity", "request_reset_mid"],
        controller: "auth",
        action: "request_reset"
    }


}