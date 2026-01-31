import { useState, useCallback, useEffect, useRef } from 'react';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T>(fetchFn: () => Promise<T>, immediate = true) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: immediate,
        error: null,
    });

    const fetchFnRef = useRef(fetchFn);

    useEffect(() => {
        fetchFnRef.current = fetchFn;
    }, [fetchFn]);

    const execute = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const result = await fetchFnRef.current();
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred';
            setState({ data: null, loading: false, error: message });
            throw err;
        }
    }, []); // Stable execute function

    useEffect(() => {
        if (immediate) {
            execute().catch(() => { });
        }
    }, [execute, immediate]);

    const setData = useCallback((newData: T) => {
        setState(prev => ({ ...prev, data: newData }));
    }, []);

    return { ...state, execute, setData };
}
