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
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import API from "../api";

interface Customer {
  id: number;
  company_name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface ServiceDetail {
  id: number;
  customer: {
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
  } | null;
  brand: {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  model: string;
  serial_number: string | null;
  accessories: string | null;
  arrival_date: string;
  issue: string | null;
  service_name: string;
  service_send_date: string | null;
  service_operation: string | null;
  service_return_date: string | null;
  delivery_date: string | null;
  created_user: any;
  status: 'pending' | 'sent_to_service' | 'returned_from_service' | 'delivered';
  updated_at: string;
  logs: Array<{
    id: number;
    user: string;
    change_date: string;
    changed_fields: Record<string, any>;
  }>;
}

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
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
      const data: ServiceDetail = response.data.data || response.data;
      console.log("Gelen servis verisi:", response);
      setService(data);

      // Customer ve brand seçimlerini set et
      setSelectedCustomer(
        data.customer ? { id: data.customer.id, company_name: data.customer.company_name } : null
      );

      setSelectedBrand(
        data.brand ? { id: data.brand.id, name: data.brand.name } : null
      );

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Servis detayları yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (searchTerm: string) => {
    try {
      const response = await API.get(`customers/?search=${searchTerm}`);
      setCustomers(response.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const searchBrands = async (searchTerm: string) => {
    try {
      const response = await API.get(`brands/?search=${searchTerm}`);
      setBrands(response.data.results);
    } catch (err) {
      console.error(err);
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
      const postData = {
        ...service,
        customer_id: selectedCustomer?.id || null,
        brand_id: selectedBrand?.id || null,
      };

      await API.put(`Services/${id}/`, postData);
      alert("Güncelleme başarılı!");
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/services")} sx={{ mb: 2 }}>
        Geri Dön
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Servis Detayı #{service.id}
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Satır 1: Customer / Brand / Model */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Box sx={{ flex: "1 1 250px" }}>
            <Autocomplete
              options={customers}
              value={selectedCustomer}
              onChange={(_, newValue) => setSelectedCustomer(newValue)}
              onInputChange={(_, input) => input && searchCustomers(input)}
              getOptionLabel={(option) => option.company_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Müşteri" fullWidth />}
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <Autocomplete
              options={brands}
              value={selectedBrand}
              onChange={(_, newValue) => setSelectedBrand(newValue)}
              onInputChange={(_, input) => input && searchBrands(input)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Marka" fullWidth />}
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Model"
              name="model"
              value={service.model}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </Box>

        {/* Satır 2: Seri No / Servis İsmi / Aksesuar */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Seri No"
              name="serial_number"
              value={service.serial_number || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: "1 1 250px" }}>
            <TextField
              label="Servis İsmi"
              name="service_name"
              value={service.service_name}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Aksesuar"
              name="accessories"
              value={service.accessories || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </Box>

        {/* Satır 3: Tarihler */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Geliş Tarihi"
              name="arrival_date"
              type="date"
              value={service.arrival_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Servise Gönderim Tarihi"
              name="service_send_date"
              type="date"
              value={service.service_send_date || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Servisten Geliş Tarihi"
              name="service_return_date"
              type="date"
              value={service.service_return_date || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Arıza ve Yapılan İşlem */}
        <TextField
          label="Arıza"
          name="issue"
          value={service.issue || ""}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Yapılan İşlem"
          name="service_operation"
          value={service.service_operation || ""}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Güncelle"}
        </Button>
      </Paper>

      {/* Loglar */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            İşlem Geçmişi
          </Typography>
          {service.logs.length > 0 ? (
            service.logs.map((log) => (
              <Box key={log.id} sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="subtitle2">Kullanıcı: {log.user}</Typography>
                <Typography variant="subtitle2">
                  Tarih: {new Date(log.change_date).toLocaleString("tr-TR")}
                </Typography>
                {Object.entries(log.changed_fields).map(([field, value]) => (
                  <Typography key={field} variant="body2">
                    • {field}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Typography>
                ))}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Henüz işlem geçmişi bulunmamaktadır.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );

};

export default ServiceDetailPage;
