import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListSubheader from '@mui/material/ListSubheader';
import { auth } from '../../services/firebase';

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

const MultipleSelectCheckmarks = ({ tag, users, clubs, selects, setSelects}) => {

  const handleChange = (event) => {
    setSelects(event.target.value);
  };

  return (
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id={`multiple-checkbox-${tag}`}>{tag}</InputLabel>
        <Select
          labelId={`multiple-checkbox-${tag}`}
          multiple
          value={selects}
          onChange={handleChange}
          input={<OutlinedInput label={tag} />}
          renderValue={(selected) => selected.map((id) => {
            const user = users.find(user => user.id === id);
            if (user) {
              return `${user.first_name} ${user.last_name}`;
            }
            const club = clubs.find(club => club.id === id);
            if (club) {
              return club.name;
            }
            return '';
          }).join(', ')}  
          MenuProps={MenuProps}
        >
          <ListSubheader>Clubs</ListSubheader>
          {clubs.filter(club => club.user_id !== auth.currentUser.uid).map((club) => (
            <MenuItem key={club.id} value={club.id}>
              <ListItemText primary={club.name} />
              <Checkbox checked={selects.includes(club.id)} />
            </MenuItem>
          ))}
          
          <ListSubheader>Utilisateurs</ListSubheader>
        
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              <Checkbox checked={selects.includes(user.id)} />
            </MenuItem>
          ))}
        
        </Select>
      </FormControl>
  );
}

export default MultipleSelectCheckmarks;