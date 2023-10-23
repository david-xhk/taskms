import fs from "fs"
import React from "react"
import { renderToPipeableStream } from "react-dom/server"
import { StaticRouter as Router } from "react-router-dom/server"

import Footer from "./src/components/Footer"
import Navbar from "./src/components/Navbar"
import LoadingDotsPage from "./src/pages/LoadingDotsPage"

const startOfHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>TMS</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Public+Sans:300,400,400i,700,700i&display=swap" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      <script defer src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc" crossorigin="anonymous"></script>
      <link rel="stylesheet" href="/main.css" />
      <link rel="icon" href="#" />
    </head>
    <body>
      <div id="app">`

const endOfHTML = `</div>
      <script src="/bundled.js"></script>
    </body>
  </html>`

/* Use Node tools (outside the scope of this course) to setup a
  stream we can write to that saves to a file on our hard drive
*/
const fileName = "./src/index.html"
const writeStream = fs.createWriteStream(fileName)

// Add the start of our HTML template to the stream
writeStream.write(startOfHTML)

/*
  Add the actual React generated HTML to the stream.
  We can use ReactDomServer (you can see how we imported
  that at the very top of this file) to generate a string
  of HTML text that a Node stream can leverage.
*/
const myStream = renderToPipeableStream(
  <Router location="/">
    <Navbar static />
    <LoadingDotsPage />
    <Footer />
  </Router>,
  {
    onAllReady() {
      myStream.pipe(writeStream)
      // End the stream with the final bit of our HTML
      writeStream.end(endOfHTML)
    },
    onError() {
      writeStream.close()
    }
  }
)
