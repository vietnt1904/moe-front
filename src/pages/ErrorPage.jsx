import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div id="error-page" className="flex flex-col gap-8 justify-center items-center h-screen">
            <h1 className="text-4xl font-bold">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p className="text-slate-400">
                <i>{error?.message || error?.statusText}</i>
            </p>
        </div>
    );
};

export default ErrorPage;
