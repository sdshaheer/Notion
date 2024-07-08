import { useState, ChangeEvent, FormEvent } from 'react'
import { TextField, Button, Grid, Divider, Typography } from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import Password from '../../customComponents/Password';
import Spinner from '../Spinner'
import { toast } from 'react-toastify';
import { basePath } from '../../utils';
import axios from 'axios'

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    [key: string]: string;
}

const Login = () => {
    const [data, setData] = useState<FormData>({
        email: '',
        password: ''
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

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
            await doSignInWithEmailAndPassword(data.email, data.password)
            navigate('/tasks')
        } catch (error: any) {
            console.error('error in logging with email and password', error)
            toast.error(error?.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLoginWithGoogle = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const firebaseResponse = await doSignInWithGoogle()
            const dataViaGmailLogin = {
                uuid: firebaseResponse?.user?.uid,
                name: firebaseResponse?.user?.displayName,
                email: firebaseResponse?.user?.email
            }
            await axios.post(`${basePath}/userAuth/createUser`,
                { ...dataViaGmailLogin }
            )

            navigate('/tasks')
        } catch (error) {
            console.error('error in logging with google account', error)

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {isLoading && <Spinner />}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        id="email"
                        name="email"
                        label="Email Address"
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
                    <Button
                        variant="contained"
                        sx={{ width: '100%', backgroundColor: '#1d28f5' }}
                        onClick={handleSubmit}
                    >
                        Sign in
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Divider orientation="horizontal" >
                        <Typography variant="body2">OR</Typography>
                    </Divider>
                </Grid>
                <Grid item xs={12} className="w-full">
                    <Button
                        variant="outlined"
                        startIcon={<FcGoogle />}
                        sx={{
                            width: '100%',
                            color: 'black',
                            border: 'solid 1px grey'
                        }}
                        onClick={handleLoginWithGoogle}
                    >
                        Continue with Google
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login
