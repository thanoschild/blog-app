'use client'

import { X } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;
        if (form) form.reset();
    }

    return (
        <button type="reset" onClick={reset}>
            <Link href="/" className="search-btn text-white">
                <X className="w-5 h-5 text-white"/>
            </Link>
        </button>
    )
}

export default SearchFormReset