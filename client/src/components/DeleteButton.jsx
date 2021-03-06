import React, { useState } from 'react';
import swal from 'sweetalert';
import { Button } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
function DeleteButton() {
  const { setLoading } = useState(AppContext);
  // needs to be tested still
  const handleJournalDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/journal/:id', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // form.reset();
        swal(' Your Journal has been Deleted!');
      })

      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Button
      style={{
        borderCcolor: '#988282;',
        color: '#988282',
        hover: '#988282'
      }}
      onClick={handleJournalDelete}
    >
      Delete Entry
    </Button>
  );
}

export default DeleteButton;
