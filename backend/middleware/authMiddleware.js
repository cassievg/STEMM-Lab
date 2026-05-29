const { admin } = require('../firebase/firebase.js')

async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authHeader;

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'No token provided.',
            });
        }

        const token = authHeader.split('Bearer ')[1];

        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = decodedToken;

        next();

    } catch (e) {
        res.status(401).json({
            error: 'Unauthorized user.'
        })
    }
}

module.exports = authMiddleware;