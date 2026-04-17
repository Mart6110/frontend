import { Box, Table, Flex, Text, IconButton, HStack } from "@chakra-ui/react"
import { formatTimestamp } from "./BaseChart"
import { memo, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { LuChevronUp, LuChevronDown, LuChevronsUpDown, LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from "react-icons/lu"
import { useState } from "react"

export interface Column {
  key: string
  label: string
  unit?: string
  format?: (value: any) => string
  enableSorting?: boolean
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  height?: number
  title?: string
  pageSize?: number
  enablePagination?: boolean
  enableSorting?: boolean
}

export const DataTable = memo(function DataTable({ 
  data, 
  columns, 
  height = 300, 
  title,
  pageSize = 10,
  enablePagination = true,
  enableSorting = true
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  // Convert custom Column format to Tanstack Table ColumnDef
  const tableColumns = useMemo<ColumnDef<any>[]>(() => 
    columns.map((col) => ({
      accessorKey: col.key,
      header: () => (
        <Flex gap={1} align="center">
          <Text fontWeight="semibold">{col.label}</Text>
          {col.unit && (
            <Text fontSize="xs" color="fg.muted">
              ({col.unit})
            </Text>
          )}
        </Flex>
      ),
      cell: (info) => {
        const value = info.getValue()
        if (col.format) {
          return col.format(value)
        }
        if (col.key === 'timestamp') {
          return formatTimestamp(value as number)
        }
        return typeof value === 'number' ? value.toFixed(2) : value
      },
      enableSorting: col.enableSorting !== false && enableSorting,
    })),
    [columns, enableSorting]
  )

  // Reverse data to show most recent first
  const reversedData = useMemo(() => [...data].reverse(), [data])

  const table = useReactTable({
    data: reversedData,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  const tableHeight = enablePagination ? height - 50 : height

  return (
    <Box>
      {title && (
        <Text fontSize="lg" fontWeight="semibold" mb={3}>
          {title}
        </Text>
      )}
      <Box 
        overflowY="auto" 
        height={`${tableHeight}px`}
        borderWidth="1px"
        borderRadius="md"
      >
        <Table.Root size="sm" striped interactive stickyHeader>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeader 
                    key={header.id}
                    cursor={header.column.getCanSort() ? "pointer" : "default"}
                    onClick={header.column.getToggleSortingHandler()}
                    userSelect="none"
                  >
                    <Flex align="center" gap={2}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <Box fontSize="sm" color="fg.muted">
                          {{
                            asc: <LuChevronUp />,
                            desc: <LuChevronDown />,
                          }[header.column.getIsSorted() as string] ?? <LuChevronsUpDown />}
                        </Box>
                      )}
                    </Flex>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length}>
                  <Flex justify="center" align="center" height="100px">
                    <Text color="fg.muted">No data available</Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      
      {enablePagination && table.getPageCount() > 1 && (
        <Flex 
          justify="space-between" 
          align="center" 
          mt={3} 
          px={2}
          gap={4}
          flexWrap="wrap"
        >
          <Text fontSize="sm" color="fg.muted">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}{" "}
            of {data.length} rows
          </Text>
          
          <HStack gap={1}>
            <IconButton
              aria-label="First page"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              size="sm"
              variant="outline"
            >
              <LuChevronsLeft />
            </IconButton>
            <IconButton
              aria-label="Previous page"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="sm"
              variant="outline"
            >
              <LuChevronLeft />
            </IconButton>
            <Text fontSize="sm" px={2} color="fg">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </Text>
            <IconButton
              aria-label="Next page"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="sm"
              variant="outline"
            >
              <LuChevronRight />
            </IconButton>
            <IconButton
              aria-label="Last page"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              size="sm"
              variant="outline"
            >
              <LuChevronsRight />
            </IconButton>
          </HStack>
        </Flex>
      )}
    </Box>
  )
})

// Helper to format boolean values
export function formatBoolean(value: boolean): string {
  return value ? "Active" : "Inactive"
}

// Helper to format timestamps consistently
export function formatTableTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}
