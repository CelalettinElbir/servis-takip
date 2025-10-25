import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import API from '../api';

interface ServiceDetail {
  id: number;
  musteri_adi: string;
  tarih: string;
  durum: string;
  aciklama: string;
  created_at: string;
  // Diğer detay alanlarını buraya ekleyebilirsiniz
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      const response = await API.get(`kayitlar/${id}/`);
      setServiceDetail(response.data);
      setError(null);
    } catch (err) {
      setError('Servis detayları yüklenirken bir hata oluştu.');
      console.error('Error fetching service detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !serviceDetail) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/servis-kayitlari')}
        sx={{ mb: 3 }}
      >
        Geri Dön
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Servis Detayı #{serviceDetail.id}
      </Typography>

      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Müşteri Adı
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {serviceDetail.musteri_adi}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Tarih
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {new Date(serviceDetail.tarih).toLocaleDateString('tr-TR')}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Durum
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {serviceDetail.durum}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Oluşturulma Tarihi
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {new Date(serviceDetail.created_at).toLocaleString('tr-TR')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="textSecondary">
                Açıklama
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {serviceDetail.aciklama}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceDetail;