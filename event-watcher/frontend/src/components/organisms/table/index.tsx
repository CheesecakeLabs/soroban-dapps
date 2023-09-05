import React, { useCallback, useState } from 'react'

import { keyBy } from 'lodash/fp'

import { getIdValue, removeById } from './helpers'
import styles from './styles.module.scss'
import { TBody } from './tbody'
import { THead } from './thead'
import { Data, ITableProps, Check } from './types'

const Table = ({
  columns,
  data,
  idPropertyName,
  onRowSelect,
}: ITableProps): JSX.Element => {
  const [selectedRows, setSelectedRows] = useState<
    Record<string | number, unknown>
  >({})

  const getIdOfRow = useCallback(
    (row: Data) => getIdValue(idPropertyName, row),
    [idPropertyName]
  )

  const onRowSelectWithReturn = useCallback(
    (list: Data) => {
      if (onRowSelect) {
        onRowSelect(list)
      }
      return list
    },
    [onRowSelect]
  )

  const toggleRowSelect = useCallback(
    (row: Data): void => {
      const id = getIdOfRow(row)

      const getAddOrRemoveElementFromList = (current: Data): Data => {
        if (current[id]) {
          return onRowSelectWithReturn(removeById(current, id))
        }
        return onRowSelectWithReturn({ ...current, [id]: row })
      }

      setSelectedRows(getAddOrRemoveElementFromList)
    },
    [getIdOfRow, onRowSelectWithReturn]
  )

  const onSelectAll = useCallback(
    (type: Check) => {
      if (type === Check.unchecked) {
        setSelectedRows(onRowSelectWithReturn({}))
        return
      }
      setSelectedRows(onRowSelectWithReturn(keyBy(idPropertyName, data)))
    },
    [data, idPropertyName, onRowSelectWithReturn]
  )

  return (
    <table className={styles.table}>
      <THead columns={columns} onSelectAll={onSelectAll} />
      <TBody
        columns={columns}
        data={data}
        onSelectRow={toggleRowSelect}
        selectedRows={selectedRows}
        getIdOfRow={getIdOfRow}
      />
    </table>
  )
}

export type { ITableProps }
export { Table }
