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
    status: "beklemede",
  });

  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

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

  const fetchBrands = async () => {
    try {
      const response = await API.get("brands/");
      setBrands(response.data.results);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

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
              onChange={(event, newValue) => {
                setSelectedCustomer(newValue);
                setService((prev) => ({
                  ...prev,
                  musteri_adi: newValue?.company_name || "",
                }));
              }}
              onInputChange={(event, newInputValue) => {
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
              value={brands.find((b) => b.name === service.marka) || null}
              onChange={(_, newValue) =>
                setService((prev) => ({
                  ...prev,
                  marka: newValue ? newValue.name : "",
                }))
              }
              getOptionLabel={(option) => option.name}
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
              name="seri_no"
              value={service.seri_no}
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
              name="servis_ismi"
              value={service.servis_ismi}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 250px" }}>
            <TextField
              label="Aksesuar"
              name="aksesuar"
              value={service.aksesuar || ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: "1 1 200px" }}>
            <TextField
              label="Geliş Tarihi"
              name="gelis_tarihi"
              type="date"
              value={service.gelis_tarihi}
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
            name="ariza"
            value={service.ariza}
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
