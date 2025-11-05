import * as Yup from "yup";

export const quoteSchema = Yup.object().shape({
  customerName: Yup.string().required("Müşteri adı zorunlu"),
  date: Yup.string().required("Tarih zorunlu"),
  categories: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Kategori adı zorunlu"),
        items: Yup.array().of(
          Yup.object().shape({
            product: Yup.string().required("Ürün adı zorunlu"),
            description: Yup.string().required("Açıklama zorunlu"),
            qty: Yup.number()
              .typeError("Geçerli sayı girin")
              .positive("0'dan büyük olmalı")
              .required("Adet/metre zorunlu"),
            price: Yup.number()
              .typeError("Geçerli fiyat girin")
              .positive("0'dan büyük olmalı")
              .required("Fiyat zorunlu"),
          })
        ),
      })
    )
    .min(1),
});
