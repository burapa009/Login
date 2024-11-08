import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Profile() {
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('personal')
    const [profileImage, setProfileImage] = useState('/default-avatar.png')
    const [isUploading, setIsUploading] = useState(false)
    const [address, setAddress] = useState(() => {
        const savedAddress = localStorage.getItem('address') || '{}'
        return JSON.parse(savedAddress)
    })
    const [isEditingAddress, setIsEditingAddress] = useState(false)

    useEffect(() => {
        const userData = localStorage.getItem('currentUser')
        if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)
            // ดึงรูปโปรไฟล์จาก localStorage
            const savedImage = localStorage.getItem(`profileImage_${parsedUser.id}`)
            if (savedImage) {
                setProfileImage(savedImage)
            }
        } else {
            navigate('/login')
        }
    }, [navigate])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
            if (file.size > 5 * 1024 * 1024) {
                MySwal.fire({
                    title: 'ไฟล์มีขนาดใหญ่เกินไป',
                    text: 'กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB',
                    icon: 'error'
                })
                return
            }

            // ตรวจสอบประเภทไฟล์
            const validTypes = ['image/jpeg', 'image/png', 'image/gif']
            if (!validTypes.includes(file.type)) {
                MySwal.fire({
                    title: 'ประเภทไฟล์ไม่ถูกต้อง',
                    text: 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, GIF)',
                    icon: 'error'
                })
                return
            }

            setIsUploading(true)
            const reader = new FileReader()
            
            reader.onloadend = () => {
                // สร้าง Image object เพื่อตรวจสอบขนาดรูปภาพ
                const img = new Image()
                img.src = reader.result
                img.onload = () => {
                    // บันทึกรูปในรูปแบบ Base64
                    setProfileImage(reader.result)
                    // บันทึกรูปลง localStorage
                    localStorage.setItem(`profileImage_${user.id}`, reader.result)
                    
                    // อัพเดทข้อมูลผู้ใช้ด้วย
                    const updatedUser = { ...user, profileImage: reader.result }
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
                    setUser(updatedUser)
                    
                    setIsUploading(false)
                    MySwal.fire({
                        title: 'อัพโหลดรูปภาพสำเร็จ',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }

            reader.onerror = () => {
                setIsUploading(false)
                MySwal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถอ่านไฟล์ได้',
                    icon: 'error'
                })
            }

            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        MySwal.fire({
            title: 'ต้องการลบรูปโปรไฟล์?',
            text: "การดำเนินการนี้ไม่สามารถย้อนกลับได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                setProfileImage('/default-avatar.png')
                localStorage.removeItem(`profileImage_${user.id}`)
                const updatedUser = { ...user }
                delete updatedUser.profileImage
                localStorage.setItem('currentUser', JSON.stringify(updatedUser))
                setUser(updatedUser)
                
                MySwal.fire({
                    title: 'ลบรูปโปรไฟล์สำเร็จ',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        MySwal.fire({
            title: 'ออกจากระบบสำเร็จ',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            navigate('/login')
        })
    }

    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddressSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('address', JSON.stringify(address))
        setIsEditingAddress(false)
        MySwal.fire({
            title: 'บันทึกที่อยู่สำเร็จ',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        })
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header with Logout Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your account</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
                
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 relative group">
                        {isUploading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                            </div>
                        ) : (
                            <>
                                <img 
                                    src={profileImage}
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover"
                                />
                                {activeTab === 'changePicture' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label htmlFor="profile-image" className="cursor-pointer text-center mb-2">
                                            <i className="fas fa-camera text-white text-2xl"></i>
                                            <p className="text-white text-sm">Change Photo</p>
                                            <input
                                                type="file"
                                                id="profile-image"
                                                accept="image/jpeg,image/png,image/gif"
                                                className="hidden"
                                                onChange={handleImageChange}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        {profileImage !== '/default-avatar.png' && (
                                            <button
                                                onClick={handleRemoveImage}
                                                className="text-red-400 hover:text-red-500 text-sm"
                                            >
                                                <i className="fas fa-trash"></i>
                                                <span className="ml-1">Remove</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button 
                        className={`px-6 py-2 rounded-full ${activeTab === 'personal' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Personal
                    </button>
                    <button 
                        className={`px-6 py-2 rounded-full ${activeTab === 'changePicture' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('changePicture')}
                    >
                        Change Picture
                    </button>
                    <button 
                        className={`px-6 py-2 rounded-full ${activeTab === 'address' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('address')}
                    >
                        Address
                    </button>
                    <button 
                        className={`px-6 py-2 rounded-full ${activeTab === 'changePassword' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('changePassword')}
                    >
                        Change Password
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'changePicture' ? (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-center mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Picture</h3>
                            <p className="text-sm text-gray-500">Update your profile picture</p>
                        </div>

                        <div className="flex flex-col items-center space-y-6">
                            {/* Current Profile Picture */}
                            <div className="relative w-40 h-40">
                                <img 
                                    src={profileImage}
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover border-4 border-purple-100"
                                />
                                <label 
                                    htmlFor="profile-image-change" 
                                    className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors"
                                >
                                    <i className="fas fa-camera"></i>
                                    <input
                                        type="file"
                                        id="profile-image-change"
                                        accept="image/jpeg,image/png,image/gif"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>

                            {/* Upload Requirements */}
                            <div className="text-center space-y-2">
                                <p className="text-sm text-gray-600 font-medium">Upload Requirements:</p>
                                <ul className="text-sm text-gray-500">
                                    <li>• Maximum file size: 5MB</li>
                                    <li>• Supported formats: JPG, PNG, GIF</li>
                                    <li>• Recommended size: 400x400 pixels</li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <label 
                                    htmlFor="profile-image-upload"
                                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer flex items-center gap-2"
                                >
                                    <i className="fas fa-upload"></i>
                                    Upload New Picture
                                    <input
                                        type="file"
                                        id="profile-image-upload"
                                        accept="image/jpeg,image/png,image/gif"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        disabled={isUploading}
                                    />
                                </label>
                                {profileImage !== '/default-avatar.png' && (
                                    <button
                                        onClick={handleRemoveImage}
                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <i className="fas fa-trash"></i>
                                        Remove Picture
                                    </button>
                                )}
                            </div>

                            {/* Loading Indicator */}
                            {isUploading && (
                                <div className="flex items-center gap-2 text-purple-500">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                                    <span>Uploading...</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'address' ? (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {isEditingAddress ? (
                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={address.street || ''}
                                        onChange={handleAddressChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="เลขที่, ถนน, ซอย"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">เมือง/เขต</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={address.city || ''}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">จังหวัด</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={address.state || ''}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">รหัสไปรษณีย์</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={address.zipCode || ''}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">ประเทศ</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={address.country || ''}
                                            onChange={handleAddressChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingAddress(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">ที่อยู่จัดส่ง</h3>
                                    <button
                                        onClick={() => setIsEditingAddress(true)}
                                        className="text-purple-500 hover:text-purple-600"
                                    >
                                        <i className="fas fa-edit mr-2"></i>
                                        แก้ไข
                                    </button>
                                </div>
                                {address.street ? (
                                    <div className="space-y-2 text-gray-600">
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.zipCode}</p>
                                        <p>{address.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">ยังไม่ได้เพิ่มที่อยู่</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Personal Information - แสดงเมื่อ tab เป็น personal */
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-600">User</span>
                                <span className="font-medium">{user.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-600">Name</span>
                                <span className="font-medium">{user.firstName} {user.lastName}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-600">E-mail</span>
                                <span className="font-medium">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-600">Phone number</span>
                                <span className="font-medium">099-999-9999</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-600">Gender</span>
                                <span className="font-medium">Male</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b">
                                <span className="text-gray-600">Birth of date</span>
                                <span className="font-medium">31/10/2024</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile