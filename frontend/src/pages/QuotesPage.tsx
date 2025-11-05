import { useState } from "react";
import QuoteList from "./QuoteList";
import NewQuoteModal from "../components/NewQuoteModal";

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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (data: any) => {
    // Toplam teklif tutarı (kategori toplamlarına göre)
    const total = data.categories.reduce(
      (sum: number, cat: any) => sum + cat.totalPrice,
      0
    );

    const newQuote = {
      id: quotes.length + 1,
      customer: data.customerName,
      date: data.date,
      total,
      categories: data.categories, // ✅ sadece kategoriler gönderiliyor
    };

    setQuotes([...quotes, newQuote]);
    setModalOpen(false);
  };

  console.log("data", quotes);

  return (
    <>
      <QuoteList onNew={() => setModalOpen(true)} quotes={quotes} />

      <NewQuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
