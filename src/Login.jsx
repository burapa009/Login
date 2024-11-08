import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Login() {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            // ดึงข้อมูลผู้ใช้ทั้งหมดจาก localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            
            // ค้นหาผู้ใช้จากอีเมลและรหัสผ่าน
            const user = users.find(u => 
                u.email === inputs.email && 
                u.password === inputs.password
            )

            if (user) {
                // เก็บข้อมูลผู้ใช้ที่ล็อกอินปัจจุบัน
                const currentUser = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser))
                
                MySwal.fire({
                    title: 'เข้าสู่ระบบสำเร็จ',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/profile')
                })
            } else {
                throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
            }
        } catch (error) {
            MySwal.fire({
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: error.message,
                icon: 'error'
            })
        }
    }

    const handleGoogleLogin = () => {
        console.log('Google login clicked')
    }

    const handleFacebookLogin = () => {
        console.log('Facebook login clicked')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                            placeholder="E-mail"
                            value={inputs.email}
                            onChange={handleChange}
                        />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                            placeholder="Password"
                            value={inputs.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-purple-500 py-3 text-white hover:bg-purple-600"
                    >
                        Login
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Don&apos;t have an account?
                        <Link to="/signup" className="text-purple-500">
                            Sign up
                        </Link>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 hover:bg-gray-50"
                        >
                            <i className="fa-brands fa-facebook text-blue-600"></i>
                            Facebook
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 hover:bg-gray-50"
                        >
                            <i className="fa-brands fa-google text-red-500"></i>
                            Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login