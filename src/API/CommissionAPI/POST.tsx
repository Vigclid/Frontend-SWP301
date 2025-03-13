import axios from 'axios'
import { ICommissionForm, ICommissionID } from '../../Interfaces/CommissionForm'

const commissionBaseUrl = "http://localhost:7233/api/commissions";
const headers = {
    'Content-Type': 'application/json',
};

// 🟢 Hàm lấy `commissionID`
export async function GetCommissionID() {
    try {
        const response = await axios.post(`${commissionBaseUrl}/request`);  // 🛠 Đảm bảo gọi đúng API lấy ID
        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi khi lấy CommissionID:", error);
        return null;
    }
}

// 🟢 Hàm tạo mới Commission
export async function CreateCommissionForm(value) {
    try {
        const response = await axios.post(`${commissionBaseUrl}/request`, value, { headers });  // 🛠 Gửi đúng API
        return response.data;
    } catch (error) {
        console.error("🚨 Lỗi khi tạo Commission:", error);
        return null;
    }
}
