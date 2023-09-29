import React, { useEffect, useRef, useState } from "react"
import { ReactTags } from "react-tag-autocomplete"

import { validateGroup } from "@han-keong/tms-validators/groupValidator"

import API from "../api.js"
import useAuth from "../hooks/useAuth.js"
import useEventEmitter from "../hooks/useEventEmitter.js"
import useFlashMessage from "../hooks/useFlashMessage.js"

export default function GroupSelector(props) {
  const { disabled, onChange, onError, onInput, placeholder, value, ...restProps } = props

  const [groups, setGroups] = useState(/** @type {string[]} */ ([]))
  const [fetchOrdinal, setFetchOrdinal] = useState(0)
  const tagsRef = useRef(/** @type {import("react-tag-autocomplete/dist/types.js").ReactTagsAPI?} */ (null))

  const { loggedIn } = useAuth()
  const flashMessage = useFlashMessage()
  const { emit } = useEventEmitter("GroupSelector")

  useEffect(() => {
    if (loggedIn) {
      emit("fetchGroupsEffect triggered")
      return API.getGroups(res => {
        if (res.data?.success) {
          emit("fetchGroupsEffect success")
          setGroups(res.data.data.map(data => data.group))
        } else {
          emit("fetchGroupsEffect fail")
          flashMessage(res.data?.message ?? "Failed to fetch groups.", "danger")
        }
      })
    }
  }, [loggedIn, fetchOrdinal])

  function onAdd({ label: group }) {
    if (groups.includes(group)) {
      emit("addGroup", { group })
      onChange([...value, group])
      return
    }
    emit("createGroup", { group })
    API.postGroups({ data: { group } }, res => {
      if (res.data?.success) {
        emit("createGroup success")
        flashMessage("👥 New group created!", "success")
        setFetchOrdinal(x => x + 1)
        onChange([...value, group])
      } else if (res.data?.errors) {
        emit("createGroup errors")
        onError(res.data.errors)
      } else {
        emit("createGroup fail")
        flashMessage(res.data?.message ?? "Failed to create group.", "danger")
      }
    })
  }

  function onDelete(index) {
    emit("deleteGroup", { index })
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
