import { useEffect, useState } from "react";

export const ApiTest = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log("Testing API with fetch...");

        // Test với fetch thay vì axios
        const response = await fetch(
          "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"
        );
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Fetch result:", result);

        setData(result);
      } catch (err: any) {
        console.error("API Test Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) return <div className="text-white">Testing API...</div>;
  if (error) return <div className="text-red-500">API Error: {error}</div>;

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl mb-4">API Test Results</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold">Response Status:</h3>
          <p>{data?.status ? "Success" : "Failed"}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Movies Count:</h3>
          <p>{data?.items?.length || 0}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Response Structure:</h3>
          <pre className="text-xs bg-gray-800 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(data, null, 2).substring(0, 500)}...
          </pre>
        </div>
      </div>
    </div>
  );
};
