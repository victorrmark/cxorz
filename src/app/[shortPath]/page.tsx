"use client";
import { createClient } from "../../../utils/supabase/client";
import { useEffect, useState } from "react";

type UrlData = {
  original_url: string;
};

export default function LinkSlug({
  params,
}: {
  params: { shortPath: string };
}) {
  const [urlData, setUrlData] = useState<UrlData>();
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const { shortPath } = params;

  const redirectTo = (url: string) => {
    window.location.href = url;
  };


  useEffect(() => {
    const fetchUrlDetails = async () => {
      const { data, error } = await supabase
        .from("urls")
        .select("original_url")
        .eq("short_path", shortPath)
        .single();

      if (data) {
        setUrlData(data);
      } else {
        setError(error.message);
      }

      redirectTo(`https://${urlData?.original_url}`)
    };

    fetchUrlDetails();
  }, [supabase, shortPath, urlData?.original_url]);
  // console.log(shortPath);

  return (
    <h1>
      redirecting...
    </h1>
  );
}
