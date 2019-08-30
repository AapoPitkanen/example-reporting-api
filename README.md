# example-reporting-api

This project was created as a practice assignment on creating a simple back-end that serves chat statistics from the giosg reporting API, and the front-end that visualizes the fetched data. The project back-end is written with TypeScript using the Node.js Express web application framework.
The front-end is built with TypeScript and modern React with React hooks and only functional components. 

To clone the repository, open your terminal and use the command `git clone https://github.com/AapoPitkanen/example-reporting-api.git`. 

After cloning the repo, run `npm install` to get all the project dependencies. Also run the command `cd client && npm install` to get all the front-end client dependencies.

**Important!** You need a giosg personal access token to actually fetch the data from the giosg servers, 
otherwise you will not get any reporting data from the giosg API. 
If you have a personal giosg access token, you should save it to your .env configuration in the project folder as GIOSG_ACCESS_TOKEN
for the server to work out-of-the-box.

To run the development back-end and front-end servers at the same time, use the command `npm run dev:ts`.

To compile the TypeScript files to JS, use the command `npm run server`.
