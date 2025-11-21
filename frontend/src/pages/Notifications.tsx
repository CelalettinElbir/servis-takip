import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Badge,
  Divider,
  Container,
  Paper,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Build as BuildIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import API from '../api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}
interface Customer {
  id: number;
  company_code: string;
  company_name: string;
  address: string;
  email: string;
  tax_number: string;
  tax_office: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServisKayit {
  id: number;
  customer: Customer;
  brand: Brand;
  model: string;
  serial_number: string;
  accessories: string;
  arrival_date: string;
  issue: string;
  service_name: string;
  service_send_date: string | null;
  service_operation: string | null;
  service_return_date: string | null;
  delivery_date: string | null;
  created_user: number | null;
  status: string;
  updated_at: string;
  logs: any[];
}

interface Notification {
  id: number;
  user: User;
  service_record: ServisKayit;
  message: string;
  created_at: string;
  is_read: boolean;
  overdue_days: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.get('auth/notifications/');
      console.log(response);
      // API'den paginated response geldiği için results array'ini al
      setNotifications(response.data.results || []);
      setError(null);
    } catch (err) {
      console.error('Bildirimler yüklenirken hata:', err);
      setError('Bildirimler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await API.patch(`auth/notifications/${id}/`, { is_read: true });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Bildirim okundu işaretlenirken hata:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="50vh"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon fontSize="large" />
            </Badge>
            <Typography variant="h4" component="h2" fontWeight="bold">
              Bildirimler
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={fetchNotifications}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}
          >
            Yenile
          </Button>
        </Box>
      </Paper>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Henüz bildirim bulunmuyor
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {notifications.map(notification => (
            <Card 
              key={notification.id}
              elevation={notification.is_read ? 1 : 3}
              sx={{
                border: notification.is_read 
                  ? '1px solid #e0e0e0' 
                  : '2px solid #2196f3',
                bgcolor: notification.is_read ? 'white' : '#f3f8ff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {notification.user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" color="textSecondary">
                        {notification.user.username}
                      </Typography>
                      {!notification.is_read && (
                        <Chip 
                          label="Yeni" 
                          color="primary" 
                          size="small" 
                          variant="filled"
                        />
                      )}
                    </Box>

                    <Typography variant="h6" gutterBottom fontWeight="medium">
                      {notification.message}
                    </Typography>

                    {notification.service_record && (
                      <Box mb={2}>
                        <Divider sx={{ my: 1 }} />
                        <Stack spacing={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              <strong>Müşteri:</strong> {notification.service_record.customer.company_name}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <BuildIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              <strong>Marka/Model:</strong> {notification.service_record.brand.name} - {notification.service_record.model}
                            </Typography>
                          </Box>
                          {notification.service_record.issue && (
                            <Typography variant="body2" color="textSecondary">
                              <strong>Arıza:</strong> {notification.service_record.issue}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}

                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                      {notification.overdue_days > 0 && (
                        <Chip
                          icon={<WarningIcon />}
                          label={`${notification.overdue_days} gün gecikme`}
                          color="error"
                          variant="outlined"
                          size="small"
                        />
                      )}
                      
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notification.created_at).toLocaleString('tr-TR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    {!notification.is_read ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => markAsRead(notification.id)}
                        sx={{ ml: 2 }}
                      >
                        Okundu İşaretle
                      </Button>
                    ) : (
                      <Chip 
                        icon={<CheckCircleIcon />}
                        label="Okundu" 
                        color="success" 
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Notifications;
