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

interface ServiceRecord {
  id: number;
  musteri_adi: string;
  marka: string;
  model: string;
  seri_no: string;
  servis_ismi: string;
  ariza: string;
  servise_gonderim_tarihi: string | null;
  servisten_gelis_tarihi: string | null;
  teslim_tarihi: string | null;
  status: string;
  gelis_tarihi: string;
  created_user: number | null;
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
      record.musteri_adi.toLowerCase().includes(searchLower) ||
      `${record.marka} ${record.model}`.toLowerCase().includes(searchLower) ||
      record.seri_no.toLowerCase().includes(searchLower) ||
      record.servis_ismi.toLowerCase().includes(searchLower)
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
              let durumText = record.status;
              debugger;
              switch (record.status) {
                case 'beklemede':
                  durumColor = "warning.main";
                  durumText = "Beklemede";
                  break;
                case 'servise_gitti':
                  durumColor = "error.main";
                  durumText = "Servise Gitti";
                  break;
                case 'servisten_geldi':
                  durumColor = "info.main";
                  durumText = "Servisten Geldi";
                  break;
                case 'teslim_edildi':
                  durumColor = "success.main";
                  durumText = "Teslim Edildi";
                  break;
              }

              return (
                <TableRow key={record.id}>
                  <TableCell>{record.musteri_adi}</TableCell>
                  <TableCell>{`${record.marka} ${record.model}`}</TableCell>
                  <TableCell>{record.seri_no}</TableCell>
                  <TableCell>{record.servis_ismi}</TableCell>
                  <TableCell>{record.ariza}</TableCell>
                  <TableCell>{record.servise_gonderim_tarihi}</TableCell>
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
