import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Alert,
  Stack
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
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#2c3e50' }}>
          Servis Takip Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Genel istatistikler ve sistem özeti
        </Typography>
      </Paper>

      {/* Genel İstatistikler */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
          Ana İstatistikler
        </Typography>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={3}
          sx={{ mb: 2 }}
        >
          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
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
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
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
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
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
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
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
          </Box>
        </Stack>
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Durum Özeti */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
              Durum Özeti
            </Typography>
            <Stack spacing={2}>
              {Object.entries(stats.status_summary).map(([status, count]) => (
                <Card 
                  key={status}
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    borderLeft: `4px solid ${getStatusColor(status)}`,
                    '&:hover': { 
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
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
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* En Çok Servis Verilen Markalar */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
              Popüler Markalar
            </Typography>
            {stats.top_brands.length > 0 ? (
              <Stack spacing={2}>
                {stats.top_brands.map((brand, index) => (
                  <Box
                    key={brand.brand__name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        transition: 'background-color 0.2s ease-in-out'
                      }
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {brand.brand__name || 'Bilinmeyen'}
                    </Typography>
                    <Chip
                      label={brand.count}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Henüz veri bulunmamaktadır.
              </Typography>
            )}
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
