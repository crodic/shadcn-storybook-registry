import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronLeftPipe,
  IconChevronRightPipe,
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function DataTablePagination({
  table,
  isCallAPIChangePage,
  onPageChange,
  onPageSizeChange,
  currentPage,
  perPage,
}) {
  return (
    <div className={cn(isCallAPIChangePage ? 'justify-end' : 'justify-between',
      'flex items-center overflow-auto px-2')}>
      {isCallAPIChangePage ? null : (
        <div className='hidden flex-1 text-sm text-muted-foreground sm:block'>
          <div className='flex flex-row'>
            <p className='content-center'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </p>
          </div>
        </div>
      )}
      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
          <Select
            value={perPage ? `${perPage}` : `${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              if (isCallAPIChangePage && onPageChange && onPageSizeChange) {
                onPageSizeChange(Number(value))
                table.setPageSize(Number(value))
                onPageChange(0) // Reset to first page
              } else {
                table.setPageSize(Number(value))
              }
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={perPage ? perPage : table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          {currentPage != null ? (
            <>
              Page {currentPage + 1} of {table.getPageCount()}
            </>
          ) : (
            <>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </>
          )}
          </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => {
              table.setPageIndex(0)
              if (isCallAPIChangePage && onPageChange) {
                onPageChange(0)
              }
            }}
            disabled={currentPage != null ? !(currentPage > 0) : !table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <IconChevronLeftPipe className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => {
              table.previousPage()
              if (isCallAPIChangePage && onPageChange && currentPage != null) {
                onPageChange(currentPage - 1)
              }
            }}
            disabled={currentPage != null ? !(currentPage > 0) : !table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <IconChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => {
              table.nextPage()
              if (isCallAPIChangePage && onPageChange && currentPage != null) {
                onPageChange(currentPage + 1)
              }
            }}
            disabled={currentPage != null ? !((currentPage < table.getPageCount() - 1)) : !table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <IconChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1)
              if (isCallAPIChangePage && onPageChange) {
                onPageChange(table.getPageCount() - 1)
              }
            }}
            disabled={currentPage != null ? !((currentPage < table.getPageCount() - 1)) : !table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <IconChevronRightPipe className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
