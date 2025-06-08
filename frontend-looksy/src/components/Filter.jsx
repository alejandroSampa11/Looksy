import React from 'react';
import { Box, TextField, Typography, FormGroup, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setMinPrice, setMaxPrice, setSort } from '../redux/slices/filterSlice';

function Filter() {
    const dispatch = useDispatch();
    const { minPrice, maxPrice, sort } = useSelector(state => state.searchFilter);

    const handleSortChange = (event) => {
        dispatch(setSort(event.target.value));
    };

    return (
        <>
            <Box sx={{ mb: 2, maxWidth: 200, pl: 5 }}>
                <FormControl fullWidth size="small">
                    <InputLabel id="sort-label">Ordenar por</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sort || ''}
                        label="Ordenar por"
                        onChange={handleSortChange}
                    >
                        <MenuItem value={0}>Sin orden</MenuItem>
                        <MenuItem value={1}>Precio: Menor a mayor</MenuItem>
                        <MenuItem value={-1}>Precio: Mayor a menor</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    );
}

export default Filter;