import React, { useState, useEffect, use } from 'react';
import apiAxios from '../../config/cienteAxios';
import { toast } from 'react-toastify';
import { Card, CardContent } from '@mui/material';
import LoadingSpinner from '../LoadingSpinner';
import TopSalesman from './StatiticsComponents/TopSalesman';
import TopSales from './StatiticsComponents/TopSales';

async function fetchTopSalesman() {
    try {
        const response = await apiAxios.get('/admin/topSalesman');
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch top salesman data');
    }
}

async function fetchStockInfo() {
    try {
        const response = await apiAxios.get('/admin/stockCount');
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch stock information');
    }
}

async function fetchTop10Sales() {
    try {
        const response = await apiAxios.get('/admin/top10Sales');
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch top 10 sales data');
    }
}

export const COLORS = ['#254D70', '#7F8CAA', '#131D4F', '#ff8042', '#954C2E'];

export const renderCustomLabel = ({ name, value }) => `${name}: $${value.toLocaleString()}`;

export const tooltipFormatter = (value, name, props) => [`${value.toLocaleString()}`, 'Revenue'];

function Statistics() {
    const [isLoading, setIsLoading] = useState(true);
    const [topSalesman, setTopSalesman] = useState([]);
    const [pieDataTopSalesman, setPieDataTopSalesman] = useState([]);
    const [stockInfo, setStockInfo] = useState([]);
    const [top10Sales, setTop10Sales] = useState([]);

    useEffect(() => {
        (async () => {
            const topSalesmanPromise = await fetchTopSalesman();
            const stockInfoPromise = await fetchStockInfo();
            const top10SalesPromise = await fetchTop10Sales();

            setTopSalesman(topSalesmanPromise);
            setStockInfo(stockInfoPromise);
            setTop10Sales(top10SalesPromise);
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        if(topSalesman.length > 0) {
            const pieData = topSalesman.map((salesman, idx) => {
                return ({
                    name: salesman.salesmanName,
                    value: salesman.totalRevenue,
                    color: COLORS[idx % COLORS.length],
                })
            });
            setPieDataTopSalesman(pieData);
        }
    }, [topSalesman])

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
            <TopSalesman pieDataTopSalesman={pieDataTopSalesman}/>
            <TopSales top10Sales={top10Sales}/>
        </Card>
    )
}

export default Statistics;
