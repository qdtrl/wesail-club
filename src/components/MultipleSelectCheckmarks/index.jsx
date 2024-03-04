import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListSubheader from '@mui/material/ListSubheader';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultipleSelectCheckmarks = ({ users, clubs, selects, setSelects}) => {
  console.log(users, clubs);
  const handleChange = (event) => {
    console.log(event.target.value);
    // const {
    //   target: { value },
    // } = event;
    // setPersonName(
    //   // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value,
    // );
  };

  return (
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selects}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          <Select>
            <ListSubheader>Clubs</ListSubheader>
            {clubs.map((club) => (
              <MenuItem key={club} value={club.id}>
                <Checkbox checked={selects.includes(club.id)} />
                <ListItemText primary={club} />
              </MenuItem>
            ))}
            
            <ListSubheader>Utilisateurs</ListSubheader>
          
            {users.map((user) => (
              <MenuItem key={user} value={user.id}>
                <Checkbox checked={selects.includes(user.id)} />
                <ListItemText primary={user} />
              </MenuItem>
            ))}
          </Select>
          
        </Select>
      </FormControl>
  );
}

export default MultipleSelectCheckmarks;