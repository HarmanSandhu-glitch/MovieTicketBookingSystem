import SignInForm from '../components/Auth/SignInForm';

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center pt-10">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
                <SignInForm />
            </div>
        </div>
    );
};

export default SignInPage;