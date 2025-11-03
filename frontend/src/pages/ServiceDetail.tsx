import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import API from "../api";

interface ServiceDetail {
  id: number;
  musteri_adi: string;
  marka: string;
  model: string;
  seri_no: string;
  servis_ismi: string;
  ariza: string;
  servise_gonderim_tarihi: string;
  servisten_gelis_tarihi: string | null;
  yapilan_islem: string;
  teslim_tarihi: string | null;
  aksesuar: string | null;
  logs: Array<{
    id: number;
    user: string;
    degisiklik_tarihi: string;
    changed_fields: Record<string, any>;
  }>;
}

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await API.get(`Services/${id}/`);
      console.log(response.data);
      setService(response.data);
      

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Servis detayları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (service) {
      setService({ ...service, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!service) return;
    setSaving(true);
    try {
      await API.put(`Services/${id}/`, service);
      alert("Güncelleme başarılı!");
      // Servisi yeniden yükle
      await fetchService();
    } catch (err) {
      console.error(err);
      alert("Güncelleme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !service) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/services")}
          sx={{ mb: 1 }}
        >
          Geri Dön
        </Button>

        <Typography variant="h5" sx={{ mb: 2 }}>
          Servis Detayı #{service.id}
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Box 1: Müşteri Adı / Marka / Model */}
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} sx={{ width: 300 }}>
                <TextField
                  label="Müşteri Adı"
                  name="musteri_adi"
                  value={service.musteri_adi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ width: 300 }}>
                <TextField
                  label="Marka"
                  name="marka"
                  value={service.marka}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ width: 300 }}>
                <TextField
                  label="Model"
                  name="model"
                  value={service.model}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* Box 2: Seri No / Servis İsmi / Aksesuar */}
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} sx={{ width: 300 }}>
                <TextField
                  label="Seri No"
                  name="seri_no"
                  value={service.seri_no}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ width: 300 }}>
                <TextField
                  label="Servis İsmi"
                  name="servis_ismi"
                  value={service.servis_ismi}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ width: 300 }}>
                <TextField
                  label="Aksesuar"
                  name="aksesuar"
                  value={service.aksesuar || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          {/* Box 3: Servise Gönderim Tarihi / Servisten Geliş / Teslim Tarihi */}
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} sx={{ width: 300 }}>
                <TextField
                  label="Servise Gönderim Tarihi"
                  name="servise_gonderim_tarihi"
                  type="date"
                  value={service.servise_gonderim_tarihi}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: 300 }}>
                <TextField
                  label="Servisten Geliş Tarihi"
                  name="servisten_gelis_tarihi"
                  type="date"
                  value={service.servisten_gelis_tarihi || ""}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} sx={{ width: 300 }}>
                <TextField
                  label="Teslim Tarihi"
                  name="teslim_tarihi"
                  type="date"
                  value={service.teslim_tarihi || ""}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
          {/* Box 4: Arıza */}
          <Box mb={2}>
            <TextField
              label="Arıza"
              name="ariza"
              value={service.ariza}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>

          {/* Box 5: Yapılan İşlem */}
          <Box mb={2}>
            <TextField
              label="Yapılan İşlem"
              name="yapilan_islem"
              value={service.yapilan_islem}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Kaydediliyor..." : "Güncelle"}
          </Button>
        </Paper>
      </Box>

      <Box className="logContainer" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            İşlem Geçmişi
          </Typography>
          {service.logs && service.logs.length > 0 ? (
            service.logs.map((log) => (
              <Box key={log.id} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Kullanıcı: {log.user}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tarih: {new Date(log.degisiklik_tarihi).toLocaleString('tr-TR')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">Yapılan Değişiklikler:</Typography>
                  {Object.entries(log.changed_fields).map(([field, value]) => (
                    <Typography key={field} variant="body2" sx={{ mt: 0.5 }}>
                      • {field}: {value}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              Henüz işlem geçmişi bulunmamaktadır.
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ServiceDetailPage;
