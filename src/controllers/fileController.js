const multer = require("multer");
const ExcelJS = require("exceljs");
const ImportedData = require("../models/ImportedData");
const { validateData } = require("../utils/validation");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.xlsx$/)) {
      return cb(new Error("Only .xlsx files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("file");

exports.uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);

      const sheetNames = workbook.worksheets.map((sheet) => sheet.name);
      const sheetDataMap = {};
      const validationErrors = [];

      workbook.worksheets.forEach((worksheet) => {
        const sheetName = worksheet.name;
        const sheetData = [];
        const errors = [];

        let headers = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) {
            headers = row.values.map((val) => val || "").slice(1);
          } else {
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = row.getCell(index + 1).value || "";
            });
            sheetData.push(rowData);
          }
        });

        const sheetErrors = validateData(sheetName, sheetData);
        if (sheetErrors.length > 0) {
          sheetErrors.forEach((error) => {
            const row = sheetData[error.row - 1];
            if (row) {
              row.errors = row.errors || [];
              row.errors.push(error.error);
            }
          });
          validationErrors.push({ sheet: sheetName, errors: sheetErrors });
        }
        sheetDataMap[sheetName] = sheetData;
      });


      res.json({
        message: "File processed successfully",
        sheetNames,
        sheetData: sheetDataMap,
        validationErrors,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.importData = async (req, res) => {
  try {
    const { rows } = req.body;
    const validRows = rows.filter((row) => {
      return (
        row.Name &&
        row.Amount &&
        !isNaN(row.Amount) &&
        row.Amount > 0 &&
        row.Date &&
        new Date(row.Date).getMonth() === new Date().getMonth() &&
        ["Yes", "No"].includes(row.Verified)
      );
    });

    const savedData = await ImportedData.insertMany(validRows);

    res.json({
      message: "Data imported successfully",
      importedCount: savedData.length,
      skippedCount: rows.length - validRows.length,
      importedRows: validRows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
