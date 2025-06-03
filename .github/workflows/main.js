name: CI/CD Pipeline

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
        env:
          MONGO_INITDB_ROOT_USERNAME: root
          MONGO_INITDB_ROOT_PASSWORD: example
        options: --health-cmd "mongo --eval 'db.runCommand(\"ping\").ok'" --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    
    - name: Install dependencies
      run: |
        cd server && npm install
        cd ../client && npm install
    
    - name: Build client
      run: |
        cd client && npm run build
    
    - name: Run tests
      run: |
        cd server && npm test
        cd ../client && npm test
    
    - name: Deploy to production
      if: github.ref == 'refs/heads/master'
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here
        # For example:
        # scp -r ./server user@server:/path/to/deploy
        # scp -r ./client/build user@server:/path/to/deploy
