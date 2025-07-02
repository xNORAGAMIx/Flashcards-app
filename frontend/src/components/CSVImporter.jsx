/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSelector } from "react-redux";
import { fileImport } from "../api/fileAPI";
import { create } from "../api/flashcardAPI";
import {
  FiUpload,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

const CSVImporter = ({ deckId, onImportSuccess }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState({
    success: null,
    message: "",
  });
  const token = useSelector((state) => state.auth.token);

  const handleImport = async () => {
    if (!csvFile) {
      setImportStatus({ success: false, message: "Please select a CSV file" });
      return;
    }

    setLoading(true);
    setImportStatus({ success: null, message: "" });
    const formData = new FormData();
    formData.append("csv", csvFile);

    try {
      const { data: flashcards } = await fileImport(token, formData);
      let importedCount = 0;

      for (const card of flashcards) {
        await create(token, {
          deckId,
          front: card.front,
          back: card.back,
        });
        importedCount++;
      }

      setImportStatus({
        success: true,
        message: `Successfully imported ${importedCount} flashcards`,
      });
      onImportSuccess();
    } catch (err) {
      console.error(err);
      setImportStatus({
        success: false,
        message:
          err.response?.data?.message ||
          "Import failed. Please check your file format.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
            <FiUpload className="text-lg" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Import Flashcards
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center text-center pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
            <FiFileText className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              CSV file with "front,back" columns
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                setCsvFile(e.target.files[0]);
                setImportStatus({ success: null, message: "" });
              }}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="mt-3 cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Select file
            </label>
            {csvFile && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[80%]">
                Selected: <span className="font-medium">{csvFile.name}</span>
              </p>
            )}
          </div>

          {importStatus.message && (
            <div
              className={`flex items-start p-3 rounded-lg text-sm ${
                importStatus.success
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              }`}
            >
              {importStatus.success ? (
                <FiCheckCircle className="flex-shrink-0 mr-2 mt-0.5" />
              ) : (
                <FiAlertCircle className="flex-shrink-0 mr-2 mt-0.5" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={loading || !csvFile}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Import Flashcards
              </>
            )}
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <p className="font-medium">CSV Format:</p>
            <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed max-h-32">
              front,back
              {"\n"}"What is the capital of France?","Paris"
              {"\n"}"2+2","4"
              {"\n"}"Photosynthesis occurs in","Chloroplasts"
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CSVImporter;
