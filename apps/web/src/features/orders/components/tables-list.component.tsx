import React, { useEffect } from 'react';
import { useOrdersQuery } from '@/hooks/query';
import { useTables } from '../hooks';
import { EOrderStatus, EOrderType } from '@pr80-app/shared-contracts';
import { setApiOrders } from '../store/orders-store';
import { TableView } from '@/domain/entity';

interface TablesListProps {
  statusFilter?: EOrderStatus;
}

export const TablesList: React.FC<TablesListProps> = ({ statusFilter }) => {
  // Fetch orders using TanStack Query
  const { data: apiOrders = [], isLoading, error } = useOrdersQuery({ status: statusFilter });

  // Update the store with API orders
  useEffect(() => {
    setApiOrders(apiOrders);
  }, [apiOrders]);

  // Use the tables hook with the fetched orders
  const { tables, selectedTable, selectOrderById, addLocalTable, removeTable } =
    useTables(apiOrders);

  // Handle loading and error states
  if (isLoading) return <div>Loading tables...</div>;
  if (error) return <div>Error loading tables: {(error as Error).message}</div>;

  return (
    <div>
      <h2>Tables</h2>

      {tables.length === 0 ? (
        <div>No tables found</div>
      ) : (
        <ul>
          {tables.map((table) => (
            <li
              key={table.id}
              className={selectedTable?.id === table.id ? 'selected' : ''}
              onClick={() => selectOrderById(table.id)}
            >
              <div>Table: {table.tableNumber}</div>
              <div>Status: {table.status}</div>
              <div>Source: {table.source}</div>
              {table.customerCount > 0 && <div>Customers: {table.customerCount}</div>}
              {table.source === 'local' && (
                <button onClick={() => removeTable(table.id)}>Remove</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Form to add a new table */}
      <AddTableForm onAddTable={addLocalTable} />
    </div>
  );
};

// Simple form component to add a new table
interface AddTableFormProps {
  onAddTable: (table: TableView) => void;
}

const AddTableForm: React.FC<AddTableFormProps> = ({ onAddTable }) => {
  const [tableKey, setTableKey] = React.useState('');
  const [customerCount, setCustomerCount] = React.useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableKey && customerCount > 0) {
      onAddTable({
        id: tableKey,
        tableNumber: tableKey,
        customerCount,
        status: EOrderStatus.DRAFT,
        source: 'local',
        totalAmount: '0',
        relatedOrderIds: [],
        type: EOrderType.MAIN,
      });
      setTableKey('');
      setCustomerCount(1);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Table</h3>
      <div>
        <label>
          Table Number:
          <input
            type="text"
            value={tableKey}
            onChange={(e) => setTableKey(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Customer Count:
          <input
            type="number"
            min="1"
            value={customerCount}
            onChange={(e) => setCustomerCount(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <button type="submit">Add Table</button>
    </form>
  );
};
