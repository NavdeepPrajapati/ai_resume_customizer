"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Home() {

  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const handleSubmit = async () => {

    if (!jd) {
      alert("Please enter Job Description");
      return;
    }

    if (!file) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();

    formData.append("jd", jd);
    formData.append("resume", file);

    try {

      setLoading(true);

      setStatus("Uploading resume...");

      const response = await axios.post(
        "http://127.0.0.1:8000/customize",
        formData
      );

      setStatus(
        "Resume customized successfully!"
      );

      setResult(
        response.data.customized_resume
      );

    } catch (error) {

      console.error(error);

      setStatus(
        "Failed to customize resume."
      );

      alert("Error processing resume");

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-2">
        AI Resume Customizer
      </h1>

      <p className="text-gray-600 mb-8">
        Upload your resume and paste a Job Description
        to generate an ATS-optimized version.
      </p>

      <div className="space-y-4">

        <textarea
          className="w-full border p-3 rounded"
          rows={10}
          placeholder="Paste Job Description Here..."
          value={jd}
          onChange={(e) =>
            setJd(e.target.value)
          }
        />

        <input
          type="file"
          accept=".pdf"
          className="border p-2 rounded"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />

        {file && (
          <p className="text-green-600 font-medium">
            Selected File: {file.name}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded
            disabled:bg-gray-400
          "
        >
          {loading
            ? "Generating Customized Resume..."
            : "Customize Resume"}
        </button>

      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Customized Resume
        </h2>

        {result && (

          <button
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-4
              py-2
              rounded
              mb-4
            "
            onClick={() => {

              const blob = new Blob(
                [result],
                {
                  type: "text/plain"
                }
              );

              const url =
                window.URL.createObjectURL(
                  blob
                );

              const a =
                document.createElement("a");

              a.href = url;

              a.download =
                "customized_resume.txt";

              a.click();

            }}
          >
            Download Resume
          </button>

        )}

        <div
          className="
            border
            p-6
            rounded
            bg-white
            text-black
          "
        >
          <ReactMarkdown>
            {result}
          </ReactMarkdown>
        </div>

      </div>

    </main>
  );
}