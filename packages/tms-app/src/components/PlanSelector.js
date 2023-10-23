import React, { memo, useEffect, useRef } from "react"
import { ReactTags } from "react-tag-autocomplete"

function PlanSelector(props) {
  const { disabled = false, plans = [], onChange, onInput, placeholder, value, large, ...restProps } = props

  const isExpanded = useRef(false)
  const tagsRef = useRef(/** @type {import("react-tag-autocomplete/dist/types").ReactTagsAPI?} */ (null))

  const selected = (() => {
    if (!value || plans.length === 0) {
      return []
    }
    const index = plans.findIndex(plan => plan.planName === value)
    if (index === -1) {
      return []
    }
    return [{ label: value, value: index }]
  })()

  const suggestions = plans.map((plan, index) => ({ label: plan.planName, value: index }))

  function suggestionsTransform(input, suggestions) {
    return suggestions.filter(({ label }) => label.includes(input))
  }

  const placeholderText = disabled ? (selected.length === 0 ? "null" : "​") : placeholder

  const classes = ["react-tags-select"]
  if (large) {
    classes.push("react-tags-large")
  }
  if (disabled && selected.length === 0) {
    classes.push("text-muted")
  }

  useEffect(() => {
    if (tagsRef.current) {
      tagsRef.current.input.value = value
    }
  }, [value])

  function onAdd({ label }) {
    onChange(label)
    setTimeout(() => {
      if (tagsRef.current) {
        tagsRef.current.input.value = label
        tagsRef.current.input.blur()
      }
    })
  }

  function onBlur() {
    if (tagsRef.current && !isExpanded.current) {
      const value = tagsRef.current.input.value
      if (plans.findIndex(plan => plan.planName === value) !== -1) {
        onChange(value)
      } else {
        tagsRef.current.input.value = selected[0]?.label ?? ""
      }
    }
  }

  function onCollapse() {
    isExpanded.current = false
  }

  function onDelete() {
    onChange("")
  }

  function onExpand() {
    isExpanded.current = true
    if (tagsRef.current) {
      tagsRef.current.input.value = ""
    }
  }

  function onKeyDown(event) {
    if (!tagsRef.current || !tagsRef.current.listBox.isExpanded) {
      return
    }
    if (event.key === "Escape") {
      tagsRef.current.input.blur()
    }
    if (event.key === "Enter" || event.key === "Escape") {
      event.stopPropagation()
    }
  }

  function onMouseLeave() {
    if (tagsRef.current) {
      tagsRef.current.listBox.collapse()
    }
  }

  return (
    <div {...restProps} className={classes.join(" ")} onKeyDown={onKeyDown} onMouseLeave={onMouseLeave}>
      <ReactTags
        activateFirstOption={false}
        allowBackspace
        allowNew={false}
        allowResize={false}
        collapseOnSelect
        delimiterKeys={["Enter"]}
        id="plans"
        isDisabled={disabled}
        noOptionsText="Plan '%value%' not found"
        onAdd={onAdd}
        onBlur={onBlur}
        onCollapse={onCollapse}
        onDelete={onDelete}
        onExpand={onExpand}
        onInput={onInput}
        // onShouldCollapse={() => false} // for debugging purposes
        placeholderText={placeholderText}
        ref={tagsRef}
        renderTag={() => <></>}
        selected={selected}
        suggestions={suggestions}
        suggestionsTransform={suggestionsTransform}
      />
    </div>
  )
}

export default memo(PlanSelector)
