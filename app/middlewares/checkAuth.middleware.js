const jwt = require('jsonwebtoken');
const config = require('config');

class CheckAuth {
    getToken(req, res) {
        const token = req.header('x-auth-token');
        if (!token)
            return res.status(401).send('عدم دسترسی؛ لطفا وارد حساب خود شوید');
        else return token;
    }
    getTokenWithoutError(req) {
        const token = req.header('x-auth-token');
        if (!token) return false;
        else return token;
    }
    decoded(token) {
        return jwt.verify(token, config.get('jwtPrivateKey'));
    }
    checkAccess(req, res, next, decoded, condition) {
        try {
            req.user = decoded;
            if (condition) next();
            else return res.status(401).send('عدم دسترسی');
        } catch (ex) {
            res.status(400).send('عدم دسترسی؛ لطفا وارد حساب خود شوید');
        }
    }

    authAdmin(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        let condition = false;
        let decoded = {};
        try {
            decoded = checkAuth.decoded(token);
            condition = decoded.role === 'admin';
        } catch (error) {
            condition = false;
        }

        checkAuth.checkAccess(req, res, next, decoded, condition);
    }

    getUserId(req, res) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getTokenWithoutError(req, res);
        if (!token) return null;
        // let condition = false;
        let decoded = {};
        try {
            decoded = checkAuth.decoded(token);
            return decoded._id;
        } catch (error) {
            return null;
        }
    }

    authUser(req, res, next) {
        const checkAuth = new CheckAuth();
        const token = checkAuth.getToken(req, res);
        let condition = false;
        let decoded = {};
        try {
            decoded = checkAuth.decoded(token);
            condition =
                decoded._id === req.params.id || decoded.role === 'admin';
        } catch (error) {
            condition = false;
        }
        checkAuth.checkAccess(req, res, next, decoded, condition);
    }
}
module.exports = CheckAuth;
