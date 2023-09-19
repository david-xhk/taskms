import fs from "fs"
import React from "react"
import ReactDOMServer from "react-dom/server"
import { StaticRouter as Router } from "react-router-dom/server"

import Footer from "./src/components/Footer"
import Header from "./src/components/Header"
import { AuthContext } from "./src/hooks/useAuth"
import { EventEmitterContext } from "./src/hooks/useEventEmitter"
import LoadingDotsPage from "./src/pages/LoadingDotsPage"

function Shell() {
  return (
    <EventEmitterContext.Provider value={{}}>
      <AuthContext.Provider value={{ loggedIn: false }}>
        <Router>
          <Header static />
          <LoadingDotsPage />
          <Footer />
        </Router>
      </AuthContext.Provider>
    </EventEmitterContext.Provider>
  )
}

const startOfHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>TMS</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Public+Sans:300,400,400i,700,700i&display=swap" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <script defer src="https://use.fontawesome.com/releases/v5.5.0/js/all.js" integrity="sha384-GqVMZRt5Gn7tB9D9q7ONtcp4gtHIUEW/yG7h98J7IpE3kpi+srfFyyB/04OV6pG0" crossorigin="anonymous"></script>
  
      <link rel="stylesheet" href="/main.css" />
    </head>
    <body>
      <div id="app">`

const endOfHTML = `</div>
    </body>
  </html>`

/* Use Node tools (outside the scope of this course) to setup a
  stream we can write to that saves to a file on our hard drive
*/
const fileName = "./src/index-template.html"
const writeStream = fs.createWriteStream(fileName)

// Add the start of our HTML template to the stream
writeStream.write(startOfHTML)

/*
  Add the actual React generated HTML to the stream.
  We can use ReactDomServer (you can see how we imported
  that at the very top of this file) to generate a string
  of HTML text that a Node stream can leverage.
*/
const myStream = ReactDOMServer.renderToPipeableStream(<Shell />, {
  onAllReady() {
    myStream.pipe(writeStream)
    // End the stream with the final bit of our HTML
    writeStream.end(endOfHTML)
  }
})
