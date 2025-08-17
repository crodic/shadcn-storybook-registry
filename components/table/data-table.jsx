import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { IconLoader } from '@tabler/icons-react';

export function DataTable({
  columns,
  data,
  module,
  searchColumnIds,
  searchColumns,
  filterColumns,
  rowsAction,
  preFiltered,
  preSort,
  clickRowAction,
  clickSubRowAction,
  // onPageChange,
  totalPages,
  currentPage,
  perPage,
  setSearchParams,
  currentPageName = 'currentPage',
  searchName = 'search',
  searchByName = 'searchBy',
  order = 'order',
  sortBy = 'sortBy',
  // onPageSizeChange,
  isCallAPIChangePage,
  isFetching,
  setSearch,
  setKeyword,
  action,
  setAction,
  setOrder,
  setSortBy,
  defaultVisibility,
  rowSelection,
  setRowSelection,
}) {
  const [columnVisibility, setColumnVisibility] = React.useState(() => {
    if (module && localStorage.getItem(`ColumnVisibility${module}`)) {
      return JSON.parse(
        localStorage.getItem(`ColumnVisibility${module}`) ?? ''
      )
    }

    return defaultVisibility
  });
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState(preSort ?? []);
  const [expanded, setExpanded] = React.useState({});

  const handleSorting = (valueFunc) => {
    setSorting(valueFunc)
    const result = valueFunc()
    if (result.length > 0) {
      if (setSearchParams)
        setSearchParams((params) => {
          params.set(order, result[0].desc ? 'desc' : 'asc')
          params.set(sortBy, result[0].id.toString())
          return params
        })
    } else {
      if (setSearchParams)
        setSearchParams((params) => {
          params.delete(order)
          params.delete(sortBy)
          return params
        })
    }
  }
  const handleColumnVisibility = (values) => {
    setColumnVisibility(values)

    if (module) {
      const modified = values()
      localStorage.setItem(
        `ColumnVisibility${module}`,
        JSON.stringify({ ...columnVisibility, ...modified })
      )
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
    },
    initialState: {
      pagination: {
        pageSize: Number(perPage || 10),
      },
    },
    pageCount: totalPages,
    enableRowSelection: true,
    columnResizeDirection: 'rtl',
    onRowSelectionChange: setRowSelection,
    getRowId: row => row.id, 
    onSortingChange: handleSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getExpandedRowModel: getExpandedRowModel(),
    paginateExpandedRows: false,
  });

  const canClick = (parentId) => {
    if (parentId) {
      return clickSubRowAction ? 'cursor-pointer' : 'cursor-default';
    } else {
      return clickRowAction ? 'cursor-pointer' : 'cursor-default';
    }
  };

  const onPageChange = (page) => {
    if (setSearchParams)
      setSearchParams((params) => {
        params.set(currentPageName, (page + 1).toString())
        return params
      })
  }

  const onPageSizeChange = (pageSize) => {
    localStorage.setItem('perPage', `${pageSize}`)
    if (setSearchParams)
      setSearchParams((params) => {
        params.set('perPage', pageSize.toString())
        return params
      })
  }

  const onSearchBy = (value) => {
    if (setSearchParams)
      setSearchParams((params) => {
        params.set(searchByName, value.toString())
        params.delete(searchName)
        params.delete(currentPageName)
        return params
      })
  }

  const onSearchValue = (data) => {
    if (setSearchParams)
      setSearchParams((params) => {
        if (data) {
          params.set(searchName, data)
        } else {
          params.delete(searchName)
        }
        params.delete(currentPageName)
        return params
      })
  }

  // React.useEffect(() => {
  //   const dataSort = sorting.length > 0 && sorting[0];
  //   if (setOrder && setSortBy && dataSort) {
  //     setSortBy(dataSort.id);
  //     setOrder(dataSort.desc ? 'desc' : 'asc');
  //   } else {
  //     if (setSortBy) setSortBy('');
  //     if (setOrder) setOrder('');
  //   }
  // }, [sorting, setOrder, setSortBy]);

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        // searchColumnIds={searchColumnIds}
        searchColumns={searchColumns}
        filterColumns={filterColumns}
        preFiltered={preFiltered}
        rowsAction={rowsAction}
        setSearch={
          setSearchParams
            ? (data) => {
                onSearchValue(data)
              }
            : undefined
        }
        setKeyword={onSearchBy}
        action={action}
        setAction={setAction}
      />

      <DataTablePagination
        table={table}
        isCallAPIChangePage={isCallAPIChangePage}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        currentPage={currentPage - 1}
        perPage={perPage}
      />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <div className='my-8 flex h-8 justify-center'>
                    <IconLoader
                      className='animate-spin justify-self-center'
                      size={32}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          if (
                            cell.id.includes('actions') ||
                            cell.id.includes('expand') ||
                            cell.id.includes('select') ||
                            document.getSelection()?.type === 'Range'
                          ) {
                            return;
                          }

                          if (clickRowAction && !row.parentId)
                            clickRowAction(row.original);
                          if (clickSubRowAction && row.parentId)
                            clickSubRowAction(row.original);
                        }}
                        className={canClick(row.parentId)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        isCallAPIChangePage={isCallAPIChangePage}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        currentPage={currentPage - 1}
        perPage={perPage}
      />
    </div>
  );
}
