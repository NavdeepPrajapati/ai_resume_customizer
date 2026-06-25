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

    if (!jd.trim()) {
      alert("Please enter Job Description.");
      return;
    }

    if (jd.trim().length < 100) {
      alert("Job Description must contain at least 100 characters.");
      return;
    }

    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file.size > MAX_FILE_SIZE) {
      alert("Resume size should not exceed 5 MB.");
      return;
    }
    const formData = new FormData();

    formData.append("jd", jd);
    formData.append("resume", file);

    try {

      setLoading(true);

      setStatus("Uploading resume...");

      const response = await axios.post(
        "https://resume-customizer-backend.onrender.com/customize",
        formData
      );

      setStatus(
        "Resume customized successfully!"
      );

      const fullResponse =
        response.data.customized_resume;



      setResult(fullResponse);

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
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-3">
          AI Resume Customizer
        </h1>

        <p className="text-slate-600 text-lg mb-10">
          Upload your resume, paste the job description, and generate an ATS-optimized resume tailored for your target role.
        </p>

        <div className="
                      bg-white
                      shadow-xl
                      rounded-2xl
                      p-6
                      space-y-4
                      border
                      border-slate-200
                      ">

          <textarea
            className="
                    w-full
                    border
                    border-slate-300
                    p-4
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    text-black
                    "
            rows={10}
            placeholder="Paste Job Description Here..."
            value={jd}
            onChange={(e) =>
              setJd(e.target.value)
            }
          />

          <div className="flex items-center justify-between">

            <div>

              <label
                className="
        inline-block
        bg-slate-100
        hover:bg-slate-200
        border
        border-slate-300
        text-slate-800
        px-5
        py-3
        rounded-xl
        cursor-pointer
        font-medium
        transition
      "
              >
                📄 Upload Resume

                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />
              </label>

            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
      bg-blue-600
      hover:bg-blue-700
      transition
      text-white
      font-semibold
      px-8
      py-3
      rounded-xl
      shadow-md
      disabled:bg-gray-400
    "
            >
              {loading
                ? "🤖 Optimizing Resume..."
                : "Customize Resume"}
            </button>


          </div>
          {file && (
            <div
              className="
      bg-green-50
      border
      border-green-200
      rounded-xl
      p-3
      text-green-700
    "
            >
              ✓ Resume Uploaded: <strong>{file.name}</strong>

              <br />

              Size: {
                file.size < 1024 * 1024
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              }
            </div>
          )}

        </div>


        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-4 text-slate-800">
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
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          border
          border-slate-200
          "
          >

            <div className="prose prose-slate max-w-none text-black">

              <ReactMarkdown>
                {result}
              </ReactMarkdown>

            </div>

          </div>



        </div>
      </div>


    </main>
  );
}