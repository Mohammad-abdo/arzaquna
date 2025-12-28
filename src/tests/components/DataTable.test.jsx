import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DataTable from '../../components/DataTable'

const mockData = [
  { id: 1, name: 'Test Item 1', status: 'active' },
  { id: 2, name: 'Test Item 2', status: 'inactive' }
]

const mockColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Status', accessor: 'status' }
]

describe('DataTable Component', () => {
  it('should render table with data', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={mockData}
        loading={false}
      />
    )

    expect(screen.getByText('Test Item 1')).toBeInTheDocument()
    expect(screen.getByText('Test Item 2')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        loading={true}
      />
    )

    expect(screen.getByText(/Loading data/i)).toBeInTheDocument()
  })

  it('should show empty message when no data', () => {
    render(
      <DataTable
        columns={mockColumns}
        data={[]}
        loading={false}
        emptyMessage="No items found"
      />
    )

    expect(screen.getByText('No items found')).toBeInTheDocument()
  })
})


