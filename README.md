# React Code Brush-Up Buddy

An interactive React coding challenge application to help you practice and improve your React skills.

## Features

- Multiple coding challenges with varying difficulty levels
- Interactive test runner that provides immediate feedback
- Test cases that verify your implementation
- Progress tracking to see which challenges you've completed
- Filter challenges by difficulty, topic, or completion status

## Technologies Used

This project is built with:

- React
- TypeScript
- Vite
- shadcn-ui
- Tailwind CSS
- Jest for testing

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd code-brush-up-buddy

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Running Tests

You can run tests in two ways:

1. Using the command line:
```sh
npm test
```

2. Using the UI:
   - Navigate to any challenge page
   - Click the "Run Tests" button to execute tests for that challenge

You can also specify which question's tests to run:

```sh
TEST_QUESTION_ID=q1 npm test
```

## Project Structure

- `src/components/questions/` - Contains all the challenge components
- `src/components/__tests__/` - Contains test files
- `src/data/questions.ts` - Contains challenge definitions and test cases
- `server.js` - Simple Express server for running tests

## Editing the Code

### Using your preferred IDE

1. Clone the repo and make changes locally
2. Use standard Git workflow to commit and push changes

### Editing directly in GitHub

- Navigate to the file you want to edit
- Click the "Edit" button (pencil icon)
- Make your changes and commit them

### Using GitHub Codespaces

- Navigate to the main repository page
- Click "Code" > "Codespaces" > "New codespace"
- Edit files and commit changes from within the Codespace

## Deployment

You can deploy this project using any static site hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS Amplify

Simply build the project with `npm run build` and deploy the contents of the `dist` directory.
