import React, { useState, useEffect } from 'react';
import apiAxios from '../../config/cienteAxios';
import { toast } from 'react-toastify';
import {
    Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Select, MenuItem, FormControl, InputLabel, Grid, Avatar, Card, CardContent, Divider, Chip, Stack, alpha
} from '@mui/material';
import { FiOctagon } from 'react-icons/fi';
import EditIcon from '@mui/icons-material/Edit';
import LoadingSpinner from '../LoadingSpinner';

function Statistics() {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return (
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <LoadingSpinner />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
        >
            <CardContent sx={{ p: 4 }}>
            </CardContent>
        </Card>
    )
}

export default Statistics;
