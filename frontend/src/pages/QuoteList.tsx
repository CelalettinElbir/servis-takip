import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { generateQuotePdf } from "../pdf/generateQuotePdf";

interface Quote {
  id: number;
  customer: string;
  date: string;
  total: number;
  categories: {
    title: string;
    totalPrice: number;
    items: {
      product: string;
      description: string;
      qty: number;
      price: number;
    }[];
  }[];
}

interface QuoteListProps {
  onNew: () => void;
  quotes: Quote[];
}

export default function QuoteList({ onNew, quotes }: QuoteListProps) {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Başlık ve Buton */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md z-10">
        <h1 className="text-2xl font-bold">Teklif Listesi</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Teklif Oluştur
        </Button>
      </div>

      {/* Tablo */}
      <div className="flex-1 overflow-auto bg-gray-100 m-8">
        <TableContainer
          component={Paper}
          className="w-full min-h-full "
          style={{ minHeight: "100%", maxHeight: "100%" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Müşteri</b>
                </TableCell>
                <TableCell>
                  <b>Tarih</b>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <b>İşlemler</b>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.customer}</TableCell>
                  <TableCell>{q.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        generateQuotePdf({
                          customerName: q.customer,
                          date: q.date,
                          categories: q.categories.map((c) => ({
                            title: c.title,
                            items: c.items.map((i: any) => ({
                              product: i.product,
                              description: i.description,
                              qty: i.qty,
                              price: i.price,
                            })),
                          })),
                        })
                      }
                    >
                      PDF Gör / İndir
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="warning">
                      Düzenle
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="error">
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
