```markdown
# Excel Data Validation API

This document explains how to set up and run the **Excel Data Validation API** locally, how the validation logic works, how large `.xlsx` files are handled, and the optimizations that have been implemented to ensure high performance.

---

## Getting Started

### 1. Clone the Repository
To clone the repository to your local machine, run the following command in your terminal:

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies
Once the repository is cloned, navigate to the project folder and install the necessary dependencies by running:

```bash
npm install
```

### 3. Start the Development Server
To run the development server locally, use:

```bash
npm run dev
```

The server will be running at `http://localhost:5000`.

---

## Validation Features

### Dynamic Sheet Validation Without Code Duplication
The backend has been designed to support multiple Excel sheets with different column names and validation rules, without requiring duplicated code. The validation logic is fully dynamic and relies on a centralized configuration file. Here's how it works:

1. **Dynamic Sheet Configuration**: For each sheet (like "Sheet1", "Sheet8"), column names and the validation rules are defined in a configuration object. This allows the backend to validate each sheet based on the specific rules for that sheet, such as whether a column is required, if it should only accept numbers, or if it must have values from a predefined list (e.g., "Yes" or "No").

2. **Handling Varying Validation Rules**: Some sheets may allow certain fields to accept "previous-month" dates, others may have columns that are not required, and some may allow zero as a valid number. The backend handles these variations dynamically based on the validation rules set for each sheet in the configuration.

3. **Extensibility**: Adding support for new sheets with different columns or rules requires minimal changes—only the configuration needs to be updated. This ensures the code remains flexible, easily maintainable, and scalable.

---

### Handling Large `.xlsx` Files Without Performance Degradation

The backend is optimized to process `.xlsx` files with thousands of rows without performance issues. Here's how the system handles large files efficiently:

1. **File Upload Handling**: The API supports file uploads using `multer`, which is configured to accept only `.xlsx` files. The upload process is restricted to files that are no larger than 2MB, preventing performance issues due to excessively large files.

2. **Efficient Excel File Parsing**: Instead of loading the entire Excel file into memory at once, the system processes the file incrementally. By using the `ExcelJS` library, each worksheet is read row by row, keeping memory usage low even for files with thousands of rows. This ensures that the application can handle large files without slowing down or running into memory limits.

3. **Incremental Processing**: As the Excel file is parsed, each sheet is processed independently, and validation is applied row by row. This means that even if a file has multiple sheets with complex validation rules, the system can handle each sheet’s data separately, allowing for better memory management and faster processing.

4. **Validation and Error Handling**: As the data from each sheet is processed, any validation errors (e.g., missing required fields, invalid data types, or incorrect date ranges) are captured and reported. Only rows that pass validation are saved, ensuring that only valid data is imported into the system.

5. **Bulk Insert**: After validation, the data is inserted into the database in bulk. This method significantly speeds up the insertion process for large datasets, ensuring that the system performs efficiently even when dealing with large volumes of data.

---

## API Routes and Request Formats

### Upload File Route
To process an `.xlsx` file, the API provides an upload route. The file is uploaded using a POST request.

**POST** `/upload`

This route accepts a `.xlsx` file and processes it according to the configuration for each sheet, validating the data and returning any validation errors.

The file must be sent as part of a `multipart/form-data` request.

The response will contain the following:

- **sheetNames**: A list of the sheet names in the uploaded file.
- **sheetData**: The processed data from each sheet.
- **validationErrors**: Any errors found during validation, including which rows and columns were problematic.

---

## Summary of Key Features

- **Flexibility**: The backend can handle multiple sheets with different structures and validation rules, all without duplicating code.
- **Performance Optimization**: Large `.xlsx` files with thousands of rows can be processed efficiently, with memory optimizations and incremental parsing.
- **Dynamic Configuration**: Validation rules for each sheet are specified in a configuration file, making it easy to add or modify sheets and their validation logic.
- **Error Reporting**: Any data issues are flagged during the processing, with detailed error messages indicating exactly where the problems are.
- **Bulk Data Import**: Once validated, the data is imported into the database using a bulk insert, which ensures quick and efficient data processing.

---

## Notes

- The system is optimized to handle large files with minimal memory consumption.
- Validation rules for each sheet are highly customizable through the configuration file, allowing for easy updates and extensions.
- Ensure the uploaded `.xlsx` file does not exceed the 2MB file size limit.

```

This document explains all the features, validation logic, and optimizations used in the backend API, and how to set it up locally. It avoids code snippets and instead provides an overview of how everything works together.