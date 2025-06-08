import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
    Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Grid, Card, CardContent
} from '@mui/material';
import { COLORS, renderCustomLabel, tooltipFormatter } from '../Statistics';


function TopSalesman({ pieDataTopSalesman }) {
    return (
        <CardContent sx={{ p: 5 }}>
            <Card>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: '#254D70',
                        letterSpacing: 1,
                        mb: 2,
                        textAlign: 'center',
                        background: 'linear-gradient(90deg, #254D70 0%, #ff8042 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    Top Vendedores
                </Typography>
                <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12} md={5}>
                        <Card
                            elevation={0}
                            sx={{
                                marginLeft: 5,
                                border: 'none',
                                boxShadow: 'none',
                                alignItems: 'center', alignContent: 'center'
                            }
                            }
                        >
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={pieDataTopSalesman.slice(0, 4)}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={renderCustomLabel}
                                >
                                    {pieDataTopSalesman.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={tooltipFormatter} />
                            </PieChart>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <List>
                            {pieDataTopSalesman.slice(0, 10).map((entry, idx) => (
                                <ListItem key={entry.name}>
                                    <ListItemText
                                        primary={entry.name}
                                        secondary={`$${entry.value}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </Card>
        </CardContent>
    )
}

export default TopSalesman;