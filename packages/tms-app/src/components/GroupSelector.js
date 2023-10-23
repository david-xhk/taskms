import React, { memo, useRef } from "react"
import FormControl from "react-bootstrap/FormControl"
import { ReactTags } from "react-tag-autocomplete"

import Truncate from "./Truncate"

function GroupSelector(props) {
  const { allowNew = false, allowCreate = false, disabled = false, groups = [], onChange, onCreate, onInput, placeholder, plaintext, readOnly, value, large, ...restProps } = props

  const tagsRef = useRef(/** @type {import("react-tag-autocomplete/dist/types").ReactTagsAPI?} */ (null))

  const selected = (() => {
    if (groups.length === 0) {
      return value.map((group, index) => ({ label: group, value: index }))
    } else {
      return value.map(group => ({ label: group, value: groups.findIndex(value => value.group === group) }))
    }
  })()

  const suggestions = (() => {
    if (groups.length === 0) {
      return value.map((group, index) => ({ label: group, value: index }))
    } else {
      return groups.map((group, index) => ({ label: group.group, value: index }))
    }
  })()

  const placeholderText = readOnly || disabled ? (selected.length === 0 ? "null" : "​") : placeholder

  const classes = []
  if (large) {
    classes.push("react-tags-large")
  }
  if (plaintext) {
    classes.push("react-tags-plaintext")
  }
  if (readOnly) {
    classes.push("react-tags-readonly")
  }
  if ((readOnly || disabled) && selected.length === 0) {
    classes.push("text-muted")
  }

  if (readOnly) {
    return selected.length === 0 ? (
      <FormControl plaintext readOnly value="null" className="text-muted me-4 cursor-unset" />
    ) : (
      <div className={classes.join(" ")}>
        <div className="react-tags">
          <ul className="react-tags__list">
            {selected.map((value, index) => (
              <li className="react-tags__list-item" key={index}>
                <div className="react-tags__tag">
                  <Truncate text={value.label} length={15} className="react-tags__tag-name" />
                </div>
              </li>
            ))}
          </ul>
          <div className="react-tags__combobox">
            <input className="react-tags__combobox-input me-4" />
          </div>
        </div>
      </div>
    )
  }

  async function onAdd({ label }) {
    if (groups.find(group => group.group === label)) {
      onChange([...value, label])
      return
    }
    if (onCreate) {
      setTimeout(async () => {
        onInput(label)
        await onCreate(label)
        onInput("")
        onChange([...value, label])
      })
    }
  }

  function onDelete(index) {
    onChange(value.filter((_, i) => i !== index))
  }

  function onValidate(input) {
    return !groups.find(group => group.group === input) && allowCreate
  }

  function suggestionsTransform(input, suggestions) {
    return suggestions.filter(({ label }) => label.includes(input))
  }

  /** @type {React.KeyboardEventHandler<HTMLDivElement>} */
  function onKeyDown(event) {
    if (!tagsRef.current || !tagsRef.current.listBox.isExpanded) {
      return
    }
    if (event.key === "Escape") {
      tagsRef.current.listBox.collapse()
      tagsRef.current.input.blur()
      tagsRef.current.input.value = ""
    }
    if (event.key === "Enter" || event.key === "Escape") {
      event.stopPropagation()
    }
  }

  function onMouseLeave() {
    if (tagsRef.current) {
      tagsRef.current.listBox.collapse()
      tagsRef.current.input.blur()
    }
  }

  function CustomTag({ classNames, tag, ...tagProps }) {
    delete tagProps.title
    return (
      <div className={classNames.tag} {...tagProps}>
        <Truncate text={tag.label} length={15} className={classNames.tagName} />
      </div>
    )
  }

  return (
    <div {...restProps} className={classes.join(" ")} onKeyDown={onKeyDown} onMouseLeave={onMouseLeave}>
      <ReactTags
        activateFirstOption={false}
        allowBackspace
        allowNew={allowNew}
        allowResize={false}
        collapseOnSelect={false}
        delimiterKeys={[",", "Enter"]}
        id="groups"
        isDisabled={disabled}
        newOptionText="Create group '%value%'"
        noOptionsText="Group '%value%' not found"
        onAdd={onAdd}
        onDelete={onDelete}
        onInput={onInput}
        // onShouldCollapse={() => false} // for debugging purposes
        onValidate={onValidate}
        placeholderText={placeholderText}
        ref={tagsRef}
        renderTag={CustomTag}
        selected={selected}
        suggestions={suggestions}
        suggestionsTransform={suggestionsTransform}
      />
    </div>
  )
}

export default memo(GroupSelector)
