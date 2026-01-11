const express = require('express');
require('dotenv').config();

const membersRouter = require('./routes/members');
const questsRouter = require('./routes/quests');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/members', membersRouter);
app.use('/quests', questsRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Still Formidable API',
    version: '1.0.0',
    endpoints: {
      members: {
        'POST /members': 'Create a new member',
        'GET /members/:id': 'Get member profile',
        'GET /members/:id/referrals': 'Get member referrals'
      },
      quests: {
        'POST /quests': 'Create a new quest',
        'GET /quests': 'List all quests',
        'GET /quests/:id': 'Get a single quest',
        'POST /quests/:id/accept': 'Accept a quest'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
