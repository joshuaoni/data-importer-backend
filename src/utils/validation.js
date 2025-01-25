const validationConfig = require("../config/validationConfig");

exports.validateData = (sheetName, sheetData) => {
  const errors = [];
  const sheetConfig = validationConfig.sheetConfigs[sheetName];

  if (!sheetConfig) {
    errors.push({ error: `No configuration found for sheet: ${sheetName}` });
    return errors;
  }

  const requiredColumns = Object.keys(sheetConfig.columns);
  const sheetColumns = Object.keys(sheetData[0] || {});
  const missingColumns = requiredColumns.filter((col) => !sheetColumns.includes(col));

  if (missingColumns.length > 0) {
    errors.push({
      error: `Sheet "${sheetName}" is missing required columns: ${missingColumns.join(", ")}`,
    });
  }

  sheetData.forEach((row, index) => {
    const rowNumber = index + 1;

    requiredColumns.forEach((columnName) => {
      const fieldName = sheetConfig.columns[columnName];
      const value = row[fieldName];
      const validationRule = sheetConfig.validationRules[columnName];

      if (validationRule?.required && !value) {
        errors.push({ row: rowNumber, error: `${columnName} is required` });
      }

      if (validationRule?.type === "number" && isNaN(value)) {
        errors.push({ row: rowNumber, error: `${columnName} must be a valid number` });
      }

      if (validationRule?.minValue && value < validationRule.minValue) {
        errors.push({ row: rowNumber, error: `${columnName} must be greater than ${validationRule.minValue}` });
      }

      if (validationRule?.allowPreviousMonth === false && value) {
        const date = new Date(value);
        if (date.getMonth() !== new Date().getMonth()) {
          errors.push({
            row: rowNumber,
            error: `${columnName} must be within the current month`,
          });
        }
      }

      if (validationRule?.values && !validationRule.values.includes(value)) {
        errors.push({ row: rowNumber, error: `${columnName} must be one of ${validationRule.values.join(", ")}` });
      }
    });
  });

  return errors;
};
