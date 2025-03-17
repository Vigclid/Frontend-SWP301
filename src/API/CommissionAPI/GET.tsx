import { ICommissionForm, IExtraCommissionForm } from "../../Interfaces/CommissionForm"
import axios from 'axios'
import { GetUserNameById } from "../UserAPI/GET.tsx"

const getcommssionformurl = "https://localhost:7233/api/CommissionForm"
const getcommissionrequestorurl = `http://localhost:7233/api/commissions/requestor/`;
const getcommissionrecieverurl = `http://localhost:7233/api/CommissionForm/ByReceiverIDAddEmailAndPhone/`

export async function GetCommissionRequestorById(id: string) {
  try {
    const response = await axios.get(getcommissionrequestorurl + id);
    console.log("🟢 API trả về danh sách commission:", response.data);

    // 🛠 Duyệt từng commission và gọi API lấy tên requestor
    const formattedData: IExtraCommissionForm[] = await Promise.all(
      response.data.map(async (comm: any) => {
        let userName = "Unknown User"; // Giá trị mặc định

        try {
          userName = await GetUserNameById(comm.requestor); // ✅ Gọi API lấy username từ firstName + lastName
        } catch (error) {
          console.error(`⚠️ Không lấy được userName cho requestorID: ${comm.requestor}`, error);
        }

        return {
          commissionID: comm.commissionID,
          receiverID: comm.receiver,
          requestorID: comm.requestor,
          description: comm.description,
          accept: comm.accept,
          progress: comm.progress,
          requestorEmail: comm.email,
          requestorPhone: comm.phoneNumber,
          requestorUserName: userName, // ✅ Đã lấy từ API
          creationDate: comm.creationDate,
          acceptanceDate: comm.acceptanceDate,
          completionDate: comm.completionDate,
        };
      })
    );

    return formattedData;
  } catch (err) {
    console.error("❌ Lỗi khi gọi API GetCommissionRequestorById:", err);
    return [];
  }
}


export async function GetCommissionRecieverById(id: string) {
  try {
    let form: IExtraCommissionForm[] = await axios.get(getcommissionrecieverurl + id).then(response => response.data)
    return form

  } catch (err) {
    console.log(err)
  }
}