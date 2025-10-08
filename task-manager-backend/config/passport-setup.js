// config/passport-setup.js

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This function now correctly receives our full user object from the database and saves its ID to the session.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

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
        passReqToCallback: true // <-- This is important, it gives us access to the 'req' object
    },
    // This function now contains all the logic for finding and updating the user.
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            // Get the user ID we saved in the session before the redirect
            const localUserId = req.session.localUserId;
            if (!localUserId) {
                return done(new Error("No local user session found."), null);
            }

            // Find our user and update their record with the GitHub info
            const updatedUser = await prisma.user.update({
                where: { id: localUserId },
                data: {
                    githubId: profile.id,
                    githubAccessToken: accessToken,
                },
            });
            
            // Return the full, updated user object from our database
            return done(null, updatedUser);

        } catch (error) {
            return done(error, null);
        }
    })
);