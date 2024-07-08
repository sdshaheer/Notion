import React, { useState, ChangeEvent, FormEvent } from 'react'
import { TextField, Button, Grid } from '@mui/material';
import { doSignUpWithEmailAndPassword } from '../../firebase/auth';
import Password from '../../customComponents/Password';
import { toast } from 'react-toastify';
import Spinner from '../Spinner'
import { basePath } from '../../utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface props {
    setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    [key: string]: string;
}

const SignUp: React.FC<props> = ({ setIsLoginPage }) => {


    const [data, setData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target

        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' })
        }
        setData({ ...data, [name]: value })
    }

    const validateData = () => {
        let errors: FormErrors = {}
        Object.entries(data).forEach(([key, value]) => {
            if (value == '') {
                errors[key] = 'This field is required'
            }
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.email = "Email is not valid.";
        }

        if ((data.password && data.confirmPassword) && data.password !== data.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setFormErrors({ ...errors })
        return Object.keys(errors).length !== 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const isErrorFound = validateData()

        if (isErrorFound) {
            return
        }

        try {
            setIsLoading(true)
            const firebaseResponse = await doSignUpWithEmailAndPassword(data.email, data.password)
            const dataViaGmailLogin = {
                uuid: firebaseResponse?.user?.uid,
                name: data?.name,
                email: firebaseResponse?.user?.email
            }
            await axios.post(`${basePath}/userAuth/createUser`,
                { ...dataViaGmailLogin }
            )

            // setIsLoginPage(true)
            toast.success('Account created successfully')
            navigate('/tasks')

        } catch (error: any) {
            console.error('error in logging with email and password', error)
            toast.error(error?.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {isLoading && <Spinner />}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        id="name"
                        name="name"
                        label="Name"
                        size="medium"
                        value={data.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        size="medium"
                        value={data.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Password
                        id="password"
                        name="password"
                        label="Password"
                        value={data.password}
                        customHandleChange={handleChange}
                        errorMessage={formErrors.password}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Password
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        value={data.confirmPassword}
                        customHandleChange={handleChange}
                        errorMessage={formErrors.confirmPassword}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        sx={{ width: '100%', backgroundColor: '#1d28f5' }}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default SignUp
