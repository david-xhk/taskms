import React, { forwardRef } from "react"
import Button from "react-bootstrap/Button"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import BsTable from "react-bootstrap/Table"

import { parseOrCreateArray } from "@han-keong/tms-helpers/parseHelper"

function Table(props) {
  const { children, columns } = props

  return (
    <BsTable hover size="sm" responsive className="custom-table bg-light-subtle border border-light-subtle rounded-3 mb-2" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
      <thead className="table-info sticky-top border border-info-subtle rounded-top-3">
        <tr>
          {parseOrCreateArray(columns).map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </BsTable>
  )
}

Table.Row = forwardRef((/** @type {React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>>} */ props, ref) => {
  const { children, ...restProps } = props
  return (
    <tr {...restProps} ref={ref}>
      {children}
    </tr>
  )
})

Table.Header = forwardRef((/** @type {React.PropsWithChildren<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>>} */ props, ref) => {
  const { children, ...restProps } = props
  return (
    <th {...restProps} ref={ref}>
      {children}
    </th>
  )
})

Table.Cell = forwardRef((/** @type {React.PropsWithChildren<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>} */ props, ref) => {
  const { children, ...restProps } = props
  return (
    <td {...restProps} ref={ref}>
      {children}
    </td>
  )
})

Table.ActionButtonGroup = forwardRef((/** @type {React.PropsWithChildren<ButtonGroup["propTypes"]>} */ props, ref) => {
  const { children, ...restProps } = props
  return (
    <ButtonGroup size="sm" {...restProps} ref={ref}>
      {children}
    </ButtonGroup>
  )
})

Table.ActionButton = forwardRef((/** @type {React.PropsWithChildren<Button["propTypes"]> & { icon: string; tooltip: string; }} */ props, ref) => {
  const { icon, tooltip, ...restProps } = props
  return (
    <Button variant="outline-primary" data-tooltip-content={tooltip} data-tooltip-id="my-tooltip" {...restProps} ref={ref}>
      <i className={icon}></i>
    </Button>
  )
})

export default Table
