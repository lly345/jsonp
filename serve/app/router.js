"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const jsonp = app.jsonp();
    router.get("/api", jsonp, controller.home.index);
};
