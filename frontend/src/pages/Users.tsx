import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string;
}

interface NewUser {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

const Users: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });

  // Kullanıcıları listele
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await API.get('/auth/users/');
      setUsers(response.data);
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.detail || 
        err.response?.data?.message ||
        'Kullanıcılar yüklenirken bir hata oluştu';
      
      setError(errorMessage);
      
      // Eğer 403 hatası alınırsa (yetkisiz erişim)
      if (err.response?.status === 403) {
        setError('Bu sayfayı görüntülemek için yönetici yetkisine sahip olmalısınız.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Component yüklendiğinde kullanıcıları getir
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Yeni kullanıcı oluştur
  const handleCreateUser = async () => {
    // Validasyon
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('Kullanıcı adı, email ve şifre zorunludur');
      return;
    }

    if (newUser.password !== newUser.password2) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (newUser.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    try {
      setCreateLoading(true);
      setError('');
      
      await API.post('auth/users/register/', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        password2: newUser.password2,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      });

      setSuccessMessage('Kullanıcı başarıyla oluşturuldu!');
      setOpenDialog(false);
      
      // Formu temizle
      setNewUser({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
      });
      
      // Kullanıcı listesini yenile
      fetchUsers();
      
      // Başarı mesajını 3 saniye sonra temizle
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      // Backend'den gelen hata mesajlarını işle
      let errorMessage = 'Kullanıcı oluşturulurken bir hata oluştu';
      
      if (err.response?.data) {
        const data = err.response.data;
        
        // Eğer field bazlı hatalar varsa
        if (data.username) {
          errorMessage = `Kullanıcı adı: ${data.username[0]}`;
        } else if (data.email) {
          errorMessage = `Email: ${data.email[0]}`;
        } else if (data.password) {
          errorMessage = `Şifre: ${data.password[0]}`;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  // Form input değişikliklerini yönet
  const handleInputChange = (field: keyof NewUser, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Dialog kapanırken formu ve hataları temizle
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setNewUser({
      username: '',
      email: '',
      password: '',
      password2: '',
      first_name: '',
      last_name: ''
    });
  };

  // Eğer kullanıcı giriş yapmamışsa
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Alert severity="warning">
          Bu sayfayı görüntülemek için giriş yapmalısınız.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Başlık ve Butonlar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Kullanıcı Yönetimi
        </Typography>
        <Box>
          <IconButton 
            onClick={fetchUsers} 
            sx={{ mr: 1 }} 
            color="primary"
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Yeni Kullanıcı
          </Button>
        </Box>
      </Box>

      {/* Başarı Mesajı */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Hata Mesajı */}
      {error && !openDialog && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Kullanıcı Listesi Tablosu */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Kullanıcı Adı</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Ad Soyad</strong></TableCell>
                {/* <TableCell><strong>Durum</strong></TableCell> */}
                <TableCell><strong>Kayıt Tarihi</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
                      Henüz kullanıcı bulunmamaktadır
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // @ts-ignore
                users.results.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.first_name || user.last_name
                        ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                        : '-'}
                    </TableCell>
                    {/* <TableCell>
                      {user.is_staff && (
                        <Chip label="Admin" color="error" size="small" sx={{ mr: 0.5 }} />
                      )}
                      {user.is_active ? (
                        <Chip label="Aktif" color="success" size="small" />
                      ) : (
                        <Chip label="Pasif" color="default" size="small" />
                      )}
                    </TableCell> */}
                    <TableCell>
                      {user.date_joined
                        ? new Date(user.date_joined).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Yeni Kullanıcı Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Kullanıcı Adı"
              fullWidth
              required
              value={newUser.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              helperText="Benzersiz bir kullanıcı adı giriniz"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={newUser.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <TextField
              label="Ad"
              fullWidth
              value={newUser.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
            />
            <TextField
              label="Soyad"
              fullWidth
              value={newUser.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
            />
            <TextField
              label="Şifre"
              type="password"
              fullWidth
              required
              value={newUser.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              helperText="En az 8 karakter olmalıdır"
            />
            <TextField
              label="Şifre Tekrar"
              type="password"
              fullWidth
              required
              value={newUser.password2}
              onChange={(e) => handleInputChange('password2', e.target.value)}
              error={newUser.password2.length > 0 && newUser.password !== newUser.password2}
              helperText={
                newUser.password2.length > 0 && newUser.password !== newUser.password2
                  ? 'Şifreler eşleşmiyor'
                  : ''
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={createLoading}>
            İptal
          </Button>
          <Button
            onClick={handleCreateUser}
            variant="contained"
            disabled={createLoading}
          >
            {createLoading ? <CircularProgress size={24} /> : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;