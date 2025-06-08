import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import { COLORS, tooltipFormatter } from '../Statistics';

const priceFormatter = (value) =>
    value?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });


const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && label) {
        const { totalRevenue, totalSold } = payload[0].payload;
        return (
            <Card sx={{ p: 1, minWidth: 150 }}>
                <Typography variant="subtitle2"><b>{label}</b></Typography>
                <Typography variant="body2">Total revenue: {priceFormatter(totalRevenue)}</Typography>
                <Typography variant="body1">Sold: {totalSold}</Typography>
            </Card>
        )
    }
    return null;
}

function TopSales({ top10Sales }) {
        const sortedData  = [...top10Sales].sort((a, b) => b.totalRevenue - a.totalRevenue);
        return (
        <Card sx={{ borderRadius: 3, background: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
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
                    Top Productos por ganancia
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <XAxis dataKey="itemName" tick={{ fontWeight: 600 }} />
                        <YAxis tickFormatter={v => `$${v / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="totalRevenue" radius={[8, 8, 0, 0]}>
                            {sortedData.map((entry, idx) => (
                                <Cell key={entry.itemId} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default TopSales;