import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Autocomplete,
} from "@mui/material";
import API from "../api";

interface Customer {
  id: number;
  company_code: string;
  company_name: string;
  address: string;
  email: string;
  tax_number: string;
  tax_office: string;
  is_active: boolean;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceCompany {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
}

interface NewService {
  id?: number;
  customer_id: number | null;
  brand_id: number | null;
  model: string;
  serial_number: string | null;
  accessories: string | null;
  arrival_date: string;
  issue: string | null;
  service_id: number | null;
  service_send_date: string | null;
  service_operation: string | null;
  service_return_date: string | null;
  delivery_date: string | null;
  status: 'pending' | 'sent_to_service' | 'returned_from_service' | 'delivered';
  updated_at?: string;
  created_user?: number;
}

const ServiceNew: React.FC = () => {
  const navigate = useNavigate();
  const [service, setService] = useState<NewService>({
    customer_id: null,
    brand_id: null,
    model: "",
    serial_number: null,
    accessories: null,
    arrival_date: new Date().toISOString().split('T')[0],
    issue: null,
    service_id: null,
    service_send_date: null,
    service_operation: null,
    service_return_date: null,
    delivery_date: null,
    status: "pending"
  });

  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [serviceCompanies, setServiceCompanies] = useState<ServiceCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceCompany | null>(null);

  // Validasyon state'leri
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchCustomers = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await API.get(`customers/?search=${searchTerm}`);
      setCustomers(response.data.results);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchBrands = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await API.get(`brands/?search=${searchTerm}`);
      setBrands(response.data.results);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchServiceCompanies = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await API.get(`ServiceCompanies/?search=${searchTerm}`);
      setServiceCompanies(response.data.results);
    } catch (error) {
      console.error("Error fetching service companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
    
    // Hata temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Servis seçimi değiştiğinde hataları temizle
  const handleServiceChange = (newValue: ServiceCompany | null) => {
    setSelectedService(newValue);
    setService((prev) => ({
      ...prev,
      service_id: newValue?.id || null
    }));
    
    // Servis hatasını temizle
    if (errors.service) {
      setErrors(prev => ({ ...prev, service: '' }));
    }
  };  // Form validasyon fonksiyonu
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Zorunlu alanlar
    if (!selectedCustomer) {
      newErrors.customer = 'Müşteri seçimi zorunludur';
    }
    if (!selectedBrand) {
      newErrors.brand = 'Marka seçimi zorunludur';
    }
    if (!service.model.trim()) {
      newErrors.model = 'Model alanı zorunludur';
    }
    if (!service.arrival_date) {
      newErrors.arrival_date = 'Geliş tarihi zorunludur';
    }
    if (!service.issue?.trim()) {
      newErrors.issue = 'Arıza açıklaması zorunludur';
    }

    // Model uzunluk kontrolü
    if (service.model.trim() && service.model.trim().length < 2) {
      newErrors.model = 'Model en az 2 karakter olmalıdır';
    }

    // Seri no uzunluk kontrolü
    if (service.serial_number && service.serial_number.trim().length < 3) {
      newErrors.serial_number = 'Seri numarası en az 3 karakter olmalıdır';
    }

    // Tarih kontrolleri
    if (service.arrival_date) {
      const arrivalDate = new Date(service.arrival_date);

      // SAATİ 00:00:00 YAP
      arrivalDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (arrivalDate > today) {
        newErrors.arrival_date = 'Geliş tarihi bugünden büyük olamaz';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validasyon kontrolü
    if (!validateForm()) {
      alert('Lütfen tüm zorunlu alanları doldurun ve hata mesajlarını kontrol edin.');
      return;
    }

    setSaving(true);
    try {
      const postData: any = {
        ...service,
        customer_id: selectedCustomer?.id || null,
        brand_id: selectedBrand?.id || null,
      };

      // Eğer servis seçildiyse ekle, yoksa gönderme
      if (selectedService?.id) {
        postData.service_id = selectedService.id;
      }

      await API.post("Services/", postData);
      alert("Yeni kayıt başarıyla oluşturuldu!");
      console.log("Gönderilen veri:", postData);
      navigate("/services");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Kayıt oluşturulurken hata oluştu!';
      alert(errorMessage);
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
        {/* Üst satır: müşteri adı, marka, model, seri no */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ flex: "1 1 250px" }}>
            <Autocomplete
              options={customers}
              loading={loading}
              value={selectedCustomer}
              onChange={(_, newValue) => {
                setSelectedCustomer(newValue);
                setService((prev) => ({
                  ...prev,
                  customer_id: newValue?.id || null
                }));
              }}
              onInputChange={(_, newInputValue) => {
                if (newInputValue) searchCustomers(newInputValue);
              }}
              getOptionLabel={(option) => option.company_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Müşteri Adı"
                  fullWidth
                  error={!!errors.customer}
                  helperText={errors.customer}
                  required
                />
              )}
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <Autocomplete
              options={brands}
              loading={loading}
              value={selectedBrand}
              onChange={(_, newValue) => {
                setSelectedBrand(newValue);
                setService((prev) => ({
                  ...prev,
                  brand_id: newValue?.id || null
                }));
              }}
              onInputChange={(_, newInputValue) => {
                if (newInputValue) searchBrands(newInputValue);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marka"
                  fullWidth
                  error={!!errors.brand}
                  helperText={errors.brand}
                  required
                />
              )}
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Model"
              name="model"
              value={service.model}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.model}
              helperText={errors.model}
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Seri No"
              name="serial_number"
              value={service.serial_number || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.serial_number}
              helperText={errors.serial_number}
            />
          </Box>
        </Box>

        {/* İkinci satır: servis ismi, aksesuar, geliş tarihi */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ flex: "1 1 250px" }}>
            <Autocomplete
              options={serviceCompanies}
              loading={loading}
              value={selectedService}
              onChange={(_, newValue) => handleServiceChange(newValue)}
              onInputChange={(_, newInputValue) => {
                if (newInputValue) searchServiceCompanies(newInputValue);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Servis Firması (İsteğe Bağlı)" 
                  fullWidth 
                  helperText="Servis firması seçimi zorunlu değildir"
                  error={!!errors.service}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: "1 1 250px" }}>
            <TextField
              label="Aksesuar"
              name="accessories"
              value={service.accessories || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Geliş Tarihi"
              name="arrival_date"
              type="date"
              value={service.arrival_date}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.arrival_date}
              helperText={errors.arrival_date}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Üçüncü satır: tarih alanları */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
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

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Teslim Tarihi"
              name="delivery_date"
              type="date"
              value={service.delivery_date || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Yapılan İşlem */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Yapılan İşlem"
            name="service_operation"
            value={service.service_operation || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Box>

        {/* Arıza açıklaması */}
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Arıza"
            name="issue"
            value={service.issue || ""}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
            error={!!errors.issue}
            helperText={errors.issue}
          />
        </Box>

        {/* Kaydet butonu */}
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
