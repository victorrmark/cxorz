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

  const supabase = createClient();
  const { shortPath } = params;

  const redirectTo = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("urls")
          .select("original_url, visit_count")
          .eq("short_path", shortPath)
          .single();

        if (error || !data) {
          setError("Redirect failed. URL not found or error occurred.");
          return;
        }

        const { original_url, visit_count } = data;
        setUrlData(data);

        const { error: updateError } = await supabase
          .from("urls")
          .update({ visit_count: visit_count + 1 })
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

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface ShortUrlPageProps {
//   params: {
//     shortPath: string;
//   };
// }

// const ShortUrlPage: React.FC<ShortUrlPageProps> = ({ params }) => {
//   const { shortPath } = params;
//   const router = useRouter();

//   useEffect(() => {
//     if (shortPath) {
//       console.log('me')
//       fetch(`../api/track-visit?shortPath=${shortPath}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Origin": window.location.origin,
//         },
//       })
//       .then((response) => {
//         if (response.redirected) {
//       // .then((response) => response.json())
//       // .then((data) => {
//       //   if (data.original_url) {
//       //     const validUrl = data.original_url.startsWith('http://') || data.original_url.startsWith('https://')
//       //       ? data.original_url
//       //       : `https://${data.original_url}`;
            
//           // Redirect after tracking is done
//           window.location.href = response.url;;
//         }
//       })
//       .catch(error => console.error('Error tracking visit:', error));
//     }
//   }, [shortPath]);
  //       .then((response) => {
  //         if (response.ok && response.redirected) {
  //           console.log("Redirecting to:", response.url);
  //           router.push(response.url);
  //         } else {
  //           return response.json().then((errorData) => {
  //             console.error(
  //               "Tracking failed:",
  //               errorData.error || response.statusText
  //             );
  //           });
  //         }
  //       })
  //       .catch((error) => console.error("Error tracking visit:", error));
  //   }
  // }, [shortPath, router]);

//   return <div>Redirecting...</div>;
// };

// export default ShortUrlPage;
