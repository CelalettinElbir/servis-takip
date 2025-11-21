import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
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

interface NewService {
  id?: number;
  customer_id: number | null;
  brand_id: number | null;
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
    service_name: "",
    service_send_date: null,
    service_operation: null,
    service_return_date: null,
    delivery_date: null,
    status: "pending"
  });

  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  setSaving(true);
  try {
    const postData = {
      ...service,
      customer_id: selectedCustomer?.id || null,
      brand_id: selectedBrand?.id || null,
    };
    await API.post("Services/", postData);
    alert("Yeni kayıt başarıyla oluşturuldu!");
    console.log("Gönderilen veri:", postData);
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
                <TextField {...params} label="Müşteri Adı" fullWidth />
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
                <TextField {...params} label="Marka" fullWidth />
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
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Seri No"
              name="serial_number"
              value={service.serial_number || ""}
              onChange={handleChange}
              fullWidth
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
            <TextField
              label="Servis İsmi"
              name="service_name"
              value={service.service_name}
              onChange={handleChange}
              fullWidth
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
              InputLabelProps={{ shrink: true }}
            />
          </Box>
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
