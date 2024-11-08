import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Signup() {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
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
            
            // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
            if (users.some(user => user.email === inputs.email)) {
                throw new Error('อีเมลนี้ถูกใช้งานแล้ว')
            }

            // สร้างข้อมูลผู้ใช้ใหม่
            const newUser = {
                id: users.length + 1,
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                email: inputs.email,
                password: inputs.password // ในระบบจริงควรเข้ารหัสก่อนเก็บ
            }
            
            // เพิ่มผู้ใช้ใหม่เข้าไปในอาร์เรย์
            users.push(newUser)
            
            // บันทึกลง localStorage
            localStorage.setItem('users', JSON.stringify(users))
            
            MySwal.fire({
                title: 'สมัครสมาชิกสำเร็จ',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/login')
            })
        } catch (error) {
            MySwal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถสมัครสมาชิกได้',
                icon: 'error'
            })
        }
    }

    const handleGoogleSignup = () => {
        console.log('Google signup clicked')
    }

    const handleFacebookSignup = () => {
        console.log('Facebook signup clicked')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Sign up</h1>
                    <p className="mt-2 text-gray-600">Please fill below informartion</p>
                </div>
                
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <input
                        name="firstName"
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        placeholder="First name"
                        value={inputs.firstName}
                        onChange={handleChange}
                    />
                    <input
                        name="lastName"
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        placeholder="Last name"
                        value={inputs.lastName}
                        onChange={handleChange}
                    />
                    <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        placeholder="E-mail"
                        value={inputs.email}
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        placeholder="Password"
                        value={inputs.password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-purple-500 py-3 text-white hover:bg-purple-600"
                    >
                        Create account
                    </button>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleFacebookSignup}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 hover:bg-gray-50"
                        >
                            <i className="fab fa-facebook text-blue-600"></i>
                            Facebook
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 hover:bg-gray-50"
                        >
                            <i className="fab fa-google text-red-500"></i>
                            Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup 