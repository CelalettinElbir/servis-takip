import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import {
  Build as BuildIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assessment as AssessmentIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import API from '../api';

interface DashboardStats {
  total_records: number;
  monthly_records: number;
  weekly_records: number;
  status_summary: {
    pending: number;
    in_service: number;
    waiting_delivery: number;
    delivered: number;
  };
  status_counts: Array<{
    status: string;
    count: number;
  }>;
  top_brands: Array<{
    brand__name: string;
    count: number;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await API.get('Services/dashboard_stats/');
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      setError('Dashboard verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'sent_to_service': return '#2196f3';
      case 'returned_from_service': return '#4caf50';
      case 'delivered': return '#8bc34a';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'sent_to_service': return 'Serviste';
      case 'returned_from_service': return 'Teslim Bekliyor';
      case 'delivered': return 'Teslim Edildi';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <WarningIcon />;
      case 'sent_to_service': return <BuildIcon />;
      case 'returned_from_service': return <ScheduleIcon />;
      case 'delivered': return <CheckCircleIcon />;
      default: return <AssessmentIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Veri bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Servis Takip Dashboard
      </Typography>

      {/* Genel İstatistikler */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total_records}
              </Typography>
              <Typography variant="body1">
                Toplam Kayıt
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <DateRangeIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.monthly_records}
              </Typography>
              <Typography variant="body1">
                Bu Ay
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <TodayIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.weekly_records}
              </Typography>
              <Typography variant="body1">
                Son 7 Gün
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.status_summary.waiting_delivery}
              </Typography>
              <Typography variant="body1">
                Teslim Bekliyor
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Durum Özeti */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Durum Özeti
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(stats.status_summary).map(([status, count]) => (
                <Grid item xs={12} sm={6} key={status}>
                  <Card 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      borderLeft: `4px solid ${getStatusColor(status)}`,
                      '&:hover': { boxShadow: 3 }
                    }}
                  >
                    <Box sx={{ mr: 2, color: getStatusColor(status) }}>
                      {getStatusIcon(status)}
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {count}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getStatusText(status)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* En Çok Servis Verilen Markalar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Popüler Markalar
            </Typography>
            {stats.top_brands.length > 0 ? (
              <Box>
                {stats.top_brands.map((brand, index) => (
                  <Box
                    key={brand.brand__name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < stats.top_brands.length - 1 ? '1px solid #eee' : 'none'
                    }}
                  >
                    <Typography variant="body1">
                      {brand.brand__name || 'Bilinmeyen'}
                    </Typography>
                    <Chip
                      label={brand.count}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Henüz veri bulunmamaktadır.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
