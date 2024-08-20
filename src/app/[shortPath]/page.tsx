"use client";
import { createClient } from "../../../utils/supabase/client";
import { useEffect, useState } from "react";

type UrlData = {
  original_url: string;
  visit_count: number;
};

export default function LinkSlug({
  params,
}: {
  params: { shortPath: string };
}) {
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [locationData, setLocationData] = useState<any | null>(null);

  const supabase = createClient();
  const { shortPath } = params;

  const redirectTo = (url: string) => {
    window.location.href = url;
  };

  const fetchUserLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const location = await response.json();
      // setLocationData(location);
      return location;
    } catch (err) {
      return null;
    }
  };


  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("urls")
          .select("original_url, visit_count, last_location")
          .eq("short_path", shortPath)
          .single();

        if (error || !data) {
          setError("Redirect failed. URL not found or error occurred.");
          return;
        }

        const { original_url, visit_count, last_location } = data;
        setUrlData(data);
        const location = await fetchUserLocation();
        // console.log("User Location:", location); 

        const { error: updateError } = await supabase
          .from("urls")
          .update({ 
            visit_count: visit_count + 1,
            last_location: `${location.city}, ${location.country_name}`
          })
          .eq("short_path", shortPath);

        if (updateError) {
          setError("Internal Server Error");
        } else {
          redirectTo(`https://${original_url}`);
        }
      } catch (e) {
        setError("An unexpected error occurred.");
      }
    };

    fetchUrlDetails();
  }, [shortPath, supabase]);

  return (
    <h1>
      {error ? error : "Redirecting..."}
    </h1>
  );
}

