import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import API from "../api";

interface NewService {
  musteri_adi: string;
  marka: string;
  model: string;
  seri_no: string;
  servis_ismi: string;
  ariza: string;
  gelis_tarihi: string;
  aksesuar: string | null;
  status: string;
}

const ServiceNew: React.FC = () => {
  const navigate = useNavigate();
  const [service, setService] = useState<NewService>({
    musteri_adi: "",
    marka: "",
    model: "",
    seri_no: "",
    servis_ismi: "",
    ariza: "",
    gelis_tarihi: "",
    aksesuar: "",
    status: "beklemede"
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  console.log(service);
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const postData = { ...service };
      await API.post("Services/", postData);
      alert("Yeni kayıt başarıyla oluşturuldu!");
      console.log(postData);
      navigate("/services");
    } catch (err) {
      console.error(err);
      alert("Kayıt oluşturulurken hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Yeni Servis Kaydı
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Üst kısım: Kısa inputlar */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Müşteri Adı"
                name="musteri_adi"
                value={service.musteri_adi}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Marka"
                name="marka"
                value={service.marka}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Model"
                name="model"
                value={service.model}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Seri No"
                name="seri_no"
                value={service.seri_no}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Servis İsmi"
                name="servis_ismi"
                value={service.servis_ismi}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Aksesuar"
                name="aksesuar"
                value={service.aksesuar || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ width: 222 }}>
              <TextField
                label="Geliş Tarihi"
                name="gelis_tarihi"
                type="date"
                value={service.gelis_tarihi}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Alt kısım: Arıza alanı */}
        <Box sx={{ mt: 3 }}>
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

        <Box sx={{ mt: 3 }}>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServiceNew;
