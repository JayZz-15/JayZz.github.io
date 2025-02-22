const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow requests from the frontend
app.use(express.json());

const leaderboardFile = 'leaderboard.json';

// Read leaderboard data
const getLeaderboard = () => {
    if (fs.existsSync(leaderboardFile)) {
        return JSON.parse(fs.readFileSync(leaderboardFile));
    }
    return [];
};

// Save leaderboard data
const saveLeaderboard = (data) => {
    fs.writeFileSync(leaderboardFile, JSON.stringify(data, null, 2));
};

// API to get leaderboard
app.get('/leaderboard', (req, res) => {
    res.json(getLeaderboard());
});

// API to submit a new score
app.post('/leaderboard', (req, res) => {
    const { name, score } = req.body;
    if (!name || score === undefined) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    let leaderboard = getLeaderboard();
    
    // Check if player already exists
    const playerIndex = leaderboard.findIndex(player => player.name === name);
    if (playerIndex !== -1) {
        // Update score if it's higher
        leaderboard[playerIndex].score = Math.max(leaderboard[playerIndex].score, score);
    } else {
        leaderboard.push({ name, score });
    }

    // Sort leaderboard by highest score
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only top 10 players
    leaderboard = leaderboard.slice(0, 10);

    saveLeaderboard(leaderboard);
    res.json({ success: true, leaderboard });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
