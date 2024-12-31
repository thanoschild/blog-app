import Form from "next/form";
import SearchFormReset from "@/components/SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {

    return (
        <Form action="/" scroll={false} className="search-form">
            <input
                type="text"
                name="query"
                placeholder="Search"
                className="search-input"
            />
            <div className="flex gap-2">
                {query && <SearchFormReset />}
                <button type="submit" className="search-btn">
                    <Search className="w-5 h-5 text-white"/>
                </button>
            </div>
        </Form>
    )
}

export default SearchForm