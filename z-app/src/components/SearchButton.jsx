import Button from "./Button"

function SearchButton({onSearchClick}) {


    return <header onClick={onSearchClick}>
        <div className="w-full p-2">
            <Button className='flex gap-2 justify-start w-full h-10 bg-white text-slate-500'>
                <span>🔎</span>
                <span>Do your search</span> 
            </Button>
        </div>
    </header>
}

export default SearchButton