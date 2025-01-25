module.exports = {
  sheetConfigs: {
    Sheet1: {
      columns: {
        Name: "Name",
        Amount: "Amount",
        Date: "Date",
        Verified: "Verified",
      },
      validationRules: {
        Name: { required: true },
        Amount: { required: true, type: "number", minValue: 0.01 },
        Date: { required: true, allowPreviousMonth: false },
        Verified: { required: true, values: ["Yes", "No"] },
      },
    },
    Sheet2: {
      columns: {
        Name: "Name",
        Amount: "Amount",
        Date: "Date",
        Verified: "Verified",
      },
      validationRules: {
        Name: { required: true },
        Amount: { required: true, type: "number", minValue: 0.01 },
        Date: { required: true, allowPreviousMonth: false },
        Verified: { required: true, values: ["Yes", "No"] },
      },
    },
    Sheet8: {
      columns: {
        InvoiceDate: "invoice_date",
        ReceiptDate: "receipt_date",
        Amount: "amount",
      },
      validationRules: {
        InvoiceDate: {
          required: true,
          allowPreviousMonth: true,
        },
        ReceiptDate: {
          required: false,
        },
        Amount: {
          required: true,
          type: "number",
          minValue: 0,
        },
      },
    },
  },
};
