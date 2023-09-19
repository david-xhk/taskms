import React, { useEffect, useRef, useState } from "react"
import { ReactTags } from "react-tag-autocomplete"

import { validateGroup } from "@han-keong/tms-validators"

import API from "../api"
import useAuth from "../hooks/useAuth"
import useEventEmitter from "../hooks/useEventEmitter"
import useFlashMessage from "../hooks/useFlashMessage"

export default function GroupSelector(props) {
  const { disabled, onChange, onError, onInput, placeholder, value, ...restProps } = props

  const [groups, setGroups] = useState([])
  const [newGroup, setNewGroup] = useState(null)
  const tagsRef = useRef(null)

  const { loggedIn } = useAuth()
  const flashMessage = useFlashMessage()
  const { emit } = useEventEmitter("GroupSelector")

  useEffect(() => {
    if (loggedIn) {
      emit("fetchGroupsEffect triggered")
      return API.getGroups(res => {
        if (res.data?.success) {
          emit("fetchGroupsEffect success")
          setGroups(res.data.data)
        } else {
          emit("fetchGroupsEffect fail")
          flashMessage(res.data?.message ?? "Failed to fetch groups.", "danger")
        }
      })
    }
  }, [loggedIn])

  useEffect(() => {
    if (newGroup) {
      emit("createGroupEffect triggered")
      return API.postGroups({ data: { group: newGroup } }, res => {
        if (res.data?.success) {
          emit("createGroupEffect success")
          setGroups(res.data.data)
          setNewGroup(null)
          flashMessage(res.data.message, "success")
          onChange([...value, newGroup])
        } else if (res.data?.errors) {
          emit("createGroupEffect errors")
          onError(res.data.errors)
        } else {
          emit("createGroupEffect fail")
          flashMessage(res.data?.message ?? "Failed to create group.", "danger")
        }
      })
    }
  }, [newGroup])

  function onAdd({ label: group }) {
    if (groups.includes(group)) {
      emit("addTag", { group })
      onChange([...value, group])
    } else {
      emit("createTag", { group })
      setNewGroup(group)
    }
  }

  function onDelete(index) {
    emit("deleteTag", { index })
    onChange(value.filter((_, i) => i !== index))
  }

  function onValidate(input) {
    return !groups?.includes(input) && validateGroup(input)
  }

  function suggestionsTransform(input, suggestions) {
    return suggestions.filter(({ label }) => label.includes(input))
  }

  return (
    <div {...restProps} onMouseLeave={() => tagsRef.current?.listBox.collapse()}>
      <ReactTags
        activateFirstOption={true}
        allowBackspace={true}
        allowNew={true}
        allowResize={true}
        collapseOnSelect={false}
        deleteButtonText="Remove from '%value%' group"
        delimiterKeys={[",", "Enter"]}
        id="groups"
        isDisabled={disabled}
        newOptionText="Create group '%value%'"
        noOptionsText="Group '%value%' not found"
        onAdd={onAdd}
        onDelete={onDelete}
        onInput={onInput}
        onValidate={onValidate}
        placeholderText={disabled ? "​" : placeholder} // For admins
        ref={tagsRef}
        selected={value.map(group => ({ label: group, value: groups.indexOf(group) }))}
        suggestions={groups.map((group, index) => ({ label: group, value: index }))}
        suggestionsTransform={suggestionsTransform}
      />
    </div>
  )
}
