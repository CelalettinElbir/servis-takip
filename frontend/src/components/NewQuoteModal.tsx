// src/components/NewQuoteModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, FieldArray, Form } from "formik";
import { quoteSchema } from "../utils/validationSchema";

interface FormItem {
  product: string;
  description: string;
  qty: string; // formda string, kullanıcı boş bırakabilsin
  price: string;
}
interface FormCategory {
  title: string;
  items: FormItem[];
}
type FormValues = {
  customerName: string;
  date: string;
  categories: FormCategory[];
};

interface QuoteItem {
  product: string;
  description: string;
  qty: number;
  price: number;
}
interface Category {
  title: string;
  items: QuoteItem[];
  totalPrice?: number;
}

interface NewQuoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (quoteData: {
    customerName: string;
    date: string;
    categories: Category[];
  }) => void;
}

export default function NewQuoteModal({
  open,
  onClose,
  onSave,
}: NewQuoteModalProps) {
  const initialValues: FormValues = {
    customerName: "",
    date: "",
    categories: [
      {
        title: "",
        items: [{ product: "", description: "", qty: "", price: "" }],
      },
    ],
  };

  const handleSubmitForm = (values: FormValues) => {
    const formatted = {
      customerName: values.customerName,
      date: values.date,
      categories: values.categories.map((cat) => {
        const items: QuoteItem[] = cat.items.map((it) => ({
          product: it.product,
          description: it.description,
          qty: Number(it.qty),
          price: Number(it.price),
        }));
        const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);
        return { title: cat.title, items, totalPrice };
      }),
    };

    console.log("🔥 Kaydedilen Veri:", formatted);
    onSave(formatted);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Yeni Teklif Oluştur</DialogTitle>

      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={quoteSchema}
        onSubmit={handleSubmitForm}
      >
        {({ values, errors, touched, handleChange }) => {
          // Formik'in nested errors/touched yapısı TS için sert olabilir.
          // Burada minimal 'any' alias kullanıyoruz — çalışır ve TS hatası vermez.
          const errorsAny = errors as any;
          const touchedAny = touched as any;

          return (
            <Form>
              <DialogContent className="space-y-6 mt-2">
                {/* Müşteri Adı */}
                <TextField
                  fullWidth
                  label="Müşteri Adı"
                  name="customerName"
                  value={values.customerName}
                  onChange={handleChange}
                  error={Boolean(
                    touchedAny.customerName && errorsAny.customerName
                  )}
                  helperText={touchedAny.customerName && errorsAny.customerName}
                  margin="normal"
                />

                {/* Tarih */}
                <TextField
                  fullWidth
                  type="date"
                  label="Teklif Tarihi"
                  name="date"
                  InputLabelProps={{ shrink: true }}
                  value={values.date}
                  onChange={handleChange}
                  error={Boolean(touchedAny.date && errorsAny.date)}
                  helperText={touchedAny.date && errorsAny.date}
                />

                {/* Categories */}
                <FieldArray name="categories">
                  {({ remove: removeCategory, push: pushCategory }) => (
                    <>
                      {values.categories.map((cat, catIndex) => {
                        const catError = errorsAny?.categories?.[catIndex];
                        const catTouched = touchedAny?.categories?.[catIndex];
                        return (
                          <div
                            key={catIndex}
                            className="border p-4 rounded-md space-y-2"
                          >
                            {/* Kategori Başlık */}
                            <TextField
                              fullWidth
                              label="Kategori Adı"
                              name={`categories[${catIndex}].title`}
                              value={values.categories[catIndex].title}
                              onChange={handleChange}
                              error={Boolean(
                                catTouched?.title && catError?.title
                              )}
                              helperText={catTouched?.title && catError?.title}
                            />

                            {/* ITEMS */}
                            <FieldArray name={`categories[${catIndex}].items`}>
                              {({ remove: removeItem, push: pushItem }) => (
                                <>
                                  {cat.items.map((item, itemIndex) => {
                                    const itemError =
                                      catError?.items &&
                                      catError.items[itemIndex];
                                    const itemTouched =
                                      catTouched?.items &&
                                      catTouched.items[itemIndex];

                                    return (
                                      <div
                                        key={itemIndex}
                                        className="grid grid-cols-5 gap-2 items-center"
                                      >
                                        <TextField
                                          label="Ürün"
                                          name={`categories[${catIndex}].items[${itemIndex}].product`}
                                          value={item.product}
                                          onChange={handleChange}
                                          error={Boolean(
                                            itemTouched?.product &&
                                              itemError?.product
                                          )}
                                          helperText={
                                            itemTouched?.product &&
                                            itemError?.product
                                          }
                                        />

                                        <TextField
                                          label="Açıklama"
                                          name={`categories[${catIndex}].items[${itemIndex}].description`}
                                          value={item.description}
                                          onChange={handleChange}
                                        />

                                        <TextField
                                          label="Adet / Metre"
                                          name={`categories[${catIndex}].items[${itemIndex}].qty`}
                                          value={item.qty}
                                          onChange={handleChange}
                                          error={Boolean(
                                            itemTouched?.qty && itemError?.qty
                                          )}
                                          helperText={
                                            itemTouched?.qty && itemError?.qty
                                          }
                                        />

                                        <TextField
                                          label="Birim Fiyat"
                                          name={`categories[${catIndex}].items[${itemIndex}].price`}
                                          value={item.price}
                                          onChange={handleChange}
                                          error={Boolean(
                                            itemTouched?.price &&
                                              itemError?.price
                                          )}
                                          helperText={
                                            itemTouched?.price &&
                                            itemError?.price
                                          }
                                        />

                                        <IconButton
                                          color="error"
                                          onClick={() => removeItem(itemIndex)}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </div>
                                    );
                                  })}

                                  <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() =>
                                      pushItem({
                                        product: "",
                                        description: "",
                                        qty: "",
                                        price: "",
                                      })
                                    }
                                  >
                                    Kategoriye Ürün Ekle
                                  </Button>
                                </>
                              )}
                            </FieldArray>

                            {/* Kategori sil (en az 1 kategori bırakmak istersen check ekle) */}
                            <div style={{ marginTop: 8 }}>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => removeCategory(catIndex)}
                                disabled={values.categories.length <= 1}
                              >
                                Kategoriyi Sil
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      <Button
                        variant="contained"
                        className="bg-green-600"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          pushCategory({
                            title: "",
                            items: [
                              {
                                product: "",
                                description: "",
                                qty: "",
                                price: "",
                              },
                            ],
                          })
                        }
                        style={{ marginTop: 12 }}
                      >
                        Yeni Kategori Ekle
                      </Button>
                    </>
                  )}
                </FieldArray>
              </DialogContent>

              <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button
                  variant="contained"
                  className="bg-blue-600"
                  type="submit"
                >
                  Kaydet
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
}
