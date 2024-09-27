const Error = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-light">
            <span className="text-6xl">Oops!</span>
            <span className="text-2xl">An error occured.</span>
            <span className="text-xl text-subtle">
                Trying refreshing the page or navigating backwards.
            </span>
        </div>
    )
}

export default Error
