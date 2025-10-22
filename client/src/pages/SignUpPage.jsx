import SignUpForm from '../components/Auth/SignUpForm';

const SignUpPage = () => {
    return (
        <div className="flex justify-center items-center pt-10">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUpPage;
