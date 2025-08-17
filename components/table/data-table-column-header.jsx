import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsSort
} from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

export function DataTableColumnHeader({
  column,
  title,
  className,
}) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8 data-[state=open]:bg-accent'
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <IconArrowDown className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <IconArrowUp className='ml-2 h-4 w-4' />
            ) : (
              <IconArrowsSort className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <IconArrowUp className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <IconArrowDown className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          {/* {column.getCanHide() && (
            <div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <IconEyeOff className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                Hide
              </DropdownMenuItem>
            </div>
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
