const http = require("http");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const server = http.createServer((request, response) => {
  const url = request.url;

  switch (url) {
    case "/about":
      console.log("About page requested");
      emitEvent("aboutPageAccessed");
      serveHTMLFile("about.html", response);
      break;
    case "/contact":
      console.log("Contact page requested");
      emitEvent("contactPageAccessed");
      serveHTMLFile("contact.html", response);
      break;
    case "/products":
      console.log("Products page requested");
      emitEvent("productsPageAccessed");
      serveHTMLFile("products.html", response);
      break;
    case "/":
      console.log("Home page requested");
      emitEvent("homePageAccessed");
      serveHTMLFile("home.html", response);
      break;
    case "/subscribe":
      console.log("Subscribe page requested");
      emitEvent("subscribePageAccessed");
      serveHTMLFile("subscribe.html", response);
      break;
    case "/bonus":
      console.log("Bonus page requested");
      emitEvent("BonusPageAccessed");
      serveHTMLFile("bonus.html", response);
      break;
    default:
      console.log("Invalid route requested");
      emitEvent("invalidRouteAccessed");
      response.statusCode = 404;
      response.end("Page not found");
  }
});

function serveHTMLFile(filename, response) {
  const filePath = path.join(__dirname, "views", filename);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.log(`Error reading file: ${filename}`);
      emitEvent("fileReadError");
      response.statusCode = 500;
      response.end("Internal Server Error");
    } else {
      console.log(`File successfully read: ${filename}`);
      emitEvent("fileReadSuccess");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(data);
    }
  });
}

const myEmitter = new MyEmitter();

// Function to emit events
function emitEvent(event) {
  myEmitter.emit(event);
}

// Function to write log data to file
function writeLogToFile(logData) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const logFileName = `log_${currentDate}.txt`;
  const logFilePath = path.join(__dirname, "logs", logFileName);
  const logEntry = `${new Date().toISOString()} - ${logData}\n`;

  fs.appendFile(logFilePath, logEntry, (error) => {
    if (error) {
      console.log(`Error writing to log file: ${error}`);
    }
  });
}

// Scenario 1: Capture the common HTTP status codes and write a message to the console.
server.on("request", (request, response) => {
  console.log(`HTTP status code: ${response.statusCode}`);
  writeLogToFile(`HTTP status code: ${response.statusCode}`);
});

// Scenario 2: Capture only the warnings and errors and write a message to the console.
server.on("request", (request, response) => {
  if (response.statusCode >= 400) {
    console.log(
      `Error or warning occurred with status code: ${response.statusCode}`
    );
    writeLogToFile(
      `Error or warning occurred with status code: ${response.statusCode}`
    );
  }
});

// Scenario 3: Every time a specific route was accessed, write a message to the console.
myEmitter.on("aboutPageAccessed", () => {
  console.log("About page accessed");
  writeLogToFile("About page accessed");
});

myEmitter.on("contactPageAccessed", () => {
  console.log("Contact page accessed");
  writeLogToFile("Contact page accessed");
});

myEmitter.on("productsPageAccessed", () => {
  console.log("Products page accessed");
  writeLogToFile("Products page accessed");
});

myEmitter.on("homePageAccessed", () => {
  console.log("Home page accessed");
  writeLogToFile("Home page accessed");
});

myEmitter.on("subscribePageAccessed", () => {
  console.log("Subscribe page accessed");
  writeLogToFile("Subscribe page accessed");
});

myEmitter.on("BonusPageAccessed", () => {
  console.log("Bonus page accessed");
  writeLogToFile("Bonus page accessed");
});

// Scenario 4: For every route that is not the home, write a message to the console.
server.on("request", (request, response) => {
  if (request.url !== "/") {
    console.log(`Route accessed: ${request.url}`);
    writeLogToFile(`Route accessed: ${request.url}`);
  }
});

// Scenario 5: Every time a file was successfully read, write a message to the console.
myEmitter.on("fileReadSuccess", () => {
  console.log("File successfully read");
  writeLogToFile("File successfully read");
});

// Scenario 6: Every time a file is not available, write a message to the console.
myEmitter.on("fileReadError", () => {
  console.log("Error reading file");
  writeLogToFile("Error reading file");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
