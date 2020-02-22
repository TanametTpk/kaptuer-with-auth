module.exports = {
    
    register:{
        path: "/register",
        method: "post",
        middlewares: ["register_mid"],
        controller: "oauth",
        action: "register"
    },

    grant:{
        path: "/grant-type/:grant_type",
        method: "post",
        middlewares: ["grant_mid"],
        controller: "oauth",
        action: "grant"
    },

    check_token:{
        path: "/check_token",
        method: "get",
        middlewares: ["needAuth", "check_token_mid"],
        controller: "oauth",
        action: "check_token"
    },

    revoke:{

        path: "/revoke",
        method: "post",
        middlewares: ["getAuthInfo", "revoke_mid"],
        controller: "oauth",
        action: "revoke"

    },

    reset_key:{
        path: "/reset-password",
        method: "post",
        middlewares: ["get_reset_publicKey", "reset_key_mid"],
        controller: "oauth",
        action: "reset_key"
    },

    request_reset:{
        path: "/forgot-password",
        method: "post",
        middlewares: ["request_reset_mid"],
        controller: "oauth",
        action: "request_reset"
    }


}