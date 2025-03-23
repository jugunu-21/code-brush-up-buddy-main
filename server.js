import express from 'express';
import { exec } from 'child_process';

const app = express();
const port = 8000;

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

app.use(express.json());

// API endpoint to run a terminal command
app.post('/run-command', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'Command is required' });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ output: stdout });
    });
});

// API endpoint to run tests
app.post('/run-tests', (req, res) => {
    const { questionId } = req.body;

    // Create an environment variable to pass the questionId to the test
    const env = { ...process.env, TEST_QUESTION_ID: questionId || 'q2' };

    // Log the questionId being used
    console.log(`Running tests with questionIddd: ${questionId || 'q2'}`);

    exec('npm test', { env }, (error, stdout, stderr) => {
        // Get the combined output
        const output = stdout + stderr;

        // Parse the test results to extract test IDs and status
        const testResults = [];
        const lines = output.split('\n');

        // Find lines with test results (starting with ✓ or ✕)
        lines.forEach(line => {
            const line_trimmed = line.trim();
            // Check for passing tests
            if (line_trimmed.startsWith('✓')) {
                // Extract the test ID which should be in square brackets [testId]
                const match = line_trimmed.match(/\[(\w+)\]/);
                if (match && match[1]) {
                    testResults.push({
                        id: match[1],
                        status: 'passed',
                        description: line_trimmed
                    });
                }
            }
            // Check for failing tests
            else if (line_trimmed.startsWith('✕')) {
                // Extract the test ID which should be in square brackets [testId]
                const match = line_trimmed.match(/\[(\w+)\]/);
                if (match && match[1]) {
                    testResults.push({
                        id: match[1],
                        status: 'failed',
                        description: line_trimmed
                    });
                }
            }
        });

        // Create summary counts
        const summary = {
            total: testResults.length,
            passed: testResults.filter(t => t.status === 'passed').length,
            failed: testResults.filter(t => t.status === 'failed').length,
            questionId: questionId || 'q2'
        };

        // Return the parsed results and full output
        res.json({
            success: !error || error.code === 0,
            testResults: testResults,
            summary: summary,
            rawOutput: output
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});