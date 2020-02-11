module.exports = {
    
    get:{
        path: "/:userId",
        method: "get",
        middlewares: ["_user_get_mid"],
        controller: "user",
        action: "dummy"
    },

    update:{
        path: "/:userId",
        method: "put",
        middlewares: ["_user_update_mid"],
        controller: "user",
        action: "dummy"
    },

    del:{
        path: "/:userId",
        method: "delete",
        middlewares: ["_user_del_mid"],
        controller: "user",
        action: "dummy"
    },

    me:{
        path: "/me",
        priority:1,
        method: "get",
        middlewares: ["needAuth", "getAuthInfo", "_user_me_mid"],
        controller: "user",
        action: "dummy"
    }

}