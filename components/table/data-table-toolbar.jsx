import { IconX } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter'; // Loại bỏ Options vì không cần thiết trong JSX
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDebouncedCallback from '@/components/hooks/useDebouncedCallback';
import { capitalizeFirstLetter } from '@/components/utils/helpers';

export function DataTableToolbar({
  table,
  searchColumns,
  filterColumns,
  preFiltered,
  rowsAction,
  setSearch,
  setKeyword,
  action,
  setAction,
}) {
  const [valueSearch, setValueSearch] = useState(preFiltered?.value ?? '')
  const isFiltered = setAction
    ? Object.values(action).some((array) => array.length > 0)
    : table.getState().columnFilters.length > 0

  const [selectedSearchColumnId, setSelectedSearchColumnId] = useState(
    preFiltered ? preFiltered.columnId : searchColumns[0].id
  )

  const findSearchColumns = searchColumns.find(
    (search) => search.id === selectedSearchColumnId
  )

  const debouncedSetSearch = useDebouncedCallback({
    func: (value) => {
      if (setSearch) {
        setSearch(value)
      }
    },
    time: 300,
    deps: [setSearch]
  })

  const searchValue = setSearch
    ? valueSearch
    : (table.getColumn(selectedSearchColumnId)?.getFilterValue() ?? '')

  const handleSelectedSearchColumnId = (value) => {
    if (setKeyword) {
      setKeyword(value)
      setValueSearch('')
    } else {
      table.resetColumnFilters()
    }
    setSelectedSearchColumnId(value)
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <div>
          <Select
            onValueChange={handleSelectedSearchColumnId}
            value={selectedSearchColumnId}
            defaultValue={selectedSearchColumnId}
          >
            <SelectTrigger className='h-8'>
              <SelectValue defaultValue={selectedSearchColumnId} />
            </SelectTrigger>
            <SelectContent>
              {searchColumns?.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder={`Search within the ${findSearchColumns?.label} column...`}
          value={searchValue}
            onChange={(event) => {
              if (setSearch) {
                setValueSearch(event.target.value)
                debouncedSetSearch(event.target.value)
              } else {
                table
                  .getColumn(selectedSearchColumnId)
                  ?.setFilterValue(event.target.value)
              }
            }}
          className='h-8 w-[150px] lg:w-[300px]'
        />
        <div className='flex gap-x-2'>
          {filterColumns?.map((value, index) => {
            return (
              table.getColumn(value.id) && (
                <DataTableFacetedFilter
                  key={index}
                  column={table.getColumn(value.id)}
                  title={capitalizeFirstLetter(value.id)}
                  options={value.items}
                  action={action}
                  setAction={setAction}
                />
              )
            );
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              if (setAction) {
                const resetAction = { ...action }
                for (const key in resetAction) {
                  resetAction[key] = []
                }
                setAction(resetAction)
              }
              table.resetColumnFilters()
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <IconX className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      {rowsAction.length > 0 &&
        rowsAction.map((value, index) => {
          if (
            table.getFilteredSelectedRowModel().rows.length <= 0 &&
            !value.alwaysVisible
          ) {
            return null;
          }

          return (
            <Button
              className='mr-2 h-8'
              key={index}
              variant={value.variant}
              onClick={() => {
                value.action(table.getFilteredSelectedRowModel().rows);
              }}
            >
              {value.name}
            </Button>
          );
        })}
    </div>
  );
}
