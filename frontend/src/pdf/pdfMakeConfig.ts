// pdfMakeConfig.ts
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// pdfMake'e font dosyalarını tanıt
pdfMake.vfs = pdfFonts.vfs;


export default pdfMake;
