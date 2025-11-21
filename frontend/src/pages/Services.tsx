import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

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

interface ServiceRecord {
  id: number;
  customer: Customer;
  brand: Brand;
  model: string;
  serial_number: string;
  accessories: string | null;
  arrival_date: string;
  issue: string;
  service_name: string;
  service_send_date: string | null;
  service_operation: string | null;
  service_return_date: string | null;
  delivery_date: string | null;
  created_user: number | null;
  status: 'pending' | 'sent_to_service' | 'returned_from_service' | 'delivered';
  updated_at: string;
  logs: any[];
}

const Services = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await API.get("Services/");
      console.log(response.data.results);
      setRecords(response.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (id: number) => {
    navigate(`/services/${id}`);
  };

  const handleNewRecord = () => {
    navigate("/services/new"); // Yeni kayıt sayfasına yönlendirme
  };

  const filteredRecords = records.filter((record) => {
    const searchLower = search.toLowerCase();
    return (
      record.customer.company_name.toLowerCase().includes(searchLower) ||
      `${record.brand.name} ${record.model}`.toLowerCase().includes(searchLower) ||
      (record.serial_number?.toLowerCase() || "").includes(searchLower) ||
      record.service_name.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Servis Kayıtları
      </Typography>
      {/* Arama Alanı */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Ara (Müşteri / Marka-Model / Seri No / Servis)"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 400 },
            "& .MuiInputBase-root": {
              height: 50, // input yüksekliği
              display: "flex",
              alignItems: "center", // input içindeki texti ortalar
            },
            "& .MuiInputLabel-root": {
              top: "-2px", // label’ı ortalamak için küçük tweak
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewRecord}
          sx={{ height: 36 }}
        >
          Yeni Kayıt Ekle
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: "75vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Müşteri Adı</TableCell>
              <TableCell>Marka / Model</TableCell>
              <TableCell>Seri No</TableCell>
              <TableCell>Servis İsmi</TableCell>
              <TableCell>Arıza</TableCell>
              <TableCell>Servise Gönderim Tarihi</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Detay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => {
              let durumColor = "warning.main";
              let durumText = "";
              
              switch (record.status) {
                case 'pending':
                  durumColor = "warning.main";
                  durumText = "Beklemede";
                  break;
                case 'sent_to_service':
                  durumColor = "error.main";
                  durumText = "Servise Gitti";
                  break;
                case 'returned_from_service':
                  durumColor = "info.main";
                  durumText = "Servisten Geldi";
                  break;
                case 'delivered':
                  durumColor = "success.main";
                  durumText = "Teslim Edildi";
                  break;
              }

              return (
                <TableRow key={record.id}>
                  <TableCell>{record.customer.company_name}</TableCell>
                  <TableCell>{`${record.brand.name} ${record.model}`}</TableCell>
                  <TableCell>{record.serial_number}</TableCell>
                  <TableCell>{record.service_name}</TableCell>
                  <TableCell>{record.issue}</TableCell>
                  <TableCell>{record.service_send_date}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: durumColor, fontWeight: "bold" }}>
                      {durumText}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      // color="primary"
                      onClick={() => handleViewDetail(record.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Services;
