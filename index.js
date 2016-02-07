var _ = require('underscore'),
    q = require('q');

function restrictToLoggedIn(req, res, next) {
    if (req.seneca) {
        // console.log("req.seneca was defined", req.seneca);
        // console.log("user is ", req.seneca.user);
        if (req.seneca.user !== null && req.seneca.user !== undefined) {
            next();
        } else {
            // req.flash('error', 'You are not authorized to view this page.');
            res.send(404);
        }
    } else {
        res.send(404);
    }
}

function getUser(req) {
    return req.seneca.user;
}

function restrictToRoles(roles, options) {
    return function(req, res, next) {
        if (req.seneca) {
            if (req.seneca.user !== null && req.seneca.user !== undefined) {
                var roleMatches = _.intersection(req.seneca.user.perm.roles, roles);
                if (roleMatches.length > 0) {
                    next();
                } else {
                    // Send a 404 if the user roles didn't match any of the route roles.
                    // Send this rather than 403 because you don't want to hint at routes
                    // for hackers.
                    res.send(404);
                }
            } else {
                res.send(403);
            }
        } else {
            res.send(403);
        }
    };
}

/**
 * Call this function to format a failure response.
 **/
var failure = function(message, reason) {
    return { 'failure': {
        'message': message,
        'reason': reason
    }};
};

/**
 * Call this function to format a success response.
 **/
var success = function(message) {
    return { 'success': message };
};

var isLoggedIn = function(req) {
    if (req.seneca) {
        if (!_.isNull(req.seneca.user) && !_.isUndefined(req.seneca.user)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

module.exports = {
    restrictToRoles: restrictToRoles,
    restrictToLoggedIn: restrictToLoggedIn,
    getUser: getUser,
    failure: failure,
    success: success,
    isLoggedIn: isLoggedIn
};