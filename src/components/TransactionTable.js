import React, { useEffect, useState } from 'react';
import './TransactionTable.css'; // Import the CSS file

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');

  // Fetch transactions from the API
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      //const response = await axios.get('/api/transactions');
      setTransactions([
        {
            id: 100,
            type: "CREDIT",
            amount: 200
        },
         {
            id: 101,
            type: "DEBIT",
            amount: 200
        },
         {
            id: 102,
            type: "SAVINGS",
            amount: 200
        }
      ]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Handle edit button click
  const handleEditClick = (id, currentAmount) => {
    setEditingId(id);
    setEditedAmount(currentAmount);
  };

  // Handle save after editing
  const handleSaveClick = async (id) => {
    try {
      //await axios.put(`/api/transactions/${id}`, { amount: editedAmount });
      setEditingId(null);
      fetchTransactions(); // Refresh the data
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (id) => {
    try {
      //await axios.delete(`/api/transactions/${id}`);
      fetchTransactions(); // Refresh the data
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="transaction-table-container">
     <div >
               <input
                // className={styles.monthPicker}
                 type="month"
                 //value={currentMonth}
                 //onChange={(e) => monthValueChanged(e.target.value)}
               />
             </div>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className={`row-${txn.type.toLowerCase()}`}>
              <td>{txn.id}</td>
              <td>{txn.description}</td>
              <td>{txn.type}</td>
              <td>
                {editingId === txn.id ? (
                  <input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  txn.amount
                )}
              </td>
              <td>
                {editingId === txn.id ? (
                  <button className="save-button" onClick={() => handleSaveClick(txn.id)}>Save</button>
                ) : (
                  <button className="edit-button" onClick={() => handleEditClick(txn.id, txn.amount)}>Edit</button>
                )}
                <button className="delete-button" onClick={() => handleDeleteClick(txn.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
