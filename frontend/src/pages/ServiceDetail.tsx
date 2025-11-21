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

interface ServiceCompany {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
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
  service: {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
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

  // Tarih formatı helper fonksiyonu
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      // Invalid date check
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return dateString;
      }
      return date.toLocaleString("tr-TR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return dateString;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      // Invalid date check
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return dateString;
      }
      return date.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return dateString;
    }
  };

  // Alan adlarını Türkçe'ye çevir
  const translateFieldName = (fieldName: string) => {
    const translations: Record<string, string> = {
      'customer': 'Müşteri',
      'brand': 'Marka',
      'model': 'Model',
      'serial_number': 'Seri Numarası',
      'accessories': 'Aksesuar',
      'arrival_date': 'Geliş Tarihi',
      'issue': 'Arıza',
      'service': 'Servis Firması',
      'service_send_date': 'Servise Gönderim Tarihi',
      'service_operation': 'Yapılan İşlem',
      'service_return_date': 'Servisten Geliş Tarihi',
      'delivery_date': 'Teslim Tarihi',
      'status': 'Durum',
      'updated_at': 'Güncellenme Tarihi',
      'created_user': 'Kayıt Yapan Kullanıcı'
    };
    return translations[fieldName] || fieldName;
  };

  // Durum değerlerini Türkçe'ye çevir
  const translateStatus = (status: string) => {
    const statusTranslations: Record<string, string> = {
      'pending': 'Beklemede',
      'sent_to_service': 'Servise Gitti',
      'returned_from_service': 'Servisten Geldi',
      'delivered': 'Teslim Edildi'
    };
    return statusTranslations[status] || status;
  };

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [serviceCompanies, setServiceCompanies] = useState<ServiceCompany[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);

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

      // Customer, brand ve service seçimlerini set et
      setSelectedCustomer(
        data.customer ? { id: data.customer.id, company_name: data.customer.company_name } : null
      );

      setSelectedBrand(
        data.brand ? { id: data.brand.id, name: data.brand.name } : null
      );

      setSelectedService(
        data.service ? { id: data.service.id, name: data.service.name } : null
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

  const searchServiceCompanies = async (searchTerm: string) => {
    try {
      const response = await API.get(`ServiceCompanies/?search=${searchTerm}`);
      setServiceCompanies(response.data.results);
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
    
    // Servis firması kontrolü
    if (!selectedService) {
      setServiceError("Servis firması seçilmesi zorunludur.");
      return;
    }
    setServiceError(null);
    
    setSaving(true);
    try {
      const postData = {
        ...service,
        customer_id: selectedCustomer?.id || null,
        brand_id: selectedBrand?.id || null,
        service_id: selectedService?.id || null,
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Servis Detayı #{service.id}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Son Güncelleme: {formatDateTime(service.updated_at)}
        </Typography>
      </Box>

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
          <Box sx={{ flex: "1 1 200px" }}>
            <Autocomplete
              options={serviceCompanies}
              value={selectedService}
              onChange={(_, newValue) => {
                setSelectedService(newValue);
                if (newValue) {
                  setServiceError(null);
                }
              }}
              onInputChange={(_, input) => input && searchServiceCompanies(input)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Servis Firması"
                  required
                  error={!!serviceError}
                  helperText={serviceError}
                  fullWidth 
                />
              )}
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
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Kullanıcı: {log.user}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                  Tarih: {formatDateTime(log.change_date)}
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {Object.entries(log.changed_fields).map(([fieldName, fieldValue]) => {
                    const renderValue = (value: any) => {
                      console.log('Rendering value:', fieldName, value); // Debug log
                      
                      if (value === null || value === undefined) return "--";
                      
                      if (typeof value === 'object') {
                        if (value.old !== undefined && value.new !== undefined) {
                          const formatSingleValue = (val: any) => {
                            if (val === null || val === undefined) return "--";
                            if (typeof val === 'object') {
                              return val.str || JSON.stringify(val);
                            }
                            if (typeof val === 'string') {
                              // Status translation
                              if (fieldName === 'status') {
                                return translateStatus(val);
                              }
                              // ISO datetime format check
                              if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                                return formatDateTime(val);
                              }
                              // Date only format check
                              if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                return formatDate(val);
                              }
                            }
                            return String(val);
                          };
                          
                          const oldVal = formatSingleValue(value.old);
                          const newVal = formatSingleValue(value.new);
                          
                          return (
                            <span>
                              <span style={{ color: '#d32f2f', textDecoration: 'line-through' }}>
                                {oldVal}
                              </span>
                              {' → '}
                              <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                {newVal}
                              </span>
                            </span>
                          );
                        }
                        return JSON.stringify(value);
                      }
                      
                      // String value formatting
                      if (typeof value === 'string') {
                        // Status translation
                        if (fieldName === 'status') {
                          return translateStatus(value);
                        }
                        // ISO datetime format check
                        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                          return formatDateTime(value);
                        }
                        // Date only format check
                        if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                          return formatDate(value);
                        }
                      }
                      
                      return String(value);
                    };
                    
                    return (
                      <Typography key={fieldName} variant="body2" sx={{ mb: 0.5 }}>
                        <strong>{translateFieldName(fieldName)}:</strong> {renderValue(fieldValue)}
                      </Typography>
                    );
                  })}
                </Box>
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
