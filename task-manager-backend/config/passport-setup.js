// config/passport-setup.js

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This function saves the user's ID into the session cookie.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// This function retrieves the full user from the database based on the ID in the cookie.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
        passReqToCallback: true // This allows us to access 'req'
    },
    // This is the main logic function that runs after a user authorizes on GitHub.
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            // Get the user ID we saved in the session before the redirect.
            const localUserId = req.session.localUserId;

            // --- THIS IS THE FIX ---
            // If the session was lost for any reason, we must return an error.
            // We cannot create a new user here because we don't have their email/password.
            if (!localUserId) {
                return done(new Error("No local user session found."), null);
            }

            // Find the user in our database and update their record with the GitHub info.
            const updatedUser = await prisma.user.update({
                where: { id: localUserId },
                data: {
                    githubId: profile.id,
                    githubAccessToken: accessToken,
                },
            });
            
            // Return the full, updated user object. Passport will handle the rest.
            return done(null, updatedUser);

        } catch (error) {
            return done(error, null);
        }
    })
);