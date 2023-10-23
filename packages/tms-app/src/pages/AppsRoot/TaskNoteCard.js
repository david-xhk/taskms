import React from "react"
import Card from "react-bootstrap/Card"

import { getDateTimeString } from "@han-keong/tms-helpers/dateHelper"

export default function TaskNoteCard(props) {
  const { note } = props

  return (
    <Card>
      <Card.Header className="h6">
        <div className="d-inline-block" data-tooltip-content={note.createdAt.toString()} data-tooltip-id="my-tooltip">
          {getDateTimeString(note.createdAt)}
        </div>
        , <strong>{note.createdBy}</strong>{" "}
        {(() => {
          switch (note.noteType) {
            case "new task":
              return "created this task"
            case "update task":
              return (
                <>
                  updated this task while it was in the <strong>{note.taskState}</strong> state
                </>
              )
            case "user note":
              return note.taskState ? (
                <>
                  created a new note while this task was in the <strong>{note.taskState}</strong> state
                </>
              ) : (
                <>created a new note while creating this task</>
              )
          }
        })()}
        :
      </Card.Header>
      <Card.Body className="fs-6 mb-0 py-2">
        <Card.Text style={{ whiteSpace: "pre-wrap" }}>{note.content}</Card.Text>
      </Card.Body>
    </Card>
  )
}
