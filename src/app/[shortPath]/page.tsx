"use client";
import { createClient } from "../../../utils/supabase/client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function LinkSlug() {
    const [error, setError] = useState<string | null>(null);
    const params = useParams();

    const supabase = createClient();
    const { shortPath } = params;

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

        fetchUserLocation().then(location => {
            console.log(location)
        }).catch(err => { console.error("Failed to fetch user location:", err) });

        const redirect = async () => {
            try {
                const location = await fetchUserLocation();
                const { data, error } = await supabase.rpc('handle_redirect', {
                    short: shortPath,
                    location: location.city + ", " + location.country_name
                });

                if (error || !data) {
                    setError("Redirect failed. URL not found or error occurred.");
                    return;
                }

                const finalUrl = /^https?:\/\//i.test(data)
                    ? data
                    : `https://${data}`;

                window.location.href = finalUrl;

            } catch (e) {
                setError("An unexpected error occurred.");
                return;
            }
        }

        redirect();
    }, [shortPath, supabase]);

    return (
        <h1>
            {error ? error : "Redirecting..."}
        </h1>
    );
}

