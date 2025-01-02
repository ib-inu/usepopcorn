import { useState, useEffect } from "react";

const KEY = "b1625d43";


export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(function () {

        // callBack?.();
        const controller = new AbortController();
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });
                if (!res.ok) throw new Error("something went wrong with fetching api...");


                const data = await res.json();

                if (data.Response === 'False') throw new Error('Movie not Found')

                setMovies(data.Search);


            } catch (err) {
                if (err.name !== "AbortError")
                    setError(err.message)
            } finally {

                setIsLoading(false);
            }
        }
        if (query.length < 2) {
            setMovies([]);
            setError("");
            return;
        }
        fetchMovies();

        return function () {
            controller.abort();
        }

    }, [query]);
    return { movies, isLoading, error }
}