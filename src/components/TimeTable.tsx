import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TimeTableProps } from '../types';

interface ExtendedTimeTableProps extends TimeTableProps {
  onDelete?: (pkId: number) => Promise<void>;
  onUpdate?: (pkId: number, updatedEntry: any) => Promise<void>;
}

const TimeTable: React.FC<ExtendedTimeTableProps> = ({ entries, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  interface EditFormData {
    REG: number;
    OT: number;
    VACATION: number;
    PTO: number;
    Holiday: number;
    Sick: number;
    Commission: number;
    Deduct: number;
  }

  const [editForm, setEditForm] = React.useState<EditFormData | null>(null);
  const calculateTotal = (entry: any) => {
    return (
      entry.REG +
      entry.OT +
      entry.VACATION +
      entry.PTO +
      entry.Holiday +
      entry.Sick
    );
  };

  return (
    <Paper elevation={3} sx={{ mt: 3 }}>
      <TableContainer>
        <Typography variant="h6" sx={{ p: 2 }}>
          Time Entries
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Pay Period</TableCell>
              <TableCell>REG</TableCell>
              <TableCell>OT</TableCell>
              <TableCell>VAC</TableCell>
              <TableCell>PTO</TableCell>
              <TableCell>Holiday</TableCell>
              <TableCell>Sick</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Deduction</TableCell>
              <TableCell>Actions</TableCell>
              {editingId && <TableCell>Edit Form</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.PK_ID}>
                <TableCell>{`${entry.First_Name} ${entry.Last_Name}`}</TableCell>
                <TableCell>{entry.ID_Record_Employee}</TableCell>
                <TableCell>{entry.Pay_Period}</TableCell>
                <TableCell>{entry.REG}</TableCell>
                <TableCell>{entry.OT}</TableCell>
                <TableCell>{entry.VACATION}</TableCell>
                <TableCell>{entry.PTO}</TableCell>
                <TableCell>{entry.Holiday}</TableCell>
                <TableCell>{entry.Sick}</TableCell>
                <TableCell>{calculateTotal(entry)}</TableCell>
                <TableCell>${entry.Commission.toFixed(2)}</TableCell>
                <TableCell>${entry.Deduct.toFixed(2)}</TableCell>
                <TableCell sx={{ minWidth: '100px' }}>
                  {entry.PK_ID && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {onUpdate && (
                        <IconButton
                          onClick={() => {
                            console.log('Edit clicked for ID:', entry.PK_ID);
                            setEditingId(entry.PK_ID!);
                            setEditForm({
                              REG: entry.REG,
                              OT: entry.OT,
                              VACATION: entry.VACATION,
                              PTO: entry.PTO,
                              Holiday: entry.Holiday,
                              Sick: entry.Sick,
                              Commission: entry.Commission,
                              Deduct: entry.Deduct
                            });
                          }}
                          sx={{ 
                            backgroundColor: '#e3f2fd',
                            '&:hover': { backgroundColor: '#bbdefb' }
                          }}
                          color="primary"
                          size="small"
                          title="Edit entry"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          onClick={() => onDelete(entry.PK_ID!)}
                          sx={{ 
                            backgroundColor: '#ffebee',
                            '&:hover': { backgroundColor: '#ffcdd2' }
                          }}
                          color="error"
                          size="small"
                          title="Delete entry"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </div>
                  )}
                </TableCell>
                {editingId === entry.PK_ID && (
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      {editForm && Object.entries(editForm).map(([key, value]) => (
                        <div key={key}>
                          <label>{key}: </label>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => {
                              const updatedForm: EditFormData = {
                                ...editForm,
                                [key]: parseFloat(e.target.value) || 0
                              };
                              setEditForm(updatedForm);
                            }}
                          />
                        </div>
                      ))}
                      <div>
                        <button
                          onClick={async () => {
                            if (onUpdate) {
                              await onUpdate(entry.PK_ID!, editForm);
                              setEditingId(null);
                              setEditForm(null);
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditForm(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TimeTable;
