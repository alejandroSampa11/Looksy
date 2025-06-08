import React, { useState } from 'react';
import { Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setMinPrice, setMaxPrice, setSort } from '../redux/slices/filterSlice';

const PRICE_MIN = 0;
const PRICE_MAX = 100000;

function Filter() {
    const dispatch = useDispatch();
    const { minPrice, maxPrice, sort } = useSelector(state => state.searchFilter);

    // Estado local para los inputs
    const [localMin, setLocalMin] = useState(minPrice ?? PRICE_MIN);
    const [localMax, setLocalMax] = useState(maxPrice ?? PRICE_MAX);

    const handleSortChange = (event) => {
        dispatch(setSort(event.target.value));
    };

    // Actualiza el estado local y solo hace dispatch al perder el foco
    const handleMaxChange = (e) => {
        setLocalMax(e.target.value);
    };
    const handleMaxBlur = () => {
        dispatch(setMaxPrice(Number(localMax) || PRICE_MAX));
    };

    const handleMinChange = (e) => {
        setLocalMin(e.target.value);
    };
    const handleMinBlur = () => {
        dispatch(setMinPrice(Number(localMin) || PRICE_MIN));
    };

    return (
        <Card sx={{ maxWidth: 700, margin: '0 auto', mt: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    {/* Ordenar por */}
                    <Box sx={{ minWidth: 200 }}>
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
                    {/* Filtrar por precio */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ mr: 1 }}>Filtrar por precio:</Typography>
                        <TextField
                            label="Mínimo"
                            size="small"
                            type="number"
                            value={localMin}
                            onChange={handleMinChange}
                            onBlur={handleMinBlur}
                            sx={{ width: 100 }}
                            inputProps={{ min: PRICE_MIN, max: localMax }}
                        />
                        <TextField
                            label="Máximo"
                            size="small"
                            type="number"
                            value={localMax}
                            onChange={handleMaxChange}
                            onBlur={handleMaxBlur}
                            sx={{ width: 100 }}
                            inputProps={{ min: localMin, max: PRICE_MAX }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default Filter;