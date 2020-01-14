module.exports = {
    
    register:{
        path: "/",
        method: "post",
        middlewares: ["register_mid"],
        controller: "auth",
        action: "register"
    },

    verify:{
        path: "/login",
        method: "post",
        middlewares: ["verify_mid"],
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
        middlewares: ["reset_key_mid"],
        controller: "auth",
        action: "reset_key"
    },

    request_reset:{
        path: "/forgot-password",
        method: "post",
        middlewares: ["request_reset_mid"],
        controller: "auth",
        action: "request_reset"
    }


}