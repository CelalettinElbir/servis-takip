import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    IconButton,
    CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import API from '../api';

interface ServiceRecord {
    id: number;
    musteri_adi: string;
    tarih: string;
    durum: string;
    aciklama: string;
    created_at: string;
}

interface ApiResponse {
    results: ServiceRecord[];
    count: number;
    next: string | null;
    previous: string | null;
}

const Services = () => {
    const [records, setRecords] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await API.get('Services/');
            setRecords(response.data);
            setError(null);
        } catch (err) {
            setError('Kayıtlar yüklenirken bir hata oluştu.');
            console.error('Error fetching records:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id: number) => {
        navigate(`/Services/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Servis Kayıtları
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Müşteri Adı</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Açıklama</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records?.results.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.id}</TableCell>
                                <TableCell>{record.musteri_adi}</TableCell>
                                <TableCell>{new Date(record.tarih).toLocaleDateString('tr-TR')}</TableCell>
                                <TableCell>{record.durum}</TableCell>
                                <TableCell>{record.aciklama}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleViewDetail(record.id)}
                                        size="small"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Services;