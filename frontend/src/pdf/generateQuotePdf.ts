import pdfMake from "./pdfMakeConfig";
import logoBase64 from "../assets/logoBase64";

const COMPANY_INFO = {
  bilgi: "info@netlineyazilim.com",
  telefon: "0422 323 30 30",
  web: "www.netlineyazilim.com",
  adres:
    "Niyazi Mah. Cezaevi Sk. İlhanlar İş Merkezi 2 No:10 K.2 D.3 Battalgazi / MALATYA ",
};

interface QuoteItem {
  product: string;
  description: string;
  qty: number;
  price: number;
}

interface QuoteCategory {
  title: string;
  items: QuoteItem[];
}

interface QuoteData {
  customerName: string;
  date: string;
  categories: QuoteCategory[];
}

export const generateQuotePdf = (data: QuoteData) => {
  // ✅ 1. SAYFA (ORİJİNALİN AYNISI)

  const rawDate = new Date(data.date); // string ise Date objesine çeviriyoruz
  const day = rawDate.getDate().toString().padStart(2, "0"); // gün 2 haneli
  const month = (rawDate.getMonth() + 1).toString().padStart(2, "0"); // ay 2 haneli, JS ay 0-11
  const year = rawDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`; // dd/mm/yyyy

  const page1 = [
    {
      table: {
        widths: [200, "*"],
        body: [
          [
            { image: `data:image/png;base64,${logoBase64}`, width: 200 },
            {
              table: {
                widths: [60, 150],
                body: [
                  [
                    {
                      text: "Bilgi:",
                      bold: true,
                      alignment: "right",
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: COMPANY_INFO.bilgi,
                      color: "blue",
                      decoration: "underline",
                      link: `mailto:${COMPANY_INFO.bilgi}`,
                    },
                  ],
                  [
                    {
                      text: "Telefon:",
                      bold: true,
                      alignment: "right",
                      margin: [0, 0, 0, 0],
                    },
                    { text: COMPANY_INFO.telefon },
                  ],
                  [
                    {
                      text: "Web:",
                      bold: true,
                      alignment: "right",
                      margin: [0, 0, 0, 0],
                    },
                    {
                      text: COMPANY_INFO.web,
                      color: "blue",
                      decoration: "underline",
                      link: `https://${COMPANY_INFO.web}`,
                    },
                  ],
                  [
                    {
                      text: "Adres:",
                      bold: true,
                      alignment: "right",
                      margin: [0, 0, 0, 0],
                    },
                    { text: COMPANY_INFO.adres },
                  ],
                ],
              },
              layout: "noBorders",
              // alignment: "right",
              margin: [110, 0, 0, 0],
            },
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 20],
    },
    {
      text: formattedDate,
      alignment: "right",
      fontSize: 12,
      margin: [0, 0, 0, 15], // alt boşluk
    },
    {
      text: "NETLINE YAZILIM TEKLİF DOSYASI",
      style: "header",
      alignment: "center",
      margin: [0, 0, 0, 20], // header alt boşluğu
    },

    {
      text: [
        "Netline Yazılım olarak yenilikçi teknolojiler konusunda müşterilerimizi bilinçlendirmek ve IT altyapılarını güncel, hızla gelişen teknoloji dünyasında yarı yolda bırakmayacak, yapılan yatırımların uzun süreler karşılığının alınacağını şekilde Bilgi Teknolojileri mimarileri inşa etmek birincil önceliğimiz.\n\n",

        "Bu vizyon doğrultusunda müşterilerimize en iyi hizmeti verebilmek adına konusunda uzman, en üst düzey sertifikasyonlara sahip ekiplere kadromuzda yer veriyoruz.\n\n",

        "Değerlendirmeniz sonucu doğabilecek her türlü sorunu yanıtlamak üzere hazır olduğumuzu bildirir,\n",

        { text: "Netline Yazılım", bold: true, fontSize: 12 },
        " ve ",
        { text: `${data.customerName}`, bold: true, fontSize: 12 },
        " arasında bu uzun süreli iş birliğinin devam etmesini dileriz.\n\n",

        "Saygılarımızla,\n\n",
        "Seydi ÖZKAN\n",
        { text: "NETLINE YAZILIM" },
      ],
      margin: [0, 10, 0, 10],
      fontSize: 11,
      lineHeight: 1.2,
    },

    { text: "", pageBreak: "after" },
  ];

  // ✅ KATEGORİ TABLOLARI (HER BİRİ AYRI SAYFA)
  const categoryPages: any[] = [];

  data.categories.forEach((cat, index) => {
    const tableBody = [
      [
        { text: "Ürün", bold: true, fillColor: "#e6e6e6" },
        { text: "Açıklama", bold: true, fillColor: "#e6e6e6" },
        { text: "Adet/Metre", bold: true, fillColor: "#e6e6e6" },
        { text: "Birim Fiyat", bold: true, fillColor: "#e6e6e6" },
        { text: "Toplam", bold: true, fillColor: "#e6e6e6" },
      ],
      ...cat.items.map((item) => {
        const total = item.qty * item.price;
        return [
          item.product,
          item.description,
          item.qty,
          `$ ${item.price} `,
          `$ ${total} `,
        ];
      }),
      // ✅ Kategori toplam satırı tabloya eklendi
      [
        { text: "", colSpan: 3, border: [false, true, false, false] },
        {},
        {},
        {
          text: "Genel Toplam",
          bold: true,
          fillColor: "#e6e6e6",
          color: "red",
        },
        {
          text: `$ ${cat.items.reduce((s, i) => s + i.qty * i.price, 0)}`,
          bold: true,
          color: "red",
          fillColor: "#e6e6e6",
        },
      ],
    ];
 // @ts-ignore
    const categoryTotal = cat.items.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

    categoryPages.push(
      // Üst bilgi kısmı
      // {
      //   stack: [
      //     // Yazı üstte, sağa hizalanmış
      //     {
      //       columns: [
      //         { text: "" }, // solda boşluk
      //         {
      //           text: `Netline Yazılım ve ${data.customerName}`,
      //           bold: true,
      //           fontSize: 10,
      //           alignment: "right",
      //           margin: [0, 0, 0, 2], // alt boşluk ile çizgiye yaklaş
      //         },
      //       ],
      //     },
      //     // Kırmızı ve kalın çizgi
      //     {
      //       canvas: [
      //         {
      //           type: "rect", // dolu dikdörtgen
      //           x: 0,
      //           y: 0,
      //           w: 561, // genişlik (sayfa genişliği)
      //           h: 5, // yükseklik = çizgi kalınlığı
      //           color: "red", // renk
      //         },
      //       ],
      //       absolutePosition: { x: 17, y: 52 }, // x: soldan başla, y: üstten pozisyon
      //       margin: [0, 0, 0, 40], // çizgi alt boşluğu
      //     },
      //   ],
      // },
      { text: cat.title, style: "subheader", margin: [0, 0, 0, 10] },
      {
        text: "Fiyat Teklifi",
        bold: true,
        fontSize: 14,
        margin: [0, 0, 0, 10],
      },

      {
        table: { widths: [100, "*", 40, 80, 70], body: tableBody },
        layout: {
          paddingTop: function () {
            return 6;
          },
          paddingBottom: function () {
            return 6;
          },
          hLineWidth: () => 0.1,
          vLineWidth: () => 0.1,
        },
      },

      index !== data.categories.length - 1
        ? { text: "", pageBreak: "after" }
        : {}
    );
  });

  // ✅ 3. SAYFA – ŞARTLAR (AYNI BIRAKTIK)

  // Üst bilgi + kırmızı çizgi
  const page3 = [
    {
      text: "Teklif Şartları",
      style: "subheader",
      margin: [0, 0, 0, 0],
      pageBreak: "before",
    },

    // Fiyat
    { text: "Fiyat", bold: true, margin: [0, 5, 0, 5] },
    {
      ul: [
        {
          text: [
            { text: "Fiyatlarımıza KDV dahil değildir.", bold: true },
            " Fiyatlarımız USD ve/veya EURO cinsinden verilmiştir.", // normal yazı
          ],
        },
      ],
      margin: [20, 0, 0, 5], // içe kaydırma
    },

    // Ödeme
    { text: "Ödeme", bold: true, margin: [0, 5, 0, 5] },
    {
      ul: [
        "Siparişte KDV dahil toplam tutarın %30’u tahsil edilir.",
        "Mal tesliminde karşılıklı anlaşılan şekilde (USD/EURO/TL) Çek teslim edilecektir.",
        "Ödemelerin döviz cinsinden yapılması durumunda ilgili ödemeler muhasebe kayıtlarına ödeme tarihindeki T.C. Merkez Bankası efektif döviz satış kurundan TL'ye çevrilerek alınacaktır.",
        "Ödemelerin TL olarak yapılması durumunda döviz cinsinden bakiyenin takip edilebilmesi için dövize dönüşüm kuru ödeme tarihindeki T.C. Merkez Bankası efektif döviz satış kuru olacaktır.",
        "Kesilen döviz cinsinden faturaların TL'ye çevrilmesinde ve muhasebe kayıtlarına alınmasında fatura tarihindeki T.C. Merkez Bankası efektif döviz satış kuru esas alınacaktır.",
        "TL olarak tahsil edilen ödemelerde ödeme gününde oluşacak kur farkı ayrıca kur farkı faturası olarak MÜŞTERİYE yansıtılır.",
      ],
      margin: [20, 0, 0, 5],
    },

    // Teslimat
    { text: "Teslimat", bold: true, margin: [0, 5, 0, 5] },
    {
      ul: [
        { text: "Ürünler, sipariş onayının alınmasını müteakip:" },
        {
          text: [
            { text: "Donanım/Yazılım Ürünlerinde: ", bold: true },
            "Distribütör veya üretici stok durumuna göre derhal satın alması yapılarak 2 iş günü içinde; stokta olmaması durumunda 4 ila 6 hafta içinde teslim edilir.",
          ],
          margin: [20, 0, 0, 0], // soldan girinti
        },
        {
          text: [
            { text: "Teklifte yer alan Ürün/Hizmet/Yazılım ", bold: true },
            "karşılıklı yapılacak sözleşmede yer alacak ve sözleşme karşılıklı imzalanacaktır.",
          ],
          margin: [20, 0, 0, 0], // soldan girinti
        },
        {
          text: "Hizmetler, Netline Yazılım tarafından proje kapsamında yerine getirilir.",
        },
      ],
      margin: [20, 0, 0, 5],
    },

    // Genel Şartlar
    { text: "Genel Şartlar", bold: true, margin: [0, 5, 0, 5] },
    {
      ul: [
        "Teklifimiz sadece firmanıza özel olup, üçüncü kişi ve kurumlarla paylaşılamaz.",
        "Toplam hatalarında birim fiyatlar esas alınır.",
        "Her türlü sözleşme ve harç maliyeti teklifimize dahil değildir.",
        "Fiyatlar tüm teklifin kabul edilmesi durumunda geçerlidir. Teklif kapsamındaki ürün ve/veya hizmetlerin parça parça alınması durumunda yeniden fiyatlandırma yapılabilir.",
        "Tüm sipariş, Sipariş Formu veya aşağıda bulunan onay hanesinin doldurulması ve tarafımıza ulaştırılması ile bir seferde alınmaktadır.",
        "Donanım ve yazılım üreticilerinin veya distribütörlerinin yapacağı fiyat değişiklikleri tarafınıza bildirilerek uygulanacak olup, teslim tarihleri ve ücretleri üretici veya distribütör stok durumuna göre teklif kabul tarihinde kesinleşecektir.",
        "Bu teklifimiz yetkili imza ve kaşe ile onayınız durumunda tüm detay ve koşulları ile kesin siparişiniz olarak işleme alınır.",
        "Sipariş formuna yazılı ve kaşe-imzalı onay gelmesinden sonra iptal edilmek istenen siparişlerde ürünün liste fiyatı üzerinden %25 cayma bedeli ödemeyi müşteri gayrıkabili rücu olarak kabul etmiştir. Talep edilmesi halinde liste fiyatları müşteri ile paylaşılacaktır.",
      ],
      margin: [20, 0, 0, 5],
    },

    // Teklif Onayı
    { text: "Teklif Onayı", bold: true, margin: [0, 5, 0, 5], fontSize: 16 },
    {
      text: [
        "İş bu yukarıda yazılı olan teklif ve teklif şartları okunmuş olup tarafımızdan iş bu imza ve kaşe ile onaylanmıştır.\n\n",
        "(Bu teklif onaylandıktan sonra lütfen +90 (422) 323 30 30 numaralı faks’a gönderiniz veya taratarak ",
        {
          text: "info@netlineyazilim.com",
          color: "blue",
          decoration: "underline",
          link: "mailto:info@netlineyazilim.com",
        },
        " mail adresine gönderiniz.)",
      ],
      fontSize: 10,
      lineHeight: 1.2,
      margin: [0, 5, 0, 5],
    },

    // Tarih, Yetkili Ad Soyad, Kaşe & İmza
    { text: "Tarih :", bold: true, margin: [0, 5, 0, 5], fontSize: 12 },
    {
      text: "Yetkili Ad, Soyad :",
      bold: true,
      margin: [0, 5, 0, 5],
      fontSize: 12,
    },
    { text: "Kaşe ve İmza :", bold: true, margin: [0, 5, 0, 5], fontSize: 12 },
  ];

  // ✅ PDF BİRLEŞTİRME
  const documentDefinition = {
    content: [...page1, ...categoryPages, ...page3],
    styles: {
      header: { fontSize: 20, bold: true },
      subheader: { fontSize: 18, bold: true },
    },
    defaultStyle: { fontSize: 10 },

    // ✅ Header ekleme
    header: function (
      currentPage: number,
      pageSize: { width: number; height: number }
    ) {
      // İlk sayfada header göstermek istemiyorsan
      if (currentPage === 1) return {};

      const yPosition = 30; // yazının üstten pozisyonu
      const lineOffset = 12; // yazının altından çizgiye mesafe

      return {
        stack: [
          {
            columns: [
              { text: "" }, // solda boşluk
              {
                text: `Netline Yazılım ve ${data.customerName}`,
                bold: true,
                fontSize: 10,
                alignment: "right",
                margin: [0, 0, 0, 0],
              },
            ],
            margin: [0, yPosition, 30, 0], // sol, üst, sağ, alt
          },
          {
            canvas: [
              {
                type: "rect", // dolu dikdörtgen
                x: 0,
                y: 0,
                w: pageSize.width - 34, // genişlik (sayfa genişliği)
                h: 5, // yükseklik = çizgi kalınlığı
                color: "red", // renk
              },
            ],
            absolutePosition: { x: 17, y: yPosition + lineOffset }, // x: soldan başla, y: üstten pozisyon
            //  margin: [0, 0, 0, 40], // çizgi alt boşluğu
          },
        ],
      };
    },

    // ✅ Footer ekleme
    footer: function (
      currentPage: number,
      pageCount: number,
      pageSize: { width: number; height: number }
    ) {
      if (currentPage === 1) return {}; // ilk sayfada footer yok

      const lineHeight = 2; // header ile aynı kalınlık
      const lineX = 17; // header ile aynı x pozisyonu
      const lineWidth = pageSize.width - 34; // header ile aynı genişlik

      return {
        stack: [
          {
            canvas: [
              {
                type: "rect", // dolu dikdörtgen kullanıyoruz
                x: lineX,
                y: 0,
                w: lineWidth,
                h: lineHeight,
                color: "red",
              },
            ],
            margin: [0, 0, 0, 5], // çizgi alt boşluğu
          },
          {
            text: `Sayfa ${currentPage} / ${pageCount}`,
            alignment: "center",
            fontSize: 9,
            color: "gray",
          },
        ],
        margin: [0, 0, 0, 20],
      };
    },

    pageMargins: [30, 80, 40, 30], // sol, üst, sağ, alt,
  };

  pdfMake.createPdf(documentDefinition).open();
};
